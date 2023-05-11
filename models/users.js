import mongoose from 'mongoose';

const users = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
    },
    mobile: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    adminType: {
        type: String,
        default: "customer"
    },
    isSeller: {
        type: Boolean,
        default: false
    },
})

export const Users = mongoose.model("Users", users)