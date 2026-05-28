import "reflect-metadata";
import { AppDataSource } from "../config/data_source";
import { User } from "../entities/user";
import { Recruiter } from "../entities/recruiter";
import { Job } from "../entities/job";
import { UserRole, WorkType } from "../utils/enum";

import fs from "fs";
import path from "path";
import csv from "csv-parser";

/* ===================== HELPERS ===================== */

const parseExperience = (exp: string): number => {
  const match = exp?.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
};

const mapWorkType = (type: string): WorkType => {
  switch (type?.toLowerCase()) {
    case "full-time":
      return WorkType.FULL_TIME;
    case "part-time":
      return WorkType.PART_TIME;
    case "contract":
      return WorkType.CONTRACT;
    case "temporary":
      return WorkType.TEMPORARY;
    default:
      return WorkType.FULL_TIME;
  }
};

const cleanSkills = (skills: string): string[] => {
  if (!skills) return [];

  return skills
    .split(/(?=[A-Z])/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
};

/* ===================== MAIN SCRIPT ===================== */

const seedJobs = async () => {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const recruiterRepo = AppDataSource.getRepository(Recruiter);
  const jobRepo = AppDataSource.getRepository(Job);

  console.log("🚀 DB Connected");

  /* ---------- Step 1: Create / reuse user ---------- */

  let user = await userRepo.findOne({
    where: { email: "seed_recruiter@test.com" },
  });

  if (!user) {
    user = userRepo.create({
      email: "seed_recruiter@test.com",
      password: "123456", // dev only
      role: UserRole.RECRUITER,
    });

    await userRepo.save(user);
    console.log("✅ User created");
  } else {
    console.log("⚠️ User already exists");
  }

  /* ---------- Step 2: Create / reuse recruiter ---------- */

  let recruiter = await recruiterRepo.findOne({
    where: { user: { id: user.id } },
    relations: ["user"],
  });

  if (!recruiter) {
    recruiter = recruiterRepo.create({
      user,
      companyName: "Seed Company",
      contactPerson: "System Admin",
    });

    await recruiterRepo.save(recruiter);
    console.log("✅ Recruiter created");
  } else {
    console.log("⚠️ Recruiter already exists");
  }

  /* ---------- Step 3: Read CSV ---------- */

  const filePath = path.join(__dirname, "sample_jobs.csv");

  console.log("📂 Reading file from:", filePath);
  console.log("📂 File exists:", fs.existsSync(filePath));

  const results: any[] = [];

  fs.createReadStream(filePath)
    .pipe(csv({ separator: "," }))
    .on("data", (row) => {
      console.log("📄 ROW:", row); // DEBUG
      results.push(row);
    })
    .on("end", async () => {
      console.log("📊 Total rows parsed:", results.length);

      if (results.length === 0) {
        console.log("❌ No data found in CSV");
        process.exit();
      }

      /* ---------- Step 4: Insert jobs ---------- */

      for (const row of results) {
        try {
          const job = jobRepo.create({
            recruiter,

            jobTitle: row["Job Title"],
            role: row["Role"],
            description: row["Job Description"],
            qualifications: row["Qualifications"],

            experienceRequired: parseExperience(row["Experience"]),
            workType: mapWorkType(row["Work Type"]),

            skills: cleanSkills(row["skills"]),
          });

          await jobRepo.save(job);

          console.log("✅ Inserted:", job.jobTitle);
        } catch (err) {
          console.error("❌ ERROR inserting row:", row);
          console.error(err);
        }
      }

      console.log("🎉 All jobs inserted successfully");
      process.exit();
    })
    .on("error", (err) => {
      console.error("❌ CSV READ ERROR:", err);
    });
};

seedJobs();