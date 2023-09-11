const express = require("express");
const {
  getSales,
  getCategorywiseSales,
  getCategorywiseSalesInParticularTime,
} = require("../controllers/sales");

const router = express.Router();

router.get("/daily", getSales);

router.get("/daily/category", getCategorywiseSales);

router.get(
  "/:startDate/:endDate/category",
  getCategorywiseSalesInParticularTime
);

module.exports = router;
