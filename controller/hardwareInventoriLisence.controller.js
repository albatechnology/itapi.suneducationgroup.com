const db = require("../models");
const HardwareInventoriLisence = db.HardwareInventoriLisence;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");

exports.getByHardwareInventori = async (req, res) => {
  const { hardware_inventori_id } = res.param.id;
  try {
    const result = await HardwareInventoriLisence.findAll({
      where: { hardware_inventori_id },
    });
    const returnValue = {
      error_code: 0,
      payload: result,
    };
    res.send(returnValue);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.getAvailable = async (req, res) => {
  try {
    const result = await sequelize.query(
      "select software_lisences.*,software.nama_software from software_lisences join software on software.id = software_lisences.software_id  where software_lisences.id not in (select software_lisence_id from hardware_inventori_lisences where status = 1) ",
      {
        type: QueryTypes.SELECT,
      }
    );
    const returnValue = {
      error_code: 0,
      payload: result,
    };
    res.send(returnValue);
  } catch (e) {
    res.status(400).send(e);
  }
};
