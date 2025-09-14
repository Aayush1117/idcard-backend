const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
// const upload = require("../middlewares/upload");
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStatus,
  deleteStudent,
} = require("../controllers/studentController");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ✅ Accept multiple files with different field names
const cpUpload = upload.fields([
  { name: "userimg", maxCount: 1 },
  { name: "paymentScreenshot", maxCount: 1 },
]);

// // Upload multiple files (photo + paymentScreenshot)
// const multipleUpload = upload.fields([
//   { name: "photo", maxCount: 1 },
//   { name: "paymentScreenshot", maxCount: 1 },
// ]);

// Routes
router.post("/", cpUpload, createStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStatus);
router.delete("/:id", deleteStudent);

// // Routes
// router.post("/", multipleUpload, createStudent);
// router.get("/", getStudents);
// router.get("/:id", getStudentById);
// router.patch("/:id", updateStatus);
// router.delete("/:id", deleteStudent);

module.exports = router;
