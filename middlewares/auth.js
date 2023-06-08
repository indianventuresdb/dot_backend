import jwt from "jsonwebtoken";
export const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies
    console.log(req.cookies)
    if (!token) {
        return res.status(300).json({ success: false, message: "you are not logged in" })
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)

    if (!decode) {
        return res.status(json).json({ success: false, message: "you are not logged in" })
    } 
    try {
        req.user = await Users.findById(decode._id);
    } catch (error) {
        res.status(404).json({ status: false, message: "Invalid Authentication token" })
    }

    next()
}