import { Router } from "express";
import { createJob,getAllJobs,getJobById,getMyJobs} from "../../controllers/jobController";
import { asyncHandler } from "../../middle_wares/asyncHandler";
import { authenticate } from "../../middle_wares/authMiddleware";
import { authorizeRoles } from "../../middle_wares/roleMiddleware";
import { UserRole } from "../../utils/enum";
import { getRecommendedJobs } from "../../controllers/recommendationController";
import { getApplicantsByJob } from "../../controllers/applicationController";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeRoles(UserRole.RECRUITER, UserRole.ADMIN),
  asyncHandler(createJob)
);
router.get("/", asyncHandler(getAllJobs));
router.get(
  "/recommendations",
  authenticate,
  asyncHandler(getRecommendedJobs)
);

router.get("/:id", asyncHandler(getJobById));
router.get("/:jobId/applicants", authenticate, authorizeRoles(UserRole.RECRUITER, UserRole.ADMIN), asyncHandler(getApplicantsByJob));

router.get(
  "/recruiter/my-jobs",
  authenticate,
  authorizeRoles(UserRole.RECRUITER),
  asyncHandler(getMyJobs)
);

export default router;