const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    reviewer_name: { type: String, required: true, trim: true, maxlength: 100 },
    review_text: { type: String, required: true, trim: true, maxlength: 2000 },
    rating: { type: Number, min: 1, max: 5, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    source: { type: String, default: "InternHunt" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);


