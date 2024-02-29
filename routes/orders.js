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
  orderReadyToDispatch,
  orderDispatched,
  orderDelivered,
  deleteOrder,
} = require("../controllers/orders.js");
const { taskTracking } = require("../middlewares/taskTracking.js");

const router = express.Router();

router.post("/orders", createOrder);

router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.get("/orders/user/:userId", getOrderByUserId);
router.get("/pending/orders", getPendingOrders);
router.get("/count", ordersNumbers);

router.put("/orders/readyToDispatch/:orderId", orderReadyToDispatch);
router.put("/orders/dispatched/:orderId", orderDispatched);
router.put("/orders/delivered/:orderId", orderDelivered);
router.put("/orders/:id", updateOrder);
router.put("/orders/return/:id", returnOrder);
router.put("/orders/cancel/:id", cancelOrder);

router.delete("/orders/:orderId", isAuthenticated, taskTracking, deleteOrder);

module.exports = router;
