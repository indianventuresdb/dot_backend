const mongoose = require("mongoose");

const cartProductsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    quantity: { // Corrected spelling
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

exports.CartProducts = mongoose.model("Carts", cartProductsSchema);
