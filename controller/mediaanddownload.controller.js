const db = require("../models");

const MediaAndDownload = db.MediaAndDownload;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const result = await MediaAndDownload.findAll({
      order: [["media_name", "asc"]],
    });
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.create = async (req, res) => {
  const user_id = req.user.user_id;
  const { media_name, filename, filepath, deskripsi } = req.body;

  const payload = { media_name, filename, filepath, deskripsi };
  try {
    const createResult = await MediaAndDownload.create({
      ...payload,
      create_user_id: user_id,
    });
    res.json({
      error_code: 0,
      payload,
      message: "Media And Download berhasil ditambahkan",
    });
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.upload = (req, res) => {
  const user_id = req.user.user_id;
  let filename = "";
  if (req.files) {
    filename = req.files.filename.name;
    const filePath =
      "/public/upload/mediaanddownload/" + req.files.filename.name;
    uploadPath = __dirname + "/.." + filePath;

    req.files.filename.mv(uploadPath, async (err) => {
      console.log(err);
      if (err) return res.status(500).send(err);

      res.send({
        error_code: 0,
        filename,
        filePath,
      });
    });
  } else {
    res.send({
      error_code: 1,
      message: "Tidak ada file yang diupload",
    });
  }

  /*
  MediaAndDownload.create({
    media_name,
    filename,
    deskripsi,
    create_user_id: user_id,
  })
    .then((obj) => {
      //obj.save();
      res.json({
        error_code: 0,
        message: "Media And Download berhasil ditambahkan",
      });
    })
    .catch((err) => console.log(err));
    */
};
exports.update = async (req, res) => {
  const { id, media_name, filename, filepath, deskripsi } = req.body;
  const user_id = req.user.user_id;
  try {
    if (filename !== "") {
      const updateResult = await MediaAndDownload.update(
        {
          media_name,
          filename,
          filepath,
          deskripsi,
        },
        { where: { id } }
      );
      res.status(200).send({ error_code: 0, payload: req.body });
    } else {
      const updateResult = await MediaAndDownload.update(
        {
          media_name,
          deskripsi,
        },
        { where: { id } }
      );
      res.status(200).send({ error_code: 0, payload: req.body });
    }
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.delete = async (req, res) => {
  const id = req.params.id;
  const user_id = req.user.user_id;
  console.log(id);
  try {
    const result = await MediaAndDownload.destroy({ where: { id } });

    res.send({ error_code: 0, payload: { id } });
  } catch (e) {
    res.status(400).send(e);
  }
};
