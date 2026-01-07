import bcrypt from "bcrypt";
import User from "../models/User.js";

export async function seedSuperAdmin() {
  try {
    const adminEmail = "admin@esgenius.com";

    const existingAdmin = await User.findOne({
      where: { email: adminEmail, role: "super_admin" }
    });

    if (existingAdmin) {
      console.log("ℹ️ Super Admin already exists:", {
        id: existingAdmin.id,
        fullName: existingAdmin.fullName,
        email: existingAdmin.email,
        role: existingAdmin.role
      });
    } else {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      const newAdmin = await User.create({
        fullName: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "super_admin",
        contactNumber: "9999999999",
        isApproved: true
      });

      console.log("✅ Super Admin created successfully:", {
        id: newAdmin.id,
        fullName: newAdmin.fullName,
        email: newAdmin.email,
        role: newAdmin.role
      });
    }

    // Create Data Entry User
    const dataEntryEmail = "dataentry@esgenius.com";
    const existingDataEntry = await User.findOne({
      where: { email: dataEntryEmail, role: "data_entry" }
    });

    if (!existingDataEntry) {
      const hashedPassword = await bcrypt.hash("DataEntry@123", 10);
      
      await User.create({
        fullName: "Data Entry User",
        email: dataEntryEmail,
        password: hashedPassword,
        role: "data_entry",
        contactNumber: "8888888888",
        isApproved: true
      });
      
      console.log("✅ Data Entry user created successfully");
    }

    // Create Supervisor User
    const supervisorEmail = "supervisor@esgenius.com";
    const existingSupervisor = await User.findOne({
      where: { email: supervisorEmail, role: "supervisor" }
    });

    if (!existingSupervisor) {
      const hashedPassword = await bcrypt.hash("Supervisor@123", 10);
      
      await User.create({
        fullName: "Supervisor User",
        email: supervisorEmail,
        password: hashedPassword,
        role: "supervisor",
        contactNumber: "7777777777",
        isApproved: true
      });
      
      console.log("✅ Supervisor user created successfully");
    }

  } catch (error) {
    console.error("❌ User seed failed:", error.message);
  }
}
