import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { createProjectController } from "../controllers/project.controller";

const router = Router();



router.post("/", authenticate, createProjectController);

export default router