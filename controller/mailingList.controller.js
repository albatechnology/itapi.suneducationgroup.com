const db = require("../models");
const MailingList = db.MailingList;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const mailinglist = await sequelize.query(
      "select mailinglists.*,(select count(mailinglistmembers.email) from mailinglistmembers where mailinglistmembers.mailinglist_id = mailinglists.id ) as email_count from mailinglists ",
      {
        type: QueryTypes.SELECT,
      }
    );

    console.log(req.originalUrl);
    res.send(mailinglist);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.create = async (req, res) => {
  const { email, deskripsi } = req.body;
  let response = {};
  try {
    const selectResult = await MailingList.findAll({ where: { email } });

    if (selectResult[0] === undefined) {
      const createResult = await MailingList.create({
        email: email,
        deskripsi: deskripsi,
      });
      createResult.save();
      response = {
        error_code: 0,
        message: "Mailinglist berhasil ditambahkan",
      };
    } else {
      response = {
        error_code: 1,
        message: "Email telah terdaftar",
      };
    }
    res.send(response);
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await MailingList.findByPk(id);
    res.send(result);
  } catch (e) {
    res.status(500).send({
      message: "Error retrieving MailingList with id=" + id,
    });
  }
};
exports.update = async (req, res) => {
  const id = req.params.id;
  const { email, deskripsi } = req.body;

  let response = {};
  try {
    const selectResult = await MailingList.findAll({ where: { email } });

    if (selectResult[0] === undefined) {
      const updateResult = await MailingList.update(
        {
          email: email,
          deskripsi: deskripsi,
        },
        { where: { id } }
      );
      response = {
        error_code: 0,
        message: "Mailinglist berhasil diubah",
      };
    } else {
      const mailinglist_id = selectResult[0].id;
      if (id == mailinglist_id) {
        const updateResult = await MailingList.update(
          {
            email: email,
            deskripsi: deskripsi,
          },
          { where: { id } }
        );
        response = {
          error_code: 0,
          message: "Mailinglist berhasil diubah",
        };
      } else {
        response = {
          error_code: 1,
          message: "Email telah terdaftar",
        };
      }
    }
    res.send(response);
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await MailingList.destroy({ where: { id } });
    const result = await MailingList.findAll();
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.getByMemberId = async (req, res) => {
  try {
    const { user_id } = req.query;
    const result = await sequelize.query(
      "select * from mailinglists where id in (select mailinglist_id from mailinglistmembers where user_id = ? ) ",
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
