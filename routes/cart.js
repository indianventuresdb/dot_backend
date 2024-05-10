const express = require("express");
const {
  getAllItems,
  add_To_Cart,
  deleteFromCart,
  decreseItem,
  deleteCartDataByUserId,
} = require("../controllers/cart");

const router = express.Router();

router.get("/all-items/:userId", getAllItems);
router.post("/add-item", add_To_Cart);
router.put("/decreseItem", decreseItem);
router.delete("/delete/:userId/:productId", deleteFromCart);
router.delete("/delete-all/:userId", deleteCartDataByUserId);

module.exports = router;
