const Razorpay = require("razorpay");
const crypto = require("crypto");
const calculateAmount = require("../utils/calculateAmount");
const { Orders } = require("../models/orders.js");

var instance = new Razorpay({
  key_id: "rzp_test_ONvCLFgJgnsaYT",
  key_secret: "obbG2E3S0JZTAItexNYsJEP6",
});

exports.checkOut = async (req, res) => {
  const products = req.body.items;
  const amount = await calculateAmount(products);

  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "surendra.singh.kamboj@hotmail.com",
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
    .createHmac("sha256", "obbG2E3S0JZTAItexNYsJEP6")
    .update(body.toString())
    .digest("hex");

  const isAuthenticated = expectedSignature === razorpay_signature;

  if (isAuthenticated) {
    try {
      const order = await Orders.findByIdAndUpdate(orderId, {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        payment_successful: true,
      });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

    res.redirect(process.env.FRONTEND + `/success`);
  } else {
    res.redirect(process.env.FRONTEND + `/unsuccess`);
  }
};

exports.getKey = (req, res) => {
  return res.status(200).json({ key: "rzp_test_ONvCLFgJgnsaYT" });
};
