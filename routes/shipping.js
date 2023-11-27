const express = require("express");
const router = express.Router();

const {
  getKey,
  checkPincodeService,
  getWayBill,
  placeDispatch,
  trackShipmentByWayBill,
  generateShipmentLabel,
} = require("../controllers/shipping");

router.get("/key", getKey);
router.get("/pincode_services", checkPincodeService);
router.get("/waybill", getWayBill);
router.get("/track", trackShipmentByWayBill);
router.get("/shipmentLabel", generateShipmentLabel);

router.post("/dispatch/forward", placeDispatch);

module.exports = router;
