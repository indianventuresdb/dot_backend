const express = require("express");
const {
  getAllItems,
  add_To_Cart,
  increaseItem,
  decreseItem,
} = require("../controllers/cart");

const router = express.Router();

router.get("/all-items", getAllItems);
router.post("/add-item", add_To_Cart);
router.put("/incr", increaseItem);
router.put("/dcr", decreseItem);

module.exports = router;
