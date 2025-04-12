import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Send email function
const sendEmail = async (email, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        port: 465,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: subject,
        text: text,
    };

    return transporter.sendMail(mailOptions);
};

// Function to format order details
const formatOrderDetails = (items, paymentType, amount) => {
    const itemDetails = items.map(item => `- ${item.name} (x${item.quantity})`).join('\n');
    return `
Order Details:
Items:
${itemDetails}

Total Amount: ₹${amount}
Payment Method: ${paymentType}
`;
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (email, orderId, items, paymentType, amount) => {
    const subject = 'Order Placed Successfully';
    const orderDetails = formatOrderDetails(items, paymentType, amount);
    const text = `Your order with ID ${orderId} has been placed successfully. We will notify you when the order is out for delivery.\n\n${orderDetails}`;
    await sendEmail(email, subject, text);
};

// Send order out-for-delivery email
export const sendOutForDeliveryEmail = async (email, orderId, items, paymentType, amount) => {
    const subject = 'Order Out for Delivery';
    const orderDetails = formatOrderDetails(items, paymentType, amount);
    const text = `Your order with ID ${orderId} is out for delivery. It will reach you soon.\n\n${orderDetails}`;
    await sendEmail(email, subject, text);
};

// Send order canceled email
export const sendOrderCanceledEmail = async (email, orderId, items, paymentType, amount) => {
    const subject = 'Order Canceled';
    const orderDetails = formatOrderDetails(items, paymentType, amount);
    const text = `Your order with ID ${orderId} has been canceled. If this was a mistake, please place the order again.\n\n${orderDetails}`;
    await sendEmail(email, subject, text);
};

// Send order delivered email
export const sendOrderDeliveredEmail = async (email, orderId, items, paymentType, amount) => {
    const subject = 'Order Delivered';
    const orderDetails = formatOrderDetails(items, paymentType, amount);
    const text = `Your order with ID ${orderId} has been successfully delivered. Enjoy your meal!\n\n${orderDetails}`;
    await sendEmail(email, subject, text);
};
