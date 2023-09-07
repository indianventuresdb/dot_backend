const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
});

exports.categorySchema = mongoose.model("Category", categorySchema);
