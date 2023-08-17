const express = require("express");
const { who_i_am } = require("../controllers/who_i_am.js");

const router = express.Router();

router.get("/who_i_am", who_i_am);

module.exports = router;
