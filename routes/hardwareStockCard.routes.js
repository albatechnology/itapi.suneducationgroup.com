module.exports = (app) => {
  var router = require("express").Router();
  const hardwareStockCard = require("../controller").hardwareStockCard;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/", (req, res) => {
    console.log(req.body);
    hardwareStockCard.getAll(req, res);
  });
  router.post("/", (req, res) => {
    hardwareStockCard.create(req, res);
  });

  app.use("/api/hardwarestockcard", router);
};
