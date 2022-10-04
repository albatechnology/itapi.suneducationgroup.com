module.exports = (app) => {
  var router = require("express").Router();
  const perbaikanHardware = require("../controller").perbaikanHardware;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/", (req, res) => {
    console.log(req.body);
    perbaikanHardware.getAll(req, res);
  });
  router.get("/:id", (req, res) => {
    console.log(req.body);
    perbaikanHardware.getById(req, res);
  });
  router.get("/inventoris/:id", (req, res) => {
    console.log(req.body);
    perbaikanHardware.getInventoris(req, res);
  });
  router.post("/", (req, res) => {
    console.log(req.body);
    perbaikanHardware.create(req, res);
  });
  router.post("/sendtovendor", (req, res) => {
    console.log(req.body);
    perbaikanHardware.sendToVendor(req, res);
  });
  router.post("/returninventorifromvendor", (req, res) => {
    console.log(req.body);
    perbaikanHardware.returnInventoriFromVendor(req, res);
  });
  router.post("/assigntouser", (req, res) => {
    console.log(req.body);
    perbaikanHardware.assignToUser(req, res);
  });
  router.post("/addtostock", (req, res) => {
    console.log(req.body);
    perbaikanHardware.addToStock(req, res);
  });
  router.post("/setasbroken", (req, res) => {
    console.log(req.body);
    perbaikanHardware.setAsBroken(req, res);
  });
  router.put("/", (req, res) => {
    console.log(req.body);
    perbaikanHardware.update(req, res);
  });
  router.delete("/:id", (req, res) => {
    perbaikanHardware.delete(req, res);
  });
  app.use("/api/perbaikanhardware", router);
};
