const express = require("express");
const cors = require("cors");

const app = express();

const supabase = require("./config/supabase");

app.get("/test-db", async (req, res) => {

    const { data, error } = await supabase
        .from("tribes")
        .select("*");

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);

});
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Myntra TribeVibe Backend Running 🚀"
    });
});

module.exports = app;