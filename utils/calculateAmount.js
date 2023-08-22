const { Products } = require("../models/products");

const calculateAmount = async (products) => {
  let subTotal = 0;
  const promises = [];

  for (const item of products) {
    const { _id, quantity } = item;
    const productPromise = Products.findOne({ _id });
    promises.push(productPromise);
  }

  const resolvedProducts = await Promise.all(promises);

  resolvedProducts.forEach((product, index) => {
    const { offeredPrice } = product;
    const { quantity } = products[index];
    subTotal += offeredPrice * quantity;
  });

  return subTotal.toFixed(2);
};

module.exports = calculateAmount;
