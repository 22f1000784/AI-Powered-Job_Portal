import { Router } from "express";
import { getAdminStats, getAllUsers, deleteUser, getAllJobsAdmin, deleteJobAdmin } from "../../controllers/adminControllers";
import { asyncHandler } from "../../middle_wares/asyncHandler";
import { authenticate } from "../../middle_wares/authMiddleware";
import { authorizeRoles } from "../../middle_wares/roleMiddleware";
import { UserRole } from "../../utils/enum";

const router = Router();

router.get(
  "/stats",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  asyncHandler(getAdminStats)
);

router.get(
  "/users",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  asyncHandler(getAllUsers)
);

router.delete(
  "/users/:id",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  asyncHandler(deleteUser)
);

router.get(
  "/jobs",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  asyncHandler(getAllJobsAdmin)
);

router.delete(
  "/jobs/:id",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  asyncHandler(deleteJobAdmin)
);

export default router;