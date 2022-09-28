module.exports = (sequelize, Sequelize) => {
  const SupplierVendorCategory = sequelize.define("suppliervendor_category", {
    category_value: {
      type: Sequelize.STRING,
      unique: true,
      primaryKey: true,
    },
  });

  return SupplierVendorCategory;
};
