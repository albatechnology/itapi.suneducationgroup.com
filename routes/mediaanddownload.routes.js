module.exports = (app) => {
  var router = require("express").Router();
  const mediaanddownload = require("../controller").mediaanddownload;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/", (req, res) => {
    mediaanddownload.getAll(req, res);
  });
  router.post("/upload", (req, res) => {
    mediaanddownload.upload(req, res);
  });
  router.post("/", (req, res) => {
    mediaanddownload.create(req, res);
  });
  router.put("/", (req, res) => {
    mediaanddownload.update(req, res);
  });
  router.delete("/:id", (req, res) => {
    mediaanddownload.delete(req, res);
  });

  app.use("/api/mediaanddownload", router);
};
