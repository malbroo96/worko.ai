const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      match: /^\S+@\S+\.\S+$/ // basic email regex validation
    },

    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/ // 10 digit phone validation
    },

    jobTitle: { type: String, required: true },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Hired"],
      default: "Pending",
    },

    resumeUrl: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
