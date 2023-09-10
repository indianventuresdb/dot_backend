const { Sales } = require("../models/sales");
const generateDailyKey = require("../utils/dailyKey");

const getSales = async (req, res) => {
  try {
    const dailyKey = generateDailyKey();
    const sales = await Sales.findOne({ dateKey: dailyKey });

    if (sales) res.status(200).json(sales.sales);
    else res.status(200).json(0);
  } catch (error) {
    res.status(404).json({ message: "Failed to find" });
  }
};

const getCategorywiseSales = async (req, res) => {
  try {
    const dailyKey = generateDailyKey();
    const sales = await Sales.findOne({ dateKey: dailyKey });

    if (sales) {
      res.status(200).json({ sales: sales.category });
    } else {
      res.status(200).json({ message: "No sales found for today" });
    }
  } catch (error) {
    res.status(404).json({ message: "Failed to find" });
  }
};

module.exports = { getSales, getCategorywiseSales };
