const express = require("express");
const { addCategory, getCategory } = require("../controllers/category.js");

const router = express.Router();

router.get("/category", getCategory);
router.post("/category", addCategory);

module.exports = router;
