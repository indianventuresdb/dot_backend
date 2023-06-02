import jwt from "jsonwebtoken"

export const sendToken = (user, res, message, statusCode = 200) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
                                                      
    res.status(statusCode).cookie("token", token, {
        maxAge: 120 * 60 * 1000,
        path: "/"
    }).json({
        success: true,
        message
    });
}