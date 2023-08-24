const express = require("express");
const { addTags } = "../controllers/tags.js";

const router = express.Router();

router.get("/tags", addTags);

module.exports = router;
