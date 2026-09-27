import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createProjectController, getProjectsController } from "../controllers/project.controller";

const router = Router();



router.post("/", authenticate, createProjectController);
router.get("/", authenticate, getProjectsController)

export default router