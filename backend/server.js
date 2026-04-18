const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Issue = require("./models/Issue");
const User = require("./models/User");

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// MONGODB CONNECTION (FIXED)
// =====================
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true, // ✅ Fix for SSL error
})
.then(() => {
  console.log("✅ MongoDB Connected");
})
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err);
});

// Optional: listen for runtime DB errors
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Runtime Error:", err);
});

// =====================
// ROUTES
// =====================
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// =====================
// HEALTH CHECK
// =====================
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

// Create issue
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

// Update status
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

// Assign staff
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

// Add comment
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
// USERS API
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

// =====================
// ERROR HANDLING
// =====================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api/health`);
});