const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStatus,
  deleteStudent,
} = require("../controllers/studentController");

// Upload multiple files (photo + paymentScreenshot)
const multipleUpload = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "paymentScreenshot", maxCount: 1 },
]);

// Routes
router.post("/", multipleUpload, createStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.patch("/:id", updateStatus);
router.delete("/:id", deleteStudent);

module.exports = router;
