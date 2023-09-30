const express = require("express");
const {
  getSales,
  getCategorywiseSales,
  getCategorywiseSalesInParticularTime,
  monthlySales,
  getSalesByDateRange,
} = require("../controllers/sales");

const router = express.Router();

router.get("/daily", getSales);

router.get("/daily/category", getCategorywiseSales);

router.get(
  "/:startDate/:endDate/category",
  getCategorywiseSalesInParticularTime
);

router.get("/monthlySales/:year", monthlySales);

router.get("/:startDate/:endDate/sales", getSalesByDateRange);

module.exports = router;
