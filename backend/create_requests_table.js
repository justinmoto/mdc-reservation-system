const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const createTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      position VARCHAR(255) NOT NULL,
      batch VARCHAR(255) NOT NULL,
      booking_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      room VARCHAR(255) NOT NULL
    );
  `;

  try {
    const connection = await db.getConnection();
    await connection.query(createTableQuery);
    console.log("Requests table created successfully!");
    connection.release();
  } catch (error) {
    console.error("Error creating requests table:", error.message);
  }
};

createTable();
