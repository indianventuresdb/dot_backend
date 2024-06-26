const generateHTML = require("./tableGenerator");
const puppeteer = require("puppeteer");


async function convertHtmlToPdf(htmlContent, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set content to the HTML
  await page.setContent(htmlContent);

  // Generate PDF
  await page.pdf({ path: outputPath, format: "A4" });

  await browser.close();
  console.log(`PDF generated at ${outputPath}`);
}


function generateUniqueString() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  const day = ("0" + currentDate.getDate()).slice(-2);
  const hours = ("0" + currentDate.getHours()).slice(-2);
  const minutes = ("0" + currentDate.getMinutes()).slice(-2);
  const seconds = ("0" + currentDate.getSeconds()).slice(-2);
  const milliseconds = ("00" + currentDate.getMilliseconds()).slice(-3);

  return `AUG${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
}


function getCurrentDate() {
  const currentDate = new Date();
  const day = ('0' + currentDate.getDate()).slice(-2);
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  const year = currentDate.getFullYear();

  return `${day}/${month}/${year}`;
}


async function generateInvoice(orderID, address, products, outputPath, gst) {
  // console.log(orderID, address, products, outputPath, gst);

  // console.log(address)

  const htmlCode = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Invoice</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        h1 {
          font-size: medium;
        }
        .title {
          width: 100%;
          padding: 1rem;
          position: absolute;
          color: white;
          z-index: 2;
          top: 0;
          display: flex;
          justify-content: space-evenly;
          /* background-color: darkgray; */
        }
        .address {
          width: full;
          margin-top: 2rem;
          display: flex;
          justify-content: space-around;
          padding:0rem 1rem;
        }
        .company {
          display: flex;
          gap: 2rem;
        }
        .client{
          max-width: 50%;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-family: Arial, sans-serif;
        }
  
        thead {
          background-color: #f2f2f2;
        }
  
        thead td {
          padding: 10px;
          font-weight: bold;
          text-align: left;
          border-bottom: 2px solid #ccc;
        }
  
        tbody td {
          padding: 10px;
          border-bottom: 1px solid #ccc;
        }
  
        tbody td:first-child {
          width: 40%;
        }
  
        tbody td:nth-child(2),
        tbody td:nth-child(3),
        tbody td:nth-child(4),
        tbody td:nth-child(5) {
          text-align: center;
          border-right: 1px solid #ccc; /* Add vertical lines */
        }
  
        tbody td h4 {
          margin: 0;
        }
  
        tbody td p {
          margin: 5px 0;
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div style="max-width: 100vw; overflow-x: hidden">
        <img src="https://server.augse.in/files/uploads/header.svg" />
      </div>
      <div class="title">
        <h1>Invoice No. ${generateUniqueString()}</h1>
        <p>Invoice Date : ${getCurrentDate()}</p>
      </div>
      <p style="width:100%;padding:0rem 3rem;text-align:right;"></P>
      <div class="address">
        <div class="company">
          <img
            src="https://www.driftofthread.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FDOT_logo.3177890f.png&w=128&q=75"
            alt="logo"
            style="margin-top: -3rem;position: absolute;z-index: 3;top: 80px;transform: translateX(-50%); left: 50%;"
          />
          <div>
          <h1>Brand : Augse</h1>
          <h1>Organization: Drift of Thread</h1>
          <p>Address : 190/199, Chukkuwala, Part II, Dehradun, Uttarakhand- 248001</p>
          <p>GSTIN : 05BIMPM8421Q3ZJ</p>
          <p>Order ID : ${orderID.toString().toUpperCase()}</p>
          </div>
        </div>
        <div class="client">
          <div style="text-align:right;">
            <h1>Billing Details</h1>
            <p>
              ${address.name}
            </p>
            <p>${address.phone}</p>
            <p>${address.houseNumber}, ${address.street}, ${address.city}, ${address.state}, ${address.country}, ${address.pinCode}</p>
          </div>
          <div style="text-align:right;margin-top: 1rem;">
            <h1>Shipping Address</h1>
            <p>
              ${address.name}
            </p>
            <p>${address.phone}</p>
            <p>${address.houseNumber}, ${address.street}, ${address.city}, ${address.state}, ${address.country}, ${address.pinCode}</p>
          </div>
        </div>
      </div>
      <!-- <table></table> -->
      <div style="margin-top: 1rem; padding-left: 1rem; padding-right: 1rem">
        <table>
          <thead>
            <td style="text-align: left">Product</td>
            <td style="text-align: center">Quantity</td>
            <td style="text-align: center">Price</td>
            <td style="text-align: center">GST</td>
            <td style="text-align: center">Amount</td>
          </thead>
          <tbody>
          ${generateHTML(products)}
       </tbody>
        </table>
  
        <p style="margin-top: 3rem;font-style: italic;font-weight: bold;">Thank you for shoping from Augse.</p>
      </div>
    </body>
  </html>  
  `;

  try {
    const res = await convertHtmlToPdf(htmlCode,outputPath)
    console.log("reposne",res)
  } catch (error) {
    console.log(error)
  }
}

module.exports = generateInvoice;
