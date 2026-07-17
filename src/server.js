// src/server.js
const express = require("express");
const cors = require("cors");

const app = require("./app");

// app.use(cors({
//   origin: "http://localhost:3000",
//   "https://myntra-tribes.vercel.app",

//   credentials: true,
// }));
const allowedOrigins = [
  "http://localhost:3000",
  "https://myntra-tribes.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin (e.g. Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
const tribeRoutes = require("./routes/tribeRoutes");
app.use("/api/tribes", tribeRoutes);
const PORT = process.env.PORT || 5000;
const productRoutes = require("./routes/productRoutes");
const lookbookRoutes = require("./routes/lookbookRoutes");
const visionRoutes = require("./routes/visionRoutes");
const authRoutes = require("./routes/authRoutes");
const avatarRoutes = require("./routes/avatarRoutes");
const quizRoutes = require("./routes/quizRoutes");
const userRoutes = require("./routes/userRoutes");
const leaderboardRoutes =require("./routes/leaderboardRoutes");
const aiRoutes = require("./routes/aiRoutes");

app.use("/api/ai", aiRoutes);
app.use(
  "/api/leaderboard",
  leaderboardRoutes
);
app.use("/api/user", userRoutes);
app.use("/api/lookbooks", lookbookRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/avatars", avatarRoutes);
app.use("/api/avatar", avatarRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/vision", visionRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});