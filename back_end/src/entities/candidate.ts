import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
  Index,
} from "typeorm";
import { User } from "./user";
import { JobApplication } from "./job_application";
import { JobRecommendation } from "./job_recommendation";

@Entity({ name: "candidates" })
export class Candidate {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // 🔗 One-to-one with User
  @OneToOne(() => User, (user) => user.candidate, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  // 👤 Personal Info
  @Column({ name: "full_name", type: "varchar", length: 255 })
  fullName!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone?: string;

  @Column({ type: "text", nullable: true })
  education?: string;

  @Column({ name: "experience_years", type: "int", default: 0 })
  experience_years!: number;

  // 🧠 Skills (important for matching + recommendations)
  @Index()
  @Column("text", { array: true, nullable: true })
  skills?: string[];

  // 📄 Resume
  @Column({ name: "resume_url", type: "text", nullable: true })
  resumeUrl?: string;

  @Column({ type: "text", nullable: true })
  resumeText?: string;

  @Column("float", { array: true, nullable: true })
  embedding?: number[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  // 📄 Applications (candidate → many applications)
  @OneToMany(() => JobApplication, (application) => application.candidate)
  applications!: JobApplication[];

  // 🎯 Recommendations (candidate → many recommended jobs)
  @OneToMany(() => JobRecommendation, (rec) => rec.candidate)
  recommendations!: JobRecommendation[];
}