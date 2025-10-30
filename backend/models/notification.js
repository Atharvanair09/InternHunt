const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "user_registration",
        "project_submission",
        "user_approval",
        "project_approval",
      ],
      required: true,
    },
    message: { type: String, required: true },
    detail: { type: String, default: "" },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);


