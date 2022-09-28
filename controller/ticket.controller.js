const db = require("../models");
const Ticket = db.Ticket;
const TicketPermintaan = db.TicketPermintaan;
const sequelize = db.sequelize;
const { QueryTypes, Op } = require("sequelize");
const ticketModel = require("../models/ticket.model");
const {
  HardwareSpec,
  HardwareInventori,
  HardwareAssign,
  HardwareStockCard,
  TicketPeminjaman,
  TicketPeminjamanDetail,
  TicketPerbaikan,
  TicketMessage,
} = require("../models");
const { hardwareStockCard } = require(".");

/*
  status
  0. Declined
  1. Create 
  2. Approve By Supervisor
  3. Approve By Admin -> In Progress
  4. Set Shipping
  5. Arrived Add User
  6. In Return
  10. Complete

*/

exports.getAll = (req, res) => {
  sequelize
    .query(
      "select t.*,l.fullname from tickets t join login_data l on l.user_id = t.create_user_id  order by tanggal_pengajuan asc",
      {
        type: QueryTypes.SELECT,
      }
    )
    .then((selData) => {
      res.send(selData);
    });
};
exports.getAllAdmin = (req, res) => {
  sequelize
    .query(
      "select t.*,l.fullname from tickets t join login_data l on l.user_id = t.create_user_id  order by tanggal_pengajuan asc",
      {
        type: QueryTypes.SELECT,
      }
    )
    .then((selData) => {
      res.send(selData);
    });
};
exports.getAllMyTicket = (req, res) => {
  const user_id = req.user.user_id;

  sequelize
    .query(
      "select t.*,l.fullname from tickets t join login_data l on l.user_id = t.create_user_id  where t.create_user_id =  ? order by tanggal_pengajuan asc",
      {
        replacements: [user_id],
        type: QueryTypes.SELECT,
      }
    )
    .then((selData) => {
      res.send(selData);
    });
};
exports.getAllMyStaff = (req, res) => {
  const user_id = req.user.user_id;

  sequelize
    .query(
      "select t.*,l.fullname from tickets t join login_data l on l.user_id = t.create_user_id  where t.create_user_id in (select user_id from login_data where supervisor_id = ? ) order by tanggal_pengajuan asc",
      {
        replacements: [user_id],
        type: QueryTypes.SELECT,
      }
    )
    .then((selData) => {
      res.send(selData);
    });
};
exports.getAllDetails = async (req, res) => {
  const user_id = req.user.user_id;
  const ticketId = req.params.ticketId;
  let payload = {};
  try {
    payload = await getTicketData(ticketId);
    //console.log("payload", payload);
    res.send(payload);
  } catch (e) {
    console.log(e);
  }
};

exports.createPeminjaman = async (req, res) => {
  const { tanggal_pengajuan, tanggal_awal, tanggal_akhir, alasan, details } =
    req.body;
  const user_id = req.user.user_id;
  const listPeminjamanDetail = [];
  try {
    const ticketData = {
      jenis_ticket: "PEMINJAMAN",
      tanggal_pengajuan,
      alasan,
      status: 1, // create
      create_user_id: user_id,
    };
    const ticketResult = await Ticket.create(ticketData);

    ticketResult.save();
    const ticketId = ticketResult.id;

    const ticketPeminjamanData = {
      ticket_id: ticketId,
      tanggal_awal: tanggal_awal,
      tanggal_akhir: tanggal_akhir,
    };
    const ticketPeminjamanResult = await TicketPeminjaman.create(
      ticketPeminjamanData
    );

    // insert detail
    details.forEach(async (detail) => {
      const { hardware_spec_id, qty, keterangan } = detail;

      // get hardwareSpecData
      const hardwareSpecResult = await HardwareSpec.findByPk(hardware_spec_id);
      if (hardwareSpecResult) {
        hardwareSpecData = hardwareSpecResult.dataValues;

        if (hardwareSpecData.consumable) {
          const ticketPeminjamanDetailData = {
            ticket_id: ticketId,
            hardware_spec_id,
            qty,
            status: 1, // create
            inventori_id: 0,
            hardware_assign_id: 0,
            keterangan,
          };

          const ticketPeminjamanDetailResult =
            await TicketPeminjamanDetail.create(ticketPeminjamanDetailData);
          listPeminjamanDetail.push(ticketPeminjamanDetailData);
        } else {
          for (let forIndex = 0; forIndex < qty; forIndex++) {
            const ticketPeminjamanDetailData = {
              ticket_id: ticketId,
              hardware_spec_id,
              qty: 1,
              status: 1, // create
              inventori_id: 0,
              hardware_assign_id: 0,
              keterangan,
            };

            const ticketPeminjamanDetailResult =
              await TicketPeminjamanDetail.create(ticketPeminjamanDetailData);
            listPeminjamanDetail.push(ticketPeminjamanDetailData);
          }
        }
      }
    });
    res.send({
      error_code: 0,
      payload: {
        ticketId,
        ticket: ticketData,
        permintaan: listPeminjamanDetail,
      },
    });
  } catch (e) {
    res.send(e);
  }
};

exports.processTicket = async (req, res) => {
  const { status, ticket } = req.body;
  const user_id = req.user.user_id;
  const ticketId = ticket.id;
  let payload = {};
  if (status === 0) {
    const ticketResult = await Ticket.findByPk(ticketId);
    if (ticketResult) {
      ticketData = ticketResult.dataValues;

      if (ticketData.jenis_ticket === "PERMINTAAN") {
        const ticketPermintaanResult = await TicketPermintaan.update(
          { status: 0 },
          {
            where: { ticket_id: ticketId },
          }
        );

        const ticketUpdateResult = await Ticket.update(
          { status: 0 },
          { where: { id: ticketId } }
        );
        //console.log("resTicket", resTicket);
        payload = await getTicketData(ticketId);
      }
    }
  }

  if (status === 2) {
    const ticketResult = await sequelize.query(
      "select * from tickets where id = ? and create_user_id in (select user_id from login_data where supervisor_id = ? ) order by tanggal_pengajuan asc",
      {
        replacements: [ticketId, user_id],
        type: QueryTypes.SELECT,
      }
    );
    if (ticketResult[0] !== undefined) {
      ticketData = ticketResult[0];

      if (ticketData.jenis_ticket === "PERMINTAAN") {
        const ticketPermintaanResult = await TicketPermintaan.update(
          { status: 2 },
          {
            where: { ticket_id: ticketId, status: 1 },
          }
        );

        const ticketUpdateResult = await Ticket.update(
          { status: 2 },
          { where: { id: ticketId } }
        );

        payload = await getTicketData(ticketId);
      }
    }
  }

  if (status === 3) {
    const ticketResult = await Ticket.findByPk(ticketId);
    if (ticketResult) {
      ticketData = ticketResult.dataValues;

      if (ticketData.jenis_ticket === "PERMINTAAN") {
        const ticketPermintaanResult = await TicketPermintaan.update(
          { status: 3 },
          {
            where: { ticket_id: ticketId, status: 2 },
          }
        );
        const ticketUpdateResult = await Ticket.update(
          { status: 3 },
          { where: { id: ticketId } }
        );

        payload = await getTicketData(ticketId);
      }
    }
  }
  if (status === 5) {
    const ticketResult = await Ticket.findByPk(ticketId);
    if (ticketResult) {
      ticketData = ticketResult.dataValues;

      if (ticketData.jenis_ticket === "PERMINTAAN") {
        const ticketPermintaanResult = await TicketPermintaan.update(
          { status: 5 },
          {
            where: { ticket_id: ticketId, status: 4 },
          }
        );
        const ticketUpdateResult = await Ticket.update(
          { status: 5 },
          { where: { id: ticketId } }
        );

        payload = await getTicketData(ticketId);
      }
    }
  }
  res.send(payload);
};

exports.processDetail = async (req, res) => {
  const { status, detail } = req.body;
  const user_id = req.user.user_id;
  const ticketId = detail.ticket_id;
  const detailId = detail.id;
  //console.log("status", status);

  let payload = {};
  if (status === 0) {
    const ticketResult = await Ticket.findByPk(ticketId);
    //console.log(ticketResult);
    if (ticketResult) {
      ticketData = ticketResult.dataValues;
      const ticketStatus = ticketData.status;

      if (ticketData.jenis_ticket === "PERMINTAAN") {
        const updateResult = await TicketPermintaan.update(
          { status: 0 },
          { where: { id: detailId } }
        );

        const detailsResult = await TicketPermintaan.findAll({
          where: { ticket_id: ticketId, status: 1 },
        });
        if (ticketStatus === 1) {
          if (detailsResult[0] === undefined) {
            const approveDetailsResult = await TicketPermintaan.findAll({
              where: { ticket_id: ticketId, status: 2 },
            });
            if (approveDetailsResult[0] === undefined) {
              // Declined
              const ticketUpdateResult = await Ticket.update(
                { status: 0 },
                { where: { id: ticketId } }
              );
            } else {
              // Approve
              const ticketUpdateResult = await Ticket.update(
                { status: 2 },
                { where: { id: ticketId } }
              );
            }
          }
        }
        if (ticketStatus === 2) {
          if (detailsResult[0] === undefined) {
            const approveDetailsResult = await TicketPermintaan.findAll({
              where: { ticket_id: ticketId, status: 3 },
            });
            if (approveDetailsResult[0] === undefined) {
              // Declined
              const ticketUpdateResult = await Ticket.update(
                { status: 0 },
                { where: { id: ticketId } }
              );
            } else {
              // Approve
              const ticketUpdateResult = await Ticket.update(
                { status: 3 },
                { where: { id: ticketId } }
              );
            }
          }
        }
        if (ticketStatus === 3) {
          if (detailsResult[0] === undefined) {
            const approveDetailsResult = await TicketPermintaan.findAll({
              where: { ticket_id: ticketId, status: 4 },
            });
            if (approveDetailsResult[0] === undefined) {
              // Declined
              const ticketUpdateResult = await Ticket.update(
                { status: 0 },
                { where: { id: ticketId } }
              );
            } else {
              // Approve
              const ticketUpdateResult = await Ticket.update(
                { status: 4 },
                { where: { id: ticketId } }
              );
            }
          }
        }
        payload = await getTicketData(ticketId);
      }
      if (ticketData.jenis_ticket === "PEMINJAMAN") {
        const updateResult = await TicketPeminjamanDetail.update(
          { status: 0 },
          { where: { id: detailId } }
        );

        const detailsResult = await TicketPeminjamanDetail.findAll({
          where: { ticket_id: ticketId, status: 1 },
        });
        if (ticketStatus === 1) {
          if (detailsResult[0] === undefined) {
            const approveDetailsResult = await TicketPeminjamanDetail.findAll({
              where: { ticket_id: ticketId, status: 2 },
            });
            if (approveDetailsResult[0] === undefined) {
              // Declined
              const ticketUpdateResult = await Ticket.update(
                { status: 0 },
                { where: { id: ticketId } }
              );
            } else {
              // Approve
              const ticketUpdateResult = await Ticket.update(
                { status: 2 },
                { where: { id: ticketId } }
              );
            }
          }
        }
        if (ticketStatus === 2) {
          if (detailsResult[0] === undefined) {
            const approveDetailsResult = await TicketPeminjamanDetail.findAll({
              where: { ticket_id: ticketId, status: 3 },
            });
            if (approveDetailsResult[0] === undefined) {
              // Declined
              const ticketUpdateResult = await Ticket.update(
                { status: 0 },
                { where: { id: ticketId } }
              );
            } else {
              // Approve
              const ticketUpdateResult = await Ticket.update(
                { status: 3 },
                { where: { id: ticketId } }
              );
            }
          }
        }
        if (ticketStatus === 3) {
          if (detailsResult[0] === undefined) {
            const approveDetailsResult = await TicketPeminjamanDetail.findAll({
              where: { ticket_id: ticketId, status: 4 },
            });
            if (approveDetailsResult[0] === undefined) {
              // Declined
              const ticketUpdateResult = await Ticket.update(
                { status: 0 },
                { where: { id: ticketId } }
              );
            } else {
              // Approve
              const ticketUpdateResult = await Ticket.update(
                { status: 4 },
                { where: { id: ticketId } }
              );
            }
          }
        }
        payload = await getTicketData(ticketId);
      }
    }
  }

  if (status === 2) {
    const ticketResult = await sequelize.query(
      "select * from tickets where id = ? and create_user_id in (select user_id from login_data where supervisor_id = ? ) order by tanggal_pengajuan asc",
      {
        replacements: [ticketId, user_id],
        type: QueryTypes.SELECT,
      }
    );
    //console.log(ticketResult);
    if (ticketResult[0] !== undefined) {
      ticketData = ticketResult[0];

      if (ticketData.jenis_ticket === "PERMINTAAN") {
        const ticketPermintaanResult = await TicketPermintaan.findByPk(
          detailId
        );
        if (ticketPermintaanResult.status == 1) {
          const updateResult = await TicketPermintaan.update(
            { status: 2 },
            { where: { id: detailId } }
          );
        }

        const detailsResult = await TicketPermintaan.findAll({
          where: { ticket_id: ticketId, status: 1 },
        });
        if (detailsResult[0] === undefined) {
          const ticketUpdateResult = await Ticket.update(
            { status: 2 },
            { where: { id: ticketId } }
          );
        }
        payload = await getTicketData(ticketId);
        //console.log("payload", payload);
      }
      if (ticketData.jenis_ticket === "PEMINJAMAN") {
        const ticketPeminjamanDetailResult =
          await TicketPeminjamanDetail.findByPk(detailId);
        if (ticketPeminjamanDetailResult.status == 1) {
          const updateResult = await TicketPeminjamanDetail.update(
            { status: 2 },
            { where: { id: detailId } }
          );
        }

        const detailsResult = await TicketPeminjamanDetail.findAll({
          where: { ticket_id: ticketId, status: 1 },
        });
        if (detailsResult[0] === undefined) {
          const ticketUpdateResult = await Ticket.update(
            { status: 2 },
            { where: { id: ticketId } }
          );
        }
        payload = await getTicketData(ticketId);
        //console.log("payload", payload);
      }
    }
  }

  if (status === 3) {
    const ticketResult = await Ticket.findByPk(ticketId);
    //console.log("ticketResult", ticketResult);
    if (ticketResult) {
      ticketData = ticketResult.dataValues;

      if (ticketData.jenis_ticket === "PERMINTAAN") {
        const ticketPermintaanResult = await TicketPermintaan.findByPk(
          detailId
        );
        if (ticketPermintaanResult.status == 2) {
          const updateResult = await TicketPermintaan.update(
            { status: 3 },
            { where: { id: detailId } }
          );
        }

        const detailsResult = await TicketPermintaan.findAll({
          where: { ticket_id: ticketId, status: 2 },
        });
        if (detailsResult[0] === undefined) {
          const ticketUpdateResult = await Ticket.update(
            { status: 3 },
            { where: { id: ticketId } }
          );
        }
        payload = await getTicketData(ticketId);
      }
      if (ticketData.jenis_ticket === "PEMINJAMAN") {
        const ticketPermintaanDetailResult =
          await TicketPeminjamanDetail.findByPk(detailId);
        if (ticketPermintaanDetailResult.status == 2) {
          const updateResult = await TicketPeminjamanDetail.update(
            { status: 3 },
            { where: { id: detailId } }
          );
        }

        const detailsResult = await TicketPeminjamanDetail.findAll({
          where: { ticket_id: ticketId, status: 2 },
        });
        if (detailsResult[0] === undefined) {
          const ticketUpdateResult = await Ticket.update(
            { status: 3 },
            { where: { id: ticketId } }
          );
        }
        payload = await getTicketData(ticketId);
      }
    }
  }
  if (status === 5) {
    const ticketResult = await Ticket.findByPk(ticketId);
    //console.log("ticketResult", ticketResult);
    if (ticketResult) {
      ticketData = ticketResult.dataValues;

      if (ticketData.jenis_ticket === "PERMINTAAN") {
        const ticketPermintaanResult = await TicketPermintaan.findByPk(
          detailId
        );
        if (ticketPermintaanResult.status == 4) {
          const updateResult = await TicketPermintaan.update(
            { status: 5 },
            { where: { id: detailId } }
          );
        }

        const detailsResult = await TicketPermintaan.findAll({
          where: { ticket_id: ticketId, status: 4 },
        });
        if (detailsResult[0] === undefined) {
          const ticketUpdateResult = await Ticket.update(
            { status: 5 },
            { where: { id: ticketId } }
          );
        }
        payload = await getTicketData(ticketId);
      }
    }
  }
  //console.log("Payload ", payload);
  res.send(payload);
};

exports.assignInventori = async (req, res) => {
  const { ticketPermintaanId, hardwareInventoriId } = req.body;
  let payload = {};
  const ticketPermintaanResult = await TicketPermintaan.findByPk(
    ticketPermintaanId
  );
  console.log("ticketPermintaanResult", ticketPermintaanResult);
  if (ticketPermintaanResult) {
    const ticketPermintaanData = ticketPermintaanResult.dataValues;
    const ticketId = ticketPermintaanData.ticket_id;
    const ticketResult = await Ticket.findByPk(ticketId);
    const ticketData = ticketResult.dataValues;

    const hardwareInventoriResult = await HardwareInventori.findByPk(
      hardwareInventoriId
    );
    if (hardwareInventoriResult) {
      const hardwareInventoriData = hardwareInventoriResult.dataValues;

      const hardwareAssignData = {
        user_id: ticketData.create_user_id,
        hardware_inventori_id: hardwareInventoriData.id,
        status: 1,
      };

      const hardwareAssignResult = await HardwareAssign.create(
        hardwareAssignData
      );
      const hardwareAssignId = hardwareAssignResult.dataValues.id;
      const ticketPermintaanUpdateResult = await TicketPermintaan.update(
        { hardware_assign_id: hardwareAssignId },
        { where: { id: ticketPermintaanId } }
      );
      payload = await getTicketData(ticketId);
    }
  }
  res.send(payload);
};

exports.shippingDetail = async (req, res) => {
  const { detail } = req.body;
  const user_id = req.user.user_id;
  const ticketId = detail.ticket_id;
  const detailId = detail.id;
  //console.log("status", status);

  let payload = {};

  const ticketResult = await Ticket.findByPk(ticketId);
  //console.log("ticketResult", ticketResult);
  if (ticketResult) {
    ticketData = ticketResult.dataValues;

    if (ticketData.jenis_ticket === "PERMINTAAN") {
      const ticketPermintaanResult = await TicketPermintaan.findByPk(detailId);
      const ticketPermintaanData = ticketPermintaanResult.dataValues;
      // kurangin stock
      const hardwareSpecId = ticketPermintaanData.hardware_spec_id;
      const hardwareSpecResult = await HardwareSpec.findByPk(hardwareSpecId);
      if (hardwareSpecResult) {
        const hardwareSpecData = hardwareSpecResult.dataValues;
        if (hardwareSpecData.consumable) {
          const balance = hardwareSpecData.stock_qty - ticketPermintaanData.qty;
          const stockCardData = {
            hardware_spesifikasi_id: hardwareSpecId,
            harga: 0,
            supplier_id: 0,
            form_permintaan: "",
            qty_out: ticketPermintaanData.qty,
            balance: balance,
            transaction_id: detailId,
            transaction_type: 2,
          };
          const hardwareStockCardResult = await HardwareStockCard.create(
            stockCardData
          );
          hardwareStockCardResult.save();

          const updateSpecResult = await HardwareSpec.update(
            { stock_qty: balance },
            { where: { id: hardwareSpecId } }
          );
        } else {
          const balance = hardwareSpecData.stock_qty - 1;
          const updateSpecResult = await HardwareSpec.update(
            { stock_qty: balance },
            { where: { id: hardwareSpecId } }
          );
        }
      }

      if (ticketPermintaanData.status == 3) {
        const updateResult = await TicketPermintaan.update(
          { status: 4 },
          { where: { id: detailId } }
        );
      }

      const detailsResult = await TicketPermintaan.findAll({
        where: { ticket_id: ticketId, status: 3 },
      });
      if (detailsResult[0] === undefined) {
        const ticketUpdateResult = await Ticket.update(
          { status: 4 },
          { where: { id: ticketId } }
        );
      }
      payload = await getTicketData(ticketId);
    }
  }
  //console.log("Payload ", payload);
  res.send(payload);
};

const getTicketData = async (ticketId) => {
  let resTicket = {};
  let resTicketDetails = {};
  let payload = {};
  resTicket = await sequelize.query(
    "select t.*,l.fullname from tickets t join login_data l on l.user_id = t.create_user_id where t.id = ?  order by t.tanggal_pengajuan asc",

    {
      replacements: [ticketId],
      type: QueryTypes.SELECT,
    }
  );
  if (resTicket[0] !== undefined) {
    if (resTicket[0].jenis_ticket === "PERMINTAAN") {
      resTicketDetails = await sequelize.query(
        "select d.*,s.nama_hardware,s.stock_qty,s.consumable,(select hardware_inventoris.no_asset from hardware_inventoris where hardware_inventoris.id in (select hardware_assigns.hardware_inventori_id from hardware_assigns where hardware_assigns.id = d.hardware_assign_id)) as assign_no_asset from ticket_permintaan_details d join hardware_spesifikasis s on s.id = d.hardware_spec_id where d.ticket_id = ? order by d.hardware_spec_id asc",
        {
          replacements: [ticketId],
          type: QueryTypes.SELECT,
        }
      );
      payload = { ...resTicket[0], details: resTicketDetails };
    }
    if (resTicket[0].jenis_ticket === "PEMINJAMAN") {
      ticketPeminjamanResult = await TicketPeminjaman.findAll({
        where: { ticket_id: ticketId },
      });
      ticketPeminjamanData = ticketPeminjamanResult[0].dataValues;
      console.log("ticketPeminjamanData", ticketPeminjamanData);
      resTicketDetails = await sequelize.query(
        "select d.*,s.nama_hardware,s.stock_qty,s.consumable,(select hardware_inventoris.no_asset from hardware_inventoris where hardware_inventoris.id in (select hardware_assigns.hardware_inventori_id from hardware_assigns where hardware_assigns.id = d.hardware_assign_id)) as assign_no_asset from ticket_peminjaman_details d join hardware_spesifikasis s on s.id = d.hardware_spec_id where d.ticket_id = ? order by d.hardware_spec_id asc",
        {
          replacements: [ticketId],
          type: QueryTypes.SELECT,
        }
      );
      payload = {
        ...resTicket[0],
        tanggal_awal: ticketPeminjamanData.tanggal_awal,
        tanggal_akhir: ticketPeminjamanData.tanggal_akhir,
        details: resTicketDetails,
      };
    }
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
      //console.log("payload", payload);
    }
  }

  //console.log("resTicket", resTicket);

  //const payload = { ...resTicket[0], details: resTicketDetails };
  return payload;
};
