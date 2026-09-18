import { Request, Response } from "express"
import { loginQuery } from "../services/auth.service";

export const login = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Email and password are required"
            })
        }

        const result = await loginQuery({ email: email, password: password })

        if (result.error === "EMAIL_NOT_FOUND") {
            return res.status(401).json({
                status: "error",
                message: "Email not found"
            })
        }
        if (result.error === "INVALID_PASSWORD") {
            return res.status(401).json({
                status: "error",
                message: "Incorrect password"
            })
        }


        return res.status(200).json({
            status: "success",
            message: "Login successfull",
            user: result
        })


    } catch (error: any) {
        console.log(error)
        return res.status(500).json({
            status: "error",
            message: "Login failed"
        })
    }
}