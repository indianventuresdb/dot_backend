const { Products } = require("../models/products");

const calculateAmount = async (products) => {
  let price = 0;
  let amount = 0;
  let gst = 0;
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
    price = offeredPrice * quantity;
    amount += offeredPrice * (1 + tax / 100) * quantity;
    gst += ((offeredPrice * tax) / 100) * quantity;
  });

  return [amount.toFixed(2), returnable, cancel, price, gst];
};

module.exports = calculateAmount;
