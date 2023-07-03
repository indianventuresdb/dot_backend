import jwt from "jsonwebtoken";
import { Users } from "../models/users.js";

export const who_i_am = async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return res.redirect("/");
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)

    if (!decode) {
        return res.redirect("/");
    }
    try {
        req.user = await Users.findById(decode._id);
        switch (req.user.adminType) {
            case "admin": res.redirect("/admin")
                break;
            case "accountant": res.redirect("/accounts")
                break;
            case "delivery": res.redirect("/delivery")
                break;
            case "customer": res.redirect("/")
                break;
            default: res.redirect("/login")
                break;
        }
    } catch (error) {
        return res.redirect("/");
    }
    next()
}