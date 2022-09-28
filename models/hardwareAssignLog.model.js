module.exports = (sequelize, Sequelize) => {
  const HardwareAssignLog = sequelize.define("hardware_assign_log", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    hardware_inventori_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    log_message: {
      type: Sequelize.STRING,
    },
  });

  return HardwareAssignLog;
};
