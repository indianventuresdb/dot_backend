const mongoose = require("mongoose");

const address = new mongoose.Schema({
    houseNumber: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    landmark: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }
}, {
    timestamps: true
});

exports.Address = mongoose.model("Address", address);
