import { Request, Response } from "express";
import { AppDataSource } from "../config/data_source";
import { User } from "../entities/user";
import { Candidate } from "../entities/candidate";
import { Recruiter } from "../entities/recruiter";
import { UserRole } from "../utils/enum";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../error/AppError";
import {  ERROR_CODES } from "../error/errorCodes"

export const signupUser = async (req: Request, res: Response) => {
  const { email, password, role, fullName, companyName, contactPerson } = req.body;
  console.log("Signup hit");
  const userRepo = AppDataSource.getRepository(User);
console.log("Repo created");
  // 🔍 check if user exists
  const existing = await userRepo.findOne({ where: { email } });
  if (existing) {
    throw new AppError(ERROR_CODES.USER_ALREADY_EXISTS);
  }

  // 🔒 hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // ⚡ transaction (important)
  await AppDataSource.transaction(async (manager) => {
    const user = manager.create(User, {
      email,
      password: hashedPassword,
      role,
    });

    await manager.save(user);

    // 👤 create profile based on role
    if (role === UserRole.CANDIDATE) {
      await manager.save(
        manager.create(Candidate, {
          user,
          fullName,
        })
      );
    }

    if (role === UserRole.RECRUITER) {
      await manager.save(
        manager.create(Recruiter, {
          user,
          companyName,
          contactPerson,
        })
      );
    }
  });

  return res.status(201).json({
    message: "User registered successfully",
  });
};
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userRepo = AppDataSource.getRepository(User);

  // 🔍 find user
  const user = await userRepo.findOne({ where: { email } });

  if (!user) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED);
  }

  // 🔒 compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED);
  }

  // 🔐 generate token
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.json({
    message: "Login successful",
    token,
    
  });
};