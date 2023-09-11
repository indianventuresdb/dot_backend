const { Sales } = require("../models/sales");
const generateDailyKey = require("../utils/dailyKey");
const validateDate = require("../utils/validateDate");

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

    const salesCategoryArray = Array.from(sales.category);

    if (sales) {
      res.status(200).json({ sales: salesCategoryArray });
    } else {
      res.status(200).json({ message: "No sales found for today" });
    }
  } catch (error) {
    res.status(404).json({ message: "Failed to find" });
  }
};

const getCategorywiseSalesInParticularTime = async (req, res) => {
  const minTempDate = req.params.startDate;
  const maxTempDate = req.params.endDate;

  if (!validateDate(minTempDate) || !validateDate(maxTempDate)) {
    return res.status(404).json({ message: "Invalid date format" });
  }

  const minDate = new Date(minTempDate);
  const maxDate = new Date(maxTempDate);

  if (minDate > maxDate) {
    return res.status(400).json({
      message: "Minimum date must be less than or equal to maximum date",
    });
  }

  try {
    let currentDate = minDate;
    const aggregatedCategories = new Map();

    while (currentDate <= maxDate) {
      const dailyKey = currentDate.toISOString().split("T")[0];
      currentDate.setDate(currentDate.getDate() + 1);
      const sales = await Sales.findOne({ dateKey: dailyKey });
      if (sales && sales.category instanceof Map) {
        for (const [category, value] of sales.category) {
          if (aggregatedCategories.has(category)) {
            aggregatedCategories.set(
              category,
              aggregatedCategories.get(category) + value
            );
          } else {
            aggregatedCategories.set(category, value);
          }
        }
      }
    }

    const aggregatedCategoriesArray = Array.from(aggregatedCategories);

    if (aggregatedCategories) {
      res.status(200).json({
        sales: aggregatedCategoriesArray,
        message: `Sales of particular category between ${minTempDate} and ${maxTempDate}.`,
      });
    } else {
      res.status(200).json({
        message: `No sales found between ${minTempDate} and ${maxTempDate}.`,
      });
    }
  } catch (error) {
    res.status(404).json({ message: "Failed to find" });
  }
};

module.exports = {
  getSales,
  getCategorywiseSales,
  getCategorywiseSalesInParticularTime,
};
