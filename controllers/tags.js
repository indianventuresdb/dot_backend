const { tagsSchema } = require("../models/tags.js");

const getTags = async (req, res) => {
  try {
    const tags = await tagsSchema.find();

    if (!tags || tags.length === 0) {
      res.status(404).json({ success: false, message: "Tags not found" });
    } else {
      res.status(200).json({ success: true, tags: tags.map((item) => item.tags) });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const addTags = async (req, res) => {
  const tags = req.body.data;
  
  try {
    const tag = await tagsSchema.create({ tags });
    if (tag) {
      res.status(201).json({ success: true, tag });
    } else {
      res.status(400).json({ success: false, message: "Bad Request" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { addTags, getTags };
