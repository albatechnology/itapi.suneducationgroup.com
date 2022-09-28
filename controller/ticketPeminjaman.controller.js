const db = require("../models");
const Ticket = db.Ticket;
const TicketPeminjaman = db.TicketPeminjaman;
const TicketPeminjamanDetail = db.TicketPeminjamanDetail;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");
const {
  HardwareSpec,
  HardwareInventori,
  HardwareAssign,
  HardwareStockCard,
} = require("../models");
const { hardwareSpec } = require(".");

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

exports.create = async (req, res) => {
  const {
    subject,
    tanggal_pengajuan,
    tanggal_awal,
    tanggal_akhir,
    alasan,
    details,
  } = req.body;
  const user_id = req.user.user_id;
  const listPeminjamanDetail = [];
  try {
    const ticketData = {
      jenis_ticket: "PEMINJAMAN",
      subject,
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
        ticket_id: ticketId,
        ticket: ticketData,
        permintaan: listPeminjamanDetail,
      },
    });
  } catch (e) {
    res.send(e);
  }
};

exports.edit = async (req, res) => {
  const { ticket, user } = req.body;
  const ticketId = ticket.id;
  const details = ticket.details;
  try {
    if (ticket.jenis_ticket === "PEMINJAMAN") {
      if (user === "USER" && ticket.status === 1) {
        // update ticketPeminjaman
        ticketPeminjamanUpdateResult = TicketPeminjaman.update(
          {
            subject: ticket.subject,
            tanggal_awal: ticket.tanggal_awal,
            tanggal_akhir: ticket.tanggal_akhir,
          },
          { where: { ticket_id: ticket.id } }
        );
        // delete details
        const detailDeleteResult = await TicketPeminjamanDetail.destroy({
          where: { ticket_id: ticketId },
        });
        details.forEach(async (detail, index) => {
          const { hardware_spec_id, qty, keterangan } = detail;

          // get hardwareSpecData
          const hardwareSpecResult = await HardwareSpec.findByPk(
            hardware_spec_id
          );
          if (hardwareSpecResult) {
            hardwareSpecData = hardwareSpecResult.dataValues;

            if (hardwareSpecData.consumable) {
              const ticketPeminjamanDetailData = {
                ticket_id: ticketId,
                hardware_spec_id,
                qty,
                inventori_id: 0,
                hardware_assign_id: 0,
                keterangan,
                status: 1,
              };

              const TicketPeminjamanDetailResult =
                await TicketPeminjamanDetail.create(ticketPeminjamanDetailData);
              //listPermintaanDetail.push(ticketPermintaanDetailData);
            } else {
              for (let forIndex = 0; forIndex < qty; forIndex++) {
                const ticketPeminjamanDetailData = {
                  ticket_id: ticketId,
                  hardware_spec_id,
                  qty: 1,
                  inventori_id: 0,
                  hardware_assign_id: 0,
                  keterangan,
                  status: 1,
                };

                const ticketPeminjamanDetailResult =
                  await TicketPeminjamanDetail.create(
                    ticketPeminjamanDetailData
                  );
                //listPermintaanDetail.push(ticketPermintaanDetailData);
              }
            }
          }
        });
      } else {
        details.forEach(async (detail, index) => {
          if (detail.id === 0) {
            const { hardware_spec_id, qty, keterangan } = detail;

            // get hardwareSpecData
            const hardwareSpecResult = await HardwareSpec.findByPk(
              hardware_spec_id
            );
            if (hardwareSpecResult) {
              hardwareSpecData = hardwareSpecResult.dataValues;

              if (hardwareSpecData.consumable) {
                const ticketPeminjamanDetailData = {
                  ticket_id: ticketId,
                  hardware_spec_id,
                  qty,
                  inventori_id: 0,
                  hardware_assign_id: 0,
                  keterangan,
                  status: ticket.status,
                  supervisor_approve_time: ticket.supervisor_approve_time,
                  admin_approve_time: ticket.admin_approve_time,
                  shipping_time: ticket.shipping_time,
                };

                const TicketPeminjamanDetailResult =
                  await TicketPeminjamanDetail.create(
                    ticketPeminjamanDetailData
                  );
                //listPermintaanDetail.push(ticketPermintaanDetailData);
              } else {
                for (let forIndex = 0; forIndex < qty; forIndex++) {
                  const ticketPeminjamanDetailData = {
                    ticket_id: ticketId,
                    hardware_spec_id,
                    qty: 1,
                    inventori_id: 0,
                    hardware_assign_id: 0,
                    keterangan,
                    status: ticket.status,
                    supervisor_approve_time: ticket.supervisor_approve_time,
                    admin_approve_time: ticket.admin_approve_time,
                    shipping_time: ticket.shipping_time,
                  };

                  const ticketPeminjamanDetailResult =
                    await TicketPeminjamanDetail.create(
                      ticketPeminjamanDetailData
                    );
                  //listPermintaanDetail.push(ticketPermintaanDetailData);
                }
              }
            }
          }
        });
      }
    }
    const payload = await getTicketData(ticket);
    res.send(payload);
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

      if (ticketData.jenis_ticket === "PEMINJAMAN") {
        const ticketPeminjamanDetailResult =
          await TicketPeminjamanDetail.update(
            { status: 0, decline_time: sequelize.fn("NOW") },
            {
              where: { ticket_id: ticketId },
            }
          );
        payload = await getTicketData(ticket);
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

      if (ticketData.jenis_ticket === "PEMINJAMAN") {
        const ticketPeminjamanDetailResult =
          await TicketPeminjamanDetail.update(
            { status: 2, supervisor_approve_time: sequelize.fn("NOW") },
            {
              where: { ticket_id: ticketId, status: 1 },
            }
          );

        payload = await getTicketData(ticket);
      }
    }
  }

  if (status === 3) {
    const ticketResult = await Ticket.findByPk(ticketId);
    if (ticketResult) {
      ticketData = ticketResult.dataValues;

      if (ticketData.jenis_ticket === "PEMINJAMAN") {
        const ticketPeminjamanDetailResult =
          await TicketPeminjamanDetail.update(
            { status: 3, admin_approve_time: sequelize.fn("NOW") },
            {
              where: { ticket_id: ticketId, status: 2 },
            }
          );

        payload = await getTicketData(ticket);
      }
    }
  }
  if (status === 10) {
    const ticketResult = await Ticket.findByPk(ticketId);
    if (ticketResult) {
      ticketData = ticketResult.dataValues;

      if (ticketData.jenis_ticket === "PEMINJAMAN") {
        const ticketPeminjamanDetailResult =
          await TicketPeminjamanDetail.update(
            { status: 10, completed_time: sequelize.fn("NOW") },
            {
              where: { ticket_id: ticketId, status: 6 },
            }
          );
        payload = await getTicketData(ticket);
      }
    }
  }
  res.send(payload);
};

exports.processDetail = async (req, res) => {
  const { status, ticket, detail } = req.body;
  const user_id = req.user.user_id;
  const ticketId = detail.ticket_id;
  const detailId = detail.id;

  let payload = {};
  if (status === 0) {
    const ticketResult = await Ticket.findByPk(ticketId);
    if (ticketResult) {
      ticketData = ticketResult.dataValues;
      const ticketStatus = ticketData.status;

      if (ticketData.jenis_ticket === "PEMINJAMAN") {
        const updateResult = await TicketPeminjamanDetail.update(
          { status: 0, decline_time: sequelize.fn("NOW") },
          { where: { id: detailId } }
        );

        payload = await getTicketData(ticket);
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

      if (ticketData.jenis_ticket === "PEMINJAMAN") {
        const ticketPeminjamanDetailResult =
          await TicketPeminjamanDetail.findByPk(detailId);
        if (ticketPeminjamanDetailResult.status == 1) {
          const updateResult = await TicketPeminjamanDetail.update(
            { status: 2, supervisor_approve_time: sequelize.fn("NOW") },
            { where: { id: detailId } }
          );
        }

        payload = await getTicketData(ticket);
      }
    }
  }

  if (status === 3) {
    const ticketResult = await Ticket.findByPk(ticketId);
    if (ticketResult) {
      ticketData = ticketResult.dataValues;

      if (ticketData.jenis_ticket === "PEMINJAMAN") {
        const ticketPeminjamanDetailResult =
          await TicketPeminjamanDetail.findByPk(detailId);
        if (ticketPeminjamanDetailResult.status == 2) {
          const updateResult = await TicketPeminjamanDetail.update(
            { status: 3, admin_approve_time: sequelize.fn("NOW") },
            { where: { id: detailId } }
          );
        }

        payload = await getTicketData(ticket);
      }
    }
  }

  res.send(payload);
};
exports.receiveDetail = async (req, res) => {
  const { ticket, detail } = req.body;
  const user_id = req.user.user_id;
  const ticketId = detail.ticket_id;
  const detailId = detail.id;

  let payload = {};

  const ticketResult = await Ticket.findByPk(ticketId);
  if (ticketResult) {
    ticketData = ticketResult.dataValues;

    if (ticketData.jenis_ticket === "PEMINJAMAN") {
      const ticketPeminjamanDetailResult =
        await TicketPeminjamanDetail.findByPk(detailId);
      if (ticketPeminjamanDetailResult.status == 4) {
        // update detail status
        const updateResult = await TicketPeminjamanDetail.update(
          { status: 5, user_receive_time: sequelize.fn("NOW") },
          { where: { id: detailId } }
        );

        // update assign status jadi 3. Dipinjam User
        const hardwareAssignId =
          ticketPeminjamanDetailResult.hardware_assign_id;
        const hardwareAssignUpdateResult = await HardwareAssign.update(
          { status: 3 },
          { where: { id: hardwareAssignId } }
        );
      }

      payload = await getTicketData(ticket);
    }
  }

  res.send(payload);
};
exports.returnDetail = async (req, res) => {
  const { ticket, detail } = req.body;
  const user_id = req.user.user_id;
  const ticketId = detail.ticket_id;
  const detailId = detail.id;

  let payload = {};

  const ticketResult = await Ticket.findByPk(ticketId);
  if (ticketResult) {
    ticketData = ticketResult.dataValues;

    if (ticketData.jenis_ticket === "PEMINJAMAN") {
      const ticketPeminjamanDetailResult =
        await TicketPeminjamanDetail.findByPk(detailId);
      if (ticketPeminjamanDetailResult.status == 5) {
        // update detail status
        const updateResult = await TicketPeminjamanDetail.update(
          { status: 6, user_return_time: sequelize.fn("NOW") },
          { where: { id: detailId } }
        );
      }

      payload = await getTicketData(ticket);
    }
  }

  res.send(payload);
};
exports.completeDetail = async (req, res) => {
  const { ticket, detail } = req.body;
  const user_id = req.user.user_id;

  const ticketId = detail.ticket_id;
  const detailId = detail.id;

  const ticketResult = await Ticket.findByPk(ticketId);
  if (ticketResult) {
    ticketData = ticketResult.dataValues;

    if (ticketData.jenis_ticket === "PEMINJAMAN") {
      const ticketPeminjamanDetailResult =
        await TicketPeminjamanDetail.findByPk(detailId);
      if (ticketPeminjamanDetailResult.status == 6) {
        // update detail status
        const updateResult = await TicketPeminjamanDetail.update(
          { status: 10, completed_time: sequelize.fn("NOW") },
          { where: { id: detailId } }
        );

        // update assign status jadi 0. Not Assign
        const hardwareAssignId =
          ticketPeminjamanDetailResult.hardware_assign_id;
        const hardwareSpecId = ticketPeminjamanDetailResult.hardware_spec_id;
        if (hardwareAssignId !== 0) {
          const hardwareAssignUpdateResult = await HardwareAssign.update(
            { status: 0 },
            { where: { id: hardwareAssignId } }
          );

          // increse hardware stock
          const hardwareSpecResult = await HardwareSpec.findByPk(
            hardwareSpecId
          );
          if (hardwareSpecResult) {
            const hardwareSpecData = hardwareSpecResult.dataValues;
            const stock_qty = hardwareSpecData.stock_qty;
            const hardwareSpecUpdateResult = await HardwareSpec.update(
              { stock_qty: stock_qty + 1 },
              {
                where: { id: hardwareSpecId },
              }
            );
          }
        }
      }
    }
  }

  const payload = await getTicketData(ticket);

  res.send(payload);
};

exports.receiveTicket = async (req, res) => {
  const { ticket } = req.body;
  const user_id = req.user.user_id;
  const ticketId = ticket.id;
  let payload = {};

  const ticketResult = await Ticket.findByPk(ticketId);
  if (ticketResult) {
    ticketData = ticketResult.dataValues;
    if (ticketData.status === 4) {
      if (ticketData.jenis_ticket === "PEMINJAMAN") {
        const ticketPeminjamanDetailResult =
          await TicketPeminjamanDetail.findAll({
            where: { ticket_id: ticketId, status: 4 },
          });

        if (ticketPeminjamanDetailResult) {
          ticketPeminjamanDetailResult.forEach(async (detail) => {
            const detailId = detail.id;
            // update detail status
            const updateResult = await TicketPeminjamanDetail.update(
              { status: 5, user_receive_time: sequelize.fn("NOW") },
              { where: { id: detailId } }
            );

            // update assign status jadi 3. Dipinjam User
            const hardwareAssignId = detail.hardware_assign_id;
            const hardwareAssignUpdateResult = await HardwareAssign.update(
              { status: 3 },
              { where: { id: hardwareAssignId } }
            );
          });
        }

        payload = await getTicketData(ticket);
      }
    }
  }

  res.send(payload);
};

exports.returnTicket = async (req, res) => {
  const { ticket } = req.body;
  const user_id = req.user.user_id;
  const ticketId = ticket.id;
  let payload = {};

  const ticketResult = await Ticket.findByPk(ticketId);
  if (ticketResult) {
    ticketData = ticketResult.dataValues;
    if (ticketData.status === 5) {
      if (ticketData.jenis_ticket === "PEMINJAMAN") {
        const ticketPeminjamanDetailResult =
          await TicketPeminjamanDetail.findAll({
            where: { ticket_id: ticketId, status: 5 },
          });

        if (ticketPeminjamanDetailResult) {
          ticketPeminjamanDetailResult.forEach(async (detail) => {
            const detailId = detail.id;
            // update detail status
            const updateResult = await TicketPeminjamanDetail.update(
              { status: 6, user_receive_time: sequelize.fn("NOW") },
              { where: { id: detailId } }
            );
          });
        }

        payload = await getTicketData(ticket);
      }
    }
  }

  res.send(payload);
};

exports.completeTicket = async (req, res) => {
  const { ticket } = req.body;
  const user_id = req.user.user_id;
  const ticketId = ticket.id;
  let payload = {};
  let incStock = [];
  const ticketResult = await Ticket.findByPk(ticketId);
  if (ticketResult) {
    ticketData = await ticketResult.dataValues;
    if (ticketData.status === 6) {
      if (ticketData.jenis_ticket === "PEMINJAMAN") {
        const ticketPeminjamanDetailResult =
          await TicketPeminjamanDetail.findAll({
            where: { ticket_id: ticketId, status: 6 },
          });

        if (ticketPeminjamanDetailResult) {
          ticketPeminjamanDetailResult.forEach(async (detail) => {
            const status = detail.status;
            const hardwareAssignId = detail.hardware_assign_id;
            const hardwareSpecId = detail.hardware_spec_id;
            if (hardwareAssignId !== 0 && status === 6) {
              if (incStock[hardwareSpecId] === undefined) {
                incStock[hardwareSpecId] = 1;
              } else {
                incStock[hardwareSpecId]++;
              }
            }
          });
        }

        ticketPeminjamanDetailResult.forEach(async (detail) => {
          //console.log("detail", detail);
          const detailId = await detail.id;

          if (detail.status == 6) {
            // update detail status
            const updateResult = await TicketPeminjamanDetail.update(
              { status: 10, completed_time: sequelize.fn("NOW") },
              { where: { id: detailId } }
            );

            // update assign status jadi 0. Not Assign
            const hardwareAssignId = detail.hardware_assign_id;
            const hardwareSpecId = detail.hardware_spec_id;

            if (hardwareAssignId !== 0) {
              const hardwareAssignUpdateResult = await HardwareAssign.update(
                { status: 0 },
                { where: { id: hardwareAssignId } }
              );
            }
          }
        });

        for (const [hardwareSpecId, qty] of Object.entries(incStock)) {
          const result = await HardwareSpec.findByPk(hardwareSpecId);
          if (result) {
            const data = result.dataValues;
            const stock_qty = data.stock_qty;
            const updateResult = await HardwareSpec.update(
              { stock_qty: stock_qty + qty },
              { where: { id: hardwareSpecId } }
            );
          }
        }

        payload = await getTicketData(ticket);
      }
    }
  }

  res.send(payload);
};

exports.assignInventori = async (req, res) => {
  const { ticketDetailId, hardwareInventoriId } = req.body;
  let payload = {};
  const ticketPeminjamanDetailResult = await TicketPeminjamanDetail.findByPk(
    ticketDetailId
  );
  if (ticketPeminjamanDetailResult) {
    const ticketPeminjamanDetailData = ticketPeminjamanDetailResult.dataValues;
    const ticketId = ticketPeminjamanDetailData.ticket_id;
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
      const ticketPeminjamanDetailUpdateResult =
        await TicketPeminjamanDetail.update(
          { hardware_assign_id: hardwareAssignId },
          { where: { id: ticketDetailId } }
        );
      payload = await getTicketData(ticketData);
    }
  }
  res.send(payload);
};

exports.resetInventori = async (req, res) => {
  const { detail } = req.body;
  console.log("detail", detail);
  const ticketPeminjamanDetailId = detail.id;
  let payload = {};
  const ticketPeminjamanDetailResult = await TicketPeminjamanDetail.findByPk(
    ticketPeminjamanDetailId
  );
  if (ticketPeminjamanDetailResult) {
    const ticketPeminjamanDetailData = ticketPeminjamanDetailResult.dataValues;
    const ticketId = ticketPeminjamanDetailData.ticket_id;
    const ticketResult = await Ticket.findByPk(ticketId);
    const ticketData = ticketResult.dataValues;
    const hardwareAssignId = ticketPeminjamanDetailData.hardware_assign_id;

    const hardwareAssignUpdateResult = await HardwareAssign.update(
      { status: 0 },
      { where: { id: hardwareAssignId } }
    );
    const ticketPeminjamanDetailUpdateResult =
      await TicketPeminjamanDetail.update(
        { hardware_assign_id: 0 },
        { where: { id: ticketPeminjamanDetailId } }
      );
    payload = await getTicketData(ticketData);
  }
  res.send(payload);
};

exports.shippingDetail = async (req, res) => {
  const { ticket, detail, fromStock } = req.body;
  //console.log("body", req.body);
  const user_id = req.user.user_id;
  const ticketId = ticket.id;
  const detailId = detail.id;
  console.log("body", req.body);

  let payload = {};

  const ticketResult = await Ticket.findByPk(ticketId);
  //console.log("ticketResult", ticketResult);
  if (ticketResult) {
    ticketData = ticketResult.dataValues;

    if (ticketData.jenis_ticket === "PEMINJAMAN") {
      const ticketPeminjamanDetailResult =
        await TicketPeminjamanDetail.findByPk(detailId);
      const ticketPeminjamanDetailData =
        ticketPeminjamanDetailResult.dataValues;
      // kurangin stock
      const hardwareSpecId = ticketPeminjamanDetailData.hardware_spec_id;
      const hardwareSpecResult = await HardwareSpec.findByPk(hardwareSpecId);
      if (hardwareSpecResult) {
        const hardwareSpecData = hardwareSpecResult.dataValues;
        if (hardwareSpecData.consumable) {
          if (fromStock) {
            // Subtract Stock
            const balance =
              hardwareSpecData.stock_qty - ticketPeminjamanDetailData.qty;
            const stockCardData = {
              hardware_spesifikasi_id: hardwareSpecId,
              harga: 0,
              supplier_id: 0,
              form_permintaan: "",
              qty_out: ticketPeminjamanDetailData.qty,
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
          }
        } else {
          const balance = hardwareSpecData.stock_qty - 1;
          const updateSpecResult = await HardwareSpec.update(
            { stock_qty: balance },
            { where: { id: hardwareSpecId } }
          );
        }
      }

      if (ticketPeminjamanDetailData.status == 3) {
        const updateResult = await TicketPeminjamanDetail.update(
          { status: 4, shipping_time: sequelize.fn("NOW") },
          { where: { id: detailId } }
        );
      }

      payload = await getTicketData(ticket);
    }
  }
  //console.log("Payload ", payload);
  res.send(payload);
};

const getTicketData = async (ticket) => {
  const ticketId = ticket.id;
  let resTicket = {};
  let resTicketDetails = {};
  let payload = {};
  const updateticketResult = await updateTicket(ticket);
  resTicket = await sequelize.query(
    "select * from tickets where id = ? order by tanggal_pengajuan asc",
    {
      replacements: [ticketId],
      type: QueryTypes.SELECT,
    }
  );
  if (resTicket[0] !== undefined) {
    if (resTicket[0].jenis_ticket === "PEMINJAMAN") {
      ticketPeminjamanResult = await TicketPeminjaman.findByPk(resTicket[0].id);
      if (ticketPeminjamanResult) {
        ticketPeminjamanData = ticketPeminjamanResult.dataValues;
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
        tanggal_awal: ticket.tanggal_awal,
        tanggal_akhir: ticket.tanggal_akhir,
        alasan: ticket.alasan,
        catatan_admin: ticket.catatan_admin,
        catatan_supervisor: ticket.catatan_supervisor,
        catatan_user: ticket.catatan_user,
      },
      { where: { id: ticketId } }
    );
    const ticketResult = await Ticket.findByPk(ticketId);
    if (ticketResult) {
      const ticketData = ticketResult.dataValues;
      if (ticketData.jenis_ticket === "PEMINJAMAN") {
        const detailResult = await TicketPeminjamanDetail.findAll({
          where: { ticket_id: ticketId },
        });

        if (detailResult) {
          let detailStatus = 99;
          detailResult.forEach((detail, detailIndex) => {
            if (detail.status !== 0 && detail.status < detailStatus) {
              detailStatus = detail.status;
            }
          });
          if (detailStatus === 99) {
            // decline Ticket
            const updateResult = await Ticket.update(
              {
                status: 0,
                decline_time: sequelize.fn("NOW"),
              },
              { where: { id: ticketId } }
            );
          } else {
            if (detailStatus !== ticketData.status) {
              let updateData = {
                status: detailStatus,
              };
              if (detailStatus === 2)
                updateData = {
                  status: detailStatus,
                  supervisor_approve_time: sequelize.fn("NOW"),
                };
              if (detailStatus === 3)
                updateData = {
                  status: detailStatus,
                  admin_approve_time: sequelize.fn("NOW"),
                };
              if (detailStatus === 4)
                updateData = {
                  status: detailStatus,
                  shipping_time: sequelize.fn("NOW"),
                };
              if (detailStatus === 5)
                updateData = {
                  status: detailStatus,
                  user_deliver_time: sequelize.fn("NOW"),
                };
              if (detailStatus === 6)
                updateData = {
                  status: detailStatus,
                  user_return_time: sequelize.fn("NOW"),
                };
              if (detailStatus === 10)
                updateData = {
                  status: detailStatus,
                  completed_time: sequelize.fn("NOW"),
                };

              const updateResult = await Ticket.update(updateData, {
                where: { id: ticketId },
              });
            }
          }
        }
      }
    }
    return true;
  } catch (e) {
    return false;
  }
};

const processCompleteDetail = async (detail) => {
  const ticketId = detail.ticket_id;
  const detailId = detail.id;

  const ticketResult = await Ticket.findByPk(ticketId);
  if (ticketResult) {
    ticketData = ticketResult.dataValues;

    if (ticketData.jenis_ticket === "PEMINJAMAN") {
      const ticketPeminjamanDetailResult =
        await TicketPeminjamanDetail.findByPk(detailId);
      if (ticketPeminjamanDetailResult.status == 6) {
        // update detail status
        const updateResult = await TicketPeminjamanDetail.update(
          { status: 10, completed_time: sequelize.fn("NOW") },
          { where: { id: detailId } }
        );

        // update assign status jadi 0. Not Assign
        const hardwareAssignId =
          ticketPeminjamanDetailResult.hardware_assign_id;
        const hardwareSpecId = ticketPeminjamanDetailResult.hardware_spec_id;
        if (hardwareAssignId !== 0) {
          const hardwareAssignUpdateResult = await HardwareAssign.update(
            { status: 0 },
            { where: { id: hardwareAssignId } }
          );

          // increse hardware stock
          const hardwareSpecResult = await HardwareSpec.findByPk(
            hardwareSpecId
          );
          if (hardwareSpecResult) {
            const hardwareSpecData = hardwareSpecResult.dataValues;
            const stock_qty = hardwareSpecData.stock_qty;
            const hardwareSpecUpdateResult = await HardwareSpec.update(
              { stock_qty: stock_qty + 1 },
              {
                where: { id: hardwareSpecId },
              }
            );
            return detail;
          }
        }
      }
    }
  }
};
