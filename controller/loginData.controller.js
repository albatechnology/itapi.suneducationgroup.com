require("dotenv").config();
const db = require("../models");
const LoginData = db.LoginData;
const sequelize = db.sequelize;
const { QueryTypes, json } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    let result;
    let query_filter = " WHERE ld.user_id IS NOT NULL";
    let query_order_hardware = " ORDER BY ha.hardware_inventori_id DESC";
    let query_order_software = " ORDER BY sa.software_inventori_id DESC";

    let hardwareInventori = [];
    let softwareInventori = [];

    if ((cabang_id = req.query.cabang_id)) {
      query_filter += ' AND ld.cabang_id="' + cabang_id + '"';
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

    if (req.query.hardware_inventori_id) {
      result = await sequelize.query(
        "SELECT ha.hardware_inventori_id  hardware_inventori_id, ld.* FROM login_data ld LEFT JOIN hardware_assigns ha ON ha.user_id = ld.user_id AND ha.hardware_inventori_id = " +
          (req.query.hardware_inventori_id
            ? req.query.hardware_inventori_id
            : "0") +
          query_filter +
          query_order_hardware,
        {
          type: QueryTypes.SELECT,
        }
      );
    }

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

    if ((software_inventori_id = req.query.software_inventori_id)) {
      softwareInventori = await sequelize.query(
        'SELECT * FROM software_lisences WHERE id = "' +
          software_inventori_id +
          '"',
        {
          type: QueryTypes.SELECT,
        }
      );
    }

    if (req.query.software_inventori_id) {
      result = await sequelize.query(
        "SELECT sa.software_inventori_id software_inventori_id, ld.* FROM login_data ld LEFT JOIN software_assigns sa ON sa.user_id = ld.user_id AND sa.software_inventori_id = " +
          (req.query.software_inventori_id
            ? req.query.software_inventori_id
            : "0") +
          query_filter +
          query_order_software,
        {
          type: QueryTypes.SELECT,
        }
      );
    }

    if (softwareInventori[0]) {
      result.map((res) => {
        if (
          JSON.parse(softwareInventori[0]["user_ids"]).includes(res.user_id)
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
