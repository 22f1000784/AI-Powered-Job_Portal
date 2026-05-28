import { Response } from "express";
import { AppDataSource } from "../config/data_source";
import { Candidate } from "../entities/candidate";
import { Job } from "../entities/job";
import { AuthRequest } from "../types/authrequest";
import { AppError } from "../error/AppError";
import { ERROR_CODES } from "../error/errorCodes";
import { getEmbedding } from "../services/embeddingService";
import { cosineSimilarity } from "../utils/math";

export const getRecommendedJobs = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError(ERROR_CODES.UNAUTHORIZED);

  const candidateRepo = AppDataSource.getRepository(Candidate);
  const jobRepo = AppDataSource.getRepository(Job);

  const candidate = await candidateRepo.findOne({
    where: { user: { id: req.user.id } },
  });

  if (!candidate || (!candidate.resumeText && (!candidate.skills || candidate.skills.length === 0))) {
    return res.status(400).json({
      message: "Please update your profile or upload a resume to get recommendations.",
      requiresResume: true,
    });
  }

  // 1. Get candidate embedding
  let candidateEmbedding = candidate.embedding;
  if (!candidateEmbedding || candidateEmbedding.length === 0) {
    console.log("Candidate embedding missing. Generating on-the-fly...");
    const skillsList = candidate.skills || [];
    const edu = candidate.education || "";
    const expText = candidate.resumeText || "";
    const candidateContext = `
      Skills: ${skillsList.join(", ")}
      Education: ${edu}
      Experience: ${expText}
    `.trim();

    try {
      candidateEmbedding = await getEmbedding(candidateContext);
      candidate.embedding = candidateEmbedding;
      await candidateRepo.save(candidate);
    } catch (err) {
      console.error("Error generating candidate embedding on-the-fly:", err);
      return res.status(500).json({ message: "Failed to generate recommendation profile embedding" });
    }
  }

  // 2. Fetch all available jobs
  const jobs = await jobRepo.find();
  if (jobs.length === 0) return res.json([]);

  try {
    console.log("Running Fast Vector Similarity Recommendation Engine...");
    const start = Date.now();

    // 3. Score all jobs using cosine similarity of pre-computed embeddings
    const scoredResults = [];
    for (const job of jobs) {
      let jobEmbedding = job.embedding;
      if (!jobEmbedding || jobEmbedding.length === 0) {
        console.log(`Job ${job.id} embedding missing. Generating on-the-fly...`);
        const skillsList = job.skills || [];
        const jobText = `
          Title: ${job.jobTitle}
          Role: ${job.role}
          Description: ${job.description}
          Requirements: ${skillsList.join(", ")}
        `.trim();
        try {
          jobEmbedding = await getEmbedding(jobText);
          job.embedding = jobEmbedding;
          await jobRepo.save(job);
        } catch (err) {
          console.error(`Error generating job ${job.id} embedding:`, err);
          continue;
        }
      }

      const score = cosineSimilarity(candidateEmbedding, jobEmbedding);
      scoredResults.push({
        ...job,
        score,
      });
    }

    // 4. Sort and return top 15
    const results = scoredResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);

    console.log(`Recommendations calculated in ${Date.now() - start} ms.`);
    return res.json(results);
  } catch (err) {
    console.error("Recommendation Engine Error:", err);
    return res.status(500).json({ message: "Recommendation engine failed" });
  }
};


