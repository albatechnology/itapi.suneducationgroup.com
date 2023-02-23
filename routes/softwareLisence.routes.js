module.exports = (app) => {
  var router = require("express").Router();
  const softwareLisence = require("../controller").softwareLisence;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/", (req, res) => {
    softwareLisence.getAll(req, res);
  });

  router.get("/:id", (req, res) => {
    softwareLisence.getById(req, res);
  });

  router.put("/:id/assign_to", (req, res) => {
    softwareLisence.assign_to(req, res);
  });

  // router.get("/channels/list", (req, res) => {
  //   hardwareInventori.getAllChannel(req, res);
  // });

  router.get("/software/:id", (req, res) => {
    softwareLisence.getBySoftware(req, res);
  });

  router.get("/software/:softwareid/:id", (req, res) => {
    softwareLisence.getBySoftwareLicenseId(req, res);
  });

  router.post("/", (req, res) => {
    softwareLisence.create(req, res);
  });

  app.use("/api/softwarelisence", router);
};
