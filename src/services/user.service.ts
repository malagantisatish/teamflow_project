import { pool } from "../db/pool.js";

export const getAllUsers = async () => {
    const result = await pool.query(
        `SELECT id,name,email,created_at,updated_at
         FROM users`);
    return result.rows
}


export const insertUser = async ({ name, email, password }: { name: string, email: string, password: string }) => {
    const result = await pool.query(`
            INSERT INTO users (name,email,password_hash)
            VALUES ($1,$2,$3)
            RETURNING id,name,email,created_at`, [name, email, password])

    return result.rows[0]

}

export const updateUserDb = async ({ name, email, id }: { name: string, email: string, id: string }) => {
    const result = await pool.query(`
            UPDATE users
             SET name = $1,
             email = $2,
             updated_at = NOW()
             WHERE id = $3 
             RETURNING id, name, email, created_at, updated_at`, [name, email, id])
    return result.rows

}


export const getUserFromDb = async ({ id }: { id: string }) => {
    const result = await pool.query(`
            SELECT id,name,email,created_at,updated_at
             FROM users
              where id = $1`, [id]);

    return result.rows
}

export const deleteUserFromDb = async ({ id }: { id: string }) => {
    const result = await pool.query(
        `DELETE FROM users WHERE id = $1
            RETURNING id, name, email`, [id]
    )

    return result.rows
}