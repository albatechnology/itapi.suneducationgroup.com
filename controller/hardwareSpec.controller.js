const db = require("../models");
const HardwareSpec = db.HardwareSpec;
const sequelize = db.sequelize;
const { QueryTypes, json } = require("sequelize");

exports.getAll = async (req, res) => {
  // try {
  //   const result = await HardwareSpec.findAll({
  //     order: [["nama_hardware", "asc"]],
  //   });
  //   //console.log(req.user);
  //   res.send(result);
  // } catch (e) {
  //   res.status(400).send(e);
  // }
  try {
    const result = await sequelize.query(
      "select hardware_spesifikasis.*,(select count(hardware_inventoris.hardware_spesifikasi_id) from hardware_inventoris where hardware_inventoris.hardware_spesifikasi_id = hardware_spesifikasis.id) as software_count from hardware_spesifikasis",
      {
        type: QueryTypes.SELECT,
      }
    );
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.getById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await HardwareSpec.findByPk(id);
    res.send(result);
  } catch (e) {
    res.status(500).send({
      message: "Error retrieving HardwareSpec with id=" + id,
    });
  }
};
exports.create = async (req, res) => {
  try {
    const {
      nama_hardware,
      kode_inventori,
      seq_inventori,
      consumable,
      deskripsi,
      spesifikasi,
    } = req.body;
    const user_id = req.user.user_id;
    const result = await HardwareSpec.create({
      nama_hardware,
      kode_inventori,
      seq_inventori,
      consumable,
      stock_qty: 0,
      deskripsi,
      spesifikasi: JSON.stringify(spesifikasi),
      create_user_id: user_id,
    });
    result.save();
    res.json({
      error_code: 0,
      message: "SupplierVendor berhasil ditambahkan",
    });
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.update = async (req, res) => {
  try {
    const {
      id,
      nama_hardware,
      kode_inventori,
      seq_inventori,
      consumable,
      deskripsi,
      spesifikasi,
    } = req.body;
    console.log(req.body);
    const result = await HardwareSpec.update(
      {
        nama_hardware,
        kode_inventori,
        seq_inventori,
        consumable,
        deskripsi,
        spesifikasi: JSON.stringify(spesifikasi),
      },
      { where: { id } }
    );
    res.status(200).send({ error_code: 0, payload: req.body });
  } catch (e) {
    res.status(500).send({
      message: "Error update SupplierVendor with id=" + id,
    });
  }
};
