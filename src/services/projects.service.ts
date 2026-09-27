import { pool } from "../db/pool"

export const createProjectQuery = async ({ name, description, ownerid }: { name: string, description: string, ownerid: string }) => {
    const result = await pool.query(`
    INSERT INTO projects (name,description,owner_id)
       VALUES ($1,$2,$3)
       RETURNING id,name,description,owner_id,created_at,updated_at`, [name, description, ownerid]);
    return result.rows[0];
}

export const getProjectsByOwnerid = async ({ ownerId }: { ownerId: string }) => {
    const result = await pool.query(
        `SELECT id,name, description, owner_id, created_at, updated_at 
        FROM projects WHERE owner_id = $1
        ORDER BY created_at DESC`, [ownerId]
    )

    return result.rows

}