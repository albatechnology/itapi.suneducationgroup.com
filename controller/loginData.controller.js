require("dotenv").config();
const db = require("../models");
const LoginData = db.LoginData;
const sequelize = db.sequelize;
const { QueryTypes, json } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    let result;
    let query_filter = " WHERE ld.user_id IS NOT NULL";

    // default inventory variable
    let inventoryData = [];
    let inventoryId = req.query.hardware_inventori_id;
    let inventoryTable = "hardware_inventoris";
    let inventoryAssignTable = "hardware_assigns";
    let inventoryColumn = "hardware_inventori_id";

    if ((cabang_id = req.query.cabang_id)) {
      query_filter += ' AND ld.cabang_id="' + cabang_id + '"';
    }

    // define software inventory variable
    if (req.query.software_inventori_id) {
      inventoryId = req.query.software_inventori_id;

      inventoryTable = "software_lisences";
      inventoryAssignTable = "software_assigns";
      inventoryColumn = "software_inventory_id";
    }

    // get inventory data
    inventoryData = await sequelize.query(
      "SELECT * FROM " + inventoryTable + ' WHERE id = "' + inventoryId + '"',
      {
        type: QueryTypes.SELECT,
      }
    );

    // get result
    let query_order = " ORDER BY i." + inventoryColumn + " DESC";

    result = await sequelize.query(
      "SELECT i." +
        inventoryColumn +
        " " +
        inventoryColumn +
        ", ld.* FROM login_data ld LEFT JOIN " +
        inventoryAssignTable +
        " i ON i.user_id = ld.user_id AND i." +
        inventoryColumn +
        " = " +
        (inventoryId ? inventoryId : "0") +
        query_filter +
        query_order,
      {
        type: QueryTypes.SELECT,
      }
    );

    // proceed result
    if (inventoryData[0]) {
      result.map((res) => {
        if (JSON.parse(inventoryData[0]["user_ids"]).includes(res.user_id)) {
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
