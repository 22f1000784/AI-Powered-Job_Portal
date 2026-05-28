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
import { Job } from "./job"

@Entity({ name: "job_recommendations" })
@Unique(["candidate", "job"]) // 🚫 avoid duplicate recommendations
export class JobRecommendation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // 👤 Many recommendations → one candidate
  @ManyToOne(() => Candidate, (candidate) => candidate.recommendations, {
    onDelete: "CASCADE",
  })
  @Index()
  candidate!: Candidate;

  // 💼 Many recommendations → one job
  @ManyToOne(() => Job, (job) => job.recommendations, {
    onDelete: "CASCADE",
  })
  @Index()
  job!: Job;

  // 🎯 Recommendation score (AI / similarity score)
  @Column({
    type: "float",
    default: 0,
  })
  score!: number;

  // 📅 When recommendation was generated
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}