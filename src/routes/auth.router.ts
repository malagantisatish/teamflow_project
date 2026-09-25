import { Router } from "express";
import { login, logout, refreshToken } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";



const router = Router();

router.post("/login", login);


router.get("/protected", authenticate, authorize({ requiredRole: "admin" }), (req, res) => {
    res.status(200).json({
        status: "success",
        message: "You can access this protected route",
        user: req.user
    })
})


router.post("/refresh", refreshToken)

router.post("/logout", logout)






export default router