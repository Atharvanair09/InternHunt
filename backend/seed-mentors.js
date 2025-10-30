  const mongoose = require("mongoose");
const Mentor = require("./models/mentors");
const { mentors } = require("./init/mentor");

async function seedMentors() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/InternHunt");
    console.log("Connected to MongoDB");

    // Clear existing mentors
    await Mentor.deleteMany({});
    console.log("Cleared existing mentors");

    // Insert mentor data
    await Mentor.insertMany(mentors);
    console.log(`✅ Successfully seeded ${mentors.length} mentors to database`);

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("❌ Error seeding mentors:", error);
    process.exit(1);
  }
}

seedMentors();
