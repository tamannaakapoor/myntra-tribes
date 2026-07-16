// src/server.js
const express = require("express");
const cors = require("cors");

const app = require("./app");

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

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