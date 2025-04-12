import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import {
    sendOrderConfirmationEmail,
    sendOutForDeliveryEmail,
    sendOrderCanceledEmail,
    sendOrderDeliveredEmail
} from "../utils/emailUtils.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const currency = "inr";
const deliveryCharge = 40;
const frontend_URL = 'http://localhost:5173';

// Placing User Order using Stripe
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const newOrder = new orderModel({
            userId: userId,
            items: items,
            amount: amount,
            address: address,
            paymentType: "Card",
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Send order confirmation email
        const user = await userModel.findById(userId);
        await sendOrderConfirmationEmail(user.email, newOrder._id, items, "Card", amount);

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charge",
                },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Placing User Order for COD (Cash on Delivery)
const placeOrderCod = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const newOrder = new orderModel({
            userId: userId,
            items: items,
            amount: amount,
            address: address,
            payment: true,
            paymentType: "COD",
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Send order confirmation email
        const user = await userModel.findById(userId);
        await sendOrderConfirmationEmail(user.email, newOrder._id, items, "COD", amount);

        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Listing Orders for Admin Panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).select("userId items amount address status date payment paymentType");
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Fetching User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        let orders = await orderModel.find({ userId: req.body.userId });

        // Convert date to ISO string (which will be interpreted as UTC by the frontend)
        orders = orders.map(order => ({
            ...order._doc,
            date: order.date.toISOString() 
        }));
        
        res.json({ success: true, data: orders });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Updating Order Status with Email Notifications
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        order.status = status;
        await order.save();

        const user = await userModel.findById(order.userId);
        const userEmail = user.email;
        const { items, paymentType, amount } = order;

        if (status === "Food Processing") {
            await sendOrderConfirmationEmail(userEmail, orderId, items, paymentType, amount);
        } else if (status === "Out for delivery") {
            await sendOutForDeliveryEmail(userEmail, orderId, items, paymentType, amount);
        } else if (status === "Delivered") {
            await sendOrderDeliveredEmail(userEmail, orderId, items, paymentType, amount);
        } else if (status === "Cancelled") {
            await sendOrderCanceledEmail(userEmail, orderId, items, paymentType, amount);
        }

        res.json({ success: true, message: "Status updated and email sent" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating status or sending email" });
    }
};

// Verifying Order Payment
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        res.json({ success: false, message: "Not Verified" });
    }
};

// Cancelling an Order
const cancelOrder = async (req, res) => {
    const { orderId } = req.body;
    try {
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.status === 'Delivered') {
            return res.status(400).json({ success: false, message: 'Cannot cancel a delivered order' });
        }

        order.status = 'Cancelled';
        await order.save();

        const user = await userModel.findById(order.userId);
        await sendOrderCanceledEmail(user.email, order._id, order.items, order.paymentType, order.amount);

        res.json({ success: true, message: 'Order cancelled successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error cancelling the order' });
    }
};

// Get report for total items delivered and total amount of orders delivered
const getReport = async (req, res) => {
    try {
        const report = await orderModel.aggregate([
            {
                $match: { status: "Delivered" } 
            },
            {
                $group: {
                    _id: null,
                    totalItems: { $sum: { $sum: "$items.quantity" } }, 
                    totalAmount: { $sum: "$amount" } 
                }
            }
        ]);

        if (report.length === 0) {
            return res.json({ success: true, data: { totalItems: 0, totalAmount: 0 } });
        }

        const { totalItems, totalAmount } = report[0];

        res.json({ success: true, data: { totalItems, totalAmount } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching report" });
    }
};

// Exporting functions
export { 
    placeOrder, 
    listOrders, 
    userOrders, 
    updateStatus, 
    verifyOrder, 
    placeOrderCod, 
    cancelOrder,
    getReport 
};
