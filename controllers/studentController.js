const Student = require("../models/Student");

// Create new student
const createStudent = async (req, res) => {
  try {
    // Multer -> multiple files (photo + paymentScreenshot)
    const photoFile = req.files?.photo ? req.files.photo[0] : null;
    const paymentFile = req.files?.paymentScreenshot ? req.files.paymentScreenshot[0] : null;

    const photoUrl = photoFile
      ? `${req.protocol}://${req.get("host")}/uploads/${photoFile.filename}`
      : null;

    const paymentScreenshotUrl = paymentFile
      ? `${req.protocol}://${req.get("host")}/uploads/${paymentFile.filename}`
      : null;

    const student = await Student.create({
      name: req.body.name,
      fatherName: req.body.fatherName,
      rollNumber: req.body.rollNumber,
      course: req.body.course,
      semester: req.body.semester,
      dob: req.body.dob,
      gender: req.body.gender,
      phone: req.body.phone,
      email: req.body.email,
      bloodGroup: req.body.bloodGroup,
      photo: photoUrl,
      paymentScreenshot: paymentScreenshotUrl,
      utr: req.body.utr,
      paymentStatus: "Pending"
    });

    res.status(201).json(student);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update student (status, paymentStatus, etc.)
const updateStatus = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStatus,
  deleteStudent,
};
