import bcrypt from "bcrypt";
import { pool } from "../db/pool";

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

    return {
        id: user.id,
        name: user.name,
        email: user.email,

    }





}