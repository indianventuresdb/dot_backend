const express = require("express");
const { downloadImageController } = require("../controllers/files.js");

const router = express.Router();

router.get("/uploads/:fileName", downloadImageController);

module.exports = router;
