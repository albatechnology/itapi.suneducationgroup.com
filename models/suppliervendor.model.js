module.exports = (sequelize, Sequelize) => {
  const SuppierVendor = sequelize.define("suppliervendor", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_pt: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    pic: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mobile_phone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    alamat: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    rekening_bank: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    create_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return SuppierVendor;
};
