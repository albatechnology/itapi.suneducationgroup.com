module.exports = (app) => {
  var router = require("express").Router();
  const dropdowndata = require("../controller").dropdowndata;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/suppliervendorcategory", (req, res) => {
    dropdowndata.supplierVendorCategory(req, res);
  });
  router.get("/uom", (req, res) => {
    dropdowndata.uom(req, res);
  });
  router.get("/jenisperbaikan", (req, res) => {
    dropdowndata.jenisPerbaikan(req, res);
  });

  app.use("/api/dropdowndata", router);
};
