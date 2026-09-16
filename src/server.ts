import app from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./db/pool.js";



const startServer = async () => {
    try {
        await pool.query("SELECT NOW()")
        console.log("Database connected successfully");
        app.listen(env.port, () => {
            console.log(`Server running on port ${env.port}`)
        })

    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
}

startServer()
