import { Request, Response } from "express"
import { loginQuery, refreshAccessToken } from "../services/auth.service.js";

export const login = async (req: Request, res: Response) => {
    console.log(req.body)

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
            user: result.user,
            accessToken: result.token,
            refreshToken: result.refreshToken
        })


    } catch (error: any) {
        console.log(error)
        return res.status(500).json({
            status: "error",
            message: "Login failed"
        })
    }
}


export const refreshToken = async (req: Request, res: Response) => {
    try {

    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: "Refresh token api failed"
        })
    }
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({
            status: "error",
            message: "Refresh token is required"
        })
    }

    const result = refreshAccessToken(refreshToken);

    if ("error" in result) {
        if (result.error === "REFRESH_TOKEN_EXPIRED") {
            return res.status(401).json({
                status: "error",
                message: "Refresh token has expired"
            })

        }
        return res.status(401).json({
            status: "error",
            message: "Invalid refresh token"
        })
    }

    return res.status(200).json({
        status: "success",
        message: "Access token refreshed successfully",
        accessToken: result.accessToken
    })
}