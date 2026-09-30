import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createProjectController, deleteProjectController, getProjectByidController, getProjectsController, updateProjectController } from "../controllers/project.controller";

const router = Router();



router.post("/", authenticate, createProjectController);
router.get("/", authenticate, getProjectsController)
router.get("/:id", authenticate, getProjectByidController);
router.put("/:id", authenticate, updateProjectController);
router.delete("/:id", authenticate, deleteProjectController);


export default router