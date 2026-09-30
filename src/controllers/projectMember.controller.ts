import { Request, Response } from "express";
import { addProjectMember } from "../services/projectMember.service";

export const addProjectMemberController = async (req: Request, res: Response) => {
    try {
        const ownerId = req.user?.userId;
        const { userId } = req.body;

        if (!ownerId) {
            return res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
        };

        if (!userId) {
            return res.status(401).json({
                status: "error",
                message: "UserId is required"
            });
        };

        const result = await addProjectMember({ projectId: userId as string, userId: ownerId });
        return res.status(201).json({
            status: "success",
            memberDetails: result
        })


    } catch (error: any) {
        console.log(error);

        if (error.code === "23505") {
            return res.status(409).json({
                status: "error",
                message: "User is already a member of this project"
            });
        }
        return res.status(500).json({
            status: "error",
            message: "Failed to add user to the project"
        });
    }
}


