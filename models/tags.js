const mongoose = require("mongoose");

const tagsSchema = new mongoose.Schema({
  tags: {
    type: String,
    required: true,
    unique: true,
  },
});

exports.tagsSchema = mongoose.model("tags", tagsSchema);
