import { Router } from "express";
import { login, refreshToken } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";



const router = Router();

router.post("/login", login);

router.get("/protected", authenticate, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "You can access this protected route",
        user: req.user
    })
})


router.post("/refresh", refreshToken)


export default router