const db = require("../models");
const PerbaikanHardware = db.PerbaikanHardware;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");
const { HardwareAssign, PerbaikanHardwareInventori } = require("../models");

exports.getAll = async (req, res) => {
  const result = await sequelize.query(
    "select ph.*,sv.nama_pt from perbaikan_hardwares ph join suppliervendors sv on sv.id = ph.vendor_id order by ph.tanggal_pengajuan asc",
    {
      type: QueryTypes.SELECT,
    }
  );
  res.send(result);
};
exports.getById = async (req, res) => {
  const id = req.params.id;
  const payload = await getData(id);
  res.send(payload);
};
exports.getInventoris = async (req, res) => {
  const id = req.params.id;
  const payload = await getInventoris(id);
  console.log("payload", payload);
  res.send(payload);
};
exports.create = async (req, res) => {
  const { tanggal_pengajuan, vendor_id, catatan, inventoris } = req.body;
  const user_id = req.user.user_id;
  try {
    const insertResult = await PerbaikanHardware.create({
      tanggal_pengajuan,
      vendor_id,
      catatan,
      status: 1,
      create_user_id: user_id,
    });
    insertResult.save();
    const perbaikan_hardware_id = insertResult.id;
    console.log("perbaikan_hardware_id", perbaikan_hardware_id);
    for (let index = 0; index < inventoris.length; index++) {
      if (inventoris[index].checked) {
        const inventori_id = inventoris[index].id;
        const keterangan = inventoris[index].keterangan
          ? inventoris[index].keterangan
          : "";

        // get Assign data
        const assignResult = await HardwareAssign.findAll({
          where: {
            hardware_inventori_id: inventori_id,
            status: 4,
          },
        });

        if (assignResult) {
          console.log("assignResult", assignResult);
          const assign_id = assignResult[0].id;
          inventoriData = {
            perbaikan_hardware_id,
            inventori_id,
            assign_id,
            keterangan,
            status: 1,
            biaya: 0,
          };
          console.log("inventoriData", inventoriData);

          const inventoriInsertResult = await PerbaikanHardwareInventori.create(
            inventoriData
          );
          inventoriInsertResult.save();
          console.log("inventoriInsertResult", inventoriInsertResult);
          // Update assign data
          const updateAssignResult = await HardwareAssign.update(
            { status: 5 },
            {
              where: {
                id: assign_id,
              },
            }
          );
        }
      }
    }
    const payload = await getData(perbaikan_hardware_id);
    res.send(payload);
  } catch (e) {
    res.send(e);
  }
};

exports.update = async (req, res) => {
  const { id, tanggal_pengajuan, vendor_id, catatan, inventoris } = req.body;
  const user_id = req.user.user_id;
  try {
    const updateResult = await PerbaikanHardware.update(
      {
        vendor_id,
        catatan,
      },
      {
        where: { id },
      }
    );
    console.log("req.body", req.body);
    for (let index = 0; index < inventoris.length; index++) {
      const inventori_id = inventoris[index].id;
      const keterangan = inventoris[index].keterangan;

      // get Assign data

      inventoriData = {
        keterangan,
      };

      const inventoriUpdateResult = await PerbaikanHardwareInventori.update(
        inventoriData,
        { where: { id: inventori_id } }
      );
    }
    const payload = await getData(id);
    res.send(payload);
  } catch (e) {
    res.send(e);
  }
};

exports.sendToVendor = async (req, res) => {
  const { id } = req.body;
  const user_id = req.user.user_id;
  try {
    const result = await PerbaikanHardware.findByPk(id);
    if (result) {
      const inventoriResult = await PerbaikanHardwareInventori.findAll({
        where: { perbaikan_hardware_id: id },
      });
      if (inventoriResult) {
        for (let index = 0; index < inventoriResult.length; index++) {
          inventoriUpdateResult = PerbaikanHardwareInventori.update(
            { status: 2 },
            {
              where: { id: inventoriResult[index].id },
            }
          );
        }
      }
    }

    const payload = await getData(id);
    res.send(payload);
  } catch (e) {
    res.send(e);
  }
};

exports.returnInventoriFromVendor = async (req, res) => {
  const { perbaikanData, inventori } = req.body;
  const { id } = perbaikanData;
  const user_id = req.user.user_id;
  const perbaikan_hardware_inventori_id = inventori.id;
  const biaya = inventori.biaya;
  try {
    const result = await PerbaikanHardware.findByPk(id);
    if (result) {
      const inventoriResult = await PerbaikanHardwareInventori.findByPk(
        perbaikan_hardware_inventori_id
      );
      if (inventoriResult) {
        inventoriUpdateResult = PerbaikanHardwareInventori.update(
          { status: 3, biaya },
          {
            where: { id: perbaikan_hardware_inventori_id },
          }
        );
      }
    }

    const payload = await getData(id);
    res.send(payload);
  } catch (e) {
    res.send(e);
  }
};
exports.assignToUser = async (req, res) => {
  const { perbaikanData, inventori } = req.body;
  const { id } = perbaikanData;
  const user_id = req.user.user_id;
  const perbaikan_hardware_inventori_id = inventori.id;
  const biaya = inventori.biaya;
  try {
    const result = await PerbaikanHardware.findByPk(id);
    if (result) {
      const inventoriResult = await PerbaikanHardwareInventori.findByPk(
        perbaikan_hardware_inventori_id
      );
      if (inventoriResult) {
        const assign_id = inventoriResult.assign_id;

        const assignResult = await HardwareAssign.findByPk(assign_id);
        console.log("assignResult", assignResult);
        if (assignResult) {
          const user_id = assignResult.user_id;
          let assign_status = 0;
          //console.log("user_id", user_id);
          if (user_id) assign_status = 2;

          const assignUpdateResult = await HardwareAssign.update(
            { status: assign_status },
            {
              where: { id: assign_id },
            }
          );
          console.log("assignUpdateResult", assignUpdateResult);
          inventoriUpdateResult = PerbaikanHardwareInventori.update(
            { status: 10 },
            {
              where: { id: perbaikan_hardware_inventori_id },
            }
          );
        }
      }
    }

    const payload = await getData(id);
    res.send(payload);
  } catch (e) {
    res.send(e);
  }
};
exports.addToStock = async (req, res) => {
  const { perbaikanData, inventori } = req.body;
  const { id } = perbaikanData;
  const user_id = req.user.user_id;
  const perbaikan_hardware_inventori_id = inventori.id;
  const biaya = inventori.biaya;
  try {
    const result = await PerbaikanHardware.findByPk(id);
    if (result) {
      const inventoriResult = await PerbaikanHardwareInventori.findByPk(
        perbaikan_hardware_inventori_id
      );
      if (inventoriResult) {
        const assign_id = inventoriResult.assign_id;

        const assignResult = await HardwareAssign.findByPk(assign_id);

        if (assignResult) {
          const user_id = assignResult.user_id;
          const assign_status = 0;

          const assignUpdateResult = await HardwareAssign.update(
            { status: assign_status },
            {
              where: { id: assign_id },
            }
          );
          inventoriUpdateResult = PerbaikanHardwareInventori.update(
            { status: 10 },
            {
              where: { id: perbaikan_hardware_inventori_id },
            }
          );
        }
      }
    }

    const payload = await getData(id);
    res.send(payload);
  } catch (e) {
    res.send(e);
  }
};
exports.setAsBroken = async (req, res) => {
  const { perbaikanData, inventori } = req.body;
  const { id } = perbaikanData;
  const user_id = req.user.user_id;
  const perbaikan_hardware_inventori_id = inventori.id;
  const biaya = inventori.biaya;
  try {
    const result = await PerbaikanHardware.findByPk(id);
    if (result) {
      const inventoriResult = await PerbaikanHardwareInventori.findByPk(
        perbaikan_hardware_inventori_id
      );
      if (inventoriResult) {
        const assign_id = inventoriResult.assign_id;

        const assignResult = await HardwareAssign.findByPk(assign_id);

        if (assignResult) {
          const user_id = assignResult.user_id;
          const assign_status = 6;

          const assignUpdateResult = await HardwareAssign.update(
            { status: assign_status },
            {
              where: { id: assign_id },
            }
          );
          inventoriUpdateResult = PerbaikanHardwareInventori.update(
            { status: 10 },
            {
              where: { id: perbaikan_hardware_inventori_id },
            }
          );
        }
      }
    }

    const payload = await getData(id);
    res.send(payload);
  } catch (e) {
    res.send(e);
  }
};
getData = async (id) => {
  const result = await PerbaikanHardware.findByPk(id);
  let payload = {};
  if (result) {
    // update perbaikan status

    const inventoriResult = await sequelize.query(
      "select phi.*,hi.no_asset,hi.merek, hi.tipe,hi.serial_number,hs.nama_hardware from perbaikan_hardware_inventoris phi join hardware_inventoris hi on hi.id = phi.inventori_id join hardware_spesifikasis hs on hs.id = hi.hardware_spesifikasi_id where phi.perbaikan_hardware_id = ?",
      {
        replacements: [id],
        type: QueryTypes.SELECT,
      }
    );
    console.log("inventoriResult", inventoriResult);
    let status = 10;
    for (let index = 0; index < inventoriResult.length; index++) {
      //console.log("inventoriResult", inventoriResult);
      if (inventoriResult[index].status < status)
        status = inventoriResult[index].status;
    }

    const perbaikanResult = await PerbaikanHardware.update(
      { status },
      {
        where: { id },
      }
    );

    payload = { ...result, inventoris: inventoriResult };
  }
  return payload;
};

getInventoris = async (id) => {
  const result = await PerbaikanHardware.findByPk(id);
  let payload = {};
  if (result) {
    const result = await sequelize.query(
      "select phi.*,hi.no_asset,hi.merek, hi.tipe,hi.serial_number,hs.nama_hardware from perbaikan_hardware_inventoris phi join hardware_inventoris hi on hi.id = phi.inventori_id join hardware_spesifikasis hs on hs.id = hi.hardware_spesifikasi_id where phi.perbaikan_hardware_id = ?",
      {
        replacements: [id],
        type: QueryTypes.SELECT,
      }
    );
    payload = result;
  }
  return payload;
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await PerbaikanHardware.destroy({ where: { id } });
    const result = await PerbaikanHardware.findAll();
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};
