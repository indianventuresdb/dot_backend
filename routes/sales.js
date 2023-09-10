const express = require("express");
const { getSales, getCategorywiseSales } = require("../controllers/sales");

const router = express.Router();

router.get("/daily", getSales);

router.get("/daily/category", getCategorywiseSales);

module.exports = router;
