module.exports = (sequelize, Sequelize) => {
  const TicketMessage = sequelize.define("ticket_message", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    ticket_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    user_type: {
      type: Sequelize.INTEGER,
      allowNull: false,
      /*
      1. USER
      2. ADMIN
      3. SUPERVISOR
      */
    },
    message: {
      type: Sequelize.STRING,
    },
  });

  return TicketMessage;
};
