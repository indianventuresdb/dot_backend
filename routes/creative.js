const express = require("express");
const router = express.Router();

const {
  addCreative,
  deleteCreative,
  getCreatives,
} = require("../controllers/creative");
const { isAuthenticated } = require("../middlewares/auth");
const { taskTracking } = require("../middlewares/taskTracking");

router.get("/:type", getCreatives);

router.post("/", isAuthenticated, taskTracking, addCreative);

router.delete("/:id", isAuthenticated, taskTracking, deleteCreative);

module.exports = router;
