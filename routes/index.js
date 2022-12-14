module.exports = (app) => {
  require("./authentication.routes")(app);
  require("./loginData.routes")(app);
  require("./mailingList.routes")(app);
  require("./mailingListMember.routes")(app);
  require("./publicEmail.routes")(app);
  require("./publicEmailAdmin.routes")(app);
  require("./faq.routes")(app);
  require("./tipsandtrick.routes")(app);
  require("./mediaanddownload.routes")(app);
  require("./suppliervendor.routes")(app);
  require("./dropdowndata.routes")(app);
  require("./hardwareSpec.routes")(app);
  require("./hardwareInventori.routes")(app);
  require("./hardwareInventoriLisence.routes")(app);
  require("./hardwareStockCard.routes")(app);
  require("./software.routes")(app);
  require("./softwareLisence.routes")(app);
  require("./formPermintaan.routes")(app);
  require("./ticket.routes")(app);
  require("./ticketPermintaan.routes")(app);
  require("./ticketPeminjaman.routes")(app);
  require("./ticketPerbaikan.routes")(app);
  require("./perbaikanHardware.routes")(app);
  require("./user.routes")(app);
  //require("./ticketPermintaan.routes")(app);
};
