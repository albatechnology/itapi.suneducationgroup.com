module.exports = (app) => {
  var router = require("express").Router();
  const ticketPerbaikan = require("../controller").ticketPerbaikan;
  const authentication = require("../controller").authentication;

  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.post("/", (req, res) => {
    ticketPerbaikan.create(req, res);
  });

  router.post("/upload", (req, res) => {
    ticketPerbaikan.upload(req, res);
  });

  router.put("/:id", (req, res) => {
    ticketPerbaikan.edit(req, res);
  });
  router.post("/processinventori", (req, res) => {
    ticketPerbaikan.processInventori(req, res);
  });
  router.post("/processrepairinventori", (req, res) => {
    ticketPerbaikan.processRepairInventori(req, res);
  });
  router.post("/assignreplaceinventori", (req, res) => {
    ticketPerbaikan.assignReplaceInventori(req, res);
  });
  router.post("/assignpeminjamaninventori", (req, res) => {
    ticketPerbaikan.assignPeminjamanInventori(req, res);
  });
  router.post("/shippingpeminjaman", (req, res) => {
    ticketPerbaikan.shippingPeminjaman(req, res);
  });
  router.post("/receivepeminjaman", (req, res) => {
    ticketPerbaikan.receivePeminjaman(req, res);
  });
  router.post("/returnpeminjaman", (req, res) => {
    ticketPerbaikan.returnPeminjaman(req, res);
  });
  router.post("/sendmessage", (req, res) => {
    ticketPerbaikan.sendMessage(req, res);
  });
  router.post("/completepeminjaman", (req, res) => {
    ticketPerbaikan.completePeminjaman(req, res);
  });
  router.post("/completeinventori", (req, res) => {
    ticketPerbaikan.completeInventori(req, res);
  });

  router.post("/declineinventori", (req, res) => {
    ticketPerbaikan.declineInventori(req, res);
  });
  router.post("/processticket", (req, res) => {
    ticketPerbaikan.processTicket(req, res);
  });

  app.use("/api/ticketperbaikan", router);
};
