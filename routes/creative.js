const express = require("express");
const router = express.Router();

const {
  addCreative,
  deleteCreative,
  getCreatives,
} = require("../controllers/creative");

router.get("/:type", getCreatives);

router.post("/", addCreative);

router.delete("/:id", deleteCreative);

module.exports = router;
