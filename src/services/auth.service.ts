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



export const refreshAccessToken = async (refreshToken: string) => { // generating the new access token by validating the  refresh token
    try {
        const decoded = jwt.verify(
            refreshToken, env.jwtRefreshSecret
        )

        if (typeof decoded === "string") {
            return {
                error: "INVALID_REFRESH_TOKEN"
            }
        }

        const dbRefreshToken = await findRefreshToken({ token: refreshToken })
        if (!dbRefreshToken) {
            return { error: "REFRESH_TOKEN_NOT_FOUND" }
        }

        const accessToken = jwt.sign(
            { userId: decoded.userId },
            env.jwtSecret,
            { expiresIn: "1m" }
        )

        const newRefreshToken = jwt.sign(
            { userId: decoded.userId },
            env.jwtRefreshSecret,
            {
                expiresIn: "7d"
            }
        )

        const expiresAt = refreshTokenExpiresAt

        await saveRefreshToken({ expiresAt: expiresAt, token: newRefreshToken, userId: decoded.userId })

        await deleteRefreshToken({ token: refreshToken });



        return {
            accessToken,
            newRefreshToken
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


export const refreshTokenExpiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
);

export const saveRefreshToken = async ({ userId, expiresAt, token }: { userId: string, token: string, expiresAt: Date }) => {

    await pool.query(
        `INSERT INTO refresh_tokens 
           (user_id, token, expires_at)
           VALUES ($1,$2,$3)`, [userId, token, expiresAt]
    )
}


export const findRefreshToken = async ({ token }: { token: string }) => {
    const result = await pool.query(`
        SELECT id, user_id, token, expires_at
        FROM refresh_tokens WHERE token = $1`, [token])

    return result.rows[0]

}

export const deleteRefreshToken = async ({ token }: { token: string }) => {
    await pool.query(`
        DELETE FROM refresh_tokens where token=$1`, [token])
}