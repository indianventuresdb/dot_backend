const express = require("express");
const { addCategory, getCategory } = require("../controllers/category.js");
const { isAuthenticated } = require("../middlewares/auth.js");
const { taskTracking } = require("../middlewares/taskTracking.js");

const router = express.Router();

router.get("/category", getCategory);
router.post("/category", isAuthenticated, taskTracking, addCategory);

module.exports = router;
