module.exports = (sequelize, Sequelize) => {
  const Ticket = sequelize.define("ticket", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    jenis_ticket: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    subject: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    tanggal_pengajuan: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    alasan: {
      type: Sequelize.STRING,
    },
    catatan_admin: {
      type: Sequelize.STRING,
    },
    catatan_supervisor: {
      type: Sequelize.STRING,
    },
    catatan_user: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
    },
    supervisor_approve_time: {
      type: Sequelize.DATE,
    },
    admin_approve_time: {
      type: Sequelize.DATE,
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
    decline_time: {
      type: Sequelize.DATE,
    },

    create_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return Ticket;
};
