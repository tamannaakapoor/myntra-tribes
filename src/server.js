// src/server.js

const app = require("./app");
const tribeRoutes = require("./routes/tribeRoutes");
app.use("/api/tribes", tribeRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});