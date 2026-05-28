import { Response } from "express";
import { AppDataSource } from "../config/data_source";
import { Job } from "../entities/job";
import { Candidate } from "../entities/candidate";
import { Recruiter } from "../entities/recruiter";
import { AuthRequest } from "../types/authrequest";
import { UserRole } from "../utils/enum";

export const getShortlistedCandidates = async (req: AuthRequest, res: Response) => {
  try {
    const jobId = req.params.jobId as string;

    const jobRepo = AppDataSource.getRepository(Job);
    const candidateRepo = AppDataSource.getRepository(Candidate);

    // 1. Fetch Job with recruiter relation
    const job = await jobRepo.findOne({
      where: { id: jobId },
      relations: ["recruiter"],
    });
    if (!job) return res.status(404).json({ message: "Job not found" });

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

    // 2. Fetch all candidates
    const allCandidates = await candidateRepo.find();

    // 3. Simple Keyword Match Scoring
    const jobSkills = job.skills.map(s => s.toLowerCase());

    const results = allCandidates.map(candidate => {
      const candidateSkills = (candidate.skills || []).map(s => s.toLowerCase());
      const resumeContent = (candidate.resumeText || "").toLowerCase();

      // Count how many job skills exist in candidate's skills OR resume text
      let matchCount = 0;
      jobSkills.forEach(skill => {
        if (candidateSkills.includes(skill) || resumeContent.includes(skill)) {
          matchCount++;
        }
      });

      // Calculate score (0 to 1)
      const score = jobSkills.length > 0 ? matchCount / jobSkills.length : 0;

      return {
        id: candidate.id,
        fullName: candidate.fullName,
        skills: candidate.skills,
        score: score,
        resumeUrl: candidate.resumeUrl,
        // Include any other fields you want to show on the card
      };
    });

    // 4. Sort by score and send
    const sortedResults = results
      .filter(c => c.score > 0) // Only show candidates with at least one match
      .sort((a, b) => b.score - a.score);

    res.json(sortedResults);
  } catch (err) {
    console.error("Shortlisting Error:", err);
    res.status(500).json({ message: "Server error during shortlisting" });
  }
};