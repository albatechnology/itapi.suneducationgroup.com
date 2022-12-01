module.exports = (app) => {
  var router = require("express").Router();
  const hardwareInventori = require("../controller").hardwareInventori;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/", (req, res) => {
    //console.log(req.body);
    hardwareInventori.getAll(req, res);
  });

  router.get("/available", (req, res) => {
    //console.log(req.body);
    hardwareInventori.getAvailable(req, res);
  });
  router.get("/assigned", (req, res) => {
    //console.log(req.body);
    hardwareInventori.getAssigned(req, res);
  });
  router.get("/brokenatit", (req, res) => {
    //console.log(req.body);
    hardwareInventori.getBrokenAtIT(req, res);
  });
  router.get("/brokenatvendor", (req, res) => {
    //console.log(req.body);
    hardwareInventori.getBrokenAtVendor(req, res);
  });

  router.get("/:id", (req, res) => {
    //console.log();
    hardwareInventori.getById(req, res);
  });
  router.get("/hardwarespecid/:id", (req, res) => {
    console.log(req.body);
    hardwareInventori.getByHardwareSpecId(req, res);
  });

  router.post("/", (req, res) => {
    hardwareInventori.create(req, res);
  });
  router.post("/addlisence", (req, res) => {
    hardwareInventori.addLisence(req, res);
  });
  router.post("/removelisence", (req, res) => {
    hardwareInventori.removeLisence(req, res);
  });
  router.put("/", (req, res) => {
    hardwareInventori.update(req, res);
  });

  router.get("/user/list", (req, res) => {
    hardwareInventori.getUserList(req, res);
  });

  router.put("/:id/assign", (req, res) => {
    hardwareInventori.assign_to(req, res);
  });

  router.post("/assignforrepair", (req, res) => {
    hardwareInventori.assignForRepair(req, res);
  });

  app.use("/api/hardwareinventori", router);
};
