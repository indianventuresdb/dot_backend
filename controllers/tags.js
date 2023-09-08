const { tagsSchema } = require("../models/tags.js");

const getTags = async (req, res) => {
  try {
    const tags = await tagsSchema.find();

    if (!tags) {
      res.status(300).json({ message: "Tgas not found" });
    }
    res
      .status(200)
      .json({ success: true, tags: tags.map((item) => item.tags) });
  } catch {
    return res.status(500).json({ message: "Internal server error." });
  }
};

const addTags = async (req, res) => {
  const tags = req.body.data;
  try {
    const tag = await tagsSchema.create({ tags });
    tag
      ? res.status(200).json({ success: true, tag })
      : res.status(400).json({ success: false });
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false });
  }
};

module.exports = { addTags, getTags };
