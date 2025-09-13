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
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Multiple files: "photo" + "paymentScreenshot"
router.post("/", upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "paymentScreenshot", maxCount: 1 }
]), createStudent);

router.get("/", getStudents);
router.get("/:id", getStudentById);
router.patch("/:id", updateStatus);   // Approve/Reject/Payment
router.delete("/:id", deleteStudent); // Delete

module.exports = router;
