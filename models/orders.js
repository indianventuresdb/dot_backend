const mongoose = require("mongoose");

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
    invoiceFileName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isOnTheWay: {
        type: Boolean,
        default: false
    },
    way: {
        type: [String],
        default: []
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    isReturned: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

exports.Orders = mongoose.model("Orders", orders);
