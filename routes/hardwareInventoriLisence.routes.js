module.exports = (app) => {
  var router = require("express").Router();
  const hardwareInventoriLisence =
    require("../controller").hardwareInventoriLisence;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/available", (req, res) => {
    //console.log(req.body);
    hardwareInventoriLisence.getAvailable(req, res);
  });

  app.use("/api/hardwareinventorilisence", router);
};
