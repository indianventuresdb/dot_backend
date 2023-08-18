const { app } = require("./app.js");
const connectDb = require("./database/connectDb.js");
const Razorpay = require("razorpay");

connectDb();

exports.instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

app.listen(process.env.PORT, function () {
  console.log("server Started on http://localhost:" + process.env.PORT);
});
