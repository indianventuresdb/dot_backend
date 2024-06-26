const express = require("express");
const { addData, getData } = require("../controllers/postTrackerController");

const router = express.Router();

router.post("/postrecived", addData);
router.get("/postsent", getData);

module.exports = router;
