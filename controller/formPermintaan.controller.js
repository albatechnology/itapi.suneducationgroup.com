const db = require("../models");
const FormPermintaan = db.FormPermintaan;
const FormPermintaanDetails = db.FormPermintaanDetails;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const result = await sequelize.query(
      "select p.*,s.nama_pt from form_permintaans p join suppliervendors s on s.id = p.supplier_id",
      {
        type: QueryTypes.SELECT,
      }
    );
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.create = async (req, res) => {
  const { supplier_id, tanggal_pengajuan, alasan_pembelian, details } =
    req.body;
  const user_id = req.user.user_id;
  const detailsData = [];
  try {
    const formPermintaanData = await FormPermintaan.create({
      supplier_id,
      tanggal_pengajuan,
      alasan_pembelian,
      create_user_id: user_id,
    });
    formPermintaanData.save();

    if (details.length > 0) {
      // insert details
      details.forEach(async (detail) => {
        const detailData = await FormPermintaanDetails.create({
          ...detail,
          form_permintaan_id: formPermintaanData.id,
          harga_total: detail.harga_satuan * detail.qty,
        });
        detailsData.push(detailData);
        detailData.save();
      });
    }

    res.send({
      error_code: 0,
      payload: {
        formPermintaan: formPermintaanData,
        details: detailsData,
      },
    });
  } catch (e) {
    res.status(500).send(e);
  }

  //console.log(req.body);
};
exports.generatePdf = async (req, res) => {
  //console.log(req.body);
  var fs = require("fs");
  var pdf = require("html-pdf");
  var html = fs.readFileSync("./public/templateFormPermintaan.html", "utf8");
  var options = { format: "Letter" };
  console.log("html", html);
  pdf.create(html, options).toFile("./public/testpdf.pdf", function (err, res) {
    if (err) return console.log(err);
    console.log(res); // { filename: '/app/businesscard.pdf' }
  });
};

// exports.update = async (req, res) => {
//   const { id, tanggal_pengajuan, alasan_pembelian, details } = req.body;
//   const user_id = req.user.user_id;
//   try {
//     const updateResult = await PerbaikanHardware.update({

//     })
//   } catch (e) {
//     res.send(e);
//   }
// };

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await FormPermintaan.destroy({ where: { id } });
    const result = await FormPermintaan.findAll();
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};
