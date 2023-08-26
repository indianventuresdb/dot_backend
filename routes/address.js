const express = require("express");
const {
  addAddress,
  updateAddress,
  getAddress,
  deleteAddress,
} = require("../controllers/address");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.post("/create", isAuthenticated, addAddress);
router.put("/update/:addressId", updateAddress);
router.get("/find", isAuthenticated, getAddress);
router.delete("/delete/:addressId", deleteAddress);

module.exports = router;
