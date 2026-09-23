import { Request, Response } from "express"
import { deleteRefreshToken, findRefreshToken, loginQuery, refreshAccessToken, refreshTokenExpiresAt, saveRefreshToken } from "../services/auth.service.js";
import { env } from "../config/env.js";
import jwt from "jsonwebtoken"

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

        // note we are using cookie for sending refresh token


        const expiresAt = refreshTokenExpiresAt
        await saveRefreshToken({ token: result?.refreshToken ?? "", userId: result.user?.id ?? "", expiresAt: expiresAt })

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: env.nodeEnv === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })


        return res.status(200).json({
            status: "success",
            message: "Login successfull",
            user: result.user,
            accessToken: result.token,
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
        // const { refreshToken } = req.body;
        const refreshToken = req.cookies?.refreshToken ?? ""
        if (!refreshToken) {
            return res.status(400).json({
                status: "error",
                message: "Refresh token is required"
            })
        }

        // in below i am generating the access token by validating the refresh token

        const result = await refreshAccessToken(refreshToken);

        if ("error" in result) {
            if (result.error === "REFRESH_TOKEN_EXPIRED") {
                return res.status(401).json({
                    status: "error",
                    message: "Refresh token has expired"
                })

            }

            if (result.error === "REFRESH_TOKEN_NOT_FOUND") {
                return res.status(401).json({
                    status: "error",
                    message: "Refresh token has beem revoked"
                })
            }
            return res.status(401).json({
                status: "error",
                message: "Invalid refresh token"
            })
        }

        res.cookie("refreshToken", result.newRefreshToken, {
            httpOnly: true,
            secure: env.nodeEnv === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            status: "success",
            message: "Access token refreshed successfully",
            accessToken: result.accessToken
        })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: "Refresh token api failed"
        })
    }
}


export const logout = async (req: Request, res: Response) => {
    try {

        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            await deleteRefreshToken({ token: refreshToken })
        }
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: env.nodeEnv === "production",
            sameSite: "strict"
        })

        return res.status(200).json({
            status: "success",
            message: "Logout successful"
        })

    } catch (error: any) {
        res.status(500).json({
            status: "error",
            message: "logout request failed"
        })

    }
}