import { pool } from "./pool";

const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS refresh_tokens (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token TEXT NOT NULL,
            expires_at TIMESTAMPTZ NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );`)

        console.log("tables created successfully")

    } catch (error: any) {
        console.log("error creating tables", error)

    } finally {
        await pool.end()
    }
}


createTables()