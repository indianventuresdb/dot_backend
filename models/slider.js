const mongoose = require("mongoose");

const slides = new mongoose.Schema({
    slidePath: {
        type: String,
        required: true,
        unique: true
    }
})

exports.Slides = mongoose.model("Slides", slides);