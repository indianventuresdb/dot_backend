import jwt from "jsonwebtoken";
import { Users } from "../models/users.js";

export const who_i_am = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.redirect("/loginfirst");
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Users.findById(decode._id);

        switch (req.user.adminType) {
            case "admin":
                res.redirect("/admin");
                break;
            case "accountant":
                res.redirect("/accounts");
                break;
            case "delivery":
                res.redirect("/delivery");
                break;
            case "customer":
                res.redirect("/customer");
                break;
            default:
                res.redirect("/login");
                break;
        }
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.redirect("/decodefailed");
        } else {
            return res.redirect("/");
        }
    }

    next();
};
