module.exports = (app) => {
  var router = require("express").Router();
  const softwareLisence = require("../controller").softwareLisence;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/", (req, res) => {
    console.log(req.body);
    softwareLisence.getAll(req, res);
  });
  router.get("/:id", (req, res) => {
    console.log(req.body);
    softwareLisence.getById(req, res);
  });
  router.get("/software/:id", (req, res) => {
    console.log(req.body);
    softwareLisence.getBySoftware(req, res);
  });

  router.post("/", (req, res) => {
    softwareLisence.create(req, res);
  });

  app.use("/api/softwarelisence", router);
};
