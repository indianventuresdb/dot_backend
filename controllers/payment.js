const Razorpay = require("razorpay");
const crypto = require("crypto");
const calculateAmount = require("../utils/calculateAmount");

var instance = new Razorpay({
  key_id: "rzp_test_ONvCLFgJgnsaYT",
  key_secret: "obbG2E3S0JZTAItexNYsJEP6",
});

exports.checkOut = async (req, res) => {
  const products = req.body.items;
  const subTotal = await calculateAmount(products);

  //suppose salesTax to be 12%
  const amount = subTotal * 1.12;

  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "surendra.singh.kamboj@hotmail.com",
    };

    const order = await instance.orders.create(options);
    order ? res.status(200).json({ success: true, order }) : null;
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Order can not create." });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", "obbG2E3S0JZTAItexNYsJEP6")
    .update(body.toString())
    .digest("hex");

  const isAuthenticated = expectedSignature === razorpay_signature;

  if (isAuthenticated) {
    // Store in database

    // await Payment.create({
    //   razorpay_order_id,
    //   razorpay_payment_id,
    //   razorpay_signature,
    // });

    res.redirect(
      `http://localhost:3000/Payment/paymentsuccessful/${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};

exports.getKey = (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_ID_KEY });
};
