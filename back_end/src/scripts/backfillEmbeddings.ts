import "reflect-metadata";
import { AppDataSource } from "../config/data_source";
import { Job } from "../entities/job";
import { Candidate } from "../entities/candidate";
import { getEmbedding } from "../services/embeddingService";

const backfill = async () => {
  try {
    console.log("Initializing database connection...");
    await AppDataSource.initialize();
    console.log("Database connected.");

    const jobRepo = AppDataSource.getRepository(Job);
    const candidateRepo = AppDataSource.getRepository(Candidate);

    // 1. Backfill Job Embeddings
    console.log("Fetching jobs without embeddings...");
    const jobs = await jobRepo.find();
    console.log(`Found ${jobs.length} total jobs to process.`);

    let jobCount = 0;
    for (const job of jobs) {
      if (!job.embedding || job.embedding.length === 0) {
        const skillsList = job.skills || [];
        const jobText = `
          Title: ${job.jobTitle}
          Role: ${job.role}
          Description: ${job.description}
          Requirements: ${skillsList.join(", ")}
        `.trim();

        try {
          job.embedding = await getEmbedding(jobText);
          await jobRepo.save(job);
          jobCount++;
          console.log(`[${jobCount}] Pre-computed embedding for job: ${job.jobTitle}`);
        } catch (err) {
          console.error(`Failed to embed job ${job.id}:`, err);
        }
      }
    }
    console.log(`Finished job backfill. Updated ${jobCount} jobs.`);

    // 2. Backfill Candidate Embeddings
    console.log("Fetching candidates without embeddings...");
    const candidates = await candidateRepo.find();
    console.log(`Found ${candidates.length} total candidates to process.`);

    let candidateCount = 0;
    for (const candidate of candidates) {
      if ((!candidate.embedding || candidate.embedding.length === 0) && (candidate.skills || candidate.resumeText)) {
        const skillsList = candidate.skills || [];
        const edu = candidate.education || "";
        const expText = candidate.resumeText || "";
        const candidateContext = `
          Skills: ${skillsList.join(", ")}
          Education: ${edu}
          Experience: ${expText}
        `.trim();

        try {
          candidate.embedding = await getEmbedding(candidateContext);
          await candidateRepo.save(candidate);
          candidateCount++;
          console.log(`[${candidateCount}] Pre-computed embedding for candidate: ${candidate.fullName}`);
        } catch (err) {
          console.error(`Failed to embed candidate ${candidate.id}:`, err);
        }
      }
    }
    console.log(`Finished candidate backfill. Updated ${candidateCount} candidates.`);

  } catch (error) {
    console.error("Backfill Error:", error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    console.log("Database connection closed.");
    process.exit();
  }
};

backfill();
