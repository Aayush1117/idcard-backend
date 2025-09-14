const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    course: { type: String, required: true },
    semester: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    bloodGroup: { type: String },
    address: { type: String },

    // File uploads
    userimg: { type: String },
    paymentScreenshot: { type: String },

    // Payment & Status
    utr: { type: String }, 
    paymentStatus: { 
      type: String, 
      enum: ["Pending", "Paid"], 
      default: "Pending" 
    },
    status: { 
      type: String, 
      enum: ["Pending", "Approved", "Rejected"], 
      default: "Pending" 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
