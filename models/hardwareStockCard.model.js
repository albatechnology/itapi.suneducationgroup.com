module.exports = (sequelize, Sequelize) => {
  /*

  transaction_Type 
  1. Stock Opname
  2. Permintaan


*/

  const HardwareStockCard = sequelize.define("hardware_stock_card", {
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

    harga: {
      type: Sequelize.DECIMAL,
    },

    supplier_id: {
      type: Sequelize.INTEGER,
    },
    tanggal_pembelian: {
      type: Sequelize.DATEONLY,
    },
    form_permintaan: {
      type: Sequelize.STRING,
    },
    transaction_id: {
      type: Sequelize.INTEGER,
    },
    transaction_type: {
      type: Sequelize.INTEGER,
    },
    qty_in: {
      type: Sequelize.INTEGER,
    },
    qty_out: {
      type: Sequelize.INTEGER,
    },
    balance: {
      type: Sequelize.INTEGER,
    },
  });

  return HardwareStockCard;
};
