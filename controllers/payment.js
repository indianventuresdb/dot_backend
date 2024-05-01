const Razorpay = require("razorpay");
const crypto = require("crypto");
const { Orders } = require("../models/orders.js");
const { default: mongoose } = require("mongoose");
const { Products } = require("../models/products.js");
const generateDailyKey = require("../utils/dailyKey.js");
const { Sales } = require("../models/sales.js");
const data = require("../config/phonepay.js");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { generateUniqueString } = require("../utils/generateTransactionId.js");

exports.checkOut = async (req, res) => {
  const { orderId } = req.body;

  try {
    const orderData = await Orders.findById(orderId).populate("addressId");
    const amount = orderData.price;
    const transactionId = generateUniqueString();
    const options = {
      merchantId: data.merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: orderData.userId,
      amount: amount * 100,
      redirectUrl: `${process.env.BACKEND}/api/v1/payment/verifyPayment/${orderId}`,
      redirectMode: "POST",
      callbackUrl: `${process.env.BACKEND}/api/v1/payment/verifyPayment/${orderId}`,
      mobileNumber: orderData.addressId.phone,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    await Orders.findByIdAndUpdate(orderId, {
      transactionId: transactionId,
    });

    const saltKey = data.salt;
    const jsonString = JSON.stringify(options);
    const buffer = Buffer.from(jsonString, "utf-8");
    const base64Encoded = buffer.toString("base64");
    const apiEndpoint = "/pg/v1/pay";
    const suffix = "###1";

    const hashInput = base64Encoded + apiEndpoint + saltKey;
    const hash = crypto.createHash("sha256").update(hashInput).digest("hex");
    const checkSum = hash + suffix;

    const option = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checkSum,
      },
      body: JSON.stringify({ request: base64Encoded }),
    };

    console.log(transactionId);

    const response = await fetch(
      "https://api.phonepe.com/apis/hermes/pg/v1/pay",
      option
    );
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
    const responseData = await response.json();
    res.status(200).json({
      redirectTo: responseData.data.instrumentResponse.redirectInfo.url,
    });
  } catch (error) {
    console.log(error);
    res.redirect(process.env.FRONTEND + `/unsuccess?orderId=${orderId}`);
  }
};

exports.verifyPayment = async (req, res) => {
  const { orderId } = req.params;
  const { code, transactionId, providerReferenceId } = req.body;

  let sess;
  if (code === "PAYMENT_SUCCESS") {
    try {
      const order = await Orders.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.transactionId != transactionId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      order.providerReferenceId = providerReferenceId;
      order.payment_successful = true;
      order.order_placed = new Date();

      await order.save();

      const { quantity, acutalPrice, gst, discount, invoiceFileName } = order;
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
          shipping: 0,
        });
      } else {
        const sales = dailySales.sales + parseFloat(cost);
        const dailygst = dailySales.gst + parseFloat(gst);
        // const dailyShipping = dailySales.shipping + (cost < 3000) ? 150 : 0;
        dailySales.sales = sales;
        dailySales.gst = dailygst;
        dailySales.shipping = 0;
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

      const orderDetail = await Orders.findById(orderId)
        .populate("addressId")
        .populate("userId");
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.USER_E_MAIL,
          pass: process.env.USER_PASS,
        },
      });

      const filePath = path.join(__dirname, "../", invoiceFileName);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          return res.status(500).json({ message: "Error reading file" });
        }

        const mailOptions = {
          from: process.env.USER_E_MAIL,
          to: orderDetail.addressId.email,
          subject: "Invoice",
          text: "Thank You for Shopping with Augse. Your Order is placed successfully & will be delivered to you within 5 to 8 working days. To track your order status. click here: https://www.augse.in/users/Orders",
          attachments: [
            {
              filename: invoiceFileName,
              content: data,
              encoding: "base64",
            },
          ],
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });

        const mailOptions2 = {
          from: process.env.USER_E_MAIL,
          to: process.env.SELLER_MAIL,
          subject: `New Order Received - ${orderId}`,
          text: `Dear Augse,

          We're excited to inform you that a new order has been received from a customer on your website. Here are the details:

          Customer Name: ${orderDetail.userId.name}
          Phone Number: ${orderDetail.userId.phone}
          Email Address: ${orderDetail.userId.email}
          Order Number: ${orderId}
          Order Date: ${new Date()}
          Order Detail: https://admin.augse.in/admin/track/${orderId}
          Please take the necessary steps to process this order promptly. If you require any additional information, feel free to contact the customer using the provided details.

          Thank you for your attention to this matter.

          Best regards,
          Augse Webserver`,
        };

        transporter.sendMail(mailOptions2, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      });
    } catch (error) {
      await sess.abortTransaction();
      console.log(error);
      return res.status(500).json({ error: error.message });
    }

    res.redirect(
      process.env.FRONTEND + `/success?tranactionId=${transactionId}`
    );
  } else {
    res.redirect(process.env.FRONTEND + `/unsuccess?orderId=${orderId}`);
  }
};

exports.getKey = (req, res) => {
  return res.status(200).json({ key: "rzp_test_ONvCLFgJgnsaYT" });
};
