const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.authentication = require("./authentication.model.js")(sequelize, Sequelize);
db.LoginData = require("./loginData.model")(sequelize, Sequelize);
db.ChannelData = require("./channel.model")(sequelize, Sequelize);
db.MailingList = require("./mailingList.model")(sequelize, Sequelize);
db.MailingListMember = require("./mailingListMember.model")(
  sequelize,
  Sequelize
);
db.PublicEmail = require("./publicEmail.model")(sequelize, Sequelize);
db.PublicEmailAdmin = require("./publicEmailAdmin.model")(sequelize, Sequelize);
db.FAQ = require("./faq.model")(sequelize, Sequelize);
db.TipsAndTrick = require("./tipsandtrick.model")(sequelize, Sequelize);
db.MediaAndDownload = require("./mediaanddownload.model")(sequelize, Sequelize);
db.SupplierVendor = require("./suppliervendor.model")(sequelize, Sequelize);
db.SupplierVendorCategory = require("./suppliervendorcategory.model")(
  sequelize,
  Sequelize
);
db.HardwareSpec = require("./hardwareSpec.model")(sequelize, Sequelize);
db.ProductSpecification = require("./specifications.model")(
  sequelize,
  Sequelize
);
db.HardwareInventori = require("./hardwareInventori.model")(
  sequelize,
  Sequelize
);
db.HardwareInventoriLisence = require("./hardwareInventoriLisence.model")(
  sequelize,
  Sequelize
);
db.HardwareStockCard = require("./hardwareStockCard.model")(
  sequelize,
  Sequelize
);
db.Software = require("./software.model")(sequelize, Sequelize);
db.SoftwareLisence = require("./softwareLisence.model")(sequelize, Sequelize);
db.UoM = require("./uom.model")(sequelize, Sequelize);
db.FormPermintaan = require("./formPermintaan.model")(sequelize, Sequelize);
db.FormPermintaanDetails = require("./formPermintaanDetails.model")(
  sequelize,
  Sequelize
);
db.JenisPerbaikan = require("./jenisPerbaikan.model")(sequelize, Sequelize);
db.Ticket = require("./ticket.model")(sequelize, Sequelize);
db.TicketPermintaanDetail = require("./ticketPermintaanDetail.model")(
  sequelize,
  Sequelize
);
db.TicketPeminjaman = require("./ticketPeminjaman.model")(sequelize, Sequelize);
db.TicketPeminjamanDetail = require("./ticketPeminjamanDetail.model")(
  sequelize,
  Sequelize
);
db.TicketPerbaikan = require("./ticketPerbaikan.model")(sequelize, Sequelize);
db.TicketPerbaikanInventori = require("./ticketPerbaikanInventori.model")(
  sequelize,
  Sequelize
);
db.TicketPerbaikanPeminjaman = require("./ticketPerbaikanPeminjaman.model")(
  sequelize,
  Sequelize
);
db.TicketMessage = require("./ticketMessage.model")(sequelize, Sequelize);

db.HardwareAssign = require("./hardwareAssign.model")(sequelize, Sequelize);
db.HardwareAssignLog = require("./hardwareAssignLog.model")(
  sequelize,
  Sequelize
);
db.PerbaikanHardware = require("./perbaikanHardware.model")(
  sequelize,
  Sequelize
);
db.PerbaikanHardwareInventori = require("./perbaikanHardwareInventori.model")(
  sequelize,
  Sequelize
);

module.exports = db;
