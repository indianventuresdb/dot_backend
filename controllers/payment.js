const { instance } = require("../server");

exports.checkOut = async () => {
  const options = {
    amount: 5000,
    currency: "INR",
    receipt: "randomNumber",
  };
  const order = await instance.orders.create(options);
  console.log(order);
  res.status(200).json({ success: true });
};
