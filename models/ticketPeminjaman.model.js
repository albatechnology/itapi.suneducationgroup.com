module.exports = (sequelize, Sequelize) => {
  const TicketPeminjaman = sequelize.define("ticket_peminjaman", {
    ticket_id: {
      type: Sequelize.INTEGER,
      unique: true,
      primaryKey: true,
    },
    tanggal_awal: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    tanggal_akhir: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
  });

  return TicketPeminjaman;
};
