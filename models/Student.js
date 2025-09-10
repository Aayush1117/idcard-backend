const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: String,
  rollNumber: { type: String, required: true },
  course: String,
  semester: String,
  dob: Date,
  gender: String,
  phone: String,
  email: String,
  bloodGroup: String,
  photo: String, // File path of uploaded photo
  paymentStatus: { type: String, default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
