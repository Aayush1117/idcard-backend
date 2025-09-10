const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createStudent,
  getStudents,
  getStudentById,
} = require("../controllers/studentController");

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("photo"), createStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);

module.exports = router;
