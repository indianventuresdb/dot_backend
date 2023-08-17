const { Users } = require("../models/users.js");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const sendToken = (user, res, message, statusCode = 200, loggedBy = null) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(statusCode).cookie("token", token, {
        maxAge: 120 * 60 * 1000,
        path: "/"
    }).json({ path: "http://localhost:3000" });
};

const sendTokenAdmin = (user, res, path, statusCode = 200) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(statusCode).cookie("token", token, {
        maxAge: 120 * 60 * 1000,
        path: "/"
    }).json({ path });
};

// User Register Controller
exports.register = async (req, res) => {
    const { firstName, lastName, email, mobile, password, gender } = req.body;
    try {
        const user = await Users.findOne({ email });
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            if (hashedPassword) {
                const user = await Users.create({
                    firstName, lastName, email, mobile, gender, password: hashedPassword
                });
                if (user) {
                    // Sending Email to the User
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.USER_E_MAIL,
                            pass: process.env.USER_PASS
                        }
                    });
                    const mailOptions = {
                        from: process.env.USER_E_MAIL,
                        to: email,
                        subject: 'Verify your account.',
                        html: `<link
                            rel="stylesheet"
                            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                            integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                            crossorigin="anonymous"
                        />
                        <h3 class="text-center">Hi ${firstName},</h3>
                        <div class="container mx-auto">
                            <div class="row justify-content-center text-center">
                                <div class="col-md-6">
                                    <p>
                                        Welcome to DOT, please click the button below to verify your account:
                                    </p>
                                    <div>
                                        <a
                                            class="btn btn-primary"
                                            href="http://localhost:${process.env.PORT}/api/v1/user/verify/${user._id}/${user.emailVerifyKey}"
                                        >
                                            Verify Now
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    // email sent
                    sendToken(user, res, "Account Created successfully. Please check your email and verify your account.", 200);
                }
            }
        } else {
            return res.status(200).json({ status: false, message: "User already registered." });
        }
    } catch (error) {
        console.log("Here is error caught: ", error);
        if (!res.headersSent) {
            return res.status(500).json({ status: false, message: "Internal server error, Please try again." });
        }
    }
};

// User account verify Controller
exports.verify = async (req, res) => {
    const { id, key } = req.params;
    try {
        const user = await Users.findById(id);
        if (!user) {
            return res.status(300).json({ status: false, message: "Account not Registered." });
        }
        if (user.isEmailVerified) {
            return res.status(300).json({ status: false, message: "Account already verified." });
        }
        if (user.emailVerifyKey === key) {
            await Users.findOneAndUpdate({ _id: id }, { isEmailVerified: true });
            return res.status(200).json({ status: true, message: `Congratulations ${user.firstName}, Your account Verified successfully.` });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server ERROR" });
    }
};

// User Login Controller
exports.login = async (req, res) => {
    const { email, mobile, password } = req.body;
    try {
        if (!email) {
            const user = await Users.findOne({ mobile });
            if (!user) {
                return res.status(500).json({ status: false, message: "Mobile number or password incorrect." });
            }
            const verifyPassword = await bcrypt.compare(password, user.password);
            if (!verifyPassword) {
                return res.status(500).json({ status: false, message: "Mobile number or password incorrect." });
            }
            if (!user.isEmailVerified) {
                return res.status(200).json({ status: true, message: "Your account is not verified. Please check your email and verify your account." });
            }
            sendToken(user, res, "Login successful", 200, "loggedBy: Mobile number");
        } else {
            const user = await Users.findOne({ email }).select("+password");
            if (!user) {
                return res.status(500).json({ status: false, message: "Email or password incorrect." });
            }
            const verifyPassword = await bcrypt.compare(password, user.password);
            if (!verifyPassword) {
                return res.status(500).json({ status: false, message: "Email or password incorrect." });
            }
            if (!user.isEmailVerified) {
                return res.status(200).json({ status: true, message: "Your account is not verified. Please check your email and verify your account." });
            }
            sendToken(user, res, "Login successful", 200, "loggedBy: Email");
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

// User Login Controller
exports.loginAdmin = async (req, res) => {
    const { email, mobile, password } = req.body;
    try {
        if (!email) {
            const user = await Users.findOne({ mobile });
            if (!user) {
                return res.status(500).json({ status: false, message: "Mobile number or password incorrect." });
            }
            const verifyPassword = await bcrypt.compare(password, user.password);
            if (!verifyPassword) {
                return res.status(500).json({ status: false, message: "Mobile number or password incorrect." });
            }
            if (!user.isEmailVerified) {
                return res.status(200).json({ status: true, message: "Your account is not verified. Please check your email and verify your account." });
            }
            sendTokenAdmin(user, res, user.adminType === "admin"
                ? "dashboard"
                : user.adminType === "seller"
                    ? "seller"
                    : user.adminType === "delivery"
                        ? "delivery"
                        : user.adminType === "accountant"
                            ? "accountant"
                            : "/", 200);
        } else {
            const user = await Users.findOne({ email }).select("+password");
            if (!user) {
                return res.status(500).json({ status: false, message: "Email or password incorrect." });
            }
            const verifyPassword = await bcrypt.compare(password, user.password);
            if (!verifyPassword) {
                return res.status(500).json({ status: false, message: "Email or password incorrect." });
            }
            if (!user.isEmailVerified) {
                return res.status(200).json({ status: true, message: "Your account is not verified. Please check your email and verify your account." });
            }
            sendTokenAdmin(user, res, user.adminType === "admin"
                ? "dashboard"
                : user.adminType === "seller"
                    ? "seller"
                    : user.adminType === "delivery"
                        ? "delivery"
                        : user.adminType === "accountant"
                            ? "accountant"
                            : "/", 200);
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

// user Logout
exports.logout = (req, res) => {
    return res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
    }).json({ success: true, message: "Logout successfully......." });
};

// get profile data
exports.getMyProfile = (req, res) => {
    res.status(200).json({ success: false, user: req.user });
};

// Users fetching for admin
exports.fetchUsers = async (req, res) => {
    const { adminType } = req.params;
    try {
        if (adminType === "all" || adminType === "All") {
            const users = await Users.find();
            if (!users) {
                return res.status(200).json({ message: "Users not found" });
            }
            return res.status(200).json(users);
        }
        const users = await Users.find({ adminType });
        if (!users) {
            return res.status(200).json({ message: "Users not found" });
        }
        return res.status(200).json(users);
    } catch (error) {
        return res.status(200).json({ message: "Failed to fetch users." });
    }
};

// delete user
exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await Users.findByIdAndDelete(userId);
        if (!user) {
            return res.status(300).json({ message: "user deletion failed." });
        }
        return res.status(200).json({ message: "user deleted successfully." });
    } catch (error) {
        return res.status(300).json({ message: "user deletion failed." });
    }
};

// Users counter
exports.usersNumbers = async (req, res) => {
    try {
        const documentCount = await Users.count({});
        if (!documentCount) {
            return res.status(300).json({ message: "fail to count" });
        }
        return res.status(200).json({ numbers: documentCount });
    } catch (error) {
        return res.status(300).json({ message: "fail to count" });
    }
};
