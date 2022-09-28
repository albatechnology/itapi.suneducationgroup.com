const db = require("../models");
const SupplierVendor = db.SupplierVendor;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");

exports.getAll = (req, res) => {
  SupplierVendor.findAll({ order: [["nama_pt", "asc"]] }).then((data) => {
    //console.log(req.user);
    res.send(data);
  });
};
exports.create = (req, res) => {
  const { nama_pt, pic, phone, mobile_phone, alamat, rekening_bank, category } =
    req.body;
  const user_id = req.user.user_id;
  SupplierVendor.create({
    nama_pt,
    pic,
    phone,
    mobile_phone,
    alamat,
    rekening_bank,
    category,
    create_user_id: user_id,
  })
    .then((obj) => {
      obj.save();
      res.json({
        error_code: 0,
        message: "SupplierVendor berhasil ditambahkan",
      });
    })
    .catch((err) => console.log(err));
};
exports.update = (req, res) => {
  const {
    id,
    nama_pt,
    pic,
    phone,
    mobile_phone,
    alamat,
    rekening_bank,
    category,
  } = req.body;
  SupplierVendor.update(
    {
      nama_pt,
      pic,
      phone,
      mobile_phone,
      alamat,
      rekening_bank,
      category,
    },
    { where: { id } }
  )
    .then((obj) => {
      res.status(200).send({ error_code: 0, payload: req.body });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error update SupplierVendor with id=" + id,
      });
    });
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await SupplierVendor.destroy({ where: { id } });

    const supplierVendorData = await SupplierVendor.findAll();
    res.send(supplierVendorData);
  } catch (e) {
    res.send(e);
  }
};
