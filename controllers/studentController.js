const Student = require("../models/Student");

// Create new student
const createStudent = async (req, res) => {
  try {
    const photoFile = req.files?.photo ? req.files.photo[0] : null;
    const paymentFile = req.files?.paymentScreenshot ? req.files.paymentScreenshot[0] : null;

    // ✅ Cloudinary gives us .path = image URL
    const photoUrl = photoFile ? photoFile.path : null;
    const paymentScreenshotUrl = paymentFile ? paymentFile.path : null;

    const {
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
    } = req.body;

    // ✅ Validation for required fields
    if (!name || !rollNumber || !course || !semester || !gender || !phone || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // ✅ Require either UTR or payment screenshot
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
      paymentStatus: "Pending",
      status: "Pending",
    });

    res.status(201).json({ message: "Student registered successfully", student });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: "Something went wrong, please try again later." });
  }
};

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get single student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Something went wrong, please try again later." });
  }
};

// Update student status or payment
const updateStatus = async (req, res) => {
  try {
    const updateFields = {};

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
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // ✅ No need to delete files manually (handled by Cloudinary)
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStatus,
  deleteStudent,
};
