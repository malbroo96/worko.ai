const Candidate = require("../models/Candidate");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");

const allowedStatuses = ["Pending", "Reviewed", "Hired"];

const uploadResumeToCloudinary = (fileBuffer) => {
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

    stream.end(fileBuffer);
  });
};

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

// POST /candidates
exports.createCandidate = async (req, res) => {
  try {
    let resumeUrl = "";

    if (req.file) {
      if (!isCloudinaryConfigured) {
        return res.status(500).json({
          message:
            "Resume upload is enabled but Cloudinary credentials are missing in .env",
        });
      }

      const uploaded = await uploadResumeToCloudinary(req.file.buffer);
      resumeUrl = uploaded.secure_url;
    }

    const candidate = await Candidate.create({
      ...req.body,
      phone: normalizePhone(req.body.phone),
      ...(resumeUrl ? { resumeUrl } : {}),
    });

    return res.status(201).json(candidate);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// GET /candidates
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    return res.json(candidates);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /candidates/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    return res.json(candidate);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE /candidates/:id
exports.deleteCandidate = async (req, res) => {
  try {
    const deleted = await Candidate.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    return res.json({ message: "Candidate deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};