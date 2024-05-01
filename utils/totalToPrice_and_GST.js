function calculatePriceAndGST(totalValue, gstPercentage) {
  // Calculate price excluding GST
  const price = (totalValue / (1 + gstPercentage / 100)).toFixed(2);

  // Calculate GST amount
  const gstAmount = (totalValue - price).toFixed(2);

  // Return an object with price and GST amount
  return {
    price: parseFloat(price),
    gstAmount: parseFloat(gstAmount),
  };
}

module.exports = calculatePriceAndGST;
