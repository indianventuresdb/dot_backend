const { tagsSchema } = require("../models/tags");

const addTags = async (req, res) => {
  try {
    const tags = await tagsSchema.find();
    !tags
      ? res.status(300).json({ message: "Images not found" })
      : res.status(200).json(tags);
  } catch (err) {
    const { error } = console;
    error(err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { addTags };
