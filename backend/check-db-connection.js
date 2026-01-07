import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

async function testConnection() {
  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "postgres",
      logging: false,
    }
  );

  try {
    console.log("🔍 Testing database connection...");
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`User: ${process.env.DB_USER}`);
    
    await sequelize.authenticate();
    console.log("✅ Database connection successful!");
    
    // Test query
    const [results] = await sequelize.query("SELECT version();");
    console.log("✅ PostgreSQL version:", results[0].version);
    
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error("Error:", error.message);
    
    if (error.message.includes("database") && error.message.includes("does not exist")) {
      console.log("\n💡 Solution: Run the database setup script first:");
      console.log("   cd scripts && setup-database.bat");
    } else if (error.message.includes("password authentication failed")) {
      console.log("\n💡 Solution: Check your PostgreSQL password in .env file");
    } else if (error.message.includes("connect ECONNREFUSED")) {
      console.log("\n💡 Solution: Make sure PostgreSQL is running on your system");
    }
  } finally {
    await sequelize.close();
  }
}

testConnection();