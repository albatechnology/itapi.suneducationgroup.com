const db = require("../models");
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");

exports.myUserData = async (req, res) => {
  const user_id = req.user.user_id;
  let payload = {};
  try {
    userResult = await sequelize.query(
      "select user_id, username, fullname, nickname, inisial, email, handphone, cabang_id, supervisor_username, supervisor_id, supervisor_email, supervisor_fullname, dirid from login_data where user_id = ?",
      {
        replacements: [user_id],
        type: QueryTypes.SELECT,
      }
    );

    if (userResult[0] !== undefined) {
      payload = {
        error_code: 0,
        userData: userResult[0],
      };
    } else {
      payload = {
        error_code: 1,
        message: "User data tidak ditemukan",
      };
    }

    res.send(payload);
  } catch (e) {
    res.send(e);
  }
};

exports.userData = async (req, res) => {
  const user_id = req.params.id;
  let payload = {};
  try {
    userResult = await sequelize.query(
      "select user_id, username, fullname, nickname, inisial, email, handphone, cabang_id, supervisor_username, supervisor_id, supervisor_email, supervisor_fullname, dirid from login_data where user_id = ?",
      {
        replacements: [user_id],
        type: QueryTypes.SELECT,
      }
    );

    if (userResult[0] !== undefined) {
      payload = {
        error_code: 0,
        userData: userResult[0],
      };
    } else {
      payload = {
        error_code: 1,
        message: "User data tidak ditemukan",
      };
    }

    res.send(payload);
  } catch (e) {
    res.send(e);
  }
};

exports.myPermintaanInventori = async (req, res) => {
  const user_id = req.user.user_id;

  hardwareInventoriResult = await sequelize.query(
    "select hardware_inventoris.*,hardware_spesifikasis.nama_hardware from hardware_inventoris join hardware_spesifikasis on hardware_spesifikasis.id = hardware_inventoris.hardware_spesifikasi_id where hardware_inventoris.id in (select hardware_inventori_id from hardware_assigns where user_id = ? and status = 2)",
    {
      replacements: [user_id],
      type: QueryTypes.SELECT,
    }
  );
  res.send(hardwareInventoriResult);
};

exports.myInventori = async (req, res) => {
  const user_id = req.user.user_id;

  hardwareInventoriResult = await sequelize.query(
    "select hardware_inventoris.*,hardware_spesifikasis.nama_hardware from hardware_inventoris join hardware_spesifikasis on hardware_spesifikasis.id = hardware_inventoris.hardware_spesifikasi_id where hardware_inventoris.id in (select hardware_inventori_id from hardware_assigns where user_id = ?)",
    {
      replacements: [user_id],
      type: QueryTypes.SELECT,
    }
  );
  res.send(hardwareInventoriResult);
};
exports.myPermintaanInventori = async (req, res) => {
  const user_id = req.user.user_id;

  hardwareInventoriResult = await sequelize.query(
    "select hardware_inventoris.*,hardware_spesifikasis.nama_hardware from hardware_inventoris join hardware_spesifikasis on hardware_spesifikasis.id = hardware_inventoris.hardware_spesifikasi_id where hardware_inventoris.id in (select hardware_inventori_id from hardware_assigns where user_id = ? and status = 2)",
    {
      replacements: [user_id],
      type: QueryTypes.SELECT,
    }
  );
  res.send(hardwareInventoriResult);
};
exports.myPeminjamanInventori = async (req, res) => {
  const user_id = req.user.user_id;

  hardwareInventoriResult = await sequelize.query(
    "select hardware_inventoris.*,hardware_spesifikasis.nama_hardware from hardware_inventoris join hardware_spesifikasis on hardware_spesifikasis.id = hardware_inventoris.hardware_spesifikasi_id where hardware_inventoris.id in (select hardware_inventori_id from hardware_assigns where user_id = ? and status = 3)",
    {
      replacements: [user_id],
      type: QueryTypes.SELECT,
    }
  );
  res.send(hardwareInventoriResult);
};
