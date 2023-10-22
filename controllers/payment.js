const Razorpay = require("razorpay");
const crypto = require("crypto");
const { Orders } = require("../models/orders.js");
const { default: mongoose } = require("mongoose");
const { Products } = require("../models/products.js");
const generateDailyKey = require("../utils/dailyKey.js");
const { Sales } = require("../models/sales.js");
const credentials = require("../config/razorpay.js");

var instance = new Razorpay(credentials);

exports.checkOut = async (req, res) => {
  const { orderId } = req.body;

  try {
    const orderData = await Orders.findById(orderId);
    const amount = orderData.price;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "user@email.com",
    };

    const order = await instance.orders.create(options);
    order ? res.status(200).json({ success: true, order }) : null;
  } catch (error) {
    res.redirect(process.env.FRONTEND + `/unsuccess`);
  }
};

exports.verifyPayment = async (req, res) => {
  const { orderId } = req.params;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", credentials.key_secret)
    .update(body.toString())
    .digest("hex");

  const isAuthenticated = expectedSignature === razorpay_signature;

  let sess;
  if (isAuthenticated) {
    try {
      const order = await Orders.findByIdAndUpdate(orderId, {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        payment_successful: true,
        order_placed: new Date(),
      });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const { quantity, acutalPrice, gst, discount } = order;
      const productIDs = order.productId,
        cost = acutalPrice;

      const categoryMap = new Map();
      sess = await mongoose.startSession();
      sess.startTransaction();

      for (let i = 0; i < productIDs.length; i++) {
        const productId = productIDs[i];
        const productQuantity = quantity[i];

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

      await sess.commitTransaction();
    } catch (error) {
      await sess.abortTransaction();
      console.log(error);
      return res.status(500).json({ error: error.message });
    }

    res.redirect(process.env.FRONTEND + `/success`);
  } else {
    res.redirect(process.env.FRONTEND + `/unsuccess`);
  }
};

exports.getKey = (req, res) => {
  return res.status(200).json({ key: credentials.key });
};
