const db = require("../models");
const FormPermintaan = db.FormPermintaan;
const FormPermintaanDetails = db.FormPermintaanDetails;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");

const getByFormPermintaanId = async (formPermintaanId) => {
  const formPermintaan = await sequelize.query(
    "SELECT * FROM form_permintaans as fp join suppliervendors as sv on sv.id = fp.supplier_id where fp.id = ?",
    {
      replacements: [formPermintaanId],
      type: QueryTypes.SELECT,
    }
  );
  const formPermintaanDetails = await sequelize.query(
    "SELECT fpd.* FROM form_permintaans as fp join form_permintaan_details as fpd on fp.id = fpd.form_permintaan_id join suppliervendors as sv on sv.id = fp.supplier_id where fp.id = ?",
    {
      replacements: [formPermintaanId],
      type: QueryTypes.SELECT,
    }
  );

  return {
    ...formPermintaan[0],
    details: formPermintaanDetails,
  };
};

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
  const {
    supplier_id,
    date_available,
    tanggal_pengajuan,
    alasan_pembelian,
    note,
    details,
  } = req.body;
  const user_id = req.user.user_id;
  const detailsData = [];
  try {
    const formPermintaanData = await FormPermintaan.create({
      supplier_id,
      tanggal_pengajuan,
      date_available,
      alasan_pembelian,
      note,
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
      payload: await getByFormPermintaanId(formPermintaanData.id),
    });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getByFormPermintaanId = async (req, res) => {
  const formPermintaanId = req.params.id;
  try {
    res.send(await getByFormPermintaanId(formPermintaanId));
  } catch (e) {
    res.status(400).send(e);
  }
  //res.send(hardwareSpecId);
};

exports.update = async (req, res, next) => {
  const id = req.params.id;
  // const detailsData = [];
  try {
    const {
      supplier_id,
      date_available,
      tanggal_pengajuan,
      alasan_pembelian,
      note,
      details,
    } = req.body;
    const result = await FormPermintaan.update(
      {
        supplier_id,
        date_available,
        tanggal_pengajuan,
        alasan_pembelian,
        note,
      },
      { where: { id: id } }
    );
    if (details.length > 0) {
      const formPermintaanDetails = await FormPermintaanDetails.destroy({
        where: { form_permintaan_id: id },
      });
      details.forEach(async (detail) => {
        const detailData = await FormPermintaanDetails.create({
          ...detail,
          form_permintaan_id: id,
          harga_total: detail.harga_satuan * detail.qty,
        });
        // detailsData.push(detailData);
        detailData.save();
      });
    }
    res
      .status(200)
      .send({ error_code: 0, payload: await getByFormPermintaanId(id) });
  } catch (error) {
    res.status(500).send({
      message: "Error update Form Permintaan with id=" + id,
    });
  }
};

exports.generatePdf = async (req, res) => {
  try {
    const ids = req.body.ids || [];
    let resultArray = [];
    for (const id of ids) {
      const data = await getByFormPermintaanId(id);
      console.log("cek dta", data);
      let result = {
        submission_date: data.tanggal_pengajuan,
        date_available: data.date_available,
        note: data.alasan_pembelian,
        supplier_id: data.supplier_id,
        supplier_name: data.nama_pt,
        details: data.details,
      };
      resultArray.push(result);
    }
    res.send(resultArray);
    console.log("cek payloadererererer", resultArray);
  } catch (e) {
    res.status(400).send(e);
  }
};

// exports.generatePdf = async (req, res) => {
//   try {
//     var now = new Date();
//     doc.pipe(
//       fs.createWriteStream(
//         "./public/formpermintaan-" +
//           now.getFullYear() +
//           "-" +
//           now.getMonth() +
//           "-" +
//           now.getDate() +
//           ".pdf"
//       )
//     );
//     doc.fontSize(27).text("Form Permintaan", 100, 100);
//     doc
//       .addPage()
//       .fontSize(15)
//       .text("Generating PDF with the help of pdfkit", 100, 100);

//     // Apply some transforms and render an SVG path with the
//     // 'even-odd' fill rule
//     doc
//       .scale(0.6)
//       .translate(470, -380)
//       .path("M 250,75 L 323,301 131,161 369,161 177,301 z")
//       .fill("red", "even-odd")
//       .restore();

//     // Add some text with annotations
//     doc
//       .addPage()
//       .fillColor("blue")
//       .text("The link for GeeksforGeeks website", 100, 100)

//       .link(100, 100, 160, 27, "https://www.geeksforgeeks.org/");

//     // Finalize PDF file
//     doc.end();
//   } catch (e) {
//     res.status(400).send(e);
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
