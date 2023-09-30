const mongoose = require("mongoose");
const { Orders } = require("../models/orders.js");
const { Products } = require("../models/products.js");
const { Users } = require("../models/users.js");
const { Sales } = require("../models/sales.js");
const { Address } = require("../models/address.js");
const path = require("path");
const fs = require("fs");
const generateInvoice = require("../utils/generateInvoice.js");
const generateDailyKey = require("../utils/dailyKey.js");
const calculateAmount = require("../utils/calculateAmount");

// Create a new order
exports.createOrder = async (req, res) => {
  const products = req.body.items;
  const userId = req.body.userId;
  const addressId = req.body.addressId;
  const paymentMode = req.body.paymentMode;

  let price = 0,
    cost = 0,
    gst = 0,
    isReturnable = true,
    isCancelable = true;
  try {
    let arr = await calculateAmount(products);
    price = arr[0];
    cost = arr[3];
    gst = arr[4];
    if (price < 3000) price = parseFloat(price) + 150;
    isReturnable = arr[1];
    isCancelable = arr[2];
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "Failed to calculate price" });
  }

  console.log(price, cost, gst);

  const productsId = products.map((data) => data._id);
  const productCost = products.map((data) => data.price);
  const quantity = products.map((data) => data.quantity);
  const productName = products.map((data) => data.name);
  const productImage = products.map((data) => data.image);
  const categoryMap = new Map();

  let user;
  try {
    user = await Users.findById(userId);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ success: false, message: "No user found." });
  }

  if (!user) {
    return res.status(404).json({ success: false, message: "No user found." });
  }

  let sess;

  try {
    const order = new Orders({
      userId,
      productId: productsId,
      productCost,
      addressId,
      quantity,
      productName,
      invoiceFileName: "File",
      price,
      productImage,
      paymentMode,
      isReturnable,
      isCancelable,
      order_placed: new Date(),
    });
    sess = await mongoose.startSession();
    sess.startTransaction();

    for (let i = 0; i < products.length; i++) {
      const productId = products[i]._id;
      const productQuantity = products[i].quantity;

      const product = await Products.findById(productId).session(sess);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found.`);
      }

      if (product.quantity < productQuantity) {
        throw new Error(
          `Insufficient stock for product ${product.productName}.`
        );
      }
      const categoryName = product.category;
      if (categoryMap.has(categoryName)) {
        const currentQuantity = categoryMap.get(categoryName);
        categoryMap.set(categoryName, currentQuantity + productQuantity);
      } else {
        categoryMap.set(categoryName, productQuantity);
      }

      product.quantity = product.quantity - productQuantity;
      product.sold = product.sold + productQuantity;
      await product.save();
    }

    const dailyKey = generateDailyKey();
    const dailySales = await Sales.findOne({ dateKey: dailyKey });

    if (!dailySales) {
      await Sales.create({
        dateKey: dailyKey,
        sales: cost,
        category: categoryMap,
        gst: gst,
      });
    } else {
      const sales = dailySales.sales + parseFloat(cost);
      const gst = dailySales.gst + parseFloat(gst);
      dailySales.sales = sales;
      dailySales.gst = gst;
      for (const [categoryName, quantity] of categoryMap.entries()) {
        if (dailySales.category.has(categoryName)) {
          dailySales.category.set(
            categoryName,
            dailySales.category.get(categoryName) + quantity
          );
        } else {
          dailySales.category.set(categoryName, quantity);
        }
      }
      await dailySales.save();
    }

    const address = await Address.findById(addressId);

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const folderName = `${year}-${month}`;
    const folderPath = path.join("invoices", folderName);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    const fullOutputPath = path.join(
      folderPath,
      `invoice_${Math.random()}.pdf`
    );

    console.log(order._id);
    generateInvoice(order._id, address, products, fullOutputPath, gst)
      .then(() => {
        console.log("Invoice generated successfully.");
      })
      .catch((error) => {
        console.error("Error generating invoice:", error);
      });

    order.invoiceFileName = fullOutputPath;
    const savedOrder = await order.save({ session: sess });
    user.orders.push(order);
    await user.save({ session: sess });
    await sess.commitTransaction();

    res.status(201).json({ orderId: savedOrder._id });
  } catch (error) {
    console.log(error);
    await sess.abortTransaction();
    res.status(500).json({ error: error.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Orders.find().populate("userId");
    !orders
      ? res.status(404).json({ message: "Order not found" })
      : res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  const id = req.params.id;
  try {
    const order = await Orders.findById(id)
      .populate("addressId")
      .populate("userId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await Users.findById(userId).populate("orders");
    if (!user) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ orders: user.orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Orders.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an order
exports.cancelOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Orders.findById(id);
    if (!order.isCancelable || order.delivered) {
      return res.status(404).json({ message: "Order is not returnable" });
    }
    order.cancelled = true;
    order.status = "Order Cancelled";
    await order.save();
    res.status(200).json({ message: "Order Canceled" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.returnOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Orders.findById(id);
    if (!order.isReturnable || !order.delivered) {
      return res.status(404).json({ message: "Order is not returnable" });
    }
    order.isReturned = true;
    order.status = "Order Returned";
    await order.save();
    res.status(200).json({ message: "Order Returned" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.ordersForSeller = async (req, res) => {
  try {
    const orders = await Orders.find();
    const ordersWithAllDetails = orders.map(async (item) => {
      const product = await Products.findById(item.productId);
      const username = await Users.findById(item.userId);
      item.productId = product;
      item.userId = username;
      return item;
    });
    res.status(200).json(ordersWithAllDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.ordersNumbers = async (req, res) => {
  try {
    const documentCount = await Orders.count({});
    res.status(200).json({ numbers: documentCount });
  } catch (error) {
    res.status(300).json({ message: "fail to count orders" });
  }
};
