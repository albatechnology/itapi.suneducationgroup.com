module.exports = (app) => {
  var router = require("express").Router();
  const mailingList = require("../controller").mailingList;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/", (req, res) => {
    mailingList.getAll(req, res);
  });

  router.get("/bymember", (req, res) => {
    mailingList.getByMemberId(req, res);
  });
  router.get("/:id", (req, res) => {
    mailingList.getById(req, res);
  });
  router.post("/", (req, res) => {
    mailingList.create(req, res);
  });
  router.delete("/:id", (req, res) => {
    mailingList.delete(req, res);
  });
  router.put("/:id", (req, res) => {
    mailingList.update(req, res);
  });

  app.use("/api/mailinglist", router);
};
