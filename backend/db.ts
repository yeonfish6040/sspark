import mysql from "mysql2/promise"

// mysql://user:user@sspark-db-sfhroy:3306/sspark_db
export const db = mysql.createPool({
  host: "sspark-db-sfhroy",
  user: "user",
  password: "user",
  database: "sspark_db",
  waitForConnections:true,
  connectionLimit: 10,
})