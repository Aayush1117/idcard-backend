const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStatus,
  deleteStudent,
} = require("../controllers/studentController");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("photo"), createStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.patch("/:id", updateStatus);      // Approve/Reject
router.delete("/:id", deleteStudent);    // Delete

module.exports = router;
