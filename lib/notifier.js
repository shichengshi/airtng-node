var Reservation = require('../models/reservation');
const { connect, StringCodec } = require("nats");
const fs = require("fs");

const opts = { servers: "nats.argo-events.svc:4222" };

const sendGuestNotification = function() {
  console.log("sendGuestNotification");
  Reservation.find().or([
    {status: 'confirmed'},
    {status: 'rejected'},
  ])
  .deepPopulate('property property.owner guest status')
  .then(function (reservations) {
    // if (reservations.length > 1) {
    //   return;
    // }

    var reservation = reservations[0];
    var owner = reservation.property.owner;

    // Send the notification
    console.log("Send the notification");
    const message = buildGuestMessage(reservation);
    publishNatsMessage(message,"guest");
  });
};

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
    publishNatsMessage(message,"host");
  });
};

const publishNatsMessage = async (message,subject) => {
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
  var message = reservation.guest.username +"から"+ reservation.property.description +"の新しい予約が入りました。\n" +
    reservation.message + "\n" +
    "<http://app.3.142.35.89.nip.io/sessions/answer?employeeid=12345| 承認か拒否の選択>";
  var messagejson = {
    message: message,
    channel: "random"
  };

  return JSON.stringify(messagejson);
};

var buildGuestMessage = function(reservation) {
  var status;
  if(reservation.status === "confirm") {
    status = "承認";
  }else {
    status = "拒否";
  }
  var message = reservation.property.owner.username +"から"+ reservation.property.description +"の予約の返答が来ました。\n" + 
  "("+status+")";
  var messagejson = {
    message: message,
    channel: "general"
  };
  return JSON.stringify(messagejson);
};

exports.sendNotification = sendNotification;
exports.sendGuestNotification = sendGuestNotification;
