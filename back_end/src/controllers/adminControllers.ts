import { Response } from "express";
import { AppDataSource } from "../config/data_source";
import { User } from "../entities/user";
import { Candidate } from "../entities/candidate";
import { Recruiter } from "../entities/recruiter";
import { Job } from "../entities/job";
import { JobApplication } from "../entities/job_application";

import { ApplicationStatus } from "../utils/enum";
import { AuthRequest } from "../types/authrequest";

export const getAdminStats = async (
  req: AuthRequest,
  res: Response
) => {
  const userRepo = AppDataSource.getRepository(User);
  const candidateRepo = AppDataSource.getRepository(Candidate);
  const recruiterRepo = AppDataSource.getRepository(Recruiter);
  const jobRepo = AppDataSource.getRepository(Job);
  const appRepo = AppDataSource.getRepository(JobApplication);

  // 📊 Basic counts
  const [
    totalUsers,
    totalCandidates,
    totalRecruiters,
    totalJobs,
    totalApplications,
  ] = await Promise.all([
    userRepo.count(),
    candidateRepo.count(),
    recruiterRepo.count(),
    jobRepo.count(),
    appRepo.count(),
  ]);

  // 📊 Status breakdown
  const shortlisted = await appRepo.count({
    where: { status: ApplicationStatus.SHORTLISTED },
  });

  const rejected = await appRepo.count({
    where: { status: ApplicationStatus.REJECTED },
  });

  const applied = await appRepo.count({
    where: { status: ApplicationStatus.APPLIED},
  });

  return res.json({
    totals: {
      users: totalUsers,
      candidates: totalCandidates,
      recruiters: totalRecruiters,
      jobs: totalJobs,
      applications: totalApplications,
    },

    applicationStats: {
      applied,
      shortlisted,
      rejected,
    },
  });
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  const userRepo = AppDataSource.getRepository(User);
  const users = await userRepo.find({
    order: { createdAt: "DESC" },
  });
  return res.json(users);
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { id: id as any } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await userRepo.remove(user);
  return res.json({ message: "User deleted successfully" });
};

export const getAllJobsAdmin = async (req: AuthRequest, res: Response) => {
  const jobRepo = AppDataSource.getRepository(Job);
  const jobs = await jobRepo.find({
    relations: ["recruiter"],
    order: { createdAt: "DESC" },
  });
  return res.json(jobs);
};

export const deleteJobAdmin = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const jobRepo = AppDataSource.getRepository(Job);
  const job = await jobRepo.findOne({ where: { id: id as any } });
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }
  await jobRepo.remove(job);
  return res.json({ message: "Job deleted successfully" });
};