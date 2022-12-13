const db = require("../models");
const Ticket = db.Ticket;
const TicketPerbaikan = db.TicketPerbaikan;
const TicketPerbaikanInventori = db.TicketPerbaikanInventori;
const TicketPerbaikanPeminjaman = db.TicketPerbaikanPeminjaman;

const sequelize = db.sequelize;
var fs = require("fs");
const { QueryTypes, Op } = require("sequelize");
const {
  HardwareSpec,
  HardwareInventori,
  HardwareAssign,
  HardwareStockCard,
  TicketMessage,
} = require("../models");

/*
  status 
  0. Declined
  1. Create 
  2. Approve By Supervisor
  3. Approve By Admin -> In Progress
  4. Set Shipping
  7. In Repair
  10. Complete

*/

makeUniqueId = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

exports.create = async (req, res) => {
  let image1path = "";
  let image2path = "";
  let image3path = "";
  // console.log("cek req body", req.body.image1path);
  // if (req.body !== undefined) {
  if (req.body.image1path) {
    fileraw = req.body.image1path;
    let buff = new Buffer.from(fileraw, "base64");
    const image1name = `openticketsimage${makeUniqueId(10)}.png`;
    fs.writeFileSync(`public/upload/opentickets/${image1name}`, buff);
    image1path = "public/upload/opentickets/" + image1name;
  }
  if (req.body.image2path) {
    fileraw = req.body.image2path;
    let buff = new Buffer.from(fileraw, "base64");
    const image2name = `openticketsimage${makeUniqueId(10)}.png`;
    fs.writeFileSync(`public/upload/opentickets/${image2name}`, buff);
    image2path = "public/upload/opentickets/" + image2name;
  }
  if (req.body.image3path) {
    fileraw = req.body.image3path;
    let buff = new Buffer.from(fileraw, "base64");
    const image3name = `openticketsimage${makeUniqueId(10)}.png`;
    fs.writeFileSync(`public/upload/opentickets/${image3name}`, buff);
    image3path = "public/upload/opentickets/" + image3name;
  }
  // }

  const {
    subject,
    jenis_ticket,
    jenis_perbaikan,
    tanggal_pengajuan,
    alasan,
    inventoris,
  } = req.body;

  const payload = {
    subject,
    jenis_ticket,
    jenis_perbaikan,
    tanggal_pengajuan,
    alasan,
    image1path,
    image2path,
    image3path,
  };
  const user_id = req.user.user_id;
  let listInventori = [];

  try {
    const ticketData = {
      ...payload,
      subject,
      status: 1, // create
      create_user_id: user_id,
    };
    const ticketResult = await Ticket.create(ticketData);

    ticketResult.save();
    const ticketId = ticketResult.id;

    const ticketPerbaikanData = {
      ticket_id: ticketId,
      jenis_perbaikan,
    };

    const ticketPerbaikanResult = await TicketPerbaikan.create(
      ticketPerbaikanData
    );

    // insert detail
    if (inventoris) {
      inventoris.forEach((inventori) => {
        const { inventori_id, keterangan } = inventori;
        // get hardwareInventoriData
        const hardwareInventoriResult =
          HardwareInventori.findByPk(inventori_id);

        if (hardwareInventoriResult) {
          hardwareInventoriData = hardwareInventoriResult.dataValues;

          const inventoriData = {
            ticket_id: ticketId,
            inventori_id,
            keterangan,
            status: 1,
            is_delete: 0,
          };
          inventoriResult = TicketPerbaikanInventori.create(inventoriData);
          listInventori.push(inventoriData);
        }
      });
    }

    res.send({
      error_code: 0,
      payload: {
        ticket_id: ticketId,
        ticket: ticketData,
        inventoris: listInventori,
      },
    });
  } catch (e) {
    res.send(e);
  }
};

exports.edit = async (req, res) => {
  const ticket_id = req.params.id;
  const t_result = await Ticket.findByPk(ticket_id);
  const ticketId = t_result.id;
  try {
    if (t_result.jenis_ticket === "PERBAIKAN") {
      // if (user === "ADMIN" && t_result.status === 1) {
      const imageResult = await Ticket.findByPk(ticketId);
      let image1path = imageResult.image1path;
      let image2path = imageResult.image2path;
      let image3path = imageResult.image3path;

      let newPath1 = "";
      let newPath2 = "";
      let newPath3 = "";

      if (!req.files == undefined) {
        if (!req.files["image1path"] == undefined) {
          req_image1path = req.files.req_image1path;
          fs.unlink(image1path, (err) => {
            if (err) console.log(err);
            else {
              console.log(`\nDeleted file: ${image1path}`);
            }
          });
          filename = req_image1path.name;
          newPath1 = "public/upload/opentickets/" + filename;
          uploadPath = __dirname + "/../" + newPath1;
          req_image1path.mv(uploadPath, async (err) => {
            if (err) return res.status(500).send(err);
          });
        }

        if (!req.files["image2path"] == undefined) {
          req_image2path = req.files.req_image2path;
          fs.unlink(image2path, (err) => {
            if (err) console.log(err);
            else {
              console.log(`\nDeleted file: ${image2path}`);
            }
          });
          filename = req_image2path.name;
          newPath2 = "public/upload/opentickets/" + filename;
          uploadPath = __dirname + "/../" + newPath2;
          req_image2path.mv(uploadPath, async (err) => {
            if (err) return res.status(500).send(err);
          });
        }

        if (!req.files["image3path"] == undefined) {
          req_image3path = req.files.req_image3path;
          fs.unlink(image3path, (err) => {
            if (err) console.log(err);
            else {
              console.log(`\nDeleted file: ${image3path}`);
            }
          });
          filename = req_image3path.name;
          newPath3 = "public/upload/opentickets/" + filename;
          uploadPath = __dirname + "/../" + newPath3;
          req_image3path.mv(uploadPath, async (err) => {
            if (err) return res.status(500).send(err);
          });
        }
      }

      const {
        subject,
        jenis_perbaikan,
        tanggal_pengajuan,
        alasan,
        inventoris,
      } = req.body;
      const payload = {
        subject,
        jenis_perbaikan,
        tanggal_pengajuan,
        alasan,
        inventoris,
        image1path: newPath1,
        image2path: newPath2,
        image3path: newPath3,
      };

      ticketResult = Ticket.update(payload, {
        where: { id: ticketId },
      });

      const listInventori = [];

      // delete details
      const inventorisDeleteResult = await TicketPerbaikanInventori.destroy({
        where: { ticket_id: ticketId },
      });

      if (inventoris) {
        inventoris.forEach(async (inventori, index) => {
          const { inventori_id, keterangan } = inventori;

          const hardwareInventoriResult = await HardwareInventori.findByPk(
            inventori_id
          );
          if (hardwareInventoriResult) {
            hardwareInventoriData = hardwareInventoriResult.dataValues;

            const inventoriData = {
              ticket_id: ticketId,
              inventori_id,
              keterangan,
              status: 1,
              is_delete: 0,
            };
            inventoriResult = await TicketPerbaikanInventori.create(
              inventoriData
            );
            listInventori.push(inventoriData);
          }
        });
      }
      res.send({
        error_code: 0,
        payload: {
          ticket_id: ticketId,
          ticket: ticketData,
          inventoris: listInventori,
        },
      });
    }
  } catch (e) {
    res.send(e);
  }
};

exports.processInventori = async (req, res) => {
  const { ticket, inventori } = req.body;
  const user_id = req.user.user_id;
  const ticketId = inventori.ticket_id;
  const perbaikanInventoriId = inventori.id;

  let payload = {};

  const ticketResult = await Ticket.findByPk(ticketId);
  if (ticketResult) {
    ticketData = ticketResult.dataValues;

    if (ticketData.jenis_ticket === "PERBAIKAN") {
      const ticketPerbaikanInventoriResult =
        await TicketPerbaikanInventori.findByPk(perbaikanInventoriId);
      if (ticketPerbaikanInventoriResult.status == 1) {
        // update detail status
        const updateResult = await TicketPerbaikanInventori.update(
          { status: 3, admin_approve_time: sequelize.fn("NOW") },
          { where: { id: perbaikanInventoriId } }
        );
      }

      payload = await getTicketData(ticket);
    }
  }

  res.send(payload);
};
exports.processRepairInventori = async (req, res) => {
  const { ticket, inventori } = req.body;
  const user_id = req.user.user_id;
  const ticketId = inventori.ticket_id;
  const perbaikanInventoriId = inventori.id;

  let payload = {};

  const ticketResult = await Ticket.findByPk(ticketId);
  if (ticketResult) {
    ticketData = ticketResult.dataValues;

    if (ticketData.jenis_ticket === "PERBAIKAN") {
      const ticketPerbaikanInventoriResult =
        await TicketPerbaikanInventori.findByPk(perbaikanInventoriId);
      if (ticketPerbaikanInventoriResult.status == 3) {
        // update detail status
        const updateResult = await TicketPerbaikanInventori.update(
          { status: 7 },
          { where: { id: perbaikanInventoriId } }
        );
        // update assign status
        const hardware_inventori_id =
          ticketPerbaikanInventoriResult.inventori_id;
        const hardwareAssignResult = await HardwareAssign.findAll({
          where: { hardware_inventori_id: hardware_inventori_id, status: 2 },
        });
        if (hardwareAssignResult[0] !== undefined) {
          //console.log("hardware assing found");
          const hardwareAssignUpdateResult = await HardwareAssign.update(
            { status: 4 },
            {
              where: { id: hardwareAssignResult[0].id, status: 2 },
            }
          );
        }
      }

      payload = await getTicketData(ticket);
    }
  }

  res.send(payload);
};
exports.assignReplaceInventori = async (req, res) => {
  const { hardwareInventoriId, perbaikanInventoriId } = req.body;
  const user_id = req.user.user_id;
  let ticketId = 0;
  let inventori = {};
  let payload = {};

  const perbaikanInventoriResult = await TicketPerbaikanInventori.findByPk(
    perbaikanInventoriId
  );
  if (perbaikanInventoriResult) {
    console.log("perbaikanInventoriResult", perbaikanInventoriResult);
    inventori = perbaikanInventoriResult.dataValues;
    ticketId = inventori.ticket_id;
    const ticketResult = await Ticket.findByPk(ticketId);
    if (ticketResult) {
      console.log("ticketResult", ticketResult);
      ticketData = ticketResult.dataValues;
      // update assign lama jadi 0
      const oldInventoriId = inventori.inventori_id;

      const hardwareAssignResult = await HardwareAssign.findAll({
        where: { hardware_inventori_id: oldInventoriId, status: 2 },
      });
      if (hardwareAssignResult[0] !== undefined) {
        console.log("hardware assing found");
        const hardwareAssignUpdateResult = await HardwareAssign.update(
          { status: 0 },
          {
            where: {
              hardware_inventori_id: hardwareAssignResult[0],
              status: 2,
            },
          }
        );
      }
      // insert assign baru

      const hardwareAssignData = {
        user_id: ticketData.create_user_id,
        hardware_inventori_id: hardwareInventoriId,
        status: 2,
      };
      const hardwareAssignCreateResult = await HardwareAssign.create(
        hardwareAssignData
      );

      // update detail status
      const updateResult = await TicketPerbaikanInventori.update(
        { status: 10, completed_time: sequelize.fn("NOW") },
        { where: { id: perbaikanInventoriId } }
      );

      payload = await getTicketData(ticketData);
    }
  }

  res.send(payload);
};

exports.assignPeminjamanInventori = async (req, res) => {
  const { hardwareInventoriId, perbaikanInventoriId } = req.body;
  const user_id = req.user.user_id;
  //console.log("req body", req.body);
  let ticketId = 0;
  let inventori = {};
  let payload = {};

  const perbaikanInventoriResult = await TicketPerbaikanInventori.findByPk(
    perbaikanInventoriId
  );
  if (perbaikanInventoriResult) {
    //console.log("perbaikanInventoriResult", perbaikanInventoriResult);
    inventori = perbaikanInventoriResult.dataValues;
    ticketId = inventori.ticket_id;
    const ticketResult = await Ticket.findByPk(ticketId);
    if (ticketResult) {
      //console.log("ticketResult", ticketResult);
      ticketData = ticketResult.dataValues;
      // insert assign baru

      const hardwareAssignData = {
        user_id: ticketData.create_user_id,
        hardware_inventori_id: hardwareInventoriId,
        status: 1,
      };
      const hardwareAssignCreateResult = await HardwareAssign.create(
        hardwareAssignData
      );
      hardwareAssignCreateResult.save();
      const hardware_assign_id = hardwareAssignCreateResult.id;

      // insert peminjaman
      const peminjamanData = {
        ticket_perbaikan_inventori_id: perbaikanInventoriResult.id,
        inventori_id: hardwareInventoriId,
        hardware_assign_id,
        status: 3,
      };

      const peminjamanCreateResult = await TicketPerbaikanPeminjaman.create(
        peminjamanData
      );

      payload = await getTicketData(ticketData);
    }
  }

  res.send(payload);
};
exports.shippingPeminjaman = async (req, res) => {
  const { ticket, inventori } = req.body;
  const user_id = req.user.user_id;
  const ticketId = inventori.ticket_id;
  const perbaikanInventoriId = inventori.id;

  let payload = {};

  const ticketResult = await Ticket.findByPk(ticketId);
  if (ticketResult) {
    ticketData = ticketResult.dataValues;

    if (ticketData.jenis_ticket === "PERBAIKAN") {
      const ticketPerbaikanInventoriResult =
        await TicketPerbaikanInventori.findByPk(perbaikanInventoriId);
      if (ticketPerbaikanInventoriResult) {
        // get peminjaman
        const peminjamanResult = await TicketPerbaikanPeminjaman.findAll({
          where: {
            ticket_perbaikan_inventori_id: perbaikanInventoriId,
            status: 3,
          },
        });

        if (peminjamanResult[0] !== undefined) {
          // get hardware spec
          const inventori_id = peminjamanResult[0].inventori_id;

          const hardwareInventoriResult = await HardwareInventori.findByPk(
            inventori_id
          );

          if (hardwareInventoriResult) {
            const hardware_spesifikasi_id =
              hardwareInventoriResult.dataValues.hardware_spesifikasi_id;

            const hardwareSpecResult = await HardwareSpec.findByPk(
              hardware_spesifikasi_id
            );
            if (hardwareSpecResult) {
              console.log("hardwareSpecResult", hardwareSpecResult);
              const stock_qty = hardwareSpecResult.dataValues.stock_qty;
              const hardwareSpecUpdate = await HardwareSpec.update(
                { stock_qty: stock_qty - 1 },
                { where: { id: hardware_spesifikasi_id } }
              );
            }
          }

          // update peminjaman status
          const peminjamanUpdate = await TicketPerbaikanPeminjaman.update(
            { status: 4, shipping_time: sequelize.fn("NOW") },
            { where: { id: peminjamanResult[0].id } }
          );
        }
      }

      payload = await getTicketData(ticket);
    }
  }

  res.send(payload);
};
exports.receivePeminjaman = async (req, res) => {
  const { ticket, inventori } = req.body;
  const user_id = req.user.user_id;
  const ticketId = inventori.ticket_id;
  const perbaikanInventoriId = inventori.id;

  let payload = {};

  const ticketResult = await Ticket.findByPk(ticketId);
  if (ticketResult) {
    ticketData = ticketResult.dataValues;

    if (ticketData.jenis_ticket === "PERBAIKAN") {
      const ticketPerbaikanInventoriResult =
        await TicketPerbaikanInventori.findByPk(perbaikanInventoriId);
      if (ticketPerbaikanInventoriResult) {
        // get peminjaman
        const peminjamanResult = await TicketPerbaikanPeminjaman.findAll({
          where: {
            ticket_perbaikan_inventori_id: perbaikanInventoriId,
            status: 4,
          },
        });

        if (peminjamanResult[0] !== undefined) {
          // update assign status
          const hardware_assign_id = peminjamanResult[0].hardware_assign_id;
          const hardwareAssignUpdate = await HardwareAssign.update(
            { status: 3 },
            { where: { id: hardware_assign_id } }
          );

          // update status peminjaman status
          const peminjamanUpdate = await TicketPerbaikanPeminjaman.update(
            { status: 5, user_receive_time: sequelize.fn("NOW") },
            { where: { id: peminjamanResult[0].id } }
          );
        }
      }

      payload = await getTicketData(ticket);
    }
  }

  res.send(payload);
};
exports.returnPeminjaman = async (req, res) => {
  const { ticket, inventori } = req.body;
  const user_id = req.user.user_id;
  const ticketId = inventori.ticket_id;
  const perbaikanInventoriId = inventori.id;

  let payload = {};

  const ticketResult = await Ticket.findByPk(ticketId);
  if (ticketResult) {
    ticketData = ticketResult.dataValues;

    if (ticketData.jenis_ticket === "PERBAIKAN") {
      const ticketPerbaikanInventoriResult =
        await TicketPerbaikanInventori.findByPk(perbaikanInventoriId);
      if (ticketPerbaikanInventoriResult) {
        // get peminjaman
        const peminjamanResult = await TicketPerbaikanPeminjaman.findAll({
          where: {
            ticket_perbaikan_inventori_id: perbaikanInventoriId,
            status: 5,
          },
        });

        if (peminjamanResult[0] !== undefined) {
          // update status peminjaman status
          const peminjamanUpdate = await TicketPerbaikanPeminjaman.update(
            { status: 6, user_return_time: sequelize.fn("NOW") },
            { where: { id: peminjamanResult[0].id } }
          );
        }
      }

      payload = await getTicketData(ticket);
    }
  }

  res.send(payload);
};

exports.completePeminjaman = async (req, res) => {
  const { ticket, inventori } = req.body;
  const user_id = req.user.user_id;
  const ticketId = inventori.ticket_id;
  const perbaikanInventoriId = inventori.id;

  let payload = {};

  const ticketResult = await Ticket.findByPk(ticketId);
  if (ticketResult) {
    ticketData = ticketResult.dataValues;

    if (ticketData.jenis_ticket === "PERBAIKAN") {
      const ticketPerbaikanInventoriResult =
        await TicketPerbaikanInventori.findByPk(perbaikanInventoriId);
      if (ticketPerbaikanInventoriResult) {
        // get peminjaman
        const peminjamanResult = await TicketPerbaikanPeminjaman.findAll({
          where: {
            ticket_perbaikan_inventori_id: perbaikanInventoriId,
            status: 6,
          },
        });

        if (peminjamanResult[0] !== undefined) {
          // get hardware spec
          const inventori_id = peminjamanResult[0].inventori_id;

          const hardwareInventoriResult = await HardwareInventori.findByPk(
            inventori_id
          );

          if (hardwareInventoriResult) {
            const hardware_spesifikasi_id =
              hardwareInventoriResult.dataValues.hardware_spesifikasi_id;

            const hardwareSpecResult = await HardwareSpec.findByPk(
              hardware_spesifikasi_id
            );
            if (hardwareSpecResult) {
              const stock_qty = hardwareSpecResult.dataValues.stock_qty;
              const hardwareSpecUpdate = await HardwareSpec.update(
                { stock_qty: stock_qty + 1 },
                { where: { id: hardware_spesifikasi_id } }
              );
            }
          }
          // update assign status
          const hardware_assign_id = peminjamanResult[0].hardware_assign_id;
          const hardwareAssignUpdate = await HardwareAssign.update(
            { status: 0 },
            { where: { id: hardware_assign_id } }
          );

          // update peminjaman status
          const peminjamanUpdate = await TicketPerbaikanPeminjaman.update(
            { status: 10, shipping_time: sequelize.fn("NOW") },
            { where: { id: peminjamanResult[0].id } }
          );
        }
      }

      payload = await getTicketData(ticket);
    }
  }

  res.send(payload);
};

exports.completeInventori = async (req, res) => {
  const { ticket, inventori } = req.body;
  const user_id = req.user.user_id;
  const ticketId = inventori.ticket_id;
  const perbaikanInventoriId = inventori.id;

  let payload = {};

  const ticketResult = await Ticket.findByPk(ticketId);
  if (ticketResult) {
    ticketData = ticketResult.dataValues;

    if (ticketData.jenis_ticket === "PERBAIKAN") {
      const ticketPerbaikanInventoriResult =
        await TicketPerbaikanInventori.findByPk(perbaikanInventoriId);
      const updateResult = await TicketPerbaikanInventori.update(
        { status: 10, completed_time: sequelize.fn("NOW") },
        { where: { id: perbaikanInventoriId } }
      );
      // update assign status
      const hardware_inventori_id = ticketPerbaikanInventoriResult.inventori_id;
      const hardwareAssignResult = await HardwareAssign.findAll({
        where: { hardware_inventori_id: hardware_inventori_id, status: 4 },
      });
      if (hardwareAssignResult[0] !== undefined) {
        //console.log("hardware assing found");
        const hardwareAssignUpdateResult = await HardwareAssign.update(
          { status: 2 },
          {
            where: { id: hardwareAssignResult[0].id, status: 4 },
          }
        );
      }
      payload = await getTicketData(ticket);
    }
  }

  res.send(payload);
};
exports.declineInventori = async (req, res) => {
  const { ticket, inventori } = req.body;
  const user_id = req.user.user_id;
  const ticketId = inventori.ticket_id;
  const perbaikanInventoriId = inventori.id;

  let payload = {};

  const ticketResult = await Ticket.findByPk(ticketId);
  if (ticketResult) {
    ticketData = ticketResult.dataValues;

    if (ticketData.jenis_ticket === "PERBAIKAN") {
      const ticketPerbaikanInventoriResult =
        await TicketPerbaikanInventori.findByPk(perbaikanInventoriId);
      if (ticketPerbaikanInventoriResult.status == 1) {
        // update detail status
        const updateResult = await TicketPerbaikanInventori.update(
          { status: 0, decline_time: sequelize.fn("NOW") },
          { where: { id: perbaikanInventoriId } }
        );
      }

      payload = await getTicketData(ticket);
    }
  }

  res.send(payload);
};
exports.processTicket = async (req, res) => {
  const { ticket } = req.body;
  const user_id = req.user.user_id;
  const ticketId = ticket.id;
  let payload = {};

  const ticketResult = await Ticket.findByPk(ticketId);
  if (ticketResult) {
    ticketData = ticketResult.dataValues;
    if (ticketData.status === 1) {
      if (ticketData.jenis_ticket === "PERBAIKAN") {
        const ticketPerbaikanInventoriResult =
          await TicketPerbaikanInventori.findAll({
            where: { ticket_id: ticketId, status: 1 },
          });

        if (ticketPerbaikanInventoriResult) {
          ticketPerbaikanInventoriResult.forEach(async (inventori) => {
            const perbaikanInventoriId = inventori.id;
            // update detail status
            const updateResult = await TicketPerbaikanInventori.update(
              { status: 3, admin_approve_time: sequelize.fn("NOW") },
              { where: { id: perbaikanInventoriId } }
            );
          });
        }
        //
        const ticketUpdateResult = await Ticket.update(
          {
            status: 3,
            admin_approve_time: sequelize.fn("NOW"),
          },
          {
            where: { id: ticketId },
          }
        );
        payload = await getTicketData(ticket);
      }
    }
  }

  res.send(payload);
};

exports.sendMessage = async (req, res) => {
  const { ticket, userState, message } = req.body;
  const user_id = req.user.user_id;
  const ticketId = ticket.id;
  let payload = {};
  const ticketResult = await Ticket.findByPk(ticketId);
  if (ticketResult) {
    const ticketData = ticketResult.dataValues;

    const messageData = {
      ticket_id: ticketId,
      user_id,
      user_type: userState === "USER" ? 1 : 2,
      message,
    };

    const messageCreate = await TicketMessage.create(messageData);
    messageCreate.save();

    payload = await getTicketData(ticketData);
  }

  res.send(payload);
};

const getTicketData = async (ticket) => {
  const ticketId = ticket.id;
  let resTicket = {};
  let resTicketInventoris = {};
  let payload = {};
  const updateticketResult = await updateTicket(ticket);
  resTicket = await sequelize.query(
    "select t.*,l.fullname from tickets t join login_data l on l.user_id = t.create_user_id where t.id = ?  order by t.tanggal_pengajuan asc",

    {
      replacements: [ticketId],
      type: QueryTypes.SELECT,
    }
  );
  if (resTicket[0] !== undefined) {
    if (resTicket[0].jenis_ticket === "PERBAIKAN") {
      resTicketInventoris = await sequelize.query(
        "select i.*,hi.no_asset,hi.merek,hi.tipe,hi.serial_number,hi.hardware_spesifikasi_id,hs.nama_hardware from ticket_perbaikan_inventoris i join hardware_inventoris hi on hi.id = i.inventori_id join hardware_spesifikasis hs on hs.id = hi.hardware_spesifikasi_id where i.ticket_id = ? order by i.id asc",
        {
          replacements: [ticketId],
          type: QueryTypes.SELECT,
        }
      );

      resTicketPeminjaman = await sequelize.query(
        "select p.*,hi.no_asset,hi.merek,hi.tipe,hi.serial_number,hi.hardware_spesifikasi_id,hs.nama_hardware from ticket_perbaikan_peminjamans p join hardware_inventoris hi on p.inventori_id = hi.id join hardware_spesifikasis hs on hi.hardware_spesifikasi_id = hs.id where p.ticket_perbaikan_inventori_id in (select id from ticket_perbaikan_inventoris where ticket_id = ? ) and p.status <> 10 order by p.id asc",
        {
          replacements: [ticketId],
          type: QueryTypes.SELECT,
        }
      );
      const peminjamanMapping = [];
      resTicketPeminjaman.forEach((item) => {
        peminjamanMapping[item.ticket_perbaikan_inventori_id] = item;
      });
      //console.log("Mapping", peminjamanMapping);
      const inventoris = [];
      resTicketInventoris.forEach((inventori) => {
        inventoris.push({
          ...inventori,
          peminjaman:
            peminjamanMapping[inventori.id] !== undefined
              ? peminjamanMapping[inventori.id]
              : null,
        });
      });

      const messages = await sequelize.query(
        "select m.*,l.fullname from ticket_messages m join login_data l on l.user_id = m.user_id where m.ticket_id = ? order by m.id asc",
        {
          replacements: [ticketId],
          type: QueryTypes.SELECT,
        }
      );
      payload = { ...resTicket[0], inventoris, messages };
    }
  }

  return payload;
};

const updateTicket = async (ticket) => {
  const ticketId = ticket.id;
  try {
    // update catatan
    const updateCatatanResult = await Ticket.update(
      {
        subject: ticket.subject,
        alasan: ticket.alasan,
      },
      { where: { id: ticketId } }
    );
    const ticketResult = await Ticket.findByPk(ticketId);
    if (ticketResult) {
      const ticketData = ticketResult.dataValues;
    }
    return true;
  } catch (e) {
    return false;
  }
};
