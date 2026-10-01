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

export const getProjectById = async ({ ownerId, projectid }: { projectid: string, ownerId: string }) => {
    const result = await pool.query(`
        SELECT id,name,description,owner_id,created_at,updated_at
        FROM projects
        WHERE id = $1 AND owner_id = $2`, [projectid, ownerId]);

    return result.rows[0] || null


}

export const updateProject = async ({ description, name, ownerId, projectId }: { ownerId: string, projectId: string, description: string, name: string, }) => {
    const result = await pool.query(`
        UPDATE projects
        SET 
           name = $1,
           description = $2,
           updated_at = NOW()
           WHERE id = $3 and owner_id = $4
           RETURNING id,name, description, owner_id, created_at, updated_at`, [name, description, projectId, ownerId])

    return result.rows[0] || null
}


export const deleteProject = async ({ ownerId, projectId }: { ownerId: string, projectId: string }) => {
    const result = await pool.query(`
        DELETE FROM projects
        WHERE id = $1 and owner_id = $2
        RETURNING id`, [projectId, ownerId])
    return result.rows[0] || null

};


export const isProjectOwnerQuery = async ({ ownerId, projectId }: { ownerId: string, projectId: string }) => {
    const result = await pool.query(`
        SELECT id from projects 
        WHERE id = $1 AND owner_id = $2
        `, [projectId, ownerId]);

    return result.rows.length > 0;
}