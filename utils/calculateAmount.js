const { Products } = require("../models/products");

const calculateAmount = async (products) => {
  let amount = 0;
  const promises = [];

  for (const item of products) {
    const { _id } = item;
    const productPromise = Products.findOne({ _id });
    promises.push(productPromise);
  }

  const resolvedProducts = await Promise.all(promises);

  resolvedProducts.forEach((product, index) => {
    const { offeredPrice } = product;
    const { tax } = product;
    const { quantity } = products[index];
    amount += offeredPrice * (1 + tax / 100) * quantity;
  });

  return amount.toFixed(2);
};

module.exports = calculateAmount;
