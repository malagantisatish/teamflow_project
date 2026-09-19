import bcrypt from "bcrypt";
import { pool } from "../db/pool";
import jwt from "jsonwebtoken"
import { env } from "../config/env";
import { decode } from "node:punycode";

export const loginQuery = async ({ email, password }: { email: string, password: string }) => {

    const result = await pool.query(`
        SELECT * 
        FROM users
        WHERE email=$1`, [email])

    if (result.rows.length === 0) {
        return {
            error: "EMAIL_NOT_FOUND"
        };
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(
        password, user.password_hash
    )

    if (!isPasswordValid) {
        return {
            error: "INVALID_PASSWORD"
        };
    }

    const token = jwt.sign({
        userId: user.id,
        email: user.email
    },
        env.jwtSecret,
        {
            expiresIn: "15m"
        })

    const refreshToken = jwt.sign(
        {
            userId: user.id
        },
        env.jwtRefreshSecret,
        {
            expiresIn: "7d"
        }
    )

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        token,
        refreshToken: refreshToken
    }
}



export const refreshAccessToken = (refreshToken: string) => {
    try {
        const decoded = jwt.verify(
            refreshToken, env.jwtRefreshSecret
        )

        if (typeof decoded === "string") {
            return {
                error: "INVALID_REFRESH_TOKEN"
            }
        }

        const accessToken = jwt.sign(
            { userId: decoded.userId },
            env.jwtSecret,
            { expiresIn: "15m" }
        )

        return {
            accessToken
        }

    } catch (error: any) {
        console.log(error)

        if (error.name === "TokenExpiredError") {
            return { error: "REFRESH_TOKEN_EXPIRED" }
        }
        return {
            error: "INVALID_REFRESH_TOKEN"
        }
    }
}