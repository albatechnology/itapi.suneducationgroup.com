module.exports = (sequelize, Sequelize) => {
  const FormPermintaanDetails = sequelize.define("form_permintaan_details", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    form_permintaan_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    code: {
      type: Sequelize.STRING,
    },
    no_urut: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    nama_barang: {
      type: Sequelize.STRING,
    },
    qty: {
      type: Sequelize.INTEGER,
    },
    uom: {
      type: Sequelize.STRING,
    },
    harga_satuan: {
      type: Sequelize.INTEGER,
    },
    harga_total: {
      type: Sequelize.INTEGER,
    },
  });

  return FormPermintaanDetails;
};
