exports.isSeller = (req, res, next) => {
    const { user } = req;
    if (user.adminType === "seller") {
        next();
    } else {
        res.status(300).json({ message: "You have not Authenticated" });
    }
};
