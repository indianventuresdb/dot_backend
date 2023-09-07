const { categorySchema } = require("../models/category");

const getCategory = async (req, res) => {
  try {
    const category = await categorySchema.find();

    if (!category) {
      res.status(300).json({ message: "Categories not found" });
    }
    res
      .status(200)
      .json({ success: true, category: category.map((item) => item.category) });
  } catch {
    return res.status(500).json({ message: "Internal server error." });
  }
};

const addCategory = async (req, res) => {
  const category = req.body.category;
  try {
    const cat = await categorySchema.create({ category });
    cat
      ? res.status(200).json({ success: true, category: cat })
      : res.status(400).json({ success: false });
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false });
  }
};

module.exports = { addCategory, getCategory };
