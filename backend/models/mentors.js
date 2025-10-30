const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
  mentor_name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  number: {
    type: String,
    required: true,
  },
  company_name: {
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
  expertise_areas: {
    type: [String], // e.g. ["Web Development", "Data Science"]
    required: true,
  },
  years_of_experience: {
    type: Number, // e.g. 5 (years of experience)
    required: true,
  },
  bio: {
    type: String, // Short biography of the mentor
    required: false,
  },
});

const Mentor = mongoose.model("Mentor", MentorSchema);
module.exports = Mentor;