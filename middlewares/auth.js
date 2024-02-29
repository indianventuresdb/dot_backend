const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.redirect("http:/localhost:3000/users/login");
    }
    const realtoken = atob(token);
    const decodedToken = jwt.verify(realtoken, process.env.JWT_SECRET);
    req.user = decodedToken._id;
    req.email = decodedToken.email;
    console.log(decodedToken);
  } catch (error) {
    console.log(error);
    return res.redirect("/login.html");
  }
  next();
};
