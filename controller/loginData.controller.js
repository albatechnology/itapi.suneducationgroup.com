require("dotenv").config();
const db = require("../models");
const LoginData = db.LoginData;
const sequelize = db.sequelize;

exports.getAll = async (req, res) => {
  try {
    const result = await LoginData.findAll();
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};
