const express = require("express");

const { checkOut, verifyPayment, getKey } = require("../controllers/payment");

const router = express.Router();

router.post("/checkout", checkOut);
router.post("/verifyPayment", verifyPayment);
router.get("/getKey", getKey);

module.exports = router;
