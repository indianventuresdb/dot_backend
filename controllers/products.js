const { Products } = require("../models/products.js");

const addProducts = async (req, res) => {
  const {
    productName,
    productType,
    shortDescription,
    tags,
    category,
    color,
    hsnCode,
    isCodAllowed,
    isReturnAble,
    isCancelAble,
    mrp,
    offeredPrice,
    mainImage,
    otherImage,
    productVideo,
    DetailedDescription,
    visibility,
  } = req.body;

  let discount = ((mrp - offeredPrice) / mrp) * 100;

  try {
    const product = await Products.create({
      productName,
      productType,
      shortDescription,
      tags,
      category,
      color,
      discount,
      hsnCode,
      isCodAllowed,
      isReturnAble,
      isCancelAble,
      mrp,
      offeredPrice,
      mainImage,
      otherImage,
      productVideo,
      DetailedDescription,
      visibility,
    });
    if (!product) {
      return res.status(400).json({ message: "Product add failed..." });
    }
    return res.status(200).json({ message: "Product added successfully." });
  } catch (error) {
    return res.status(300).json({ message: "Product add failed..." });
  }
};

// Remove Product from database
const removeProducts = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Products.findByIdAndDelete(productId);
    // Turnory operator
    !product
      ? res.status(300).json({ message: "Product Can not deleted." })
      : res.status(200).json({ message: "Product successfully deleted." });
  } catch (error) {
    res.status(300).json({ message: "Product Can not deleted." });
  }
};

// Update Product in Database
const updateProducts = async (req, res) => {
  const { productId } = req.params;
  const {
    productName,
    productType,
    shortDescription,
    tags,
    category,
    color,
    hsnCode,
    isCodAllowed,
    isReturnAble,
    isCancelAble,
    mrp,
    offeredPrice,
    mainImage,
    otherImage,
    productVideo,
    DetailedDescription,
    visibility,
  } = req.body;

  let discount = ((mrp - offeredPrice) / mrp) * 100;

  try {
    const product = await Products.findByIdAndUpdate(productId, {
      productName,
      productType,
      shortDescription,
      tags,
      hsnCode,
      category,
      color,
      discount,
      isCodAllowed,
      isReturnAble,
      isCancelAble,
      mrp,
      offeredPrice,
      mainImage,
      otherImage,
      productVideo,
      DetailedDescription,
      visibility,
    });
    // Turnory Oprator
    console.log(product);
    !product
      ? res.status(300).json({ message: "Product can not updated" })
      : res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(300).json({ message: "Product can not updated" });
  }
};

// get All products from database and send to Browser
const getProducts = async (req, res) => {
  try {
    const products = await Products.find();
    !products
      ? res.status(404).json({ message: "Products not found." })
      : res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: "Products fetching failed." });
  }
};

// serach products
const searchProducts = async (req, res) => {
  const { searchString } = req.params;
  try {
    const products = await Products.find({
      $or: [
        { productName: { $regex: searchString, $options: "i" } },
        { tags: { $regex: searchString, $options: "i" } },
      ],
    });
    !products
      ? res.status(300).json({ message: "Product not found" })
      : res.status(200).json(products);
  } catch (error) {
    return res.status(300).json({ message: "Product not found" });
  }
};

// get one product
const getOneProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Products.findById(productId);
    !product
      ? res.status(404).json({ message: "Product not found erorr 404" })
      : res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: "Product not found erorr 404" });
  }
};

const productNumbers = async (req, res) => {
  try {
    const documentCount = await Products.count({});
    !documentCount
      ? res.status(300).json({ message: "fail to count" })
      : res.status(200).json({ numbers: documentCount });
  } catch (error) {
    res.status(300).json({ message: "fail to count" });
  }
};

module.exports = {
  addProducts,
  removeProducts,
  updateProducts,
  getProducts,
  searchProducts,
  getOneProduct,
  productNumbers,
};
