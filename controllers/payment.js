const { instance } = require("../server");

exports.checkOut = async (req, res) => {
  try {
    console.log(instance);

    const options = {
      amount: 5000,
      currency: "INR",
      receipt: "randomNumber",
    };
    const order = await instance.orders.create(options);
    console.log(order);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, error: "Error creating order" });
  }
};
