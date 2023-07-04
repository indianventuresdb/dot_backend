import jwt from "jsonwebtoken";
import { Users } from "../models/users.js";

export const who_i_am = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(200).json({type:"notLogin"})
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Users.findById(decode._id);

        switch (req.user.adminType) {
            case "admin":
                res.status(200).json({ type: "admin" });
                break;
            case "accountant":
                res.status(200).json({ type: "accountant" });
                break;
            case "delivery":
                res.status(200).json({ type: "delivery" });
                break;
            case "customer":
                res.status(200).json({ type: "customer" });
                break;
            default:
                res.status(200).json({type:"notLogin"})
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
