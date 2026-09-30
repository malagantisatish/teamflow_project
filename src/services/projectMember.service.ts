import { pool } from "../db/pool";


export const addProjectMember = async ({ projectId, userId }: { projectId: string, userId: string }) => {

    const result = await pool.query(
        `INSERT INTO project_members
         (project_id, user_id)
         VALUES ($1, $2)
         RETURNING id,project_id,user_id, role,created_at
        `, [projectId, userId]
    )

    return result.rows[0]

}