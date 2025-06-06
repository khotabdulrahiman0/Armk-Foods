import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Food Processing", enum: ["Food Processing", "Out for delivery", "Delivered", "Cancelled"] },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false },
    paymentType: { type: String, required: true },
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
