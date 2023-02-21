const db = require("../models");
const SoftwareLisence = db.SoftwareLisence;
const SoftwareAssign = db.SoftwareAssign;
const Software = db.Software;
const sequelize = db.sequelize;
const { QueryTypes, json } = require("sequelize");
const { hardwareSpec } = require(".");
const LoginData = db.LoginData;

exports.getAll = (req, res) => {
  SoftwareLisence.findAll({ order: [["lisence_id", "asc"]] }).then((data) => {
    //console.log(req.user);
    res.send(data);
  });
};

exports.getById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await sequelize.query(
      "select software.nama_software,software_lisences.*, s.nama_pt as nama_supplier from software_lisences join software on software.id = software_lisences.software_id join suppliervendors s on s.id=software_lisences.supplier_id where software_lisences.software_id = ?",
      {
        replacements: [id],
        type: QueryTypes.SELECT,
      }
    );
    // let payload = {};
    let payload = {
      error_code: 0,
      data: {
        ...result[0],
      },
    };
    // if (result[0] !== undefined) {
    //   const licenseResult = await sequelize.query(

    //   )
    // }
    res.send(payload);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.assign_to = async (req, res) => {
  try {
    if ((userIds = req.body.user_ids)) {
      const softwareInventory = await SoftwareLisence.findByPk(req.params.id);
      const new_userIds = [];
      const inventori = req.body;
      const software_id = inventori.software_inventori_id;
      // const hardware_spesifikasi_id = inventori.hardware_spesifikasi_id;

      // push new data to new variable
      if (software_id) {
        const removeOldAssignedData = await SoftwareAssign.destroy({
          where: { software_inventori_id: software_id },
        });
      }
      userIds.forEach(async (user_id) => {
        new_userIds.push(user_id);
        const softwareAssignData = {
          user_id: user_id,
          software_inventori_id: software_id,
          status: 1,
        };

        const assignResult = await SoftwareAssign.create(softwareAssignData);
        assignResult.save();
      });

      const updateSoftwareInventory = await SoftwareLisence.update(
        {
          user_ids: new_userIds,
        },
        {
          where: { id: req.params.id },
        }
      );

      if (updateSoftwareInventory[0] === 1) {
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

exports.getBySoftware = async (req, res) => {
  const softwareId = req.params.id;
  try {
    const datas = await sequelize.query(
      "select software.nama_software,software_lisences.* from software_lisences join software on software.id = software_lisences.software_id where software_lisences.software_id = ?  ",
      {
        replacements: [softwareId],
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
};

exports.getBySoftwareLicenseId = async (req, res) => {
  const softwareLicenseId = req.params.id;
  try {
    const result = await sequelize.query(
      "select software.nama_software,software_lisences.* from software_lisences join software on software.id = software_lisences.software_id where software_lisences.id = ?  ",
      {
        replacements: [softwareLicenseId],
        type: QueryTypes.SELECT,
      }
    );
    res.send(result[0]);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.create = async (req, res) => {
  const lisences = req.body;
  const user_id = req.user.user_id;
  const lisenceList = [];
  if (lisences.length > 0) {
    const softwareId = lisences[0].softwareId;
    let softwareData = null;
    try {
      softwareData = await Software.findByPk(softwareId);
    } catch (e) {
      res.send(e);
    }

    if (softwareData) {
      lisences.forEach(async (lisence) => {
        const lisenceData = {
          software_id: softwareId,
          lisence_id: lisence.lisence_id,
          supplier_id: lisence.supplier_id,
          harga: lisence.harga,
          tanggal_pembelian: lisence.tanggal_pembelian,
          tanggal_aktif: lisence.tanggal_aktif,
          tanggal_expired: lisence.tanggal_expired,
          form_permintaan: lisence.form_permintaan,
          have_expired: lisence.have_expired,
        };
        lisenceList.push(lisenceData);
        try {
          const softwareLinsenceData = await SoftwareLisence.create(
            lisenceData
          );

          softwareLinsenceData.save();
        } catch (err) {
          //console.log(err);
          res.status(500).send(err);
        }
      });
      const payload = {
        error_code: 0,
        lisences: lisenceList,
      };

      res.send(payload);
    } else {
      res.status(412).send("Software tidak ditemukan.");
    }
  }
};
/*
exports.create = (req, res) => {
  const inventori = req.body;
  const user_id = req.user.user_id;

  //const hardwareSpecId = inventori.hardwareSpecId;
  HardwareSpec.findByPk(inventori.hardwareSpecId)
    .then((hardwareSpecData) => {
      //console.log(hardwareSpecData);
      if (hardwareSpecData) {
        var seq = hardwareSpecData.seq_inventori;

        const date = new Date(inventori.tanggal_pembelian);
        const year = date.getFullYear();
        const no_asset = `IT.${year}.${hardwareSpecData.kode_inventori}.${
          seq > 10 ? seq : `0${seq}`
        }`;
        hardwareSpecData.seq_inventori++;
        const inventoriData = {
          hardware_spesifikasi_id: inventori.hardwareSpecId,
          no_asset: no_asset,
          supplier_id: inventori.supplier_id,
          tanggal_pembelian: inventori.tanggal_pembelian,
          form_permintaan: inventori.form_permintaan,
          spesifikasi: JSON.stringify(inventori.spesifikasi),
        };
        //console.log(inventoriData);
        HardwareInventori.create(inventoriData)
          .then((hardwareInventoriData) => {
            hardwareInventoriData.save();
            // update HardwareSpec SEQ
            HardwareSpec.update(
              { seq_inventori: seq },
              { where: { id: hardwareSpecData.hardwareSpecId } }
            )
              .then((result) => {
                res
                  .status(200)
                  .send("Data Hardware Inventori berhasil disimpan");
              })
              .catch((e) => res.status(500).send(err));
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send(err);
          });
      } else {
        res.status(412).send("Hardware Spesifikasi tidak ditemukan.");
      }
    })
    .catch((err) => res.status(500).send(err));
};*/
