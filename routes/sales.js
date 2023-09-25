const express = require("express");
const {
  getSales,
  getCategorywiseSales,
  getCategorywiseSalesInParticularTime,
  monthlySales,
} = require("../controllers/sales");

const router = express.Router();

router.get("/daily", getSales);

router.get("/daily/category", getCategorywiseSales);

router.get(
  "/:startDate/:endDate/category",
  getCategorywiseSalesInParticularTime
);

router.get("/monthlySales/:year", monthlySales);

module.exports = router;
