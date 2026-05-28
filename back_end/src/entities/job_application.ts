import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
  Index,
} from "typeorm";
import { Candidate } from "./candidate";
import { Job } from "./job";
import { ApplicationStatus } from "../utils/enum";

@Entity({ name: "job_applications" })
@Unique(["candidate", "job"]) // 🚫 prevents duplicate applications
export class JobApplication {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // 👤 Many applications → one candidate
  @ManyToOne(() => Candidate, (candidate) => candidate.applications, {
    onDelete: "CASCADE",
  })
  @Index()
  candidate!: Candidate;

  // 💼 Many applications → one job
  @ManyToOne(() => Job, (job) => job.applications, {
    onDelete: "CASCADE",
  })
  @Index()
  job!: Job;

  // 🎯 Matching score (AI / algorithm output)
  @Column({
    type: "float",
    default: 0,
  })
  matchingScore!: number;

  // 📌 Application status (controlled by recruiter)
  @Column({
    type: "enum",
    enum: ApplicationStatus,
    default: ApplicationStatus.APPLIED,
  })
  status!: ApplicationStatus;

  // 📅 Timestamp
  @CreateDateColumn({ name: "applied_at" })
  appliedAt!: Date;
}