const { Slides } = require("../models/slider.js");

const slider = async (req, res) => {
    try {
        const slideImages = await Slides.find();
        !slideImages ?
            res.status(300).json({ message: "Images not found" }) :
            res.status(200).json(slideImages);
    } catch (err) {
        const { error } = console;
        error(err);
        return res.status(500).json({ message: "Internal server error." })
    }
}

module.exports = { slider }