const express = require("express");
const { addTags, getTags } = require("../controllers/tags.js");
const { isAuthenticated } = require("../middlewares/auth.js");
const { taskTracking } = require("../middlewares/taskTracking.js");

const router = express.Router();

router.get("/tags", getTags);
router.post("/tags", isAuthenticated, taskTracking, addTags);

module.exports = router;
