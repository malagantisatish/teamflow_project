import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createProjectController, getProjectByidController, getProjectsController } from "../controllers/project.controller";

const router = Router();



router.post("/", authenticate, createProjectController);
router.get("/", authenticate, getProjectsController)
router.get("/:id", authenticate, getProjectByidController)

export default router