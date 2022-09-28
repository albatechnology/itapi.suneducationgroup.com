const db = require("../models");
const HardwareStockCard = db.HardwareStockCard;
const HardwareSpec = db.HardwareSpec;
const sequelize = db.sequelize;
const { QueryTypes, json } = require("sequelize");
const { hardwareSpec } = require(".");

exports.getAll = (req, res) => {
  HardwareStockCard.findAll({ order: [["id", "asc"]] }).then((data) => {
    //console.log(req.user);
    res.send(data);
  });
};
exports.create = async (req, res) => {
  const {
    hardwareSpecId,
    harga,
    tanggal_pembelian,
    supplier_id,
    form_permintaan,
    qty,
  } = req.body;
  const user_id = req.user.user_id;

  //const hardwareSpecId = inventori.hardwareSpecId;

  let hardwareSpecData = null;
  try {
    hardwareSpecData = await HardwareSpec.findByPk(hardwareSpecId);
  } catch (e) {
    res.send(e);
  }

  if (hardwareSpecData) {
    var stock_qty = hardwareSpecData.stock_qty;
    const stockCardData = {
      hardware_spesifikasi_id: hardwareSpecId,
      harga: harga,
      supplier_id: supplier_id,
      tanggal_pembelian: tanggal_pembelian,
      form_permintaan: form_permintaan,
      qty_in: qty,
      balance: stock_qty + qty,
      transaction_id: 0,
      transaction_type: 1,
    };
    try {
      const hardwareStockCardData = await HardwareStockCard.create(
        stockCardData
      );
      hardwareStockCardData.save();

      // Update Stock
      const result = await HardwareSpec.update(
        { stock_qty: stock_qty + qty },
        { where: { id: hardwareSpecData.id } }
      );
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }

    const payload = {
      error_code: 0,
      stockCardData: stockCardData,
    };

    res.send(payload);
  } else {
    res.status(412).send("Hardware Spesifikasi tidak ditemukan.");
  }
};
