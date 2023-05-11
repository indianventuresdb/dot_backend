import mongoose from 'mongoose';

const products = mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    productType: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    indicator: {
        type: String,
        required: true,
    },
    madeIn: {
        type: String,
        default: India
    },
    brand: {
        type: String,
        required: true
    },
    totalAllowedQuantity: {
        type: Number,
        default: 5
    },
    minOrderQuantity: {
        type: Number,
        default: 1
    },
    qualityStepSize: {
        type: String,
        required: true
    },
    warrantyPeriod: {
        type: String,
    },
    guaranteePeriod: {
        type: String,
    },
    deliverableType: {
        type: [String],
        required: true
    },
    deliverableZipcodes: {
        type: [Number],
        required: true
    },
    hsnCode: {
        type: String,
    },
    taxIncludedPrice: {
        type: Number,

    },
    isCodAllowed: {
        type: Boolean,
        required: true
    },
    isReturnAble: {
        type: Boolean,
        required: true
    },
    isCancelAble: {
        type: Boolean,
        required: true
    },
    mrp: {
        type: Number,
        required: true
    },
    currentPrice: {
        type: Number,
        required: true
    },
    mainImage: {
        type: String,
        required: true
    },
    otherImage: {
        type: [String],
        required: true
    },
    productVideo: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    visibilityl: {
        type: String,
        default: false
    },
    viewCount: {
        type: Number,
        default: 0
    },
})

export const Products = mongoose.model("Products", products)