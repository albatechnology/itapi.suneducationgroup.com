module.exports = (sequelize, Sequelize) => {
  const TicketPerbaikan = sequelize.define("ticket_perbaikan", {
    ticket_id: {
      type: Sequelize.INTEGER,
      unique: true,
      primaryKey: true,
    },
    jenis_perbaikan: {
      type: Sequelize.STRING,
    },
  });

  return TicketPerbaikan;
};
