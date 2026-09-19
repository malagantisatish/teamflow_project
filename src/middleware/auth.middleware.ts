import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                status: "error",
                message: "Authentication token is required"
            });
        }

        const token = authHeader.split(" ")[1];
        console.log(token)

        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Invalid authorization header"
            })
        }

        const decoded = jwt.verify(token, env.jwtSecret);

        if (typeof decoded === "string") {
            return res.status(401).json({
                status: "error",
                message: "Invalid token"
            })
        }

        req.user = decoded as JwtPayload & {
            userId: string;
            email: string;
        }

        next();

    } catch (error: any) {
        console.log(error)
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                status: "error",
                message: "Invalid or expired token"
            })
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                status: "error",
                message: "Invalid token"
            })
        }

        return res.status(401).json({
            status: "error",
            message: "Authentication failed"
        })

    }
}