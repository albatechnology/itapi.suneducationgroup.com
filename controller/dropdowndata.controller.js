const db = require("../models");
const SupplierVendorCategory = db.SupplierVendorCategory;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");

exports.supplierVendorCategory = async (req, res) => {
  try {
    const data = await SupplierVendorCategory.findAll({
      order: [["category_value", "asc"]],
    });

    res.send(data);
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.uom = async (req, res) => {
  try {
    const selData = await sequelize.query("select * from uoms", {
      type: QueryTypes.SELECT,
    });
    res.send(selData);
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.jenisPerbaikan = async (req, res) => {
  try {
    const selData = await sequelize.query("select * from jenis_perbaikans", {
      type: QueryTypes.SELECT,
    });
    res.send(selData);
  } catch (e) {
    res.status(400).send(e);
  }
};
