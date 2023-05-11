import mongoose from 'mongoose';

const orders = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

export const Orders = mongoose.model("Orders", orders)