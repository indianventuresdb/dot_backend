const mongoose = require("mongoose");

const sales = new mongoose.Schema({
  dateKey: {
    type: String,
    required: true,
    unique: true,
  },
  sales: {
    type: Number,
    default: 0,
    required: true,
  },
  gst: {
    type: Number,
    default: 0,
    required: true,
  },
  shipping: {
    type: Number,
    default: 0,
  },
  category: {
    type: Map,
    of: Number,
    default: new Map(),
  },
});

exports.Sales = mongoose.model("Sales", sales);