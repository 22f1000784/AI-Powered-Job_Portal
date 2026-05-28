import { Router } from "express";
import { applyJob, getRecruiterShortlisted } from "../../controllers/applicationController";
import { asyncHandler } from "../../middle_wares/asyncHandler";
import { authenticate } from "../../middle_wares/authMiddleware";
import { authorizeRoles } from "../../middle_wares/roleMiddleware";
import { UserRole } from "../../utils/enum";
import { getMyApplications } from "../../controllers/applicationController";
import { updateApplicationStatus } from "../../controllers/applicationController";
const router = Router();

router.post(
  "/apply",
  authenticate,
  authorizeRoles(UserRole.CANDIDATE),
  asyncHandler(applyJob)
);
router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles(UserRole.RECRUITER),
  asyncHandler(updateApplicationStatus)
);
router.get(
  "/shortlisted/all",
  authenticate,
  asyncHandler(getRecruiterShortlisted)
);
router.get(
  "/",
  authenticate,
  asyncHandler(getMyApplications)
);
export default router;