module.exports = (app) => {
  var router = require("express").Router();
  const tipsandtrick = require("../controller").tipsandtrick;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/", (req, res) => {
    tipsandtrick.getAll(req, res);
  });
  router.post("/", (req, res) => {
    tipsandtrick.create(req, res);
  });
  router.post("/upload", (req, res) => {
    tipsandtrick.upload(req, res);
  });
  router.put("/", (req, res) => {
    tipsandtrick.update(req, res);
  });
  router.delete("/:id", (req, res) => {
    tipsandtrick.delete(req, res);
  });

  app.use("/api/tipsandtrick", router);
};
