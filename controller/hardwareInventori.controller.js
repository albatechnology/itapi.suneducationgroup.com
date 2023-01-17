const db = require("../models");
const HardwareAssign = db.HardwareAssign;
const HardwareInventori = db.HardwareInventori;
const HardwareInventoriLisence = db.HardwareInventoriLisence;
const LoginData = db.LoginData;
const ChannelData = db.ChannelData;
const HardwareSpec = db.HardwareSpec;
const sequelize = db.sequelize;
const { QueryTypes, json } = require("sequelize");
const { hardwareSpec } = require(".");
// const { HardwareAssign } = require("../models");

exports.getAll = async (req, res) => {
  try {
    const result = await HardwareInventori.findAll({
      order: [["no_asset", "asc"]],
    });
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.getById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await sequelize.query(
      "select i.*,hs.nama_hardware,s.nama_pt as nama_supplier  from hardware_inventoris i join hardware_spesifikasis hs on hs.id = i.hardware_spesifikasi_id join suppliervendors s on s.id = i.supplier_id where i.id = ?  ",
      {
        replacements: [id],
        type: QueryTypes.SELECT,
      }
    );
    let payload = {};

    if (result[0] !== undefined) {
      const lisenceResult = await sequelize.query(
        "select hil.*,sl.lisence_id, sl.tanggal_aktif,sl.tanggal_expired,s.nama_software from hardware_inventori_lisences hil join software_lisences sl on hil.software_lisence_id = sl.id join software s on sl.software_id = s.id where hil.hardware_inventori_id = ?  and hil.status = 1",
        {
          replacements: [id],
          type: QueryTypes.SELECT,
        }
      );

      payload = {
        error_code: 0,
        data: { ...result[0], lisences: lisenceResult },
      };
    } else {
      payload = {
        error_code: 1,
        message: "data not found",
      };
    }

    res.send(payload);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.getAvailable = async (req, res) => {
  try {
    const result = await sequelize.query(
      "select * from hardware_inventoris where id not in (select hardware_inventori_id from hardware_assigns where status <> 0)",
      {
        type: QueryTypes.SELECT,
      }
    );
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.getAllChannel = async (req, res) => {
  try {
    const result = await ChannelData.findAll({
      order: [["id", "asc"]],
    });
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.getAssigned = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const result = await sequelize.query(
      "select * from hardware_inventoris where id in (select hardware_inventori_id from hardware_assigns where user_id = ? AND status = 2)",
      {
        replacements: [user_id],
        type: QueryTypes.SELECT,
      }
    );
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.getBrokenAtIT = async (req, res) => {
  try {
    const result = await sequelize.query(
      "select i.*,s.nama_hardware from hardware_inventoris i join hardware_spesifikasis s on s.id = i.hardware_spesifikasi_id where i.id in  (select hardware_inventori_id from hardware_assigns where status = 4)",
      {
        type: QueryTypes.SELECT,
      }
    );
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.getBrokenAtVendor = async (req, res) => {
  try {
    const result = await sequelize.query(
      "select i.*,s.nama_hardware from hardware_inventoris i join hardware_spesifikasis s on s.id = i.hardware_spesifikasi_id where i.id in (select hardware_inventori_id from hardware_assigns where status = 5)",
      {
        type: QueryTypes.SELECT,
      }
    );
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.getBySpec = async (req, res) => {
  try {
    const { hardwareSpecId } = req.query;

    const result = await sequelize.query(
      "select * from hardware_inventoris where hardware_spesifikasi_id = ? ) ",
      {
        replacements: [hardwareSpecId],
        type: QueryTypes.SELECT,
      }
    );
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.getByHardwareSpecId = async (req, res) => {
  const hardwareSpecId = req.params.id;
  try {
    const datas = await sequelize.query(
      "select hardware_inventoris.*,hardware_spesifikasis.nama_hardware,(select hardware_assigns.status from hardware_assigns where hardware_assigns.hardware_inventori_id =  hardware_inventoris.id and (hardware_assigns.status = 4 or hardware_assigns.status = 5 or hardware_assigns.status = 6) limit 0,1 )  as assign_status from hardware_inventoris join hardware_spesifikasis on hardware_spesifikasis.id = hardware_inventoris.hardware_spesifikasi_id where hardware_inventoris.hardware_spesifikasi_id = ?  ",
      {
        replacements: [hardwareSpecId],
        type: QueryTypes.SELECT,
      }
    );

    const users = await LoginData.findAll();

    let result = [];
    datas.forEach((data) => {
      let assignedUsers = [];

      if (data.user_ids) {
        JSON.parse(data.user_ids).forEach((user_id) => {
          assignedUsers.push(users.find((x) => x.user_id == user_id).fullname);
        });
      }

      data.assigned_users = assignedUsers.join(", ");
      result.push(data);
    });

    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
  //res.send(hardwareSpecId);
};
exports.create = async (req, res) => {
  const inventoris = req.body;
  const user_id = req.user.user_id;

  //const hardwareSpecId = inventori.hardwareSpecId;

  if (inventoris.length > 0) {
    const hardwareSpecId = inventoris[0].hardwareSpecId;
    let hardwareSpecData = null;
    try {
      hardwareSpecData = await HardwareSpec.findByPk(hardwareSpecId);
    } catch (e) {
      res.send(e);
    }

    if (hardwareSpecData) {
      var seq = hardwareSpecData.seq_inventori;
      var qty = hardwareSpecData.stock_qty;
      const inventoriList = [];
      inventoris.forEach(async (inventori) => {
        const date = new Date(inventori.tanggal_pembelian);
        const year = date.getFullYear();
        const no_asset = `IT.${year}.${hardwareSpecData.kode_inventori}.${
          seq >= 10 ? seq : `0${seq}`
        }`;
        seq++;
        qty++;

        const inventoriData = {
          hardware_spesifikasi_id: inventori.hardwareSpecId,
          no_asset: no_asset,
          supplier_id: inventori.supplier_id,
          merek: inventori.merek,
          tipe: inventori.tipe,
          serial_number: inventori.serial_number,
          harga: inventori.harga,
          tanggal_pembelian: inventori.tanggal_pembelian,
          form_permintaan: inventori.form_permintaan,
          spesifikasi: JSON.stringify(inventori.spesifikasi),
        };
        inventoriList.push(inventoriData);
        try {
          const hardwareInventoriData = await HardwareInventori.create(
            inventoriData
          );

          hardwareInventoriData.save();
          const result = await HardwareSpec.update(
            { seq_inventori: seq, stock_qty: qty },
            { where: { id: hardwareSpecData.id } }
          );
        } catch (err) {
          console.log(err);
          res.status(500).send(err);
        }
      });

      const payload = {
        error_code: 0,
        inventori: inventoriList,
      };

      res.send(payload);
    } else {
      res.status(412).send("Hardware Spesifikasi tidak ditemukan.");
    }
  }
};
exports.update = async (req, res) => {
  const inventori = req.body;
  const user_id = req.user.user_id;

  //const hardwareSpecId = inventori.hardwareSpecId;

  const hardwareSpecId = inventori.hardware_spesifikasi_id;
  let hardwareSpecData = null;
  try {
    hardwareSpecData = await HardwareSpec.findByPk(hardwareSpecId);
  } catch (e) {
    res.status(400).send(e);
  }
  if (hardwareSpecData) {
    const inventoriData = {
      hardware_spesifikasi_id: inventori.hardwareSpecId,
      supplier_id: inventori.supplier_id,
      merek: inventori.merek,
      tipe: inventori.tipe,
      serial_number: inventori.serial_number,
      harga: inventori.harga,
      tanggal_pembelian: inventori.tanggal_pembelian,
      form_permintaan: inventori.form_permintaan,
      spesifikasi: JSON.stringify(inventori.spesifikasi),
    };
    try {
      const hardwareInventoriData = await HardwareInventori.update(
        inventoriData,
        { where: { id: inventori.id } }
      );

      const payload = {
        error_code: 0,
        inventori,
      };
      res.send(payload);
    } catch (err) {
      res.status(500).send(err);
    }
  }
};

exports.getUserList = async (req, res) => {
  try {
    const result = await LoginData.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.assign_to = async (req, res) => {
  try {
    if ((userIds = req.body.user_ids)) {
      const hardwareInventory = await HardwareInventori.findByPk(req.params.id);

      const new_userIds = [];

      // push old data to new variable
      // if (hardwareInventory.user_ids) {
      //   JSON.parse(hardwareInventory.user_ids).forEach((user_id) => {
      //     new_userIds.push(user_id);
      //   });
      // }
      const inventori = req.body;
      const inventori_id = inventori.hardware_inventori_id;
      const hardware_spesifikasi_id = inventori.hardware_spesifikasi_id;

      // push new data to new variable
      const removeOldAssignedData = await HardwareAssign.destroy({
        where: { hardware_inventori_id: inventori_id },
      });

      userIds.forEach(async (user_id) => {
        new_userIds.push(user_id);

        const hardwareAssignData = {
          user_id: user_id,
          hardware_inventori_id: inventori_id,
          status: 1,
        };

        const assignResult = await HardwareAssign.create(hardwareAssignData);
        assignResult.save();
      });

      const updateHardwareInventory = await HardwareInventori.update(
        {
          user_ids: new_userIds,
        },
        {
          where: { id: req.params.id },
        }
      );

      if (updateHardwareInventory[0] === 1) {
        return res.status(200).send({
          status: "success",
        });
      } else {
        return res.status(400).send({
          status: "failed",
        });
      }
    }

    return res.status(400).send({
      status: "error",
      message: "User IDs is empty!",
    });
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.assignForRepair = async (req, res) => {
  const inventori = req.body;
  const user_id = req.user.user_id;

  const inventori_id = inventori.id;
  const hardware_spesifikasi_id = inventori.hardware_spesifikasi_id;
  // insert assign
  const hardwareAssignData = {
    user_id: 0,
    hardware_inventori_id: inventori_id,
    status: 4,
  };
  const assignResult = await HardwareAssign.create(hardwareAssignData);
  assignResult.save();

  try {
    const result = await sequelize.query(
      "select hardware_inventoris.*,(select login_data.fullname from login_data where login_data.user_id = (select hardware_assigns.user_id from hardware_assigns where hardware_assigns.hardware_inventori_id =  hardware_inventoris.id and hardware_assigns.status <> 0 order by id limit 0,1 ) ) as assign_to,(select hardware_assigns.status from hardware_assigns where hardware_assigns.hardware_inventori_id =  hardware_inventoris.id and (hardware_assigns.status = 4 or hardware_assigns.status = 5 or hardware_assigns.status = 6) limit 0,1 )  as assign_status from hardware_inventoris where hardware_inventoris.hardware_spesifikasi_id = ?  ",
      {
        replacements: [hardware_spesifikasi_id],
        type: QueryTypes.SELECT,
      }
    );
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.addLisence = async (req, res) => {
  const { inventori_id, lisence_id } = req.body;
  const user_id = req.user.user_id;

  try {
    const createResult = await HardwareInventoriLisence.create({
      hardware_inventori_id: inventori_id,
      software_lisence_id: lisence_id,
      tanggal_assign: sequelize.fn("NOW"),
      status: 1,
    });
    createResult.save();
    const id = inventori_id;
    const result = await sequelize.query(
      "select i.*,hs.nama_hardware,s.nama_pt as nama_supplier  from hardware_inventoris i join hardware_spesifikasis hs on hs.id = i.hardware_spesifikasi_id join suppliervendors s on s.id = i.supplier_id where i.id = ?  ",
      {
        replacements: [id],
        type: QueryTypes.SELECT,
      }
    );
    let payload = {};

    if (result[0] !== undefined) {
      const lisenceResult = await sequelize.query(
        "select hil.*,sl.lisence_id, sl.tanggal_aktif,sl.tanggal_expired,s.nama_software from hardware_inventori_lisences hil join software_lisences sl on hil.software_lisence_id = sl.id join software s on sl.software_id = s.id where hil.hardware_inventori_id = ? and hil.status = 1 ",
        {
          replacements: [id],
          type: QueryTypes.SELECT,
        }
      );
      payload = {
        error_code: 0,
        data: { ...result[0], lisences: lisenceResult },
      };
    } else {
      payload = {
        error_code: 1,
        message: "data tidak ditemukan",
      };
    }

    res.send(payload);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.removeLisence = async (req, res) => {
  const { inventori_id, lisence_id } = req.body;
  const user_id = req.user.user_id;
  try {
    await HardwareInventoriLisence.update(
      {
        status: 0,
      },
      {
        where: {
          hardware_inventori_id: inventori_id,
          software_lisence_id: lisence_id,
        },
      }
    );

    const id = inventori_id;
    const result = await sequelize.query(
      "select i.*,hs.nama_hardware,s.nama_pt as nama_supplier  from hardware_inventoris i join hardware_spesifikasis hs on hs.id = i.hardware_spesifikasi_id join suppliervendors s on s.id = i.supplier_id where i.id = ?  ",
      {
        replacements: [id],
        type: QueryTypes.SELECT,
      }
    );
    let payload = {};

    if (result[0] !== undefined) {
      const lisenceResult = await sequelize.query(
        "select hil.*,sl.lisence_id, sl.tanggal_aktif,sl.tanggal_expired,s.nama_software from hardware_inventori_lisences hil join software_lisences sl on hil.software_lisence_id = sl.id join software s on sl.software_id = s.id where hil.hardware_inventori_id = ? and hil.status = 1 ",
        {
          replacements: [id],
          type: QueryTypes.SELECT,
        }
      );
      payload = {
        error_code: 0,
        data: { ...result[0], lisences: lisenceResult },
      };
    } else {
      payload = {
        error_code: 1,
        message: "data tidak ditemukan",
      };
    }
    res.send(payload);
  } catch (e) {
    res.status(400).send(e);
  }
};
