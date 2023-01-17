require("dotenv").config();
const db = require("../models");
const LoginData = db.LoginData;
const sequelize = db.sequelize;
const { QueryTypes, json } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    let result;
    let query_filter = " WHERE user_id IS NOT NULL";
    let query_order = " ORDER BY createdAt DESC";

    let hardwareInventori;

    if ((cabang_id = req.query.cabang_id)) {
      query_filter += ' AND cabang_id="' + cabang_id + '"';
    }

    if ((hardware_inventori_id = req.query.hardware_inventori_id)) {
      hardwareInventori = await sequelize.query(
        'SELECT * FROM hardware_inventoris WHERE id = "' +
          hardware_inventori_id +
          '"',
        {
          type: QueryTypes.SELECT,
        }
      );

      //   const assignedUserIds = hardwareInventori[0]
      //     ? hardwareInventori[0]["user_ids"]
      //     : "[]";

      //   query_filter +=
      //     " AND user_id NOT IN " +
      //     assignedUserIds.replace("[", "(").replace("]", ")");
    }

    result = await sequelize.query(
      "SELECT * FROM login_data" + query_filter + query_order,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (hardwareInventori[0]) {
      result.map((res) => {
        if (
          JSON.parse(hardwareInventori[0]["user_ids"]).includes(res.user_id)
        ) {
          res.is_assigned = true;
        } else {
          res.is_assigned = false;
        }
      });
    }

    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};
