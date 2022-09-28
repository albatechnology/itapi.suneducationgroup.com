module.exports = (sequelize, Sequelize) => {
  const Authentication = sequelize.define("authetication", {
    token: {
      type: Sequelize.STRING,
      unique: true,
      primaryKey:true
    },
    payload: {
      type: Sequelize.TEXT
    }
  });


  
  return Authentication;
};




