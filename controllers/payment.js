const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

exports.checkOut = async (req, res) => {
  try {
    console.log(process.env.RAZORPAY_API_KEY, process.env.RAZORPAY_API_SECRET);

    const options = {
      amount: 5000,
      currency: "INR",
      receipt: "randomNumber",
    };
    const order = instance.orders.create(options, (err, order) => {
      console.log(order);
    });

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      error: {
        key: process.env.RAZORPAY_API_KEY,
        secret: process.env.RAZORPAY_API_SECRET,
      },
    });
  }
};
