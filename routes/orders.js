const express = require("express");
const { isAuthenticated } = require("../middlewares/auth.js");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderByUserId,
  ordersNumbers,
} = require("../controllers/orders.js");

const router = express.Router();

// Create a new order
router.post("/orders", createOrder);

// Get all orders
router.get("/orders", getOrders);

// Get a single order by ID
router.get("/orders/:id", getOrderById);

// Get a user order by ID
router.get("/orders/user/:userId", getOrderByUserId);

// Get orders numbers
router.get("/count", ordersNumbers);

// Update an order
router.put("/orders/:id", updateOrder);

// Delete an order
router.delete("/orders/:id", deleteOrder);

module.exports = router;
