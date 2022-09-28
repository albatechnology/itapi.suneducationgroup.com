require("dotenv").config();
const fetch = require("node-fetch");
const db = require("../models");
const PublicEmailAdmin = db.PublicEmailAdmin;
const LoginData = db.LoginData;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");

exports.getAll = (req, res) => {
  PublicEmailAdmin.findAll().then((mailinglistmember) => {
    //res.send(res.user);
    //console, log(req.user);
    /*
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SUNSAFE_KEY, (err, user) => {
      console.log(user);
    });*/
    console.log(req.originalUrl);
    res.send(mailinglistmember);
  });
};
exports.create = async (req, res) => {
  const { publicemail_id, email } = req.body;
  let returnValue = {};
  let reqdata = {
    email,
  };

  try {
    const apiRes = await fetch(
      process.env.SUNSAFE_URL + "security_api/v2/verify_email",
      {
        method: "POST",
        body: JSON.stringify(reqdata),
        headers: {
          "X-Sunsafe-Api-ID": process.env.SUNSAFE_APP_ID,
          "X-Sunsafe-Api-Token": process.env.SUNSAFE_TOKEN,
          "X-Sunsafe-Api-Secret": process.env.SUNSAFE_SECRET,
          "Content-Type": "text/plain",
        },
      }
    );
    const json_data = await apiRes.json();

    console.log(json_data);
    if (json_data.error_code == 0) {
      const user_id = json_data.payload.login_data.user_id;

      const result = await PublicEmailAdmin.findAll({
        where: { user_id, publicemail_id },
      });
      if (result[0] === undefined) {
        const loginDataResult = await LoginData.findByPk(user_id);
        if (!loginDataResult) {
          const logindata = await LoginData.create(
            json_data.payload.login_data
          );
          logindata.save();
        }
        const obj = await PublicEmailAdmin.create({
          publicemail_id,
          user_id,
          email,
        });
        obj.save();
        returnValue = {
          error_code: 0,
          message: "Public Email Admin berhasil ditambahkan",
        };
      } else {
        returnValue = {
          error_code: 1,
          message: "Email telah terdaftar sebagai admin untuk public email ini",
        };
      }
    } else {
      returnValue = {
        error_code: 1,
        message: "Email yang anda masukan tidak terdaftar di SunSafe",
      };
    }
    res.send(returnValue);
  } catch (e) {
    res.send(e);
  }
  /*
  fetch(process.env.SUNSAFE_URL + "security_api/v2/verify_email", {
    method: "POST",
    body: JSON.stringify(reqdata),
    headers: {
      "X-Sunsafe-Api-ID": process.env.SUNSAFE_APP_ID,
      "X-Sunsafe-Api-Token": process.env.SUNSAFE_TOKEN,
      "X-Sunsafe-Api-Secret": process.env.SUNSAFE_SECRET,
      "Content-Type": "text/plain",
    },
  })
    .then((apiRes) => apiRes.json())
    .then((json_data) => {
      console.log(json_data);
      if (json_data.error_code == 0) {
        const user_id = json_data.payload.login_data.user_id;

        LoginData.create(json_data.payload.login_data)
          .then((logindata) => {})
          .catch((err) => {
            console.log(err);
          });

        PublicEmailAdmin.create({ publicemail_id, user_id, email })
          .then((obj) => {
            obj.save();
            res.json({
              error_code: 0,
              message: "Public Email Admin berhasil ditambahkan",
            });
          })
          .catch((err) => console.log(err));
      }
    });
*/
};

exports.getByPublicEmail = (req, res) => {
  const { publicemail_id } = req.query;
  console.log(req.query);

  sequelize
    .query(
      "select p.*,l.fullname from publicemailadmins p join login_data l on p.user_id=l.user_id where p.publicemail_id=?",
      {
        replacements: [publicemail_id],
        type: QueryTypes.SELECT,
      }
    )
    .then((data) => {
      res.send(data);
    });
};
exports.delete = (req, res) => {
  const { publicemail_id } = req.query;
  PublicEmailAdmin.destroy({ where: req.query }).then((delData) => {
    sequelize
      .query(
        "select p.*,l.fullname from publicemailadmins p join login_data l on p.user_id=l.user_id where p.publicemail_id=?",
        {
          replacements: [publicemail_id],
          type: QueryTypes.SELECT,
        }
      )
      .then((selData) => {
        res.send(selData);
      });
  });
};
