import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/authrequest";
import { AppError, } from "../error/AppError";
import {  ERROR_CODES } from "../error/errorCodes";


export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(ERROR_CODES.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(ERROR_CODES.UNAUTHORIZED));
    }

    next();
  };
};