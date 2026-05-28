import { Router } from "express";
import { signupUser } from "../../controllers/userController";
import { loginUser } from "../../controllers/userController";
import { asyncHandler } from "../../middle_wares/asyncHandler";

const router = Router();
router.use((req, res, next) => {
  console.log("userRoutes hit:", req.method, req.url);
  next();
});
console.log("Users route hit");
router.post("/signup", asyncHandler(signupUser));
// router.post("/signup", signupUser);

router.post("/login", asyncHandler(loginUser));
console.log("Users route hit");
export default router;