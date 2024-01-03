const express = require("express");
const {
  addProducts,
  hideProducts,
  showProducts,
  updateProducts,
  getProducts,
  searchProducts,
  getOneProduct,
  getOneProductDetail,
  getOneProductDetailBySlug,
  addImage,
  deleteImage,
  productQuantity,
  productNumbers,
  productOfParticularCategory,
  searchProductsWithQuery,
  categoryFilter,
} = require("../controllers/products.js");

const router = express.Router();

router.post("/add_product", addProducts);
router.put("/hide_product/:productId", hideProducts);
router.put("/show_product/:productId", showProducts);
router.put("/update_product/:productId", updateProducts);
router.post("/addimage", addImage);
router.post("/deleteimage", deleteImage);

// Get Request routes
router.get("/get_all_Products", getProducts);
router.get("/search/:searchString", searchProducts);
router.get("/query", searchProductsWithQuery)
router.get("/category", categoryFilter)
router.get("/product/:productId", getOneProduct);
router.get("/slug/:slug", getOneProductDetailBySlug);
router.get("/product/quantity/:productId", productQuantity);
router.get("/productDetail/:productId", getOneProductDetail);
router.get("/category/:categoryName", productOfParticularCategory);
router.get("/count", productNumbers);

module.exports = router;
