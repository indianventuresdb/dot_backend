const express = require("express");
const router = express.Router();

const {
  getKey,
  checkPincodeService,
  getWayBill,
  placeDispatch,
  trackShipmentByWayBill,
  generateShipmentLabel,
  pickupRequest,
  manageNDRPackages,
  NDRStatus,
} = require("../controllers/shipping");

router.get("/key", getKey);
router.get("/pincode_services", checkPincodeService);
router.get("/waybill", getWayBill);
router.get("/track", trackShipmentByWayBill);
router.get("/shipmentLabel", generateShipmentLabel);
router.get("/ndr_api", NDRStatus);

router.post("/dispatch/forward", placeDispatch);
router.post("/pickup", pickupRequest);
router.post("/ndr_api", manageNDRPackages);

module.exports = router;
