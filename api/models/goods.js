const mongoose = require("mongoose"),
      Schema = mongoose.Schema;

let goodsSchema = new Schema({
    name: String,
    price: Number,
    weightPrice: Number,
    quantity: Number,
    code: String,
    weight: Number,
    description: String,
    image: String,
    tags: Array
});

const Goods = mongoose.model("Goods", goodsSchema);

module.exports = Goods;

