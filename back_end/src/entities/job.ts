import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  Index,
} from "typeorm";
import { Recruiter } from "./recruiter";
import { JobApplication } from "./job_application";
import { JobRecommendation } from "./job_recommendation";
import { WorkType } from "../utils/enum";

@Entity({ name: "jobs" })
export class Job {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // 🔗 Many jobs → one recruiter
  @ManyToOne(() => Recruiter, (recruiter) => recruiter.jobs, {
    onDelete: "CASCADE",
  })
  recruiter!: Recruiter;

  // 🧾 From your CSV

  @Column({ name: "job_title", type: "varchar", length: 255 })
  jobTitle!: string;

  @Column({ type: "varchar", length: 255 })
  role!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "text", nullable: true })
  qualifications?: string;

  @Column({ name: "experience_required", type: "int", default: 0 })
  experienceRequired!: number;

  @Column({
    type: "enum",
    enum: WorkType,
  })
  workType!: WorkType;

  // 🧠 Skills (critical for matching + recommendations)
  @Index()
  @Column("text", { array: true })
  skills!: string[];

  @Column("float", { array: true, nullable: true })
  embedding?: number[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  // 📄 Applications (job → many candidates)
  @OneToMany(() => JobApplication, (app) => app.job)
  applications!: JobApplication[];

  // 🎯 Recommendations (job → many candidates)
  @OneToMany(() => JobRecommendation, (rec) => rec.job)
  recommendations!: JobRecommendation[];
}