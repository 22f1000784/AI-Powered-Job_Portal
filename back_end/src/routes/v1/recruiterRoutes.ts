import express from "express";
import { getShortlistedCandidates } from "../../controllers/recruiterController"; // Adjust path as needed
import { authenticate } from "../../middle_wares/authMiddleware"; // Ensure only logged-in users access this
import { authorizeRoles } from "../../middle_wares/roleMiddleware";
import { UserRole } from "../../utils/enum";

const router = express.Router();

// Route to get AI/Keyword shortlisted candidates for a specific job
// Path becomes: /api/v1/recruiter/shortlist/:jobId
router.get("/shortlist/:jobId", authenticate, authorizeRoles(UserRole.RECRUITER, UserRole.ADMIN), getShortlistedCandidates);

// You can add more recruiter routes here later, e.g.:
// router.get("/my-jobs", protect, getRecruiterJobs);

export default router;