module.exports = (sequelize, Sequelize) => {
  const TicketPerbaikanInventori = sequelize.define(
    "ticket_perbaikan_inventori",
    {
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
      inventori_id: {
        type: Sequelize.INTEGER,
      },
      keterangan: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.INTEGER,
      },
      admin_approve_time: {
        type: Sequelize.DATE,
      },
      completed_time: {
        type: Sequelize.DATE,
      },
      decline_time: {
        type: Sequelize.DATE,
      },
      is_delete: {
        type: Sequelize.BOOLEAN,
      },
    }
  );

  return TicketPerbaikanInventori;
};
