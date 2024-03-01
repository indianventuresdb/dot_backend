const { categorySchema } = require("../models/category");

const getCategory = async (req, res) => {
  try {
    const categories = await categorySchema.find();

    if (!categories || categories.length === 0) {
      res.status(404).json({ success: false, message: "Categories not found" });
    } else {
      res.status(200).json({ success: true, categories: categories.map((item) => item.category) });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const addCategory = async (req, res) => {
  const category = req.body.data;

  try {
    const newCategory = await categorySchema.create({ category });

    if (newCategory) {
      res.status(201).json({ success: true, category: newCategory });
    } else {
      res.status(400).json({ success: false, message: "Bad Request" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { addCategory, getCategory };
