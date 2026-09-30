import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { addProjectMemberController } from "../controllers/projectMember.controller";

const router = Router();


router.post("/:id/member", authenticate, addProjectMemberController)


export default router