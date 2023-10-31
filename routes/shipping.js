const express = require("express");
const router = express.Router();

const { getKey, checkPincodeService } = require("../controllers/shipping");

router.get("/key", getKey);
router.get("/pincode_services", checkPincodeService);

module.exports = router;
