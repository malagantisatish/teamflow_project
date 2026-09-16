import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json({
            status: "success",
            users: result.rows
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error", message: "Failed to fetch users"
        })
    }
})

router.post("/", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json(
                {
                    status: "error",
                    message: "Name,email and password are required"
                })
        }
        const result = await pool.query(`
            INSERT INTO users (name,email,password_hash)
            VALUES ($1,$2,$3)
            RETURNING id,name,email,created_at`, [name, email, password])

        res.status(201).json({
            status: "success",
            user: result.rows[0]
        })

    } catch (error: any) {
        console.log(error);
        if (error.code === "23505") {
            return res.status(409).json({
                status: "error", message: "Email already exists"
            })
        }
        res.status(500).json({
            status: "error", message: "Failed to add user"
        })
    }
})


router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT id,name,email,created_at,updated_at
             FROM users
              where id = $1`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "error", message: "User not found"
            })
        }
        res.status(200).json({ status: "success", user: result.rows[0] })


    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            status: "error", message: "Failed to fetch user"
        })
    }
})


router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        // validation 
        if (!name || !email) {
            return res.status(400).json({
                status: "error",
                message: "Name and email are required"
            })
        }

        const result = await pool.query(`
            UPDATE users
             SET name = $1,
             email = $2,
             updated_at = NOW()
             WHERE id = $3 
             RETURNING id, name, email, created_at, updated_at`, [name, email, id])
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            })
        }

        res.status(200).json({
            status: "success",
            user: result.rows[0]
        })

    } catch (error: any) {
        console.log(error)
        if (error.code === "23505") {
            return res.status(409).json({
                status: "error",
                message: "Email already exists"
            })
        }
        res.status(501).json({
            status: "error", message: "error while upading user"
        })
    }
})


router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `DELETE FROM users WHERE id = $1
            RETURNING id, name, email`, [id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            })
        }

        res.status(200).json({
            status: "success",
            message: "User deleted successfully",
            user: result.rows[0]
        })

    } catch (error: any) {
        console.log(error)
        if (error.code === "23505") {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            })
        }

        res.status(500).json({
            status: "error",
            message: "Failed to delete user"
        })

    }
})

export default router;