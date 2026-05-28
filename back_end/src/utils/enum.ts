// src/enums/index.ts

// User Roles
export enum UserRole {
  ADMIN = "ADMIN",
  CANDIDATE = "CANDIDATE",
  RECRUITER = "RECRUITER",
}

// Job Application Status
export enum ApplicationStatus {
  APPLIED = "APPLIED",
  SHORTLISTED = "SHORTLISTED",
  REJECTED = "REJECTED",
}

// Work Type (from your CSV)
export enum WorkType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  TEMPORARY = "TEMPORARY",
}