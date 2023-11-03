const express = require("express");
const router = express.Router();

const {
  getKey,
  checkPincodeService,
  placeDispatch,
} = require("../controllers/shipping");

router.get("/key", getKey);
router.get("/pincode_services", checkPincodeService);

router.post("/dispatch/forward", placeDispatch);

module.exports = router;
