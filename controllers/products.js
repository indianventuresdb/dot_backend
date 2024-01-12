const fs = require("fs");
const { Products } = require("../models/products.js");
const { generateSlug } = require("../utils/slugGenerator.js");
const conversion = require("../config/conversionApi");
const generateRandomString = require("../utils/generateRandomString.js");
const {
  getClientIpAddress,
  getClientUserAgent,
} = require("../utils/conversionapi.js");
const generateSHA256Hash = require("../utils/generateSHA256Hash.js");

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
  let slug;
  try {
    const existingSlugs = await Products.distinct("slug");
    slug = generateSlug(productName, existingSlugs);
  } catch (error) {}
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

// serach products
const searchProductsWithQuery = async (req, res) => {
  const { search, order, page = 1, pageSize = 10, email, name } = req.query;
  const skip = (page - 1) * pageSize;

  try {
    const products = await Products.find({
      $or: [
        { productName: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ],
    })
      .sort({ offeredPrice: order === "ascending" ? 1 : -1 })
      .skip(skip)
      .limit(Number(pageSize));

    if (!products || products.length === 0) {
      return res.status(200).json({ products: [], totalPages: 0 });
    }

    // Assuming you want to calculate total pages based on total products count
    const totalProductsCount = await Products.countDocuments({
      $or: [
        { productName: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ],
    });
    const totalPages = Math.ceil(totalProductsCount / pageSize);

    const ip = getClientIpAddress(req);
    const apiVersion = process.version;

    const location = await fetch(`https://ipinfo.io/${ip}/json`);
    const locationData = await location.json();

    const response = await fetch(
      `https://graph.facebook.com/${conversion.apiVersion}/${conversion.pixelId}/events?access_token=${conversion.token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [
            {
              event_name: "Search",
              event_time: new Date().getTime(),
              action_source: "website",
              event_id: generateRandomString(12),
              success: true,
              content_category: search,
              search_string: search,
              event_source_url: "https://www.augse.in/" + search,
              content_name: "Search Products",
              user_data: {
                em: [
                  generateSHA256Hash(email?.toLowerCase()?.replace(/\s/g, "")),
                ],
                fn: [
                  generateSHA256Hash(name?.toLowerCase()?.replace(/\s/g, "")),
                ],
                ct: [
                  generateSHA256Hash(
                    locationData?.city?.toLowerCase()?.replace(/\s/g, "")
                  ),
                ],
                st: [
                  generateSHA256Hash(
                    locationData?.region?.toLowerCase()?.replace(/\s/g, "")
                  ),
                ],
                zp: [
                  generateSHA256Hash(
                    locationData?.postal?.toLowerCase()?.replace(/\s/g, "")
                  ),
                ],
                country: [
                  generateSHA256Hash(
                    locationData?.country?.toLowerCase()?.replace(/\s/g, "")
                  ),
                ],
                client_ip_address: ip,
                client_user_agent: getClientUserAgent(req),
              },
            },
          ],
        }),
      }
    );

    console.log(await response.json());

    res.status(200).json({ products, totalPages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const categoryFilter = async (req, res) => {
  try {
    const { categories } = req.query;

    if (!categories) {
      return res
        .status(400)
        .json({ error: "Categories parameter is required." });
    }

    // Split the categories string into an array
    const categoryArray = categories.split(",");

    // Initialize an array to store the results for each category
    const results = [];

    // Loop through each category and handle pagination
    for (let i = 0; i < categoryArray.length; i++) {
      const category = categoryArray[i];
      const pageKey = `page${i + 1}`;
      const pageSizeKey = `pageSize${i + 1}`;

      const page = parseInt(req.query[pageKey]) || 1;
      const pageSize = parseInt(req.query[pageSizeKey]) || 10; // Default pageSize is 10

      // Query the database based on the category, page, and pageSize
      const products = await Products.find({ category })
        .collation({ locale: "en", strength: 2 }) // Case-insensitive
        .sort({ category: 1, offeredPrice: 1 }) // Sort by category and then by offeredPrice
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      // Add the results to the array
      results.push({ category, page, pageSize, products });
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addProducts,
  hideProducts,
  showProducts,
  addImage,
  categoryFilter,
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
  searchProductsWithQuery,
};
