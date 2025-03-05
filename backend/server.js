const dotenv = require("dotenv").config({ path: __dirname + '/.env' });
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');  // Import jsonwebtoken

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createPool({
  //
  //
  //
  //
});

// Log database connection parameters
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);



// test 
app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

// User signup
app.post("/api/signup", (req, res) => {
  const { fullName, email, password, phonenumber } = req.body;

  // Validate input fields
  if (!fullName || !email || !password || !phonenumber) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if the email already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Insert new user if email is not found
    db.query(
      "INSERT INTO users (fullName, email, password, phonenumber, isBanned) VALUES (?, ?, ?, ?, ?)", 
      [fullName, email, password, phonenumber, false], 
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "User created successfully!" });
      }
    );
  });
});

//get all users 
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});



// User login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // If user is found
    if (results.length > 0) {
      // Create a token (JWT) that expires in 1 hour
      const token = jwt.sign({ email: results[0].email, userId: results[0].id }, 'your-secret-key', { expiresIn: '1h' });

      // Send back the token
      res.status(200).json({
        message: "Login successful!",
        token: token,  // Include the token in the response
      });
    } else {
      // Invalid credentials
      res.status(401).json({ message: "Invalid credentials!" });
    }
  });
});


// Get user details
app.get("/api/user", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify token
  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Query database to get user details based on user ID from the token
    const userId = decoded.userId;
    db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length > 0) {
        res.status(200).json({ user: results[0] }); // Return user details
      } else {
        res.status(404).json({ message: "User not found" });
      }
    });
  });
});


app.post("/api/ban", (req, res) => {
  const { email, banDescription } = req.body;

  db.query(
    "UPDATE users SET isBanned = ?, banDescription = ? WHERE email = ?",
    [true, banDescription, email],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "User not found!" });
      }

      res.status(200).json({ message: "User banned successfully!" });
    }
  );
});



// Booking requests
app.post("/api/requests", (req, res) => {
  const { name, position, batch, booking_date, start_time, end_time, room, specificRequest } = req.body;


  console.log(name, position, batch, booking_date, start_time, end_time, room, specificRequest);

  db.query("INSERT INTO requests (name, position, batch, booking_date, start_time, end_time, room) VALUES (?, ?, ?, ?, ?, ?, ?)", 
  [name, position, batch, booking_date, start_time, end_time, room], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Booking request submitted!" });
  });
});


//get all requests
app.get("/api/requests", (req, res) => {
  db.query("SELECT * FROM requests", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
