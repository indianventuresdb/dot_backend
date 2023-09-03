const mongoose = require("mongoose");
const { Orders } = require("../models/orders.js");
const { Products } = require("../models/products.js");
const { Users } = require("../models/users.js");
const calculateAmount = require("../utils/calculateAmount");

// Create a new order
exports.createOrder = async (req, res) => {
  const products = req.body.items;
  const userId = req.body.userId;
  const addressId = req.body.addressId;
  const paymentMode = req.body.paymentMode;

  let price = 0;
  try {
    price = await calculateAmount(products);
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "Failed to calculate price" });
  }

  const productsId = products.map((data) => data._id);
  const productCost = products.map((data) => data.price);
  const quantity = products.map((data) => data.quantity);
  const productName = products.map((data) => data.name);
  const productImage = products.map((data) => data.image);

  let user;
  try {
    user = await Users.findById(userId);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ success: false, message: "No user found." });
  }

  if (!user) {
    return res.status(404).json({ success: false, message: "No user found." });
  }

  try {
    const order = new Orders({
      userId,
      productId: productsId,
      productCost,
      addressId,
      quantity,
      productName,
      invoiceFileName: "File",
      price,
      productImage,
      paymentMode,
    });
    const sess = await mongoose.startSession();
    sess.startTransaction();

    for (let i = 0; i < products.length; i++) {
      const productId = products[i]._id;
      const productQuantity = products[i].quantity;

      const product = await Products.findById(productId).session(sess);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found.`);
      }

      if (product.quantity < productQuantity) {
        throw new Error(
          `Insufficient stock for product ${product.productName}.`
        );
      }

      product.quantity = product.quantity - productQuantity;
      await product.save();
    }
    const savedOrder = await order.save({ session: sess });

    user.orders.push(order);
    await user.save({ session: sess });
    await sess.commitTransaction();

    res.status(201).json({ orderId: savedOrder._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Orders.find().populate("userId");
    !orders
      ? res.status(404).json({ message: "Order not found" })
      : res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  const id = req.params.id;
  try {
    const order = await Orders.findById(id)
      .populate("addressId")
      .populate("userId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await Users.findById(userId).populate("orders");
    if (!user) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ orders: user.orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Orders.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Orders.findByIdAndRemove(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.ordersForSeller = async (req, res) => {
  try {
    const orders = await Orders.find();
    const ordersWithAllDetails = orders.map(async (item) => {
      const product = await Products.findById(item.productId);
      const username = await Users.findById(item.userId);
      item.productId = product;
      item.userId = username;
      return item;
    });
    res.status(200).json(ordersWithAllDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.ordersNumbers = async (req, res) => {
  try {
    const documentCount = await Orders.count({});
    res.status(200).json({ numbers: documentCount });
  } catch (error) {
    res.status(300).json({ message: "fail to count orders" });
  }
};
