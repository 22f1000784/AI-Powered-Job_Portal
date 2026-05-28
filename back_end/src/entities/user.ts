import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from "typeorm";
import { UserRole } from "../utils/enum";
import { Candidate } from "./candidate";
import { Recruiter } from "./recruiter";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // 📧 Email (unique + required)
  @Column({
    type: "varchar",
    length: 255,
    unique: true,
  })
  email!: string;

  // 🔒 Password (hashed)
  @Column({
    type: "text",
  })
  password!: string;

  // 👤 Role (ADMIN / CANDIDATE / RECRUITER)
  @Column({
    type: "enum",
    enum: UserRole,
  })
  role!: UserRole;

  // 📅 Created timestamp
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  // 🔗 Relations

  @OneToOne(() => Candidate, (candidate) => candidate.user)
  candidate!: Candidate;

  @OneToOne(() => Recruiter, (recruiter) => recruiter.user)
  recruiter!: Recruiter;
}