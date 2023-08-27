const express = require("express");
const {
  addAddress,
  updateAddress,
  getAddress,
  addressbyId,
  deleteAddress,
} = require("../controllers/address");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.post("/create", isAuthenticated, addAddress);
router.put("/update/:addressId", updateAddress);
router.get("/find", isAuthenticated, getAddress);
router.get("/addressbyId/:addressId", isAuthenticated, addressbyId);
router.delete("/delete/:addressId", deleteAddress);

module.exports = router;
