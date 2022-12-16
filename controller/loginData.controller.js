require("dotenv").config();
const db = require("../models");
const LoginData = db.LoginData;
const sequelize = db.sequelize;

exports.getAll = async (req, res) => {
  try {
    let result;
    if ((cabang_id = req.query.cabang_id)) {
      result = await LoginData.findAll({
        where: { cabang_id },
        order: [["createdAt", "DESC"]],
      });
    } else {
      result = await LoginData.findAll({
        order: [["createdAt", "DESC"]],
      });
    }
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};
