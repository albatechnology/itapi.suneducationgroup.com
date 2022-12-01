module.exports = (app) => {
  var router = require("express").Router();
  const user = require("../controller").user;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });
  router.get("/:id", (req, res) => {
    user.userData(req, res);
  });

  router.get("/myinventory", (req, res) => {
    user.myInventori(req, res);
  });
  router.get("/:id/mypermintaaninventori", (req, res) => {
    user.myPermintaanInventori(req, res);
  });
  router.get("/mypeminjamaninventori", (req, res) => {
    user.myPeminjamanInventori(req, res);
  });

  app.use("/api/user", router);
};
