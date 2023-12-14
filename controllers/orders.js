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
const { verifyCouponAuthorization } = require("../utils/couponAuth.js");
const { CouponCode } = require("../models/couponCode.js");
const {
  verifySpecialCouponAuthorization,
} = require("../utils/verifySpecialCouponAuthorization.js");
const { SpecialCouponCode } = require("../models/specialCouponCode.js");

// Create a new order
exports.createOrder = async (req, res) => {
  const products = req.body.items;
  const userId = req.body.userId;
  const addressId = req.body.addressId;
  const paymentMode = req.body.paymentMode;
  const couponCode = req.body.couponCode;

  let discountPercentage = 0,
    coupon = null;
  if (couponCode) {
    const verified = await verifyCouponAuthorization(userId, couponCode);
    if (!verified) {
      const verifySpecial = await verifySpecialCouponAuthorization(
        userId,
        couponCode
      );
      if (verifySpecial) discountPercentage = verifySpecial;
      else
        return res
          .status(403)
          .json({ message: "Not Authorized to use this coupon code" });
    } else {
      coupon = await CouponCode.findOne({ code: couponCode });
      if (!coupon) return res.status(404).json({ message: "Coupon not found" });
      discountPercentage = coupon.discountPercentage;
    }
  }

  let price = 0,
    cost = 0,
    gst = 0,
    discount = 0,
    isReturnable = true,
    isCancelable = true;
  try {
    let arr = await calculateAmount(products, discountPercentage);
    price = arr[0];
    cost = arr[3];
    gst = arr[4];
    if (cost < 3000) price = parseFloat(price) + 150;
    isReturnable = arr[1];
    isCancelable = arr[2];
    discount = arr[5];
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ success: false, message: "Failed to calculate price" });
  }

  console.log(price, cost, gst, discount);
  try {
    if (!coupon && discount != 0) {
      const specialCoupon = await SpecialCouponCode.findOne({
        code: couponCode,
      });
      if (specialCoupon && price >= specialCoupon.minPrice) {
        specialCoupon.used.push(userId);
        await specialCoupon.save();
      } else {
        return res.status(404).json({
          success: false,
          message: `Price less than expected ${price}`,
        });
      }
    }
  } catch (error) {
    return res.status(404).json({ success: false, message: "Server Error" });
  }

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
      price: price,
      productImage,
      paymentMode,
      isReturnable,
      isCancelable,
      acutalPrice: cost,
      gst,
      discount,
      order_placed: new Date(),
      couponCodeUsed: couponCode,
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

      if (paymentMode == "Cash On Delivery") {
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
    }

    if (paymentMode == "Cash On Delivery") {
      const dailyKey = generateDailyKey();
      const dailySales = await Sales.findOne({ dateKey: dailyKey });

      if (!dailySales) {
        await Sales.create({
          dateKey: dailyKey,
          sales: cost - discount,
          category: categoryMap,
          gst: gst,
        });
      } else {
        const sales = dailySales.sales + parseFloat(cost);
        const dailygst = dailySales.gst + parseFloat(gst);
        dailySales.sales = sales;
        dailySales.gst = dailygst;
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
    if (couponCode) {
      const usedCoupon = {
        couponName: couponCode,
        usageTimestamp: new Date().toISOString(),
      };
      user.usedCoupon.push(usedCoupon);
      const couponIndex = user.activeCouponCode.indexOf(couponCode);
      if (couponIndex !== -1) {
        user.activeCouponCode.splice(couponIndex, 1);
      }
    }
    user.orders.push(order);
    await user.save({ session: sess });
    await sess.commitTransaction();
    if (coupon) {
      coupon.used = coupon.used + 1;
      await coupon.save();
    }
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

exports.getPendingOrders = async (req, res) => {
  try {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);
    const pendingOrders = await Orders.find({
      $or: [
        { delivered: { $exists: false } },
        { delivered: { $lt: thirtyDaysAgo } },
      ],
    }).populate("userId");
    return res.status(200).json(pendingOrders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.orderReadyToDispatch = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Orders.findByIdAndUpdate(orderId, {
      status: "Ready To Dispatch",
      packed: new Date(),
    });
    if (!order) {
      return res.status(404).json({ message: "Order Not Found" });
    }
    res.status(201).json({ message: "Order Ready To Dispatch" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.orderDispatched = async (req, res) => {
  const { orderId } = req.params;
  const { awb } = req.body;

  try {
    const order = await Orders.findByIdAndUpdate(orderId, {
      status: "Dispatched",
      shipped: new Date(),
      awb: awb,
    });
    if (!order) {
      return res.status(404).json({ message: "Order Not Found" });
    }
    res.status(201).json({ message: "Order Dispatched" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.orderDelivered = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Orders.findByIdAndUpdate(orderId, {
      status: "Delivered",
      delivered: new Date(),
    });
    if (!order) {
      return res.status(404).json({ message: "Order Not Found" });
    }
    res.status(201).json({ message: "Order Delivered" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    await Orders.findByIdAndDelete(orderId);
    res
      .status(200)
      .json({ message: `Order #${orderId} Deleted Successfully.` });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};