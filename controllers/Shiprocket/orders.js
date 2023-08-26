const axios = require("axios");
const { Orders } = require("../../models/orders");

const createOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const data = await Orders.findById(orderId);
    if (!data) {
      return res.status(300).json({
        success: false,
        message: "order not found in Database. it may be fake order.",
      });
    }

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://apiv2.shiprocket.in/v1/external/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios(config);

    !response
      ? res
          .status(300)
          .json({ success: false, message: "Order could not created." })
      : res.status(200).json({ success: true, response });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createOrder };
