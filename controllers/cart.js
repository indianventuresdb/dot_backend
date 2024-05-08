const { CartProducts } = require("../models/cart");

const add_To_Cart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const existing = await CartProducts.findOneAndUpdate(
      { userId, productId },
      { $inc: { quantity: 1 } },
      { new: true }
    );

    if (!existing) {
      res
        .status(301)
        .json({ status: false, message: "Product not Updated in your Cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Serevr Error" });
  }
};

const getAllItems = async (req, res) => {
  const userId = req.params.userId;
  try {
    const cartItems = await CartProducts.find({ userId });
    if (!cartItems) {
      res.status(304).json({ status: false, message: "No Cart Item Found" });
    }
    res.status(200).json({ status: true, cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Serevr Error" });
  }
};

const increaseItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const res = await CartProducts.findOneAndUpdate(
      { userId, productId },
      { $inc: { quantity: 1 } },
      { new: true }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Serevr Error" });
  }
};

const decreseItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const res = await CartProducts.findOneAndUpdate(
      { userId, productId },
      { $inc: { quantity: -1 } },
      { new: true }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Serevr Error" });
  }
};

module.exports = { add_To_Cart, increaseItem, getAllItems, decreseItem };
