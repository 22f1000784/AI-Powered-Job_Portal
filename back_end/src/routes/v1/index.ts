import { Router } from "express";
import userRoutes from "./userRoutes";
import jobRoutes from "./jobRoutes"
import applicationRoutes from "./applicationRoutes";
import adminRoutes from "./adminRoutes";
import candidateRoutes from "./candidateRoutes";
import recruiterRoutes from "./recruiterRoutes";


const router = Router();
router.use((req, res, next) => {
  console.log("v1Routes hit:", req.method, req.url);
  next();
});
// versioned routes
router.use("/users", userRoutes);
;
router.use("/jobs", jobRoutes);
router.use("/recruiter", recruiterRoutes);
router.use("/applications", applicationRoutes);

router.use("/candidate", candidateRoutes);
router.use("/admin", adminRoutes);
console.log("index.ts hit");
export default router;