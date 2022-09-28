const controller = {};

controller.authentication = require("./authentication.controller");
controller.loginData = require("./loginData.controller");
controller.mailingList = require("./mailingList.controller");
controller.mailingListMember = require("./mailingListMember.controller");
controller.publicEmail = require("./publicEmail.controller");
controller.publicEmailAdmin = require("./publicEmailAdmin.controller");
controller.faq = require("./faq.controller");
controller.tipsandtrick = require("./tipsandtrick.controller");
controller.mediaanddownload = require("./mediaanddownload.controller");
controller.suppliervendor = require("./suppliervendor.controller");
controller.dropdowndata = require("./dropdowndata.controller");
controller.hardwareSpec = require("./hardwareSpec.controller");
controller.hardwareInventori = require("./hardwareInventori.controller");
controller.hardwareInventoriLisence = require("./hardwareInventoriLisence.controller");
controller.hardwareStockCard = require("./hardwareStockCard.controller");
controller.software = require("./software.controller");
controller.softwareLisence = require("./softwareLisence.controller");
controller.formPermintaan = require("./formPermintaan.controller");
controller.ticket = require("./ticket.controller");
controller.ticketPermintaan = require("./ticketPermintaan.controller");
controller.ticketPeminjaman = require("./ticketPeminjaman.controller");
controller.ticketPerbaikan = require("./ticketPerbaikan.controller");
controller.perbaikanHardware = require("./perbaikanHardware.controller");
controller.user = require("./user.controller");

module.exports = controller;
