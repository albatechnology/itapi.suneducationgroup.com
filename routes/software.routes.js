module.exports = (app) => {
  var router = require("express").Router();
  const software = require("../controller").software;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/", (req, res) => {
    software.getAll(req, res);
  });
  router.post("/", (req, res) => {
    software.create(req, res);
  });
  router.put("/", (req, res) => {
    software.update(req, res);
  });
  router.delete("/:id", (req, res) => {
    software.delete(req, res);
  });

  app.use("/api/software", router);
};
