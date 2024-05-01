const calculatePriceAndGST = require("./totalToPrice_and_GST");

function generateHTML(data) {
  let html = "";

  let totalAmount = 0;

  data.forEach((product) => {
    const totalValue = product.quantity * product.price;

    const { price, gstAmount } = calculatePriceAndGST(totalValue,12);
    totalAmount = totalAmount + price + gstAmount;

    html += `
            <tr>
                <td>
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                </td>
                <td>${product.quantity}</td>
                <td>${price}</td>
                <td>${gstAmount}</td>
                <td>${totalValue}</td>
            </tr>
        `;
  });

  html += `<tr>
                <td></td>
                <td></td>
                <td></td>
                <td><h4>Total</h4></td>
                <td>${totalAmount}</td>
            </tr>
            `;

  return html;
}

module.exports = generateHTML;

// // Example usage:
// const data = [
//     {
//         _id: '65349d632ec29a5c4473b2ab',
//         name: 'Green Grooves',
//         quantity: 1,
//         price: 6399,
//         mrp: 15000,
//         description: 'Green Apple Kanchivaram Silk with Silver Border',
//         image: 'uploads/1712319051686-1.png',
//         slug: 'green-grooves',
//         backgroundColor: '#ffffff'
//     },
//     {
//         _id: '65349f992ec29a5c4473b2c6',
//         name: 'Kaveri Kanjeevaram',
//         quantity: 1,
//         price: 6399,
//         image: 'uploads/1712318906947-2.png',
//         description: 'Crimson kanjeevaram saree with an elegant silver border\r\n',
//         mrp: 15000,
//         slug: 'kaveri-kanjeevaram',
//         backgroundColor: '#ffffff'
//     }
// ];

// const tableHTML = generateHTML(data);
// console.log(tableHTML);
