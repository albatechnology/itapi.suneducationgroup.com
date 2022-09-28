module.exports = (sequelize, Sequelize) => {
  const TicketPermintaanDetail = sequelize.define("ticket_permintaan_detail", {
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
    hardware_spec_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    qty: {
      type: Sequelize.INTEGER,
    },
    inventori_id: {
      type: Sequelize.INTEGER,
    },
    hardware_assign_id: {
      type: Sequelize.INTEGER,
    },
    keterangan: {
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
    completed_time: {
      type: Sequelize.DATE,
    },
    decline_time: {
      type: Sequelize.DATE,
    },
    is_delete: {
      type: Sequelize.BOOLEAN,
    },
  });

  return TicketPermintaanDetail;
};
