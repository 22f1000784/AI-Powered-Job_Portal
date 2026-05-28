import { Router } from "express";
import { getProfile, updateCandidateProfile } from "../../controllers/candidateController";
import { authenticate } from "../../middle_wares/authMiddleware";
import { asyncHandler } from "../../middle_wares/asyncHandler";
import { upload } from "../../middle_wares/uploadMiddleware";
const router = Router();

router.get("/profile", authenticate, asyncHandler(getProfile));

router.put(
  "/profile",
  authenticate,              // 1️⃣ auth
  upload.single("resume"),   // 2️⃣ multer
  asyncHandler(updateCandidateProfile) // 3️⃣ controller
);

export default router;