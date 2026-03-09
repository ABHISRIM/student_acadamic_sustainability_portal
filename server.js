const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Issue = require("./models/Issue");
const User = require("./models/User");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sustainabilityDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then(() => {
  console.log("✅ MongoDB connected successfully");
}).catch((err) => {
  console.log("❌ MongoDB connection error:", err.message);
});

// Routes
const authRoutes = require("./routes/auth");
const issueRoutes = require("./routes/issues"); // Assuming you might move issues later, but for now we keep inline or refactor.
// Actually, let's just add the auth route usage.

app.use("/api/auth", authRoutes);

// =====================
// API ROUTES
// =====================

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// =====================
// ISSUES API
// =====================

// Get all issues
app.get("/api/issues", async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get issue by ID
app.get("/api/issues/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new issue
app.post("/api/issues", async (req, res) => {
  try {
    const { title, description, category, location, priority, reportedBy } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({
        error: "Title, description, and location are required"
      });
    }

    const newIssue = new Issue({
      title,
      description,
      category: category || "Other",
      location,
      priority: priority || "Medium",
      reportedBy: reportedBy || "Anonymous",
      status: "Pending",
    });

    const savedIssue = await newIssue.save();
    res.status(201).json(savedIssue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update issue
app.put("/api/issues/:id", async (req, res) => {
  try {
    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedIssue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete issue
app.delete("/api/issues/:id", async (req, res) => {
  try {
    const deletedIssue = await Issue.findByIdAndDelete(req.params.id);

    if (!deletedIssue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json({ message: "Issue deleted successfully", issue: deletedIssue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update issue status
app.patch("/api/issues/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedIssue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assign issue to staff
app.patch("/api/issues/:id/assign", async (req, res) => {
  try {
    const { staffId } = req.body;
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { assignedTo: staffId, status: "In Progress" },
      { new: true }
    ).populate("assignedTo", "name email");

    if (!issue) return res.status(404).json({ error: "Issue not found" });
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment to issue
app.post("/api/issues/:id/comments", async (req, res) => {
  try {
    const { author, text } = req.body;

    if (!author || !text) {
      return res.status(400).json({ error: "Author and text are required" });
    }

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: { author, text, date: new Date() },
        },
      },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// DASHBOARD API
// =====================

app.get("/api/dashboard/metrics", async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const pendingIssues = await Issue.countDocuments({ status: "Pending" });
    const inProgressIssues = await Issue.countDocuments({ status: "In Progress" });
    const resolvedIssues = await Issue.countDocuments({ status: "Resolved" });

    const metrics = {
      energyUsage: "2,450 kWh",
      wasteReduction: "78%",
      carbonFootprint: "-12%",
      contributors: 342,
      totalIssues,
      pendingIssues,
      inProgressIssues,
      resolvedIssues,
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/dashboard/focus-areas", async (req, res) => {
  try {
    const focusAreas = [
      { name: "Building Operations", progress: 72 },
      { name: "Transportation", progress: 45 },
      { name: "Campus Greening", progress: 88 },
      { name: "Waste Management", progress: 65 },
    ];

    res.json(focusAreas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// USER API (Basic)
// =====================

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const { name, email, phone, institution } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, institution },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all staff members
app.get("/api/users/role/staff", async (req, res) => {
  try {
    const staff = await User.find({ role: "Staff" }).select("name email _id");
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// ERROR HANDLING
// =====================

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API docs available at http://localhost:${PORT}/api/health`);
});

module.exports = app;
