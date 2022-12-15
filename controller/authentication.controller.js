require("dotenv").config();
const fetch = require("node-fetch");
const db = require("../models");
const LoginData = db.LoginData;
const ChannelData = db.ChannelData;
const jwt = require("jsonwebtoken");

async function authentication(apiReq, apiRes) {
  let data = {
    login_token: apiReq.body.login_token,
  };
  try {
    const res = await fetch(process.env.SUNSAFE_URL + "security_api/v2/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "X-Sunsafe-Api-ID": process.env.SUNSAFE_APP_ID,
        "X-Sunsafe-Api-Token": process.env.SUNSAFE_TOKEN,
        "X-Sunsafe-Api-Secret": process.env.SUNSAFE_SECRET,
        "Content-Type": "text/plain",
      },
    });

    const json_data = await res.json();
    if (json_data.error_code == 0) {
      const userData = json_data.payload.user_data;
      const supervisorData = json_data.payload.supervisor_user;
      var resData = {};
      var loginData = {};
      var profile_image = 0;

      const profileRes = await fetch(
        process.env.SUNSAFE_URL +
          `public_user/get_profile_image/${userData.user_id}`,
        {
          method: "GET",
        }
      );
      const profileData = await profileRes.json();
      if (profileData.error_code === 0) {
        profile_image = profileData.profile_image;
      }
      //console.log("profile", profileData);

      loginData = await LoginData.findByPk(userData.user_id);
      if (!loginData) {
        loginData = {
          user_id: userData.user_id,
          username: userData.username,
          fullname: userData.fullname,
          nickname: userData.nickname,
          inisial: userData.inisial,
          email: userData.email,
          handphone: userData.handphone,
          cabang_id: userData.cabang_id,
          supervisor_username: supervisorData.username,
          supervisor_id: supervisorData.user_id,
          supervisor_email: supervisorData.email,
          supervisor_fullname: supervisorData.fullname,
          dirid: userData.dirid,
          sunsafe_response: JSON.stringify(json_data),
        };
        //console.log(loginData);
        const logindata = await LoginData.create(loginData);

        //await logindata.save();
      } else {
        let loginData = {
          username: userData.username,
          fullname: userData.fullname,
          nickname: userData.nickname,
          inisial: userData.inisial,
          email: userData.email,
          handphone: userData.handphone,
          cabang_id: userData.cabang_id,
          supervisor_username: supervisorData.username,
          supervisor_id: supervisorData.user_id,
          supervisor_email: supervisorData.email,
          supervisor_fullname: supervisorData.fullname,
          dirid: userData.dirid,
          sunsafe_response: JSON.stringify(json_data),
        };
        const updateResult = await LoginData.update(loginData, {
          where: { user_id: userData.user_id },
        });
      }

      // CREATE channels start

      if ((cabang_id = json_data.payload.cabang.cabang_id)) {
        let checkData = await ChannelData.findAll({
          where: { id: cabang_id },
        });
        if (checkData.length > 0) {
          let channelData = {
            name: json_data.payload.user_data.username,
            code: json_data.payload.cabang.cabang_code,
            is_franchise: json_data.payload.cabang.is_franchise,
          };
          const updateResult = ChannelData.update(channelData, {
            where: { id: cabang_id },
          });
        } else {
          let channelData = {
            id: json_data.payload.cabang.cabang_id,
            name: json_data.payload.user_data.username,
            code: json_data.payload.cabang.cabang_code,
            is_franchise: json_data.payload.cabang.is_franchise,
          };
          const channelResult = ChannelData.create(channelData);
          channelResult.save();
        }
      }

      // CREATE channels end

      const newUserData = {
        ...userData,
        supervisor_username: supervisorData.username,
        supervisor_id: supervisorData.user_id,
        supervisor_email: supervisorData.email,
        supervisor_fullname: supervisorData.fullname,
        profile_image,
      };
      var token = await jwt.sign(newUserData, process.env.SUNSAFE_KEY);

      /*
        var token = jwt.sign(userData, process.env.SUNSAFE_KEY, {
          expiresIn: 100000,
        });
        */
      resData.error_code = 0;
      resData.payload = { userData: newUserData, token };

      //console.log(resData);
      apiRes.send(resData);
    }
  } catch (e) {
    apiRes.send(e);
  }

  /*
  fetch(process.env.SUNSAFE_URL + "security_api/v2/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "X-Sunsafe-Api-ID": process.env.SUNSAFE_APP_ID,
      "X-Sunsafe-Api-Token": process.env.SUNSAFE_TOKEN,
      "X-Sunsafe-Api-Secret": process.env.SUNSAFE_SECRET,
      "Content-Type": "text/plain",
    },
  })
    .then((res) => res.json())
    .then((json_data) => {
      if (json_data.error_code == 0) {
        const userData = json_data.payload.user_data;
        const supervisorData = json_data.payload.supervisor_user;
        var resData = {};
        var loginData = {};

        LoginData.findByPk(userData.user_id).then((loginData) => {
          if (!loginData) {
            loginData = {
              user_id: userData.user_id,
              username: userData.username,
              fullname: userData.fullname,
              nickname: userData.nickname,
              inisial: userData.inisial,
              email: userData.email,
              handphone: userData.handphone,
              cabang_id: userData.cabang_id,
              supervisor_username: supervisorData.username,
              supervisor_id: supervisorData.user_id,
              supervisor_email: supervisorData.email,
              supervisor_fullname: supervisorData.fullname,
              dirid: userData.dirid,
              sunsafe_response: JSON.stringify(json_data),
            };
            //console.log(loginData);
            LoginData.create(loginData)
              .then((logindata) => {})
              .catch((err) => {
                console.log(err);
              });
            //await logindata.save();
          } else {
            let loginData = {
              username: userData.username,
              fullname: userData.fullname,
              nickname: userData.nickname,
              inisial: userData.inisial,
              email: userData.email,
              handphone: userData.handphone,
              cabang_id: userData.cabang_id,
              supervisor_username: supervisorData.username,
              supervisor_id: supervisorData.user_id,
              supervisor_email: supervisorData.email,
              supervisor_fullname: supervisorData.fullname,
              dirid: userData.dirid,
              sunsafe_response: JSON.stringify(json_data),
            };
            LoginData.update(loginData, {
              where: { user_id: userData.user_id },
            });
          }
        });
        const newUserData = {
          ...userData,
          supervisor_username: supervisorData.username,
          supervisor_id: supervisorData.user_id,
          supervisor_email: supervisorData.email,
          supervisor_fullname: supervisorData.fullname,
        };
        var token = jwt.sign(newUserData, process.env.SUNSAFE_KEY);

        
        var token = jwt.sign(userData, process.env.SUNSAFE_KEY, {
          expiresIn: 100000,
        });
        
        resData.error_code = 0;
        resData.payload = { userData: newUserData, token };
      } else {
        resData = json_data;
      }
      //console.log(resData);
      apiRes.send(resData);
    });

*/

  //return true;
}

function authenticateToken(req, res, next) {
  const url = req.originalUrl;
  if (url == "/api/authentication") next();

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SUNSAFE_KEY, (err, user) => {
    //console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

async function validateDBToken(req, res) {
  let user = null;
  let DBConnection = false;
  //let token = "";

  try {
    await db.sequelize.authenticate();
    DBConnection = true;
  } catch (e) {}

  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    //console.log("token", token);
    if (token == null) return res.sendStatus(401);

    user = jwt.verify(token, process.env.SUNSAFE_KEY);
    //console.log(user);
    //res.send(user);
  } catch (e) {
    console.log(e);
  }
  const payload = {
    user,
    DBConnection,
  };
  console.log(payload);
  res.send(payload);
}

function processAuth(login_token) {
  return authentication(login_token);
}

function login() {
  return { userName: "login" };
}

module.exports.authentication = authentication;
module.exports.authenticateToken = authenticateToken;
module.exports.login = login;
module.exports.validateDBToken = validateDBToken;
