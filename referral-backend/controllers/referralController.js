const Referral = require("../models/Referral");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");

const normalizePhone = (phoneInput) => {
  const digitsOnly = String(phoneInput || "").replace(/\D/g, "");

  if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
    return digitsOnly.slice(1);
  }

  if (digitsOnly.length === 12 && digitsOnly.startsWith("91")) {
    return digitsOnly.slice(2);
  }

  return digitsOnly;
};

const uploadResume = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "resumes" },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

exports.createReferral = async (req, res) => {
  try {
    let resumeUrl = "";

    if (req.file) {
      if (!isCloudinaryConfigured) {
        return res.status(500).json({ message: "Cloudinary is not configured in .env" });
      }

      const uploaded = await uploadResume(req.file.buffer);
      resumeUrl = uploaded.secure_url;
    }

    const referral = await Referral.create({
      name: req.body.name,
      email: req.body.email,
      phone: normalizePhone(req.body.phone),
      jobTitle: req.body.jobTitle,
      resumeUrl,
      referredBy: req.user.userId,
    });

    return res.status(201).json(referral);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getReferrals = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { referredBy: req.user.userId };

    const referrals = await Referral.find(query)
      .populate("referredBy", "name email role")
      .sort({ createdAt: -1 });

    return res.json(referrals);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateReferralStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Pending", "Reviewed", "Hired", "Rejected"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const referral = await Referral.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("referredBy", "name email role");

    if (!referral) {
      return res.status(404).json({ message: "Referral not found" });
    }

    return res.json(referral);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};