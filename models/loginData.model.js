module.exports = (sequelize, Sequelize) => {
  const LoginData = sequelize.define("login_data", {
    user_id: {
      type: Sequelize.INTEGER,
      unique: true,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
    },
    fullname: {
      type: Sequelize.STRING,
    },
    nickname: {
      type: Sequelize.STRING,
    },
    inisial: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    handphone: {
      type: Sequelize.STRING,
    },
    cabang_id: {
      type: Sequelize.INTEGER,
    },
    supervisor_username: {
      type: Sequelize.STRING,
    },
    supervisor_id: {
      type: Sequelize.INTEGER,
    },
    supervisor_email: {
      type: Sequelize.STRING,
    },
    supervisor_fullname: {
      type: Sequelize.STRING,
    },
    dirid: {
      type: Sequelize.STRING,
    },
    sunsafe_response: {
      type: Sequelize.TEXT,
    },
  });

  return LoginData;
};
