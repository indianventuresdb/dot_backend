import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { isSeller } from "../middlewares/isSeller.js";
import { addProducts, removeProducts, updateProducts, getProducts, searchProducts } from "../controllers/products.js";

const router = express.Router();

router.post("/add_product", isAuthenticated, isSeller, addProducts);
router.delete("/remove_product/:id/:productId", isAuthenticated, isSeller, removeProducts);
router.put("/update_product/:id/:productId", isAuthenticated, isSeller, updateProducts);
router.get("/get_all_Products", getProducts);
router.get("/search", searchProducts);

export default router;