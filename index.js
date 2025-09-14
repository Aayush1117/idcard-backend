const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const basicAuth = require("express-basic-auth");  
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Serve uploads folder
app.use("/uploads", express.static(uploadDir)); 

// ✅ Protect admin.html
app.get(
  "/admin.html",
  basicAuth({
    users: { admin: "14707654" }, // change later to env vars
    challenge: true,
  }),
  (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
  }
);

// ✅ Serve public folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
const studentRoutes = require("./routes/studentRoutes");
app.use("/api/students", studentRoutes);

// ✅ Default route -> index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ (Optional) Fallback for unknown routes (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
