const db = require("../models");
const Ticket = db.Ticket;
const TicketPermintaanDetail = db.TicketPermintaanDetail;
const sequelize = db.sequelize;
const { QueryTypes, Op } = require("sequelize");
const {
  HardwareSpec,
  HardwareInventori,
  HardwareAssign,
  HardwareStockCard,
} = require("../models");

/*
  status 
  0. Declined
  1. Create 
  2. Approve By Supervisor
  3. Approve By Admin -> In Progress
  4. Set Shipping
  10. Complete

*/

exports.create = async (req, res) => {
  const { subject, tanggal_pengajuan, alasan, details } = req.body;
  const user_id = req.user.user_id;
  const listPermintaanDetail = [];
  try {
    const ticketData = {
      jenis_ticket: "PERMINTAAN",
      subject,
      tanggal_pengajuan,
      alasan,
      status: 1, // create
      create_user_id: user_id,
    };
    const ticketResult = await Ticket.create(ticketData);
    ticketResult.save();

    // insert detail
    const ticket_id = ticketResult.id;
    details.forEach(async (detail) => {
      const { hardware_spec_id, qty, keterangan } = detail;

      // get hardwareSpecData
      const hardwareSpecResult = await HardwareSpec.findByPk(hardware_spec_id);
      if (hardwareSpecResult) {
        hardwareSpecData = hardwareSpecResult.dataValues;

        if (hardwareSpecData.consumable) {
          const ticketPermintaanDetailData = {
            ticket_id: ticket_id,
            hardware_spec_id,
            qty,
            status: 1, // create
            inventori_id: 0,
            hardware_assign_id: 0,
            keterangan,
          };

          const TicketPermintaanDetailResult =
            await TicketPermintaanDetail.create(ticketPermintaanDetailData);
          listPermintaanDetail.push(ticketPermintaanDetailData);
        } else {
          for (let forIndex = 0; forIndex < qty; forIndex++) {
            const ticketPermintaanDetailData = {
              ticket_id: ticket_id,
              hardware_spec_id,
              qty: 1,
              status: 1, // create
              inventori_id: 0,
              hardware_assign_id: 0,
              keterangan,
            };

            const ticketPermintaanDetailResult =
              await TicketPermintaanDetail.create(ticketPermintaanDetailData);
            listPermintaanDetail.push(ticketPermintaanDetailData);
          }
        }
      }
    });
    res.send({
      error_code: 0,
      payload: {
        ticket_id,
        ticket: ticketData,
        permintaan: listPermintaanDetail,
      },
    });
  } catch (e) {
    res.send(e);
  }
};

exports.edit = async (req, res) => {
  const { ticket, user } = req.body;
  const user_id = req.user.user_id;
  const ticketId = ticket.id;
  const details = ticket.details;
  try {
    if (ticket.jenis_ticket === "PERMINTAAN") {
      if (user === "USER" && ticket.status === 1) {
        // delete details
        const detailDeleteResult = await TicketPermintaanDetail.destroy({
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
              const ticketPermintaanDetailData = {
                ticket_id: ticketId,
                hardware_spec_id,
                qty,
                inventori_id: 0,
                hardware_assign_id: 0,
                keterangan,
                status: 1,
              };

              const TicketPermintaanDetailResult =
                await TicketPermintaanDetail.create(ticketPermintaanDetailData);
              //listPermintaanDetail.push(ticketPermintaanDetailData);
            } else {
              for (let forIndex = 0; forIndex < qty; forIndex++) {
                const ticketPermintaanDetailData = {
                  ticket_id: ticketId,
                  hardware_spec_id,
                  qty: 1,
                  inventori_id: 0,
                  hardware_assign_id: 0,
                  keterangan,
                  status: 1,
                };

                const ticketPermintaanDetailResult =
                  await TicketPermintaanDetail.create(
                    ticketPermintaanDetailData
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
                const ticketPermintaanDetailData = {
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

                const TicketPermintaanDetailResult =
                  await TicketPermintaanDetail.create(
                    ticketPermintaanDetailData
                  );
                //listPermintaanDetail.push(ticketPermintaanDetailData);
              } else {
                for (let forIndex = 0; forIndex < qty; forIndex++) {
                  const ticketPermintaanDetailData = {
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

                  const ticketPermintaanDetailResult =
                    await TicketPermintaanDetail.create(
                      ticketPermintaanDetailData
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

      if (ticketData.jenis_ticket === "PERMINTAAN") {
        const ticketPermintaanDetailResult =
          await TicketPermintaanDetail.update(
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

      if (ticketData.jenis_ticket === "PERMINTAAN") {
        const ticketPermintaanDetailResult =
          await TicketPermintaanDetail.update(
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

      if (ticketData.jenis_ticket === "PERMINTAAN") {
        const ticketPermintaanDetailResult =
          await TicketPermintaanDetail.update(
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

      if (ticketData.jenis_ticket === "PERMINTAAN") {
        // update Assign Status
        const detailResult = await TicketPermintaanDetail.findAll({
          where: {
            ticket_id: ticketId,
            status: 4,
          },
        });
        if (detailResult) {
          detailResult.forEach(async (detail) => {
            const hardwareAssignUpdateResult = await HardwareAssign.update(
              { status: 2 },
              { where: { id: detail.hardware_assign_id } }
            );
          });
        }
        const ticketPermintaanDetailUpdateResult =
          await TicketPermintaanDetail.update(
            { status: 10, completed_time: sequelize.fn("NOW") },
            {
              where: { ticket_id: ticketId, status: 4 },
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

      if (ticketData.jenis_ticket === "PERMINTAAN") {
        const updateResult = await TicketPermintaanDetail.update(
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

      if (ticketData.jenis_ticket === "PERMINTAAN") {
        const ticketPermintaanDetailResult =
          await TicketPermintaanDetail.findByPk(detailId);
        if (ticketPermintaanDetailResult.status == 1) {
          const updateResult = await TicketPermintaanDetail.update(
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

      if (ticketData.jenis_ticket === "PERMINTAAN") {
        const ticketPermintaanDetailResult =
          await TicketPermintaanDetail.findByPk(detailId);
        if (ticketPermintaanDetailResult.status == 2) {
          const updateResult = await TicketPermintaanDetail.update(
            { status: 3, admin_approve_time: sequelize.fn("NOW") },
            { where: { id: detailId } }
          );
        }

        payload = await getTicketData(ticket);
      }
    }
  }
  if (status === 10) {
    const ticketResult = await Ticket.findByPk(ticketId);
    if (ticketResult) {
      ticketData = ticketResult.dataValues;

      if (ticketData.jenis_ticket === "PERMINTAAN") {
        const ticketPermintaanDetailResult =
          await TicketPermintaanDetail.findByPk(detailId);
        if (ticketPermintaanDetailResult.status == 4) {
          const updateResult = await TicketPermintaanDetail.update(
            { status: 10, completed_time: sequelize.fn("NOW") },
            { where: { id: detailId } }
          );
          // update Assign Status
          const hardwareAssignId =
            ticketPermintaanDetailResult.hardware_assign_id;
          const hardwareAssignUpdateResult = await HardwareAssign.update(
            { status: 2 },
            { where: { id: hardwareAssignId } }
          );
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
  const ticketPermintaanDetailResult = await TicketPermintaanDetail.findByPk(
    ticketDetailId
  );
  if (ticketPermintaanDetailResult) {
    const ticketPermintaanDetailData = ticketPermintaanDetailResult.dataValues;
    const ticketId = ticketPermintaanDetailData.ticket_id;
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
      const ticketPermintaanDetailUpdateResult =
        await TicketPermintaanDetail.update(
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
  const ticketPermintaanDetailId = detail.id;
  let payload = {};
  const ticketPermintaanDetailResult = await TicketPermintaanDetail.findByPk(
    ticketPermintaanDetailId
  );
  if (ticketPermintaanDetailResult) {
    const ticketPermintaanDetailData = ticketPermintaanDetailResult.dataValues;
    const ticketId = ticketPermintaanDetailData.ticket_id;
    const ticketResult = await Ticket.findByPk(ticketId);
    const ticketData = ticketResult.dataValues;
    const hardwareAssignId = ticketPermintaanDetailData.hardware_assign_id;

    const hardwareAssignUpdateResult = await HardwareAssign.update(
      { status: 0 },
      { where: { id: hardwareAssignId } }
    );
    const ticketPermintaanDetailUpdateResult =
      await TicketPermintaanDetail.update(
        { hardware_assign_id: 0 },
        { where: { id: ticketPermintaanDetailId } }
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

    if (ticketData.jenis_ticket === "PERMINTAAN") {
      const ticketPermintaanDetailResult =
        await TicketPermintaanDetail.findByPk(detailId);
      const ticketPermintaanDetailData =
        ticketPermintaanDetailResult.dataValues;
      // kurangin stock
      const hardwareSpecId = ticketPermintaanDetailData.hardware_spec_id;
      const hardwareSpecResult = await HardwareSpec.findByPk(hardwareSpecId);
      if (hardwareSpecResult) {
        const hardwareSpecData = hardwareSpecResult.dataValues;
        if (hardwareSpecData.consumable) {
          if (fromStock) {
            // Subtract Stock
            const balance =
              hardwareSpecData.stock_qty - ticketPermintaanDetailData.qty;
            const stockCardData = {
              hardware_spesifikasi_id: hardwareSpecId,
              harga: 0,
              supplier_id: 0,
              form_permintaan: "",
              qty_out: ticketPermintaanDetailData.qty,
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

      if (ticketPermintaanDetailData.status == 3) {
        const updateResult = await TicketPermintaanDetail.update(
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
        catatan_admin: ticket.catatan_admin,
        catatan_supervisor: ticket.catatan_supervisor,
        catatan_user: ticket.catatan_user,
      },
      { where: { id: ticketId } }
    );
    const ticketResult = await Ticket.findByPk(ticketId);
    if (ticketResult) {
      const ticketData = ticketResult.dataValues;
      if (ticketData.jenis_ticket === "PERMINTAAN") {
        const detailResult = await TicketPermintaanDetail.findAll({
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
