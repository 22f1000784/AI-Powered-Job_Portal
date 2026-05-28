import { AppDataSource } from "./data_source";
import { User } from "../entities/user";
import bcrypt from "bcrypt";
import { UserRole } from "../utils/enum";

export const seedAdmin = async () => {
  const userRepo = AppDataSource.getRepository(User);
  

  const adminEmail = "admin@email.com";
  const adminPassword = "password";

  try {
    // 1. Check if admin user already exists
    const existingAdmin = await userRepo.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      console.log("🛠️ Admin user not found. Creating one...");

      // 2. Ensure the "ADMIN" role exists in your Role entity
      

      // 3. Hash the password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // 4. Create and save the Admin user
      const adminUser = userRepo.create({
        email: "admin@email.com",
        password: hashedPassword,
        role: UserRole.ADMIN, // Matches your many-to-many relationship

      });

      await userRepo.save(adminUser);
      console.log("✅ Admin user created successfully: admin@email.com");
    } else {
      console.log("ℹ️ Admin user already exists. Skipping seed.");
    }
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
  }
};