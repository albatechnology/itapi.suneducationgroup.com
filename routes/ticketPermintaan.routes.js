module.exports = (app) => {
  var router = require("express").Router();
  const ticketPermintaan = require("../controller").ticketPermintaan;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.post("/", (req, res) => {
    ticketPermintaan.create(req, res);
  });
  router.put("/", (req, res) => {
    ticketPermintaan.edit(req, res);
  });
  router.post("/processticket", (req, res) => {
    ticketPermintaan.processTicket(req, res);
  });
  router.post("/processdetail", (req, res) => {
    ticketPermintaan.processDetail(req, res);
  });
  router.post("/shippingdetail", (req, res) => {
    ticketPermintaan.shippingDetail(req, res);
  });
  router.post("/assigninventori", (req, res) => {
    ticketPermintaan.assignInventori(req, res);
  });
  router.post("/resetinventori", (req, res) => {
    ticketPermintaan.resetInventori(req, res);
  });

  app.use("/api/ticketpermintaan", router);
};
