var Reservation = require('../models/reservation');


//nodejs からNatsにリクエストをするテスト
const { connect, StringCodec } = require("nats");

// to create a connection to a nats-server:
const nc = await connect({ servers: "nats-server:4222" });

// create a codec
const sc = StringCodec();
// create a simple subscriber and iterate over messages
// matching the subscription
const sub = nc.subscribe("hello");
(async () => {
  for await (const m of sub) {
    console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
  }
  console.log("subscription closed");
})();

nc.publish("hello", sc.encode("world"));
nc.publish("hello", sc.encode("again"));

// we want to insure that messages that are in flight
// get processed, so we are going to drain the
// connection. Drain is the same as close, but makes
// sure that all messages in flight get seen
// by the iterator. After calling drain on the connection
// the connection closes.
await nc.drain(); 









var sendNotification = function() {
  Reservation.find({status: 'pending'})
  .deepPopulate('property property.owner guest')
  .then(function (reservations) {
    if (reservations.length > 1) {
      return;
    }

    var reservation = reservations[0];
    var owner = reservation.property.owner;

    // Send the notification
    console.log("Send the notification");
  });
};


var buildMessage = function(reservation) {
  var message = "You have a new reservation request from " + reservation.guest.username +
    " for " + reservation.property.description + ":\n" +
    reservation.message + "\n" +
    "Reply accept or reject";

  return message;
};

exports.sendNotification = sendNotification;
