import { Response } from "express";
import { AppDataSource } from "../config/data_source";
import { Candidate } from "../entities/candidate";
import { AuthRequest } from "../types/authrequest";
import { AppError } from "../error/AppError";
import { ERROR_CODES } from "../error/errorCodes";
const pdf = require('pdf-parse-fork');
import { Request } from "express";
import fs from "fs";
import { getEmbedding } from "../services/embeddingService";

export const getProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED);
  }

  const candidateRepo = AppDataSource.getRepository(Candidate);

  const candidate = await candidateRepo.findOne({
    where: { user: { id: req.user.id } },
  });

  if (!candidate) {
    throw new AppError(ERROR_CODES.NOT_FOUND);
  }

  return res.json(candidate);
};

// export const updateProfile = async (req: AuthRequest, res: Response) => {
//   if (!req.user) {
//     throw new AppError(ERROR_CODES.UNAUTHORIZED);
//   }

//   const {
//     fullName,
//     phone,
//     education,
//     experience_years,
//     skills,
//     resumeUrl,
//   } = req.body;

//   const candidateRepo = AppDataSource.getRepository(Candidate);

//   const candidate = await candidateRepo.findOne({
//     where: { user: { id: req.user.id } },
//   });

//   if (!candidate) {
//     throw new AppError(ERROR_CODES.NOT_FOUND);
//   }

//   // 🔄 update fields
//   candidate.fullName = fullName ?? candidate.fullName;
//   candidate.phone = phone ?? candidate.phone;
//   candidate.education = education ?? candidate.education;
//   candidate.experience_years =
//     experience_years ?? candidate.experience_years;
//   candidate.skills = skills ?? candidate.skills;
//   candidate.resumeUrl = resumeUrl ?? candidate.resumeUrl;

//   await candidateRepo.save(candidate);

//   return res.json({
//     message: "Profile updated successfully",
//     candidate,
//   });
// };


export const updateCandidateProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const repo = AppDataSource.getRepository(Candidate);

    const candidate = await repo.findOne({
      where: { user: { id: req.user.id } },
    });
    console.log(candidate);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const body = req.body || {};


    const file = req.file;
    console.log("BODY:", req.body);
    let skills: string[] = [];
    try {
      skills = body.skills ? JSON.parse(body.skills) : [];
    } catch {}

    let resumeText = candidate.resumeText;
    let resumePath = candidate.resumeUrl;

    if (file) {
    const dataBuffer = fs.readFileSync(file.path);
    const data = await pdf(dataBuffer);
    resumeText = data.text;
    // Store as "uploads/filename" for consistent URL construction
    const filename = require("path").basename(file.path);
    resumePath = `uploads/${filename}`;
}

    candidate.fullName = body.fullName ?? candidate.fullName;
    candidate.phone = body.phone ?? candidate.phone;
    candidate.education = body.education ?? candidate.education;
    candidate.experience_years =
      body.experience_years ?? candidate.experience_years;

    if (skills.length > 0) {
      candidate.skills = skills;
    }

    if (file) {
      candidate.resumeUrl = resumePath;
      candidate.resumeText = resumeText;
    }

    // 🧠 Generate embedding for matching
    try {
      const skillsList = candidate.skills || [];
      const edu = candidate.education || "";
      const expText = candidate.resumeText || "";
      const candidateContext = `
        Skills: ${skillsList.join(", ")}
        Education: ${edu}
        Experience: ${expText}
      `.trim();
      candidate.embedding = await getEmbedding(candidateContext);
    } catch (embErr) {
      console.error("Error generating candidate embedding:", embErr);
    }

    await repo.save(candidate);

    res.json({ message: "Updated", candidate });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
};