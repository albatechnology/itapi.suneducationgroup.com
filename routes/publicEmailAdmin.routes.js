module.exports = (app) => {
  var router = require("express").Router();
  const publicEmailAdmin = require("../controller").publicEmailAdmin;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/", (req, res) => {
    publicEmailAdmin.getAll(req, res);
  });
  router.post("/", (req, res) => {
    publicEmailAdmin.create(req, res);
  });
  router.get("/publicemail", (req, res) => {
    publicEmailAdmin.getByPublicEmail(req, res);
  });

  router.delete("/", (req, res) => {
    publicEmailAdmin.delete(req, res);
  });

  app.use("/api/publicemailadmin", router);
};
