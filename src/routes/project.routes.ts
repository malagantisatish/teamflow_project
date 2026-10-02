import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createProjectController, deleteProjectController, getProjectByidController, getProjectsController, updateProjectController } from "../controllers/project.controller";
import { addProjectMemberController, getProjectMembersController } from "../controllers/projectMember.controller";

const router = Router();



router.post("/", authenticate, createProjectController);
router.get("/", authenticate, getProjectsController)
router.get("/:id", authenticate, getProjectByidController);
router.put("/:id", authenticate, updateProjectController);
router.delete("/:id", authenticate, deleteProjectController);

// project members 

router.post("/:id/members", authenticate, addProjectMemberController); // here id is project id 
router.get("/:id/members", authenticate, getProjectMembersController)



export default router