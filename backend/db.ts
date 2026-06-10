import mysql from "mysql2/promise"

export const db = mysql.createPool({
  host: process.env.DB_HOST ?? "sspark-db-sfhroy",
  user: process.env.DB_USER ?? "user",
  password: process.env.DB_PASSWORD ?? "user",
  database: process.env.DB_NAME ?? "sspark_db",
  waitForConnections: true,
  connectionLimit: 10,
})
