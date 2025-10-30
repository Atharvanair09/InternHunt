require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const User = require("./models/users.js");
const flash = require("connect-flash");
const session = require("express-session");
const cors = require("cors");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Project = require("./models/listing.js");
const nodemailer = require("nodemailer");
// const cryptojs = require("crypto-js");
const Mentor = require("./models/mentors.js");
const Application = require("./models/application.js");
const Feedback = require("./models/feedback.js");
const Notification = require("./models/notification.js");
// const { a } = require("motion/react-client");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);
app.use(flash());
async function main() {
  await mongoose.connect("mongodb://localhost:27017/InternHunt");
}
main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const sessionOptions = {
  secret: "Mysercetcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));

//authentication setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // from Google Cloud
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Check by email instead of googleId
        let user = await User.findOne({ email: profile.emails[0].value });
        const userType = req.session.userType;

        if (!user) {
          user = await User.create({
            username: profile.displayName,
            userPhoto: profile.photos[0].value,
            email: profile.emails[0].value,
            googleId: profile.id,
            userType: userType,
          });
        } else {
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/pre-google", (req, res) => {
  req.session.userType = req.query.userType;
  res.redirect("/auth/google");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    // Successful login
    res.redirect("http://localhost:5173/intro"); // frontend URL
  }
);

const tempUsers = {};

// -------------------- SIGNUP --------------------
app.post("/signup", async (req, res) => {
  const { username, email, password, userType } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store user info and OTP temporarily
    tempUsers[email] = {
      username,
      email,
      password,
      userType,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"MyApp" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Signup",
      html: `
      <head>
        <style>
@media only screen and (max-width: 600px) {
  div[style*="max-width: 680px"] {
    max-width: 100% !important;
    padding: 20px 15px 30px !important;
    background-size: auto !important;
  }

  header table {
    width: 100% !important;
    font-size: 12px !important;
  }

  main > div[style*="max-width: 489px"] {
    max-width: 100% !important;
    padding: 50px 15px 60px !important;
    border-radius: 20px !important;
  }

  main p, main h1 {
    font-size: 14px !important;
    line-height: 1.3 !important;
  }

  main p[style*="font-size: 40px"] {
    font-size: 20px !important;
    letter-spacing: 10px !important;
  }

  footer {
    max-width: 100% !important;
    padding: 10px 15px !important;
  }

  footer p {
    font-size: 14px !important;
  }

  footer div a img {
    width: 28px !important;
  }
}
</style>

      </head>
      <body
      style="
        margin: 0;
        font-family: 'Poppins', sans-serif;
        background: #ffffff;
        font-size: 14px;
      "
    >
      <div
        style="
          max-width: 680px;
          margin: 0 auto;
          padding: 45px 30px 60px;
          background: #f4f7ff;
          background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);
          background-repeat: no-repeat;
          background-size: 800px 452px;
          background-position: top center;
          font-size: 14px;
          color: #434343;
        "
      >
        <header>
          <table style="width: 100%;">
            <tbody>
              <tr style="height: 0;">
                <td>
                  <img
                    alt="InternHunt"
                    src=""
                    height="30px"
                  />
                </td>
                <td style="text-align: right;">
                  <span
                    style="font-size: 16px; line-height: 30px; color: #ffffff;"
                    >${new Date().toLocaleDateString("en-Us", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </header>

        <main>
          <div
            style="
              margin: 0;
              margin-top: 70px;
              padding: 92px 30px 115px;
              background: #ffffff;
              border-radius: 30px;
              text-align: center;
            "
          >
            <div style="width: 100%; max-width: 489px; margin: 0 auto;">
              <h1
                style="
                  margin: 0;
                  font-size: 24px;
                  font-weight: 500;
                  color: #1f1f1f;
                "
              >
                Your OTP
              </h1>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-size: 16px;
                  font-weight: 500;
                "
              >
                Hey ${username},
              </p>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-weight: 500;
                  letter-spacing: 0.56px;
                "
              >
                Thank you for choosing InternHunt Company. Use the following OTP
                to complete the procedure to Sign In. OTP is valid for
                <span style="font-weight: 600; color: #1f1f1f;">5 minutes</span>.
                Do not share this code with others, including InternHunt
                employees.
              </p>
              <p
                style="
                  margin: 0;
                  margin-top: 60px;
                  font-size: 40px;
                  font-weight: 600;
                  letter-spacing: 25px;
                  color: #ba3d4f;
                "
              >
                ${otp}
              </p>
            </div>
          </div>

          <p
            style="
              max-width: 400px;
              margin: 0 auto;
              margin-top: 90px;
              text-align: center;
              font-weight: 500;
              color: #8c8c8c;
            "
          >
            Need help? Ask at
            <a
              href="mailto:atharvanair09.ns@gmail.com"
              style="color: #499fb6; text-decoration: none;"
              >internhunt@gmail.com</a
            >
            or visit our
            <a
              href=""
              target="_blank"
              style="color: #499fb6; text-decoration: none;"
              >Help Center</a
            >
          </p>
        </main>

        <footer
          style="
            width: 100%;
            max-width: 490px;
            margin: 20px auto 0;
            text-align: center;
            border-top: 1px solid #e6ebf1;
          "
        >
          <p
            style="
              margin: 0;
              margin-top: 40px;
              font-size: 16px;
              font-weight: 600;
              color: #434343;
            "
          >
            InternHunt Company
          </p>
          <p style="margin: 0; margin-top: 8px; color: #434343;">
            Mumbai, Maharashtra.
          </p>
          <div style="margin: 0; margin-top: 16px;">
            <a href="" target="_blank" style="display: inline-block;">
              <img
                width="36px"
                alt="Facebook"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
              />
            </a>
            <a
              href=""
              target="_blank"
              style="display: inline-block; margin-left: 8px;"
            >
              <img
                width="36px"
                alt="Instagram"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
            /></a>
            <a
              href=""
              target="_blank"
              style="display: inline-block; margin-left: 8px;"
            >
              <img
                width="36px"
                alt="Twitter"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
              />
            </a>
            <a
              href=""
              target="_blank"
              style="display: inline-block; margin-left: 8px;"
            >
    </body>
    `,
    });

    res.json({
      // message: "OTP sent to your email. Please verify to complete signup.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- VERIFY OTP --------------------
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const tempUser = tempUsers[email];
  if (!tempUser)
    return res
      .status(400)
      .json({ message: "No pending signup found for this email" });

  if (Date.now() > tempUser.otpExpires) {
    delete tempUsers[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (Number(tempUser.otp) !== Number(otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // OTP correct → create user in database
  try {
    const user = new User({
      username: tempUser.username,
      email: tempUser.email,
      userType: tempUser.userType,
      userStatus: "Pending",
      isVerified: true,
    });

    const registeredUser = await User.register(user, tempUser.password);

    // Notification: new user registration
    try {
      await Notification.create({
        type: "user_registration",
        message: "New user registration",
        detail: registeredUser.username,
        meta: { userId: registeredUser._id, email: registeredUser.email },
      });
    } catch (e) {}

    // Clean up temporary store
    delete tempUsers[email];

    res.json({ alert: "Signup successful! Your account is now active." });
  } catch (err) {
    res
      .status(500)
      .json({ message: `The following is the error: ${err.message}` });
  }
});

// -------------------- RESEND OTP --------------------
app.post("/resend-otp", async (req, res) => {
  const { email } = req.body;

  const tempUser = tempUsers[email];
  if (!tempUser)
    return res
      .status(400)
      .json({ message: "No pending signup found for this email" });

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  tempUser.otp = otp;
  tempUser.otpExpires = Date.now() + 10 * 60 * 1000;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"MyApp" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your New OTP for Signup",
      html: `<h2>Hello, ${tempUser.username}</h2>
             <p>Your new OTP is: <b>${otp}</b></p>
             <p>It will expire in 10 minutes.</p>`,
    });

    res.json({ message: "A new OTP has been sent to your email." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to resend OTP", error: err.message });
  }
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    if (user.userType !== req.body.userType) {
      return res.status(400).json({ error: "User type does not match" });
    }
    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({ message: "Login successful", user });
    });
  })(req, res, next);
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  req.logout(() => {
    res.redirect("http://localhost:5173/"); // frontend URL
  });
});

app.patch("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { userStatus: req.body.userStatus },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/current-user", (req, res) => {
  if (req.isAuthenticated()) {
    const { _id, username, email, userType, userStatus } = req.user;
    res.json({ user: { _id, username, email, userType, userStatus } });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Could not delete user" });
  }
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

app.post("/api/projects/:id", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Not Working", error });
  }
});

app.post("/api/projects", async (req, res) => {
  console.log("Received POST /api/projects:", req.body);
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    // Notification: project submitted for approval
    try {
      await Notification.create({
        type: "project_submission",
        message: "Project submitted for approval",
        detail: newProject.company_name,
        meta: { projectId: newProject._id, title: newProject.project_title },
      });
    } catch (e) {}
    res.json(newProject);
  } catch (err) {
    console.error("Error saving project:", err);
    res.status(500).send(err);
  }
});

app.patch("/api/projects/:id/status", async (req, res) => {
  const projectId = req.params.id;
  const { status } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.project_status = status;
    await project.save();

    res.status(200).json({ message: "Status updated", project });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find({});
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Not Working", error });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project Not Found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Not Working", error });
  }
});

app.get("/api/mentors", async (req, res) => {
  try {
    const mentor = await Mentor.find({});
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: "Not Working", error });
  }
});

// Project approval endpoints
app.patch("/api/projects/:id/approve", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { projectApproval: "Approved" },
      { new: true }
    );
    if (!project) return res.status(404).json({ error: "Project not found" });
    // Notification: project approved
    try {
      await Notification.create({
        type: "project_approval",
        message: "Project approved",
        detail: project.project_title,
        meta: { projectId: project._id, company: project.company_name },
      });
    } catch (e) {}
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/projects/:id/reject", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { projectApproval: "Rejected" },
      { new: true }
    );
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Application endpoints
app.post("/api/applications", async (req, res) => {
  try {
    const {
      user_id,
      project_id,
      user_name,
      user_email,
      cover_letter,
      resume_url,
      additional_notes,
    } = req.body;

    // Check if user already applied to this project
    const existingApplication = await Application.findOne({
      user_id: user_id,
      project_id: project_id,
    });

    if (existingApplication) {
      return res.status(400).json({
        error: "You have already applied to this project",
      });
    }

    // Create new application
    const application = new Application({
      user_id,
      project_id,
      user_name,
      user_email,
      cover_letter: cover_letter || "",
      resume_url: resume_url || "",
      additional_notes: additional_notes || "",
    });

    await application.save();

    // Update project applicants count
    await Project.findByIdAndUpdate(project_id, { $inc: { applicants: 1 } });

    res.status(201).json({
      message: "Application submitted successfully",
      application: application,
    });
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ error: "You have already applied to this project" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.get("/api/application", async (req, res) => {
  try {
    const applicants = await Application.find({});
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: "Not Working", error });
  }
});

// Get applications for a specific project
app.get("/api/projects/:id/applications", async (req, res) => {
  try {
    const applications = await Application.find({ project_id: req.params.id })
      .populate("user_id", "username email")
      .sort({ application_date: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get applications by user
app.get("/api/users/:id/applications", async (req, res) => {
  try {
    const applications = await Application.find({ user_id: req.params.id })
      .populate("project_id", "project_title company_name project_status")
      .sort({ application_date: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update application status (approve/reject)
app.patch("/api/applications/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { application_status: status },
      { new: true }
    ).populate("project_id", "project_title company_name");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // If approved, increment selected_applicants count
    if (status === "Approved") {
      await Project.findByIdAndUpdate(application.project_id._id, {
        $inc: { selected_applicants: 1 },
      });
    }

    res.json({
      message: `Application ${status.toLowerCase()} successfully`,
      application: application,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get application status for a user and project
app.get("/api/applications/status/:userId/:projectId", async (req, res) => {
  try {
    const application = await Application.findOne({
      user_id: req.params.userId,
      project_id: req.params.projectId,
    });

    if (!application) {
      return res.json({ hasApplied: false });
    }

    res.json({
      hasApplied: true,
      status: application.application_status,
      application: application,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------- FEEDBACK --------------------
// Create feedback
app.post("/api/feedback", async (req, res) => {
  try {
    const { reviewer_name, review_text, rating } = req.body;
    if (!reviewer_name || !review_text || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const feedback = await Feedback.create({
      reviewer_name,
      review_text,
      rating,
      user_id: req.user?._id || undefined,
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List feedback (latest first)
app.get("/api/feedback", async (req, res) => {
  try {
    const feedback = await Feedback.find({}).sort({ createdAt: -1 }).limit(100);
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------- NOTIFICATIONS --------------------
// List recent notifications
app.get("/api/notifications", async (req, res) => {
  try {
    const items = await Notification.find({}).sort({ createdAt: -1 }).limit(50);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;

  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
