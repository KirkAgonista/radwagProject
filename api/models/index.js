const mongoose = require("mongoose");
const config = require("../config/database");
mongoose.set("debug", true);
mongoose.connect(config.MONGOURL);

mongoose.Promise = Promise;

module.exports.User = require("./users");
module.exports.Goods = require("./goods");
module.exports.Contractors = require("./contractors");

