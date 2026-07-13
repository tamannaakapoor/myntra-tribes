// src/server.js

const app = require("./app");
const tribeRoutes = require("./routes/tribeRoutes");
app.use("/api/tribes", tribeRoutes);
const PORT = process.env.PORT || 5000;
const productRoutes = require("./routes/productRoutes");
const lookbookRoutes = require("./routes/lookbookRoutes");
const visionRoutes = require("./routes/visionRoutes");

app.use("/api/lookbooks", lookbookRoutes);
app.use("/api/products", productRoutes);
app.use("/api/vision", visionRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});