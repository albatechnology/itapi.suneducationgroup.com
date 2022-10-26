module.exports = (app) => {
  var router = require("express").Router();
  const formPermintaan = require("../controller").formPermintaan;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/", (req, res) => {
    formPermintaan.getAll(req, res);
  });

  router.get("/:id", (req, res) => {
    formPermintaan.getByFormPermintaanId(req, res);
  });

  router.post("/", (req, res) => {
    formPermintaan.create(req, res);
  });

  router.post("/generatepdf", (req, res) => {
    //console.log(req.body);
    formPermintaan.generatePdf(req, res);
  });

  router.put("/:id", (req, res) => {
    formPermintaan.update(req, res);
  });

  router.delete("/:id", (req, res) => {
    formPermintaan.delete(req, res);
  });

  app.use("/api/formpermintaan", router);
};
