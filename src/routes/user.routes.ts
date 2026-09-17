import { Router } from "express";
import { pool } from "../db/pool.js";
import { getUsers, addUser, deleteUser, getUser, updateUser } from "../controllers/user.controller.js"

const router = Router();

router.get("/", getUsers)

router.post("/", addUser)


router.get("/:id", getUser)


router.put("/:id", updateUser)


router.delete("/:id", deleteUser)

export default router;