const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "YOUR_POSTGRES_PASSWORD",
  database: "new_tool_db",
  port: 5432,
});

pool.on("connect", () => {
  console.log("✅ Database connected successfully");
});

module.exports = pool;
