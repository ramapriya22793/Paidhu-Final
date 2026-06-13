const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoice = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const invoicesDir = path.join(__dirname, '..', 'uploads', 'invoices');
      
      // Ensure directory exists
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }

      const filePath = path.join(invoicesDir, `invoice-${order.orderNumber}.pdf`);
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);

      // --- Header ---
      doc
        .fillColor('#662654')
        .fontSize(28)
        .text('PAIDHU STORE', 50, 50)
        .fillColor('#333333')
        .fontSize(10)
        .text('123 Luxury Avenue, Fashion District', 50, 80)
        .text('Mumbai, MH 400001, India', 50, 95)
        .text('Email: support@paidhustore.com', 50, 110)
        .text('Phone: +91 9876543210', 50, 125);

      doc
        .fontSize(20)
        .fillColor('#444444')
        .text('INVOICE', 450, 50, { align: 'right' })
        .fontSize(10)
        .text(`Invoice Number: INV-${order.id}`, 400, 80, { align: 'right' })
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 400, 95, { align: 'right' })
        .text(`Order Number: ${order.orderNumber}`, 400, 110, { align: 'right' })
        .text(`Payment Method: ${order.paymentMethod}`, 400, 125, { align: 'right' });

      doc.moveTo(50, 150).lineTo(550, 150).stroke('#cccccc');

      // --- Customer Details ---
      doc
        .fontSize(12)
        .fillColor('#333333')
        .text('Bill To:', 50, 170)
        .fontSize(10)
        .text(order.customerName, 50, 190)
        .text(order.customerEmail, 50, 205)
        .text(order.shippingAddress, 50, 220, { width: 250 });

      // --- Order Items Table ---
      let y = 280;
      doc
        .fillColor('#ede7d7')
        .rect(50, y, 500, 20).fill()
        .fillColor('#333333')
        .font('Helvetica-Bold')
        .text('Item', 60, y + 5)
        .text('Qty', 350, y + 5)
        .text('Price', 400, y + 5)
        .text('Total', 480, y + 5);

      doc.font('Helvetica');
      y += 30;

      order.items.forEach(item => {
        const itemTotal = item.quantity * item.price;
        doc
          .text(item.product ? item.product.name : `Product #${item.productId}`, 60, y)
          .text(item.quantity.toString(), 350, y)
          .text(`Rs ${item.price.toFixed(2)}`, 400, y)
          .text(`Rs ${itemTotal.toFixed(2)}`, 480, y);
        y += 20;
      });

      doc.moveTo(50, y).lineTo(550, y).stroke('#cccccc');
      y += 10;

      // --- Totals ---
      doc
        .text('Subtotal:', 380, y)
        .text(`Rs ${order.subtotal.toFixed(2)}`, 480, y);
      y += 20;

      doc
        .text('Delivery Charges:', 380, y)
        .text(`Rs ${order.deliveryCharge.toFixed(2)}`, 480, y);
      y += 20;

      if (order.discountAmount > 0) {
        doc
          .text('Discount:', 380, y)
          .text(`-Rs ${order.discountAmount.toFixed(2)}`, 480, y);
        y += 20;
      }
      
      if (order.rewardPointsUsed > 0) {
        doc
          .text('Reward Points:', 380, y)
          .text(`-Rs ${order.rewardPointsUsed.toFixed(2)}`, 480, y);
        y += 20;
      }

      doc.font('Helvetica-Bold');
      doc
        .text('Grand Total:', 380, y)
        .text(`Rs ${order.totalPrice.toFixed(2)}`, 480, y);
      
      // --- Footer ---
      doc
        .fontSize(10)
        .font('Helvetica')
        .text('Thank you for shopping with Paidhu Store!', 50, 700, { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve(`/uploads/invoices/invoice-${order.orderNumber}.pdf`);
      });

      stream.on('error', (err) => {
        reject(err);
      });

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateInvoice
};
