module.exports = (sequelize, Sequelize) => {
  /*
        status
        0. Not Assign
        1. Siap di IT
        2. Dipakai User
        3. Dipinjam User
        4. Rusak di IT
        5. Rusak dalam perbaikan ke Vendor
        6. Rusak
    */
  const HardwareAssign = sequelize.define("hardware_assign", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    hardware_inventori_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  });

  return HardwareAssign;
};
