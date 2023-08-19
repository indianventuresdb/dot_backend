const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: "rzp_test_ONvCLFgJgnsaYT",
  key_secret: "obbG2E3S0JZTAItexNYsJEP6",
});

exports.checkOut = async (req, res) => {
  try {
    const options = {
      amount: 95590 * 100,
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
