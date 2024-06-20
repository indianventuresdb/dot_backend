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
    patha: {
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
  },
  { timestamps: true }
);

exports.Posts = mongoose.model("Posts", posts);
