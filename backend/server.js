const dotenv = require("dotenv").config({ path: __dirname + '/.env' });
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');  

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "loesloes2003",
  database: "my_database",
});

 
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);



app.get("/", (req, res) => {
  res.send("Hello from the server!");
});


app.post("/api/signup", (req, res) => {
  const { fullName, email, password, phonenumber } = req.body;
  if (!fullName || !email || !password || !phonenumber) {
    return res.status(400).json({ error: "All fields are required" });
  }
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }
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

app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});


app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (results.length > 0) {
      const token = jwt.sign({ email: results[0].email, userId: results[0].id }, 'your-secret-key', { expiresIn: '1h' });
      res.status(200).json({
        message: "Login successful!",
        token: token, 
      });
    } else {
      res.status(401).json({ message: "Invalid credentials!" });
    }
  });
});


app.get("/api/user", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const userId = decoded.userId;
    db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length > 0) {
        res.status(200).json({ user: results[0] }); 
      } else {
        res.status(404).json({ message: "User not found" });
      }
    });
  });
});


app.post("/api/ban", (req, res) => {
  const { id, banDescription } = req.body;

  if (!id || !banDescription) {
    return res.status(400).json({ error: "Missing id or banDescription" });
  }

  db.query(
    "UPDATE users SET isBanned = ?, banDescription = ? WHERE id = ?",
    [1, banDescription, id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "User not found!" });
      }

      res.status(200).json({ message: "User banned successfully!" });
    }
  );
});

app.post("/api/unban", (req, res) => {
  const { id } = req.body;

  db.query(
      "UPDATE users SET isBanned = 0, banDescription = NULL WHERE id = ?",
      [id],
      (err, results) => {
          if (err) return res.status(500).json({ error: err.message });

          if (results.affectedRows === 0) {
              return res.status(404).json({ message: "User not found!" });
          }

          res.status(200).json({ message: "User unbanned successfully!" });
      }
  );
});




app.post("/api/requests", (req, res) => {
  const { name, position, batch, booking_date, start_time, end_time, room, specificRequest, userId} = req.body;
  db.query(
    "INSERT INTO requests (name, position, batch, booking_date, start_time, end_time, room, specificRequest, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [name, position, batch, booking_date, start_time, end_time, room, specificRequest, userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Request created successfully!" });
    }
  );
});


app.get("/api/requests/:userId", (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const sql = "SELECT * FROM requests WHERE userId = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching requests:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json(results);
  });
});


app.get("/api/requests", (req, res) => {
  db.query("SELECT * FROM requests", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

app.delete("/api/requests/:userId/:id", (req, res) => {
  const { userId, id } = req.params;

  if (!userId || !id) {
    return res.status(400).json({ error: "User ID and Request ID are required" });
  }

  const sql = "DELETE FROM requests WHERE userId = ? AND id = ?";
  db.query(sql, [userId, id], (err, results) => {
    if (err) {
      console.error("Error deleting request:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Request not found!" });
    }

    res.json({ message: "Request deleted successfully!" });
  });
});



app.put("/api/requests/:userId/:id", (req, res) => {
  const { userId, id } = req.params;
  const updates = req.body; 

  if (!userId || !id) {
    return res.status(400).json({ error: "User ID and Request ID are required" });
  }

  const fields = Object.keys(updates).filter((key) => updates[key] !== undefined && updates[key] !== "");

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const values = fields.map((field) => updates[field]);

  values.push(userId, id);

  const sql = `UPDATE requests SET ${setClause} WHERE userId = ? AND id = ?`;

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error updating request:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Request not found!" });
    }

    res.json({ message: "Request updated successfully!", updatedFields: fields });
  });
});


app.put("/api/approve/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Request ID is required" });
  }

  const sql = "UPDATE requests SET status = 'approved' WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error approving request:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Request not found!" });
    }

    res.json({ message: "Request approved successfully!" });
  });
})



// curl -X PUT http://localhost:5000/api/reject/7 \ -H "Content-Type: application/json" \-d '{"rejectionDesc": "Request does not meet the criteria."}'

app.put("/api/reject/:id", (req, res) => {
  const { id } = req.params;
  const { rejectionDesc } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Request ID is required" });
  }
  const sql = "UPDATE requests SET status = 'rejected', rejectionDesc = ? WHERE id = ?";
  db.query(sql, [rejectionDesc, id], (err, results) => {
    if (err) {
      console.error("Error rejecting request:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Request not found!" });
    }

    res.json({ message: "Request rejected successfully!" });
  });
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
