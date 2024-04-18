
const { Products } = require("../models/products");

const calculateAmount = async (products, discountPercentage) => {
  let price = 0;
  let amount = 0;
  let gst = 0;
  let totalDiscount = 0;
  const promises = [];

  for (const item of products) {
    const { _id } = item;
    const productPromise = Products.findOne({ _id });
    promises.push(productPromise);
  }

  const resolvedProducts = await Promise.all(promises);

  let returnable = true;
  let cancel = true;

  resolvedProducts.forEach((product, index) => {
    const { offeredPrice } = product;
    const { tax } = product;
    const { isReturnAble } = product;
    const { isCancelAble } = product;
    const { quantity } = products[index];
    returnable = returnable && isReturnAble;
    cancel = cancel && isCancelAble;
    const currentProductPrice = offeredPrice * quantity;
    price += currentProductPrice;
    const discount = (currentProductPrice * discountPercentage) / 100;
    totalDiscount += discount;
    amount += (currentProductPrice - discount) * (1 + tax / 100);
    gst += ((currentProductPrice - discount) * tax) / 100;
  });

  return [amount.toFixed(2), returnable, cancel, price, gst, totalDiscount];
};

module.exports = calculateAmount;
