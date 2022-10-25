require("dotenv").config();
const fetch = require("node-fetch");
const db = require("../models");
const MailingListMember = db.MailingListMember;
const LoginData = db.LoginData;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const result = await MailingListMember.findAll();
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.create = async (req, res) => {
  const { mailinglist_id, email } = req.body;
  const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  const emailArr = email.split("\n");
  let tempValidEmailArr = [];
  let inValidEmailArr = [];
  let validEmailArr = [];

  for (let index = 0; index < emailArr.length; index++) {
    const item = emailArr[index];
    if (item !== "") {
      if (!emailRegexp.test(item)) {
        inValidEmailArr.push(item);
      } else {
        tempValidEmailArr.push(item);
      }
    }
  }

  for (let index = 0; index < tempValidEmailArr.length; index++) {
    const item = tempValidEmailArr[index];
    let reqdata = {
      email: item,
    };
    let fullname = req.body.fullname;
    let user_id = null;
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

      if (json_data.error_code == 0) {
        console.log(json_data);
        user_id = json_data.payload.login_data.user_id;
        fullname = json_data.payload.login_data.fullname;
      }
    } catch (e) {}
    try {
      const obj = await MailingListMember.create({
        mailinglist_id,
        user_id,
        email: item,
        fullname,
      });

      //console.log("obj", obj);
      const result = await obj.save();
      validEmailArr.push(item);
    } catch (e) {
      //console.log(e);
      inValidEmailArr.push(item);
    }
  }
  const returnValue = {
    error_code: 0,
    payload: { validEmail: validEmailArr, inValidEmail: inValidEmailArr },
    message: "Mailinglistmember berhasil ditambahkan",
  };
  res.send(returnValue);
  /*

  tempValidEmailArr.forEach(async (item, index) => {
    let reqdata = {
      email: item,
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
      let fullname = "";
      let user_id = null;
      if (json_data.error_code == 0) {
        console.log(json_data);
        user_id = json_data.payload.login_data.user_id;
        fullname = json_data.payload.login_data.fullname;
      }
      const obj = await MailingListMember.create({
        mailinglist_id,
        user_id,
        email: item,
        fullname,
      });
      const result = await obj.save();
      validEmailArr.push(item);
    } catch (e) {
      console.log(e);
    }
  });
*/
};

/*
exports.create = (req, res) => {
  const { mailinglist_id, email } = req.body;
  
  let reqdata = {
    email,
  };
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

        MailingListMember.create({ mailinglist_id, user_id, email })
          .then((obj) => {
            obj.save();
            res.json({
              error_code: 0,
              message: "Mailinglistmember berhasil ditambahkan",
            });
          })
          .catch((err) => console.log(err));
      }
    });
};

*/
exports.getByMailingList = async (req, res) => {
  try {
    const { mailinglist_id } = req.query;

    const result = await sequelize.query(
      "select m.* from mailinglistmembers m left join login_data l on m.user_id=l.user_id where m.mailinglist_id=?",
      {
        replacements: [mailinglist_id],
        type: QueryTypes.SELECT,
      }
    );
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.delete = async (req, res) => {
  const { mailinglist_id, email } = req.query;
  try {
    const delData = await MailingListMember.destroy({
      where: { mailinglist_id, email },
    });
    const selData = await sequelize.query(
      "select m.*,l.fullname from mailinglistmembers m left join login_data l on m.user_id=l.user_id where m.mailinglist_id=?",
      {
        replacements: [mailinglist_id],
        type: QueryTypes.SELECT,
      }
    );
    console.log("seldata", selData);
    res.send(selData);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.verifyemail = async (req, res) => {
  try {
    let reqdata = {
      email: req.body.email,
    };
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
    res.send(json_data);
  } catch (e) {
    res.status(400).send(e);
  }
};
