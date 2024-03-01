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
const { isAuthenticated } = require("../middlewares/auth");
const { taskTracking } = require("../middlewares/taskTracking");

router.get("/key", getKey);
router.get("/pincode_services", checkPincodeService);
router.get("/waybill", getWayBill);
router.get("/track", trackShipmentByWayBill);
router.get("/shipmentLabel", generateShipmentLabel);
router.get("/ndr_status/:upl/:verbose", NDRStatus);

router.post("/dispatch/forward", isAuthenticated, taskTracking, placeDispatch);
router.post("/pickup", pickupRequest);
router.post("/ndr_api", manageNDRPackages);

module.exports = router;
