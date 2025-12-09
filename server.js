const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// REGISTER API
app.post("/register", async (req, res) => {
    const { fullname, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)";
    db.query(sql, [fullname, email, hashedPassword], (err, data) => {
        if (err) return res.json({ error: err });
        return res.json({ message: "User registered successfully" });
    });
});

// LOGIN API
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.json({ error: err });
        if (results.length === 0)
            return res.json({ message: "User not found" });

        const user = results[0];

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.json({ message: "Incorrect password" });

        res.json({ message: "Login successful" });
    });
});

// START SERVER
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
