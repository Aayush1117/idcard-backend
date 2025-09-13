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

  // Photo
  photo: String, // Uploaded passport-size photo

  // Payment details
  paymentScreenshot: String, // Uploaded payment proof
  utr: String, // Transaction/UTR ID
  paymentStatus: { type: String, default: "Pending" } // Pending/Approved/Rejected
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
