const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: `${process.env.RAZORPAY_API_KEY}`,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

exports.checkOut = async (req, res) => {
  try {
    const options = {
      amount: 5000,
      currency: "INR",
      receipt: "randomNumber",
    };
    const order = await instance.orders.create(options);
    order ? console.log(order) : null;
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(401).json({
      success: false,
    });
  }
};
