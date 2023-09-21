const fs = require("fs");
const PDFDocument = require("pdfkit");
const generateDailyKey = require("./dailyKey");
const formatToINR = require("./formatToINR");

function generateInvoice(orderID, address, products, outputPath) {
  let stream;
  try {
    const doc = new PDFDocument({ margin: 10 });
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    // Set custom fonts
    doc.font("Helvetica-Bold");
    const regularFont = "Helvetica";
    doc.fontSize(20);
    // Title
    doc
      .font("Helvetica-Bold")
      .fontSize(28)
      .text("Invoice", { align: "center" });
    doc.moveDown();

    // Left column (for image)
    const leftColumnWidth = 100;
    doc.image("images/DOT_logo.jpg", 40, 20, { width: leftColumnWidth });

    // Right column (for seller address)
    const rightColumnX = 400;
    doc.fontSize(12).text("Augse's Details:", rightColumnX, 40, {
      underline: true,
    });
    doc.font(regularFont);
    doc.text("GST No: 12XXXXXXXXXX");
    doc.text("Brand - Augse");
    doc.text("Seller - Drift of Thread");
    doc.moveDown();

    // Rest of the invoice content...
    doc
      .font("Helvetica-Bold")
      .text("Invoice Details:", 45, doc.y + 25, { underline: true });
    doc.font(regularFont);
    doc.fontSize(12);
    doc.text(`Invoice Number: ${new Date().getTime()}`);
    doc.text(`Order Number: ${String(orderID).toUpperCase()}`);
    doc.text(`Order Date: ${generateDailyKey()}`);
    doc.moveDown();

    doc.font("Helvetica-Bold").text("Customer Address:", { underline: true });
    doc.font(regularFont);
    doc.text(`${address.name}`);
    doc.text(`${address.houseNumber} ${address.street} ${address.landmark}`);
    doc.text(`${address.city} ${address.state}-${address.pinCode}`);
    doc.text(`Phone: ${address.phone}`);
    doc.moveDown();

    doc.font("Helvetica-Bold").text("Invoice Items:", { underline: true });
    doc.font(regularFont);
    doc.moveDown();

    let headerX = 50;
    let rowY = 320;
    let cellWidth = 105;
    let cellHeight = 30;

    doc
      .rect(headerX, rowY, cellWidth, cellHeight)
      .fillAndStroke("lightgray", "black");
    doc.fillColor("black");
    doc.text("Item", headerX + 10, rowY + 10);

    doc
      .rect(headerX + cellWidth, rowY, cellWidth, cellHeight)
      .fillAndStroke("lightgray", "black");
    doc.fillColor("black");
    doc.text("Quantity", headerX + cellWidth + 10, rowY + 10);

    doc
      .rect(headerX + 2 * cellWidth, rowY, cellWidth, cellHeight)
      .fillAndStroke("lightgray", "black");
    doc.fillColor("black");
    doc.text("Price", headerX + 2 * cellWidth + 10, rowY + 10);

    doc
      .rect(headerX + 3 * cellWidth, rowY, cellWidth, cellHeight)
      .fillAndStroke("lightgray", "black");
    doc.fillColor("black");
    doc.text("Discount", headerX + 3 * cellWidth + 10, rowY + 10);

    doc
      .rect(headerX + 4 * cellWidth, rowY, cellWidth, cellHeight)
      .fillAndStroke("lightgray", "black");
    doc.fillColor("black");
    doc.text("Total", headerX + 4 * cellWidth + 10, rowY + 10);

    doc.fillColor("black");
    rowY += cellHeight;
    products.forEach((item, index) => {
      const height = Math.ceil((item.name.length + 1) / 20);
      doc
        .rect(headerX, rowY, cellWidth, cellHeight + 20 * (height - 1))
        .stroke();
      doc.text(item.name, headerX + 10, rowY + 10, { width: 90 });

      doc
        .rect(
          headerX + cellWidth,
          rowY,
          cellWidth,
          cellHeight + 20 * (height - 1)
        )
        .stroke();
      doc.text(item.quantity.toString(), headerX + cellWidth + 10, rowY + 10);

      doc
        .rect(
          headerX + 2 * cellWidth,
          rowY,
          cellWidth,
          cellHeight + 20 * (height - 1)
        )
        .stroke();
      doc.text(
        `${formatToINR(item.price)}`,
        headerX + 2 * cellWidth + 10,
        rowY + 10
      );

      doc
        .rect(
          headerX + 3 * cellWidth,
          rowY,
          cellWidth,
          cellHeight + 20 * (height - 1)
        )
        .stroke();
      doc.text(
        `${formatToINR(item.price)}`,
        headerX + 3 * cellWidth + 10,
        rowY + 10
      );

      doc
        .rect(
          headerX + 4 * cellWidth,
          rowY,
          cellWidth,
          cellHeight + 20 * (height - 1)
        )
        .stroke();
      doc.text(
        `${formatToINR(item.price)}`,
        headerX + 4 * cellWidth + 10,
        rowY + 10
      );

      rowY += cellHeight + 20 * (height - 1);
    });

    doc.moveDown();
    const totalAmount = products.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.price;
    }, 0);

    doc.text(
      `Sub Total: ${formatToINR(totalAmount.toFixed(2))}`,
      400,
      doc.y + 30
    );
    doc.text(`Courier Charge: ${formatToINR(60)}`);
    doc.text(`GST: ${formatToINR(totalAmount.toFixed(2))}`);
    doc.text(`Total Amount: ${formatToINR(totalAmount.toFixed(2))}`);

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on("finish", () => {
        resolve();
      });
      stream.on("error", (error) => {
        reject(error);
      });
    });
  } catch (error) {
    if (stream) {
      stream.end();
      fs.unlinkSync(outputPath);
    }
    throw error;
  }
}

module.exports = generateInvoice;
