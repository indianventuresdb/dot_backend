const mongoose = require("mongoose");

const creativeSchema = mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

exports.Creative = mongoose.model("Creatives", creativeSchema);
