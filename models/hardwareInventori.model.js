module.exports = (sequelize, Sequelize) => {
  const HardwareInventori = sequelize.define("hardware_inventori", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    hardware_spesifikasi_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    no_asset: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    merek: {
      type: Sequelize.STRING,
    },
    tipe: {
      type: Sequelize.STRING,
    },
    serial_number: {
      type: Sequelize.STRING,
    },
    harga: {
      type: Sequelize.DECIMAL,
    },

    supplier_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    tanggal_pembelian: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    form_permintaan: {
      type: Sequelize.STRING,
      defaultValue: false,
    },
    spesifikasi: {
      type: Sequelize.TEXT,
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  return HardwareInventori;
};
