var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  email:       { type: String, required: true },
  username:    { type: String, required: true },
  password:    { type: String },
  employeeId: { type: String, required: true },
  date:        { type: Date, default: Date.now },
});

userSchema.plugin(passportLocalMongoose);

var user = mongoose.model('user', userSchema);

module.exports = user;
