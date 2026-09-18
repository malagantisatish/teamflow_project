import { Request, Response } from "express"

export const login = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Email and password are required"
            })
        }

    } catch (error: any) {
        console.log(error)
        return res.status(500).json({
            status: "error",
            message: "Login failed"
        })
    }
}