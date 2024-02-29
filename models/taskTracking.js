const mongoose = require("mongoose");

const taskTrackingSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: new Date(),
  },
  task: {
    type: String,
    required: true,
  },
  additionalInfo: {
    type: String,
  },
  statusCode: {
    type: Number,
  },
  statusMessage: {
    type: String,
  },
  method: {
    type: String,
    enum: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    required: true,
  },
});

exports.TaskTracking = mongoose.model("TaskTracking", taskTrackingSchema);
