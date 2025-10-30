const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    project_title: {
      type: String,
      required: true,
      trim: true,
    },
    project_description: {
      type: String,
      required: true,
    },
    company_name: {
      type: String,
      required: true,
    },
    skills_required: {
      type: [String], // e.g. ["MERN Stack", "NLP", "ML"]
      required: true,
    },
    basic_requirements: {
      type: [String], // e.g. ["Good understanding of Node.js", "Experience with MongoDB"]
      required: true,
    },
    salary: {
      type: Number, // e.g. 15000 (for ₹15,000/month)
      required: true,
    },
    applicants: {
      type: Number, // e.g. 120 (number of applicants)
      default: 0,
    },
    selected_applicants: {
      type: Number, // e.g. 10 (number of selected applicants)
      default: 0,
    },
    project_status: {
      type: String,
      enum: ["Active", "Completed", "Upcoming"],
      default: "Upcoming",
    },
    time_duration: {
      type: String, // e.g. "3 months", "4 months", etc.
      required: true,
    },
    number_of_applicants_starts_on: {
      type: Date, // e.g. "2025-10-05"
      required: true,
    },
    projectApproval: {
      type: String,
      enum: ["Approved", "Pending", "Rejected"],
      default: "Pending",
    },
    project_milestones: {
      type: [String], // e.g. ["Requirement Gathering", "Module Development", "Deployment"]
      required: true,
    },
    mentor: {
      mentor_name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      number: {
        type: String,
        required: true,
      },
      designation: {
        type: String,
        required: true,
      },
      mentor_image: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

ProjectSchema.virtual("mentor-company").get(function () {
  return this.company_name;
});

const Listing = mongoose.model("Project", ProjectSchema);
module.exports = Listing;
