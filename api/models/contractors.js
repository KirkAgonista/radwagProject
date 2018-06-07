const mongoose = require("mongoose"),
      Schema = mongoose.Schema;

let contractorSchema = new Schema({
  name: String,
  address: String,
  nip: String,
  town: String,
  zipCode: String,
  phoneNumber: String,

});

const Contractors = mongoose.model("Contractors", contractorSchema);

module.exports = Contractors;

