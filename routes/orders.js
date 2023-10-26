const express = require("express");
const { isAuthenticated } = require("../middlewares/auth.js");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  cancelOrder,
  returnOrder,
  getOrderByUserId,
  ordersNumbers,
  getPendingOrders,
} = require("../controllers/orders.js");

const router = express.Router();

router.post("/orders", createOrder);
router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.get("/orders/user/:userId", getOrderByUserId);
router.get("/pending/orders", getPendingOrders);
router.get("/count", ordersNumbers);
router.put("/orders/:id", updateOrder);
router.put("/orders/return/:id", returnOrder);
router.put("/orders/cancel/:id", cancelOrder);
module.exports = router;
