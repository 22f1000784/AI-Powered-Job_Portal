import { Request, Response } from "express";
import { AuthRequest } from "../types/authrequest";
import { validate as isUUID } from "uuid";
import { AppDataSource } from "../config/data_source";
import { Job } from "../entities/job";
import { Recruiter } from "../entities/recruiter";
import {authenticate } from "../middle_wares/authMiddleware";
import { AppError } from "../error/AppError";
import { ERROR_CODES } from "../error/errorCodes";
import { WorkType, UserRole } from "../utils/enum";
import { getEmbedding } from "../services/embeddingService";

/* ================= CREATE JOB ================= */
export const createJob = async (req: AuthRequest, res: Response) => {
  const {
    jobTitle,
    role,
    description,
    qualifications,
    experienceRequired,
    workType,
    skills,
  } = req.body;

  // 🔴 Basic validation
  if (!jobTitle || !role || !description || !workType) {
    throw new AppError(ERROR_CODES.REQUIRED_FIELDS_MISSING);
  }

  if (!Object.values(WorkType).includes(workType)) {
    throw new AppError(ERROR_CODES.INVALID_INPUT);
  }

  const jobRepo = AppDataSource.getRepository(Job);
  const recruiterRepo = AppDataSource.getRepository(Recruiter);

  // 🔥 Only recruiter or admin allowed (middleware already enforces)
  // But still we ensure recruiter exists in DB
   console.log("getting Saved");
  const recruiter = await recruiterRepo.findOne({
  
    where: { user: { id: req.user!.id } },
    relations: ["user"],
    
  });

  if (!recruiter) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED);
  }

  let embedding: number[] | undefined;
  try {
    const skillsList = Array.isArray(skills) ? skills : skills?.split(",") || [];
    const jobText = `
      Title: ${jobTitle}
      Role: ${role}
      Description: ${description}
      Requirements: ${skillsList.join(", ")}
    `.trim();
    embedding = await getEmbedding(jobText);
  } catch (err) {
    console.error("Error generating job embedding:", err);
  }

  const job = jobRepo.create({
    recruiter,
    jobTitle,
    role,
    description,
    qualifications: qualifications || null,
    experienceRequired: experienceRequired || 0,
    workType,
    skills: Array.isArray(skills)
      ? skills
      : skills?.split(",") || [],
    embedding,
  });

  await jobRepo.save(job);

  return res.status(201).json({
    message: "Job created successfully",
    job,
  });
};
import { ILike } from "typeorm";

export const getAllJobs = async (req: AuthRequest, res: Response) => {
  const repo = AppDataSource.getRepository(Job);

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search as string || "";

  let whereCondition = {};
  if (search) {
    whereCondition = [
      { jobTitle: ILike(`%${search}%`) },
      { role: ILike(`%${search}%`) },
      { description: ILike(`%${search}%`) }
    ];
  }

  const jobs = await repo.find({
    where: whereCondition,
    relations: ["recruiter"],
    order: { createdAt: "DESC" },
    skip: skip,
    take: limit,
  });

  return res.json(jobs);
};

/* ================= GET JOB BY ID ================= */
type Params = {
  id?: string;
};

export const getJobById = async (
  req: Request<Params>,
  res: Response
) => {
  const repo = AppDataSource.getRepository(Job);
  const jobId = req.params.id as string;

  // 🔥 Prevent DB crash
  if (!isUUID(jobId)) {
    throw new AppError(ERROR_CODES.NOT_FOUND);
  }

  const job = await repo.findOne({
    where: { id: jobId },
    relations: ["recruiter"],
  });

  if (!job) {
    throw new AppError(ERROR_CODES.NOT_FOUND);
  }

  return res.json(job);
};

/* ================= GET MY JOBS ================= */
export const getMyJobs = async (req: AuthRequest, res: Response) => {
  const repo = AppDataSource.getRepository(Job);

  const jobs = await repo.find({
    where: {
      recruiter: {
        user: { id: req.user!.id },
      },
    },
    relations: ["recruiter"],
    order: { createdAt: "DESC" },
  });

  return res.json(jobs);
};