const fs = require("fs");
const PDFDocument = require("pdfkit");
const generateDailyKey = require("./dailyKey");

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
    doc.image("images/DOT_logo.png", 40, 20, { width: leftColumnWidth });

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
    let cellWidth = 87;
    let cellHeight = 30;

    doc
      .rect(headerX, rowY, cellWidth * 2, cellHeight)
      .fillAndStroke("lightgray", "black");
    doc.fillColor("black");
    doc.text("Item", headerX + 10, rowY + 10, {
      width: 160,
      align: "center",
    });

    doc
      .rect(headerX + 2 * cellWidth, rowY, cellWidth, cellHeight)
      .fillAndStroke("lightgray", "black");
    doc.fillColor("black");
    doc.text("Quantity", headerX + 2 * cellWidth + 10, rowY + 10, {
      width: 67,
      align: "center",
    });

    doc
      .rect(headerX + 3 * cellWidth, rowY, cellWidth, cellHeight)
      .fillAndStroke("lightgray", "black");
    doc.fillColor("black");
    doc.text("MRP (INR)", headerX + 3 * cellWidth + 10, rowY + 10, {
      width: 67,
      align: "center",
    });

    doc
      .rect(headerX + 4 * cellWidth, rowY, cellWidth, cellHeight)
      .fillAndStroke("lightgray", "black");
    doc.fillColor("black");
    doc.text("Discount (INR)", headerX + 4 * cellWidth + 4, rowY + 10);

    doc
      .rect(headerX + 5 * cellWidth, rowY, cellWidth, cellHeight)
      .fillAndStroke("lightgray", "black");
    doc.fillColor("black");
    doc.text("Price (INR)", headerX + 5 * cellWidth + 10, rowY + 10, {
      width: 67,
      align: "center",
    });

    doc.fillColor("black");
    rowY += cellHeight;
    const productsPerPage = 15;
    let currentPageProducts = 5;
    products.forEach((item, index) => {
      const height = Math.ceil((item.name.length + 1) / 30);
      currentPageProducts++;

      if (currentPageProducts >= productsPerPage) {
        doc.addPage();
        currentPageProducts = 0;
        rowY = 20;
      }
      doc
        .rect(headerX, rowY, cellWidth * 2, cellHeight + 20 * (height - 1))
        .stroke();
      doc.text(item.name, headerX + 10, rowY + 10, { width: 160 });

      doc
        .rect(
          headerX + 2 * cellWidth,
          rowY,
          cellWidth,
          cellHeight + 20 * (height - 1)
        )
        .stroke();
      doc.text(
        item.quantity.toString(),
        headerX + 2 * cellWidth + 10,
        rowY + 10,
        { width: 67, align: "right" }
      );

      doc
        .rect(
          headerX + 3 * cellWidth,
          rowY,
          cellWidth,
          cellHeight + 20 * (height - 1)
        )
        .stroke();
      doc.text(`${item.mrp}`, headerX + 3 * cellWidth + 10, rowY + 10, {
        width: 67,
        align: "right",
      });

      doc
        .rect(
          headerX + 4 * cellWidth,
          rowY,
          cellWidth,
          cellHeight + 20 * (height - 1)
        )
        .stroke();
      doc.text(
        `${item.mrp - item.price}`,
        headerX + 4 * cellWidth + 10,
        rowY + 10,
        { width: 67, align: "right" }
      );

      doc
        .rect(
          headerX + 5 * cellWidth,
          rowY,
          cellWidth,
          cellHeight + 20 * (height - 1)
        )
        .stroke();
      doc.text(`${item.price}`, headerX + 5 * cellWidth + 10, rowY + 10, {
        width: 67,
        align: "right",
      });

      rowY += cellHeight + 20 * (height - 1);
    });

    doc.moveDown();
    const totalAmount = products.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.price;
    }, 0);

    let y = doc.y + 20;
    let x = 400;

    doc.rect(x, y, cellWidth, cellHeight).stroke();
    doc.text(`Sub Total`, x + 5, y + 10);
    doc.rect(x + cellWidth, y, cellWidth, cellHeight).stroke();
    doc.text(` ${totalAmount.toFixed(2)}`, x + cellWidth + 5, y + 10, {
      width: 77,
      align: "right",
    });
    y += cellHeight;

    const delivery = totalAmount > 499 ? 0 : 60;
    doc.rect(x, y, cellWidth, cellHeight).stroke();
    doc.text(`Courier Charge`, x + 2, y + 10);
    doc.rect(x + cellWidth, y, cellWidth, cellHeight).stroke();
    doc.text(`${delivery}`, x + cellWidth + 5, y + 10, {
      width: 77,
      align: "right",
    });
    y += cellHeight;

    const gst = totalAmount * 0.12;
    doc.rect(x, y, cellWidth, cellHeight).stroke();
    doc.text("GST", x + 5, y + 10);
    doc.rect(x + cellWidth, y, cellWidth, cellHeight).stroke();
    doc.text(`${gst.toFixed(2)}`, x + cellWidth + 5, y + 10, {
      width: 77,
      align: "right",
    });
    y += cellHeight;

    doc.rect(x, y, cellWidth, cellHeight).stroke();
    doc.text("Total Amount", x + 5, y + 10);
    doc.rect(x + cellWidth, y, cellWidth, cellHeight).stroke();
    doc.text(
      `${(gst + totalAmount + delivery).toFixed(2)}`,
      x + cellWidth + 5,
      y + 10,
      {
        width: 77,
        align: "right",
      }
    );

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
