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

export const getProjectMembers = async ({ projectId }: { projectId: string }) => {
    try {
        const result = await pool.query(`
            SELECT
             u.id,u.name,u.email,pm.role,pm.created_at 
             FROM project_members pm
              INNER JOIN users u ON pm.user_id = u.id
              WHERE pm.project_id = $1
              ORDER BY pm.created_at ASC`, [projectId]);
        return result.rows

    } catch (error) {
        console.log(error)
        return null
    }

}