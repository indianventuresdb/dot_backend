const validator = require('validator');

exports.isRegisterData = (req, res, next) => {
    const { name, email, phone, password, gender } = req.body;
    
    if (
        validator.isEmail(email) &&
        !validator.isEmpty(name) &&
        !validator.isEmpty(phone) &&
        !validator.isEmpty(password)
    ) {
        next();
    } else {
        return res.status(400).json({ message: "invalid data" });
    }
};

exports.isLoginData = (req, res, next) => {
    next();
};
