module.exports = (app) => {
  var router = require("express").Router();
  const publicEmail = require("../controller").publicEmail;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/", (req, res) => {
    publicEmail.getAll(req, res);
  });
  router.get("/bymember", (req, res) => {
    publicEmail.getByMemberId(req, res);
  });
  router.get("/:id", (req, res) => {
    publicEmail.getById(req, res);
  });
  router.post("/", (req, res) => {
    publicEmail.create(req, res);
  });
  router.delete("/:id", (req, res) => {
    publicEmail.delete(req, res);
  });
  router.put("/:id", (req, res) => {
    publicEmail.update(req, res);
  });

  app.use("/api/publicemail", router);
};
