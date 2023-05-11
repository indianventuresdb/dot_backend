import mongoose from "mongoose";

const address = mongoose.Schema({
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
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
})

export const Address = mongoose.model("Address", address)