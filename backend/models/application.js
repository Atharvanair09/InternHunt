const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    user_email: {
      type: String,
      required: true,
    },
    application_status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    application_date: {
      type: Date,
      default: Date.now,
    },
    cover_letter: {
      type: String,
      default: "",
    },
    resume_url: {
      type: String,
      default: "",
    },
    additional_notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Ensure one application per user per project
ApplicationSchema.index({ user_id: 1, project_id: 1 }, { unique: true });

const Application = mongoose.model("Application", ApplicationSchema);
module.exports = Application;
