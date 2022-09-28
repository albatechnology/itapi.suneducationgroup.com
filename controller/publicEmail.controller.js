const db = require("../models");
const PublicEmail = db.PublicEmail;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const mailinglist = await sequelize.query(
      "select public_emails.*,(select count(publicemailadmins.email) from publicemailadmins where publicemailadmins.publicemail_id = public_emails.id ) as admin_count from public_emails ",
      {
        type: QueryTypes.SELECT,
      }
    );

    console.log(req.originalUrl);
    res.send(mailinglist);
  } catch (e) {
    res.send(e);
  }
};

exports.create = async (req, res) => {
  const { email, deskripsi } = req.body;
  let returnValue = {};
  let payload = { email, deskripsi };
  try {
    const result = await PublicEmail.findAll({ where: { email } });
    console.log("result", result);
    if (result[0] === undefined) {
      const createResult = await PublicEmail.create({ email, deskripsi });
      createResult.save();
      payload = createResult;
      returnValue = {
        error_code: 0,
        payload,
        message: "Public Email Berhasil dimasukan",
      };
    } else {
      returnValue = {
        error_code: 1,
        payload,
        message: "Public Email sudah terdaftar",
      };
    }
    res.send(returnValue);
  } catch (e) {
    res.send(e);
  }
};
exports.getById = (req, res) => {
  const id = req.params.id;

  PublicEmail.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving MailingList with id=" + id,
      });
    });
};
exports.update = async (req, res) => {
  const id = req.params.id;
  const { email, deskripsi } = req.body;
  const payload = req.body;
  let returnValue = {};
  try {
    const result = await PublicEmail.findAll({ where: { email } });
    console.log(result[0]);
    if (result[0] === undefined) {
      //update
      const updateResult = await PublicEmail.update(
        { email, deskripsi },
        { where: { id } }
      );
      returnValue = {
        error_code: 0,
        payload,
        message: "Public email berhasil diubah",
      };
    } else {
      const publicemail_id = result[0].id;
      if (publicemail_id == id) {
        // update
        const updateResult = await PublicEmail.update(
          { email, deskripsi },
          { where: { id } }
        );
        returnValue = {
          error_code: 0,
          payload,
          message: "Public email berhasil diubah",
        };
      } else {
        returnValue = {
          error_code: 1,
          payload,
          message: "Public email sudah terdaftar",
        };
      }
    }
    res.send(returnValue);
  } catch (e) {
    res.send(e);
  }
};
exports.delete = (req, res) => {
  const id = req.params.id;
  PublicEmail.destroy({ where: { id } }).then(() => {
    PublicEmail.findAll().then((publicEmailData) => {
      res.send(publicEmailData);
    });
  });
};
exports.getByMemberId = (req, res) => {
  const { user_id } = req.query;
  sequelize
    .query(
      "select * from public_emails where id in (select publicemail_id from publicemailadmins where user_id = ? ) ",
      {
        replacements: [user_id],
        type: QueryTypes.SELECT,
      }
    )
    .then((selData) => {
      res.send(selData);
    });
};
