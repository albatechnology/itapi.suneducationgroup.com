module.exports = (sequelize, Sequelize) => {
  const FormPermintaan = sequelize.define("form_permintaan", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    tanggal_pengajuan: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    date_available: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    supplier_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    alasan_pembelian: {
      type: Sequelize.STRING,
    },
    note: {
      type: Sequelize.STRING,
    },
    request_by: {
      type: Sequelize.STRING,
    },
    create_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return FormPermintaan;
};
