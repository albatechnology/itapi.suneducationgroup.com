module.exports = (app) => {
  var router = require("express").Router();
  const ticketPeminjaman = require("../controller").ticketPeminjaman;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.post("/", (req, res) => {
    ticketPeminjaman.create(req, res);
  });
  router.put("/", (req, res) => {
    //console.log("put peminjaman");
    ticketPeminjaman.edit(req, res);
  });
  router.post("/processticket", (req, res) => {
    ticketPeminjaman.processTicket(req, res);
  });
  router.post("/processdetail", (req, res) => {
    ticketPeminjaman.processDetail(req, res);
  });
  router.post("/shippingdetail", (req, res) => {
    ticketPeminjaman.shippingDetail(req, res);
  });
  router.post("/assigninventori", (req, res) => {
    ticketPeminjaman.assignInventori(req, res);
  });
  router.post("/resetinventori", (req, res) => {
    ticketPeminjaman.resetInventori(req, res);
  });
  router.post("/receiveticket", (req, res) => {
    ticketPeminjaman.receiveTicket(req, res);
  });
  router.post("/receivedetail", (req, res) => {
    ticketPeminjaman.receiveDetail(req, res);
  });
  router.post("/returnticket", (req, res) => {
    ticketPeminjaman.returnTicket(req, res);
  });
  router.post("/returndetail", (req, res) => {
    ticketPeminjaman.returnDetail(req, res);
  });
  router.post("/completeticket", (req, res) => {
    ticketPeminjaman.completeTicket(req, res);
  });
  router.post("/completedetail", (req, res) => {
    ticketPeminjaman.completeDetail(req, res);
  });

  app.use("/api/ticketpeminjaman", router);
};
