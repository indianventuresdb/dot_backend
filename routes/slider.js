const express = require("express");
const { slider } = require("../controllers/slider");


const router = express.Router();

router.get("/slider/files", slider);

module.exports = router;