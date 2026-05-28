import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user";
import { Job } from "./job";

@Entity({ name: "recruiters" })
export class Recruiter {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // 🔗 One-to-one with User
  @OneToOne(() => User, (user) => user.recruiter, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  // 🏢 Company Details
  @Column({ name: "company_name", type: "varchar", length: 255 })
  companyName!: string;

  @Column({ name: "contact_person", type: "varchar", length: 255 })
  contactPerson!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone?: string;

  @Column({ name: "company_website", type: "text", nullable: true })
  companyWebsite?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  // 💼 Recruiter → Jobs (one-to-many)
  @OneToMany(() => Job, (job) => job.recruiter)
  jobs!: Job[];
}