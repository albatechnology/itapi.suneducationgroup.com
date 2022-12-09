module.exports = (app) => {
  var router = require("express").Router();
  const hardwareSpec = require("../controller").hardwareSpec;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/", (req, res) => {
    hardwareSpec.getAll(req, res);
  });

  router.get("/:id", (req, res) => {
    hardwareSpec.getById(req, res);
  });

  router.get("/:id/specifications", (req, res) => {
    hardwareSpec.getProductSpecifications(req, res);
  });

  router.post("/", (req, res) => {
    hardwareSpec.create(req, res);
  });
  router.delete("/:id", (req, res) => {
    hardwareSpec.delete(req, res);
  });
  router.put("/", (req, res) => {
    hardwareSpec.update(req, res);
  });

  app.use("/api/hardwarespec", router);
};
