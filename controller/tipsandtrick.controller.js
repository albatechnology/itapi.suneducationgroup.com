const db = require("../models");
const TipsAndTrick = db.TipsAndTrick;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");

exports.getAll = (req, res) => {
  TipsAndTrick.findAll({ order: [["title", "asc"]] }).then((faq) => {
    //res.send(res.user);
    //console, log(req.user);
    /*
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SUNSAFE_KEY, (err, user) => {
      console.log(user);
    });*/
    res.send(faq);
  });
};
exports.create = async (req, res) => {
  const { title, infografik_url, content } = req.body;
  const user_id = req.user.user_id;
  console.log("infografik", req.files);
  const payload = {
    title,
    infografik_url,
    content,
  };
  try {
    const createResult = await TipsAndTrick.create({
      ...payload,
      create_user_id: user_id,
    });

    createResult.save();
    res.json({
      error_code: 0,
      payload,
      message: "TipsAndTrick berhasil ditambahkan",
    });
  } catch (e) {
    console.log;
  }
};
exports.upload = (req, res) => {
  const user_id = req.user.user_id;

  if (req.files) {
    const filePath =
      "/public/upload/tipsandtricks/" + req.files.infografik.name;
    uploadPath = __dirname + "/.." + filePath;

    req.files.infografik.mv(uploadPath, async (err) => {
      console.log(err);
      if (err) return res.status(500).send(err);

      res.send({
        error_code: 0,
        filePath,
      });
    });
  } else {
    res.send({
      error_code: 1,
      message: "Tidak ada File yang diupload",
    });
  }
  //console.log("infografik", req.body);
};
exports.update = async (req, res) => {
  const { id, title, infografik_url, content } = req.body;
  const user_id = req.user.user_id;
  try {
    if (infografik_url !== "") {
      const updateResult = await TipsAndTrick.update(
        {
          title,
          infografik_url,
          content,
        },
        { where: { id } }
      );
    } else {
      const updateResult = await TipsAndTrick.update(
        {
          title,
          content,
        },
        { where: { id } }
      );
    }
    res.status(200).send({ error_code: 0, payload: req.body });
  } catch (e) {
    console.log(e);
  }
};
exports.delete = async (req, res) => {
  const id = req.params.id;
  const user_id = req.user.user_id;
  console.log(id);
  try {
    const result = await TipsAndTrick.destroy({ where: { id } });

    res.send({ error_code: 0, payload: { id } });
  } catch (e) {
    res.send(e);
  }
};
