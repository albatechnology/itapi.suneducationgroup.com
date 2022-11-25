module.exports = (sequelize, Sequelize) => {
  const SoftwareLisence = sequelize.define("software_lisence", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    software_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    lisence_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tanggal_aktif: {
      type: Sequelize.DATEONLY,
    },
    tanggal_expired: {
      type: Sequelize.DATEONLY,
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
    have_expired: {
      type: Sequelize.STRING,
    },
  });

  return SoftwareLisence;
};
