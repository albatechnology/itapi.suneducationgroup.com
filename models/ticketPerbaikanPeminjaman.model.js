module.exports = (sequelize, Sequelize) => {
  const TicketPerbaikanPeminjaman = sequelize.define(
    "ticket_perbaikan_peminjaman",
    {
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      ticket_perbaikan_inventori_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      inventori_id: {
        type: Sequelize.INTEGER,
      },
      hardware_assign_id: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.INTEGER,
      },
      shipping_time: {
        type: Sequelize.DATE,
      },
      user_receive_time: {
        type: Sequelize.DATE,
      },
      user_return_time: {
        type: Sequelize.DATE,
      },

      completed_time: {
        type: Sequelize.DATE,
      },
      is_delete: {
        type: Sequelize.BOOLEAN,
      },
    }
  );

  return TicketPerbaikanPeminjaman;
};
