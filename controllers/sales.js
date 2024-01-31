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

const monthlySales = async (req, res) => {
  const year = parseInt(req.params.year);
  try {
    const result = await Sales.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $gte: [{ $toDate: "$dateKey" }, new Date(`${year}-04-01`)] },
              {
                $lt: [
                  { $toDate: "$dateKey" },
                  new Date(`${parseInt(year) + 1}-04-01`),
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: { $month: { $toDate: "$dateKey" } },
          totalSales: { $sum: "$sales" },
        },
      },
    ]);

    const monthlySales = Array(12).fill(0);

    result.forEach((item) => {
      const month = item._id <= 3 ? item._id + 8 : item._id - 4;
      monthlySales[month] = item.totalSales;
    });

    res.status(200).json({ monthlySales });
  } catch (error) {
    console.error("Error finding yearly sales:", error);
    res.status(404).json({ message: error });
  }
};

const getSalesByDateRange = async (req, res) => {
  try {
    const { range } = req.params;
    const currentDate = new Date();
    let startDate;

    switch (range) {
      case "today":
        startDate = new Date(currentDate);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "last7days":
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 7);
        break;
      case "last14days":
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 14);
        break;
      case "last1month":
        startDate = new Date(currentDate);
        startDate.setMonth(currentDate.getMonth() - 1);
        break;
      case "last4months":
        startDate = new Date(currentDate);
        startDate.setMonth(currentDate.getMonth() - 4);
        break;
      case "last1year":
        startDate = new Date(currentDate.getFullYear(), 3, 1);
        break;
      default:
        res.status(400).json({ message: "Invalid date range option" });
        return;
    }

    const result = await Sales.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $gte: [{ $toDate: "$dateKey" }, startDate] },
              { $lte: [{ $toDate: "$dateKey" }, currentDate] },
            ],
          },
        },
      },
      {
        $group: {
          _id: "s1",
          totalSales: { $sum: "$sales" },
          totalGst: { $sum: "$gst" },
          totalShipping: { $sum: "$shipping" },
        },
      },
    ]);

    const totalSales = result.length > 0 ? result[0].totalSales : 0;
    const totalGst = result.length > 0 ? result[0].totalGst : 0;
    const totalShipping = result.length > 0 ? result[0].totalShipping : 0;

    res.status(200).json({ totalSales, totalGst, totalShipping });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  getSales,
  getCategorywiseSales,
  getCategorywiseSalesInParticularTime,
  monthlySales,
  getSalesByDateRange,
};
