const mongoose = require("mongoose");

const posts = new mongoose.Schema(
  {
    ref: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    postDate: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    visitors: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

exports.Posts = mongoose.model("Posts", posts);
