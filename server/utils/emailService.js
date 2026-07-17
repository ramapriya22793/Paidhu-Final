const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderConfirmationEmail = async (order, userEmail) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Order Confirmation - ${order.orderNumber} - Paidhu Store`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #662654; text-align: center;">Paidhu Store</h2>
          <h3 style="color: #333;">Order Placed Successfully! 🎉</h3>
          <p>Hi ${order.customerName},</p>
          <p>Thank you for shopping with Paidhu Store. We have received your order <strong>${order.orderNumber}</strong>.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="background-color: #ede7d7;">
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ccc;">Summary</th>
              <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ccc;">Amount</th>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">Subtotal</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">₹${order.subtotal}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">Delivery Charges</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">₹${order.deliveryCharge}</td>
            </tr>
            ${order.discountAmount > 0 ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">Discount</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">-₹${order.discountAmount}</td>
            </tr>` : ''}
            <tr style="font-weight: bold; font-size: 1.1em;">
              <td style="padding: 10px;">Grand Total</td>
              <td style="padding: 10px; text-align: right;">₹${order.totalPrice}</td>
            </tr>
          </table>

          <p style="margin-top: 20px;">Payment Method: <strong>${order.paymentMethod}</strong></p>
          <p>Estimated Delivery: 3-5 Business Days</p>

          <p style="margin-top: 30px; font-size: 0.9em; color: #555;">
            You can track your order or download your invoice from your account dashboard.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/order-success/${order.id}" style="background-color: #662654; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Order</a>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully to', userEmail);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

module.exports = {
  sendOrderConfirmationEmail,
};
