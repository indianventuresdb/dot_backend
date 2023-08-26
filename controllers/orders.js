const { Orders } = require("../models/orders.js");
const { Products } = require("../models/products.js");
const { Users } = require("../models/users.js");
const calculateAmount = require("../utils/calculateAmount");

// Create a new order
exports.createOrder = async (req, res) => {
  const products = req.body.items;
  const userId = req.body.user;
  const addressId = req.body.addressId;
  const amount = await calculateAmount(products);

  const productsId = products.map((data) => data._id);
  const quantity = products.map((data) => data.quantity);
  const productName = products.map((data) => data.name);

  try {
    const order = new Orders({
      userId: userId || "135642653226",
      productId: productsId,
      addressId: addressId || "235611234555",
      quantity,
      productName,
      invoiceFileName: "File",
      price: amount,
    });
    const savedOrder = await order.save();
    res.status(201).json({ orderId: savedOrder._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Orders.find();
    !orders
      ? res.status(404).json({ message: "Order not found" })
      : res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Orders.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
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
