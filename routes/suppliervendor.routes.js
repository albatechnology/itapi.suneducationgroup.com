module.exports = (app) => {
  var router = require("express").Router();
  const suppliervendor = require("../controller").suppliervendor;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/", (req, res) => {
    suppliervendor.getAll(req, res);
  });
  router.post("/", (req, res) => {
    suppliervendor.create(req, res);
  });
  router.put("/", (req, res) => {
    suppliervendor.update(req, res);
  });

  router.delete("/:id", (req, res) => {
    suppliervendor.delete(req, res);
  });

  app.use("/api/suppliervendor", router);
};
