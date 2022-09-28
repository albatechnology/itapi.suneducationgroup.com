module.exports = (app) => {
  var router = require("express").Router();
  const mailingListMember = require("../controller").mailingListMember;
  const authentication = require("../controller").authentication;
  router.use((req, res, next) => {
    authentication.authenticateToken(req, res, next);
  });

  router.get("/", (req, res) => {
    mailingListMember.getAll(req, res);
  });
  router.post("/", (req, res) => {
    mailingListMember.create(req, res);
  });
  router.get("/mailinglist", (req, res) => {
    mailingListMember.getByMailingList(req, res);
  });
  router.get("/verifyemail", (req, res) => {
    mailingListMember.verifyemail(req, res);
  });
  router.delete("/", (req, res) => {
    mailingListMember.delete(req, res);
  });

  app.use("/api/mailinglistmember", router);
};
