import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Create users table
const createUsersTable = async () => {
  const connection = await db.getConnection();
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      fullName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `);
  connection.release();
};

// Create requests table
const createRequestsTable = async () => {
  const connection = await db.getConnection();
  await connection.query(`
    CREATE TABLE IF NOT EXISTS requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      position VARCHAR(255) NOT NULL,
      batch VARCHAR(255) NOT NULL,
      booking_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      room VARCHAR(255) NOT NULL,
      status ENUM('Pending', 'Approved', 'Declined') DEFAULT 'Pending'
    )
  `);
  connection.release();
};

// Initialize database
const initializeDatabase = async () => {
  await createUsersTable();
  await createRequestsTable();
};

initializeDatabase();

export default db;
