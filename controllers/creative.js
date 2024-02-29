const { Creative } = require("../models/creatives");
const fs = require("fs/promises");

const addCreative = async (req, res) => {
  try {
    if (req.file) {
      await Creative.create({ path: req.file.path, type: req.body.type });
      res.status(201).json({ message: "Image Added Successfully" });
    } else {
      res.status(404).json({ message: "No image found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteCreative = async (req, res) => {
  try {
    const { id } = req.params;
    const creative = await Creative.findById(id);
    if (!creative) res.status(404).json({ message: "No image found" });

    await fs.unlink(creative.path);

    await Creative.findByIdAndDelete(id);

    res.status(204).json({ message: "Creative deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCreatives = async (req, res) => {
  try {
    const { type } = req.params;
    const creative = await Creative.find({ type });
    res.status(200).json({ creatives: creative });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addCreative, deleteCreative, getCreatives };
