const express = require("express");
const { addTags, getTags } = require("../controllers/tags.js");

const router = express.Router();

router.get("/tags", getTags);
router.post("/tags", addTags);

module.exports = router;
