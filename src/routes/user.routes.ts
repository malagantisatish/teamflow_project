import { Router } from "express";
import { getUsers, addUser, deleteUser, getUser, updateUser, getMe } from "../controllers/user.controller.js"
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getUsers)

router.post("/", addUser)

router.get("/me", authenticate, getMe)

router.get("/:id", getUser)


router.put("/:id", authenticate, updateUser)


router.delete("/:id", deleteUser)


export default router;