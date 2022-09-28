const db = require("../models");
const FAQ = db.FAQ;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const result = await FAQ.findAll({ order: [["question", "asc"]] });
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.create = async (req, res) => {
  const { question, answer } = req.body;
  const user_id = req.user.user_id;
  try {
    const result = await FAQ.create({
      question,
      answer,
      create_user_id: user_id,
    });
    result.save();
    res.json({
      error_code: 0,
      payload: { id: result.id, question, answer },
      message: "FAQ berhasil ditambahkan",
    });
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.update = async (req, res) => {
  const { id, question, answer } = req.body;
  const user_id = req.user.user_id;
  try {
    const result = await FAQ.update(
      {
        question,
        answer,
      },
      { where: { id } }
    );
    res.send({ error_code: 0, payload: { id, question, answer } });
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  const user_id = req.user.user_id;
  console.log(id);
  try {
    const result = await FAQ.destroy({ where: { id } });

    res.send({ error_code: 0, payload: { id } });
  } catch (e) {
    res.status(400).send(e);
  }
};
