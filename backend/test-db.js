import dotenv from "dotenv";
dotenv.config();

import sequelize from "./config/db.js";
import Stakeholder from "./models/stakeholder.js";

async function testDatabase() {
  try {
    console.log("🔍 Testing database connection...");
    
    // Test connection
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
    
    // Sync models (create tables)
    await sequelize.sync({ force: false, alter: true });
    console.log("✅ Database synced successfully");
    
    // Test stakeholder creation
    console.log("🔍 Testing stakeholder creation...");
    
    const testStakeholder = {
      name: "Test Stakeholder",
      type: "Internal", // Changed from "Customer" to "Internal"
      engagement_level: "High",
      priority: "High",
      description: "Test stakeholder for database verification",
      contact_email: "test@example.com",
      department: "IT"
    };
    
    const created = await Stakeholder.create(testStakeholder);
    console.log("✅ Stakeholder created:", created.toJSON());
    
    // Test retrieval
    const stakeholders = await Stakeholder.findAll();
    console.log(`✅ Found ${stakeholders.length} stakeholders in database`);
    
    // Clean up test data
    await created.destroy();
    console.log("✅ Test stakeholder cleaned up");
    
    console.log("🎉 All tests passed!");
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Full error:", error);
  } finally {
    await sequelize.close();
  }
}

testDatabase();