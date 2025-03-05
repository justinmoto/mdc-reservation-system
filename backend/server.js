const dotenv = require("dotenv").config({ path: __dirname + '/.env' });
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Log database connection parameters
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

// User signup
app.post("/api/signup", (req, res) => {
  const { fullName, email, password } = req.body;
  db.query("INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)", [fullName, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "User created successfully!" });
  });
});

// User login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      res.status(200).json({ message: "Login successful!" });
    } else {
      res.status(401).json({ message: "Invalid credentials!" });
    }
  });
});

// Booking requests
app.post("/api/requests", (req, res) => {
  const { name, position, batch, booking_date, start_time, end_time, room } = req.body;
  db.query("INSERT INTO requests (name, position, batch, booking_date, start_time, end_time, room) VALUES (?, ?, ?, ?, ?, ?, ?)", 
  [name, position, batch, booking_date, start_time, end_time, room], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Booking request submitted!" });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
