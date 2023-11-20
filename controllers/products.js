const fs = require("fs");
const { Products } = require("../models/products.js");
const { generateSlug } = require("../utils/slugGenerator.js");

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
    hsn,
    keywords,
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
  let slug;
  try {
    const existingSlugs = await Products.distinct("slug");
    slug = generateSlug(productName, existingSlugs);
  } catch (error) {}

  const tagArray = tags.split(",");

  try {
    const product = await Products.create({
      productName,
      shortDescription,
      size,
      tags: tagArray,
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
      hsn,
      keywords,
      detailedDescription,
      slug,
      mainImage,
      otherImages: images,
    });
    if (!product) {
      return res.status(400).json({ message: "Product add failed..." });
    }
    return res.status(200).json({ message: "Product added successfully." });
  } catch (error) {
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
const hideProducts = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Products.findByIdAndUpdate(productId, {
      visibility: false,
    });

    !product
      ? res.status(300).json({ message: "Product Can not hide." })
      : res.status(200).json({ message: "Product successfully hidden" });
  } catch (error) {
    res.status(300).json({ message: "Product Can not deleted." });
  }
};

const showProducts = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Products.findByIdAndUpdate(productId, {
      visibility: true,
    });

    !product
      ? res.status(300).json({ message: "Product Can not deleted." })
      : res.status(200).json({ message: "Product successfully" });
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
    hsn,
    keywords,
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
  const slug = generateSlug(productName);
  const tagArray = tags.split(",");

  try {
    const product = await Products.findByIdAndUpdate(productId, {
      productName,
      shortDescription,
      size,
      tags: tagArray,
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
      hsn,
      keywords,
      slug,
      detailedDescription,
      mainImage,
      otherImages: images,
    });
    // Turnory Oprator
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
    const products = await Products.find({});
    !products
      ? res.status(200).json({ products: [] })
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
      ? res.status(200).json({ products: [] })
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

const getOneProductDetail = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found error 404" });
    }
    product.viewCount = product.viewCount + 1;
    await product.save();

    const sanitizedProduct = {
      ...product.toObject(),
      viewCount: undefined,
      sold: undefined,
      quantity: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      __v: undefined,
    };

    res.status(200).json(sanitizedProduct);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getOneProductDetailBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await Products.findOne({ slug: slug });
    if (!product) {
      return res.status(404).json({ message: "Product not found error 404" });
    }
    product.viewCount = product.viewCount + 1;
    await product.save();

    const sanitizedProduct = {
      ...product.toObject(),
      viewCount: undefined,
      sold: undefined,
      quantity: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      __v: undefined,
    };

    res.status(200).json(sanitizedProduct);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
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

const productQuantity = async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Products.findById(productId);
    if (!product) return res.status(404).json({ message: "Product Not Found" });
    res.status(200).json({ quantity: product.quantity });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const productOfParticularCategory = async (req, res) => {
  const { categoryName } = req.params;
  try {
    const productCount = await Products.countDocuments({
      category: categoryName,
    });
    res.status(200).json({ count: productCount });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching product count" });
  }
};

module.exports = {
  addProducts,
  hideProducts,
  showProducts,
  addImage,
  updateProducts,
  getProducts,
  searchProducts,
  deleteImage,
  getOneProduct,
  getOneProductDetail,
  getOneProductDetailBySlug,
  productNumbers,
  productOfParticularCategory,
  productQuantity,
};
