import jwt from "jsonwebtoken";
import { Users } from "../models/users.js";

export const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies
    console.log(req.cookies)
    if (!token) {
        return res.redirect("/login.html");
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)

    if (!decode) {
        return res.redirect("/login.html");
    }
    try {
        req.user = await Users.findById(decode._id);
    } catch (error) {
        return res.redirect("/login.html");
    }
    next()
}