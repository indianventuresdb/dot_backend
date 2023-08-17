const validator = require('validator');

exports.isRegisterData = (req, res, next) => {
    const { firstName, lastName, email, mobile, password, gender } = req.body;
    
    if (
        validator.isEmail(email) &&
        !validator.isEmpty(firstName) &&
        !validator.isEmpty(lastName) &&
        !validator.isEmpty(mobile) &&
        !validator.isEmpty(gender) &&
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
