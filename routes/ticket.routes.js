module.exports = (app) => {
  var router = require("express").Router();
  const ticket = require("../controller").ticket;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/", (req, res) => {
    ticket.getAll(req, res);
  });
  router.get("/admin", (req, res) => {
    ticket.getAllAdmin(req, res);
  });
  router.get("/myticket", (req, res) => {
    ticket.getAllMyTicket(req, res);
  });
  router.get("/mystaffticket", (req, res) => {
    ticket.getAllMyStaff(req, res);
  });
  router.get("/details/:ticketId", (req, res) => {
    ticket.getAllDetails(req, res);
  });
  router.post("/permintaan", (req, res) => {
    ticket.createPermintaan(req, res);
  });
  router.post("/peminjaman", (req, res) => {
    ticket.createPeminjaman(req, res);
  });
  router.post("/processticket", (req, res) => {
    ticket.processTicket(req, res);
  });
  router.post("/processdetail", (req, res) => {
    ticket.processDetail(req, res);
  });
  router.post("/shippingdetail", (req, res) => {
    ticket.shippingDetail(req, res);
  });
  router.post("/assigninventori", (req, res) => {
    ticket.assignInventori(req, res);
  });

  app.use("/api/ticket", router);
};
