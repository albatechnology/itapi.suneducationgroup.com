const db = require("../models");
const Software = db.Software;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const data = await sequelize.query(
      "select software.*,(select count(software_lisences.software_id) from software_lisences where software_lisences.software_id = software.id) as software_count from software ",
      {
        type: QueryTypes.SELECT,
      }
    );
    // res.send(software);
    res.send(data);
  } catch (e) {
    res.status(400).send(e);
  }
  // Software.findAll({ order: [["nama_software", "asc"]] }).then((data) => {
  //   //console.log(req.user);
  //   res.send(data);
  // });
};
exports.create = (req, res) => {
  const { nama_software, deskripsi } = req.body;
  const user_id = req.user.user_id;
  Software.create({
    nama_software,
    deskripsi,
    create_user_id: user_id,
  })
    .then((obj) => {
      obj.save();
      res.json({
        error_code: 0,
        message: "Software berhasil ditambahkan",
      });
    })
    .catch((err) => console.log(err));
};
exports.update = (req, res) => {
  const { id, nama_software, deskripsi } = req.body;
  Software.update(
    {
      nama_software,
      deskripsi,
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
    const result = await Software.destroy({ where: { id } });

    const softwareData = await Software.findAll();
    res.send(softwareData);
  } catch (e) {
    res.send(e);
  }
};
