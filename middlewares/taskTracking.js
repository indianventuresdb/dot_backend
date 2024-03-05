const { TaskTracking } = require("../models/taskTracking");

exports.taskTracking = async (req, res, next) => {
  console.log(req.get("Host"));
  if (req.get("Host") === "admin.augse.in") {
    let taskData = {},
      date = new Date();

    res.on("finish", async function () {
      taskData = {
        email: req.email,
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        method: req.method,
        task: req.originalUrl,
        time: date,
      };

      switch (decodeURI(req.url)) {
        case "/login_admin":
          // Assuming the email is present in the request body for "/login_admin"
          taskData.email = req.body.email;
          break;
      }

      try {
        // Create TaskTracking instance
        await TaskTracking.create(taskData);
      } catch (error) {
        console.error(error);
      }
    });
  }

  next();
};
