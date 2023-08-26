const express = require("express");
const {
  addAddress,
  updateAddress,
  getAddress,
} = require("../controllers/address");

const router = express.Router();

router.post("/create", addAddress);
router.put("/update", updateAddress);
router.get("/find", getAddress);
router.delete("/delete/:addressId", getAddress);

module.exports = router;
