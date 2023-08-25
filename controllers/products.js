const fs = require("fs");
const { Products } = require("../models/products.js");

const addProducts = async (req, res) => {
  const {
    productName,
    shortDescription,
    size,
    tags,
    category,
    tax,
    quantity,
    color,
    isCodAllowed,
    isReturnAble,
    isCancelAble,
    mrp,
    offeredPrice,
    detailedDescription,
    mainImage,
    firstImage,
    secondImage,
    thirdImage,
  } = req.body;

  const images = [];
  if (firstImage) images.push(firstImage);
  if (secondImage) images.push(secondImage);
  if (thirdImage) images.push(thirdImage);
  let discount = ((mrp - offeredPrice) / mrp) * 100;

  try {
    const product = await Products.create({
      productName,
      shortDescription,
      size,
      tags,
      category,
      tax,
      quantity,
      color,
      discount,
      isCodAllowed,
      isReturnAble,
      isCancelAble,
      mrp,
      offeredPrice,
      detailedDescription,
      mainImage,
      otherImages: images,
    });
    if (!product) {
      return res.status(400).json({ message: "Product add failed..." });
    }
    return res.status(200).json({ message: "Product added successfully." });
  } catch (error) {
    console.log(error);
    return res
      .status(300)
      .json({ message: "Product add failed, server error..." });
  }
};

const addImage = async (req, res) => {
  if (req.file) {
    res.status(200).json({ path: req.file.path });
  } else {
    res.status(404).json({ message: "No image found" });
  }
};

const deleteImage = async (req, res) => {
  const { path } = req.body;
  fs.unlink(path, (err) => {
    console.log(err);
  });
  res.status(200).json({ status: true });
};

// Remove Product from database
const removeProducts = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Products.findByIdAndDelete(productId);

    if (product) {
      fs.unlink(product.mainImage, (err) => {
        console.log(err);
      });
      for (let i = 0; i < product.otherImages.length; i++) {
        if (!product.otherImages[i]) continue;
        fs.unlink(product.otherImages[i], (err) => {
          console.log(err);
        });
      }
    }
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
    shortDescription,
    size,
    tags,
    category,
    tax,
    quantity,
    color,
    isCodAllowed,
    isReturnAble,
    isCancelAble,
    mrp,
    offeredPrice,
    detailedDescription,
    mainImage,
    firstImage,
    secondImage,
    thirdImage,
  } = req.body;

  const images = [];
  if (firstImage) images.push(firstImage);
  if (secondImage) images.push(secondImage);
  if (thirdImage) images.push(thirdImage);
  let discount = ((mrp - offeredPrice) / mrp) * 100;

  try {
    const product = await Products.findByIdAndUpdate(productId, {
      productName,
      shortDescription,
      size,
      tags,
      category,
      tax,
      quantity,
      color,
      discount,
      isCodAllowed,
      isReturnAble,
      isCancelAble,
      mrp,
      offeredPrice,
      detailedDescription,
      mainImage,
      otherImages: images,
    });
    // Turnory Oprator
    console.log("Inside" + product);
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
  addImage,
  updateProducts,
  getProducts,
  searchProducts,
  deleteImage,
  getOneProduct,
  productNumbers,
};
