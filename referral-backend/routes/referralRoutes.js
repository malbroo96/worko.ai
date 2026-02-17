const express = require("express");
const {
  createReferral,
  getReferrals,
  updateReferralStatus,
} = require("../controllers/referralController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/", protect, authorizeRoles("candidate"), upload.single("resume"), createReferral);
router.get("/", protect, getReferrals);
router.patch("/:id/status", protect, authorizeRoles("admin"), updateReferralStatus);

module.exports = router;