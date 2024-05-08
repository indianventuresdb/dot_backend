const express = require("express");
const {
  getAllItems,
  add_To_Cart,
  deleteFromCart,
  decreseItem,
} = require("../controllers/cart");

const router = express.Router();

router.get("/all-items/:userId", getAllItems);
router.post("/add-item", add_To_Cart);
router.put("/decreseItem", decreseItem);
router.delete("/delete/:cartItemId", deleteFromCart);

module.exports = router;
