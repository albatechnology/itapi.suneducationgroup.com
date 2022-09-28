const { LoginData } = require("../models");

module.exports = (app) => {
  var router = require("express").Router();
  const loginData = require("../controller").loginData;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/", (req, res) => {
    loginData.getAll(req, res);
  });

  app.use("/api/logindata", router);
};
