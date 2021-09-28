var Reservation = require('../models/reservation');
const { connect, StringCodec } = require("nats");
const fs = require("fs");

const opts = { servers: "18.116.29.14:30080" };
const subject = "test";

var sendNotification = function() {
  console.log("test");
  Reservation.find({status: 'pending'})
  .deepPopulate('property property.owner guest')
  .then(function (reservations) {
    // if (reservations.length > 1) {
    //   return;
    // }

    var reservation = reservations[0];
    var owner = reservation.property.owner;

    // Send the notification
    console.log("Send the notification");
    const message = buildMessage(reservation);
    publishNatsMessage(message);
  });
};

const publishNatsMessage = async (message) => {
  let nc;
  try {
    nc = await connect(opts);
  } catch (err) {
    console.log(`error connecting to nats: ${err.message}`);
    return;
  }
  console.info(`connected ${nc.getServer()}`);

  nc.closed()
    .then((err) => {
      if (err) {
        console.error(`closed with an error: ${err.message}`);
      }
    });

  const sc = StringCodec();
  nc.publish(subject, sc.encode(message));
  console.log(`[${1}] ${subject}: ${message}`);

  await nc.flush();
  await nc.close();
};


var buildMessage = function(reservation) {
  var message = "You have a new reservation request from " + reservation.guest.username +
    " for " + reservation.property.description + ":\n" +
    reservation.message + "\n" +
    "Reply accept or reject";

  return message;
};

exports.sendNotification = sendNotification;
