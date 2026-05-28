import {  Request,Response } from "express";
import { AppDataSource } from "../config/data_source";
import { JobApplication } from "../entities/job_application";
import { Recruiter } from "../entities/recruiter";
import { ApplicationStatus, UserRole } from "../utils/enum";

import { AppError } from "../error/AppError";
import { ERROR_CODES } from "../error/errorCodes";
import { Job } from "../entities/job"
import { Candidate } from "../entities/candidate";
import { AuthRequest } from "../types/authrequest";

export const applyJob = async (req: AuthRequest, res: Response) => {
  const { jobId } = req.body;

  if (!jobId) {
    throw new AppError(ERROR_CODES.REQUIRED_FIELDS_MISSING);
  }

  const jobRepo = AppDataSource.getRepository(Job);
  const candidateRepo = AppDataSource.getRepository(Candidate);
  const appRepo = AppDataSource.getRepository(JobApplication);

  // 🔍 get candidate
  const candidate = await candidateRepo.findOne({
    where: { user: { id: req.user!.id } },
  });

  if (!candidate) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED);
  }

  // 🔍 get job
  const job = await jobRepo.findOne({
    where: { id: jobId },
  });

  if (!job) {
    throw new AppError(ERROR_CODES.NOT_FOUND);
  }

  // 🚫 prevent duplicate applications
  const existing = await appRepo.findOne({
    where: { candidate: { id: candidate.id }, job: { id: job.id } },
  });

  if (existing) {
    throw new AppError(ERROR_CODES.ALREADY_APPLIED);
  }

  // 🎯 Matching Logic
  const candidateSkills = candidate.skills || [];
  const jobSkills = job.skills || [];

  const matchedSkills = candidateSkills.filter((skill) =>
    jobSkills.includes(skill)
  );

  const matchingScore =
    jobSkills.length === 0
      ? 0
      : (matchedSkills.length / jobSkills.length) * 100;

  const application = appRepo.create({
    candidate,
    job,
    matchingScore,
  });

  await appRepo.save(application);

  return res.status(201).json({
    message: "Applied successfully",
    application,
  });
};


type Params = { id?: string };

export const updateApplicationStatus = async (
  req: AuthRequest & Request<Params>,
  res: Response
) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) {
    throw new AppError(ERROR_CODES.REQUIRED_FIELDS_MISSING);
  }

  if (!Object.values(ApplicationStatus).includes(status)) {
    throw new AppError(ERROR_CODES.INVALID_INPUT);
  }

  const appRepo = AppDataSource.getRepository(JobApplication);
  const recruiterRepo = AppDataSource.getRepository(Recruiter);

  // 🔍 Get recruiter
  const recruiter = await recruiterRepo.findOne({
    where: { user: { id: req.user!.id } },
    relations: ["user"],
  });

  if (!recruiter) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED);
  }

  // 🔍 Get application with job relation
  const application = await appRepo.findOne({
    where: { id },
    relations: ["job", "job.recruiter"],
  });

  if (!application) {
    throw new AppError(ERROR_CODES.NOT_FOUND);
  }

  // 🔒 Ownership check (VERY IMPORTANT)
  if (application.job.recruiter.id !== recruiter.id) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED);
  }

  application.status = status;

  await appRepo.save(application);

  return res.json({
    message: "Application status updated",
    application,
  });
};

export const getMyApplications = async (req: AuthRequest, res: Response) => {
  const user = req.user; // coming from auth middleware

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const appRepo = AppDataSource.getRepository(JobApplication);

  const applications = await appRepo.find({
    where: {
      candidate: {
        user: {
          id: user.id,
        },
      },
    },
    relations: [
      "job",
      "job.recruiter", // optional but useful
    ],
    order: {
      appliedAt: "DESC",
    },
  });

  return res.json(applications);
};

export const getApplicantsByJob = async (req: AuthRequest, res: Response) => {
  try {
    const jobId = req.params.jobId as string;

    // 🔍 Find the job first to verify ownership
    const jobRepo = AppDataSource.getRepository(Job);
    const job = await jobRepo.findOne({
      where: { id: jobId },
      relations: ["recruiter"],
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 🔒 Check ownership if not an admin
    if (req.user!.role !== UserRole.ADMIN) {
      const recruiterRepo = AppDataSource.getRepository(Recruiter);
      const recruiter = await recruiterRepo.findOne({
        where: { user: { id: req.user!.id } },
      });

      if (!recruiter || job.recruiter.id !== recruiter.id) {
        return res.status(403).json({ message: "Forbidden: You do not own this job listing" });
      }
    }

    const repo = AppDataSource.getRepository(JobApplication);
    const applications = await repo.find({
      where: { 
        job: { id: jobId as any } 
      },
      relations: ["candidate", "candidate.user"],
      order: { appliedAt: "DESC" },
    });

    return res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching applicants" });
  }
};

// recruiterController.ts or applicationController.ts
export const getRecruiterShortlisted = async (req: AuthRequest, res: Response) => {
  const repo = AppDataSource.getRepository(JobApplication);

  // We find applications where status is SHORTLISTED 
  // and the job belongs to the current recruiter
  const shortlisted = await repo.find({
    where: {
      status: "SHORTLISTED", 
      job: { recruiter: { user: { id: req.user!.id } } }
    } as any, 
    relations: ["candidate", "candidate.user", "job"],
    order: { appliedAt: "DESC" }
  });

  return res.json(shortlisted);
};