const express = require("express");

const { checkOut } = require("../controllers/payment");

const router = express.Router();

router.route("/checkout").post(checkOut);

module.exports = router;
