const mongoose = require('mongoose');
const uniqid = require('uniqid');

const users = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    profileImage: {
        type: String
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
    password: {
        type: String,
        required: true,
        select: false
    },
    gender: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerifyKey: {
        type: String,
        default: uniqid()
    },
    dob: {
        type: Date
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
}, {
    timestamps: true
});

exports.Users = mongoose.model("Users", users);
