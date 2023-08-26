const express = require("express");
const { createOrder } = require("../../controllers/Shiprocket/orders");

const router = express.Router();

router.post("/createOrder/:orderId", createOrder);

module.exports = router;
