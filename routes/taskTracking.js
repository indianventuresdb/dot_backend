const router = require("express").Router();

const { TaskTracking } = require("../models/taskTracking");

router.get("/", async (req, res) => {
  try {
    const tasks = await TaskTracking.find();

    res.status(200).json({ tasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
