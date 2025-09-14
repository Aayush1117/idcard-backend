const fs = require("fs");
const path = require("path");
const Student = require("../models/Student");

// Create new student
const createStudent = async (req, res) => {
  try {
    const photoFile = req.files?.photo ? req.files.userimg[0] : null;
    const paymentFile = req.files?.paymentScreenshot ? req.files.paymentScreenshot[0] : null;

    const photoUrl = photoFile
      ? `${req.protocol}://${req.get("host")}/uploads/${photoFile.filename}`
      : null;

    const paymentScreenshotUrl = paymentFile
      ? `${req.protocol}://${req.get("host")}/uploads/${paymentFile.filename}`
      : null;

    // ✅ CHANGE 1: Validation check for required fields
    const { name, fatherName, rollNumber, course, semester, dob, gender, phone, email, bloodGroup, address, utr } = req.body;

    if (!name || !rollNumber || !course || !semester || !gender || !phone || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ CHANGE 2: Phone & email format check
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // ✅ CHANGE 3: Require either UTR or payment screenshot
    if (!utr && !paymentFile) {
      return res.status(400).json({ message: "UTR or Payment Screenshot required" });
    }

    const student = await Student.create({
      name,
      fatherName,
      rollNumber,
      course,
      semester,
      dob,
      gender,
      phone,
      email,
      bloodGroup,
      address,
      utr,
      photo: photoUrl,
      paymentScreenshot: paymentScreenshotUrl,

      // Default values
      paymentStatus: "Pending",
      status: "Pending",
    });

    res.status(201).json({ message: "Student registered successfully", student });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all students
const getStudents = async (req, res) => {
  try {
    // ✅ CHANGE 4: Sorted by latest first
    const students = await Student.find().sort({ createdAt: -1 });
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

// Update student status or payment
const updateStatus = async (req, res) => {
  try {
    const updateFields = {};

    // ✅ CHANGE 5: Validate enum values before updating
    if (req.body.status) {
      if (!["Pending", "Approved", "Rejected"].includes(req.body.status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      updateFields.status = req.body.status;
    }

    if (req.body.paymentStatus) {
      if (!["Pending", "Paid"].includes(req.body.paymentStatus)) {
        return res.status(400).json({ message: "Invalid payment status value" });
      }
      updateFields.paymentStatus = req.body.paymentStatus;
    }

    const student = await Student.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student updated successfully", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // ✅ CHANGE 6: Delete uploaded files too
    if (student.photo) {
      const photoPath = path.join(__dirname, "..", "uploads", path.basename(student.photo));
      if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
    }
    if (student.paymentScreenshot) {
      const payPath = path.join(__dirname, "..", "uploads", path.basename(student.paymentScreenshot));
      if (fs.existsSync(payPath)) fs.unlinkSync(payPath);
    }

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
