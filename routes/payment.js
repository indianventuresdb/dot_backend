const express = require("express");

const { checkOut } = require("../controllers/payment");

const router = express.Router();

router.post("/checkout", checkOut);

module.exports = router;
