import { pool } from "../db/pool.js";
import { Request, Response } from "express";
import { deleteUserFromDb, getAllUsers, getUserFromDb, insertUser, updateUserDb } from "../services/user.service.js";
import { isValidEmail, isValidUUID } from "../helperfunc/validation.js";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await getAllUsers()
        res.json({
            status: "success",
            users: result
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error", message: "Failed to fetch users"
        })
    }
};

export const addUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json(
                {
                    status: "error",
                    message: "Name,email and password are required"
                })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (name.trim().length < 2) {
            return res.status(400).json({
                status: "error",
                message: "Name must be at least 2 characters"
            })
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: "error",
                message: "Please provide a valid email"
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                status: "error",
                message: "Password must be at least 8 characters"
            })
        }


        const result = await insertUser({ name, email, password })

        res.status(201).json({
            status: "success",
            user: result
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
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        // const { id } = req.params;
        const id = req.user?.userId

        console.log(id)

        const { name, email } = req.body;
        if (!isValidUUID(id as string)) {
            return res.status(400).json({ status: "error", message: "Invalid user ID" })
        }
        // validation 
        if (!name || !email) {
            return res.status(400).json({
                status: "error",
                message: "Name and email are required"
            })
        }


        if (name.trim().length < 2) {
            return res.status(400).json({
                status: "error",
                message: "Name must be at least 2 characters"
            })
        }

        if (isValidEmail(email)) {
            return res.status(400).json({
                status: "error",
                message: "Please provide a valid email"
            })
        }

        const result = await updateUserDb({ name, email, id: id as string })
        if (result.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            })
        }

        res.status(200).json({
            status: "success",
            user: result[0]
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
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!isValidUUID(id as string)) {
            return res.status(400).json({ status: "error", message: "Invalid user ID" })
        }
        const result = await getUserFromDb({ id: id as string })

        if (result.length === 0) {
            return res.status(404).json({
                status: "error", message: "User not found"
            })
        }
        res.status(200).json({ status: "success", user: result[0] })


    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            status: "error", message: "Failed to fetch user"
        })
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id as string)) {
            return res.status(400).json({ status: "error", message: "Invalid user ID" })
        }
        const result = await deleteUserFromDb({ id: id as string })

        if (result.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            })
        }

        res.status(200).json({
            status: "success",
            message: "User deleted successfully",
            user: result[0]
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
}

export const getMe = async (req: Request, res: Response) => {
    console.log("getme")
    try {
        const userId = req.user?.userId;
        console.log("userid", userId)
        if (!userId) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized"
            })
        }

        const user = await getUserFromDb({ id: userId })
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            })
        }

        return res.status(200).json({
            status: "success",
            user: user[0]
        })

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch user"
        })

    }
}