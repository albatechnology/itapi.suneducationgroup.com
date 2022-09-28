module.exports = (app) => {
  var router = require("express").Router();
  const faq = require("../controller").faq;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/", (req, res) => {
    faq.getAll(req, res);
  });
  router.post("/", (req, res) => {
    faq.create(req, res);
  });
  router.put("/", (req, res) => {
    faq.update(req, res);
  });
  router.delete("/:id", (req, res) => {
    faq.delete(req, res);
  });

  app.use("/api/faq", router);
};
