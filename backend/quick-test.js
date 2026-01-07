import dotenv from "dotenv";
dotenv.config();

import sequelize from "./config/db.js";
import Stakeholder from "./models/stakeholder.js";

async function quickTest() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Test creating a stakeholder
    const testData = {
      name: "Quick Test Stakeholder",
      type: "Financial",
      engagement_level: "High",
      priority: "Critical",
      description: "Testing API integration",
      contact_email: "test@example.com"
    };

    const created = await Stakeholder.create(testData);
    console.log("✅ Stakeholder created:", created.id);

    // Test fetching all
    const all = await Stakeholder.findAll();
    console.log("✅ Total stakeholders:", all.length);

    // Clean up
    await created.destroy();
    console.log("✅ Test data cleaned up");

    console.log("\n🎉 API integration ready! Start the server with: npm start");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

quickTest();