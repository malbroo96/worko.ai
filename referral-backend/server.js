require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const referralRoutes = require("./routes/referralRoutes");
const User = require("./models/User");

const app = express();

const normalizeOrigin = (value) => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

const configuredOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((entry) => normalizeOrigin(entry))
  .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([
    ...configuredOrigins,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ])
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/referrals", referralRoutes);

app.use((err, req, res, next) => {
  if (err && err.message === "Only PDF files are allowed") {
    return res.status(400).json({ message: err.message });
  }

  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: err.message });
  }

  return res.status(500).json({ message: err.message || "Internal server error" });
});

const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return;
  }

  const existing = await User.findOne({ email: adminEmail.toLowerCase() });
  if (existing) {
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await User.create({
    name: "System Admin",
    email: adminEmail.toLowerCase(),
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin user seeded");
};

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    await ensureAdminUser();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Allowed CORS origins:", allowedOrigins.join(", "));
    });
  })
  .catch((error) => {
    console.error("Startup error:", error.message);
    process.exit(1);
  });