const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const {
  createCandidate,
  getCandidates,
  updateStatus,
  deleteCandidate
} = require("../controllers/candidateController");

router.post("/candidates", upload.single("resume"), createCandidate);
router.get("/candidates", getCandidates);
router.put("/candidates/:id/status", updateStatus);
router.delete("/candidates/:id", deleteCandidate);

module.exports = router;
