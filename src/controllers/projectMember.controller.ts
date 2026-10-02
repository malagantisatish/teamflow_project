import e, { Request, Response } from "express";
import { addProjectMember, getProjectMembers } from "../services/projectMember.service";
import { isProjectOwnerQuery } from "../services/projects.service";

export const addProjectMemberController = async (req: Request, res: Response) => {
    try {
        const ownerId = req.user?.userId;
        const { id: projectId } = req.params
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

        const isProjectOwner = await isProjectOwnerQuery({ ownerId: ownerId, projectId: projectId as string });

        if (!isProjectOwner) {
            return res.status(403).json({
                status: "error",
                message: "Only the project owner can add members"
            })
        }

        const result = await addProjectMember({ projectId: projectId as string, userId: ownerId });
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

export const getProjectMembersController = async (req: Request, res: Response) => {
    try {
        const ownerId = req.user?.userId
        const { id: projectId } = req.params

        if (!ownerId) {
            return res.status(401).json({
                status: "error",
                message: "Authentication required"
            })
        };

        const isOwner = await isProjectOwnerQuery({ ownerId: ownerId, projectId: projectId as string });
        if (!isOwner) {
            return res.status(403).json({
                status: "error",
                message: "Only the project owner can view project members"
            })
        }

        const result = await getProjectMembers({ projectId: projectId as string });
        return res.status(200).json({
            status: "success",
            members: result
        })

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message: "Failed to get project members list"
        })

    }
}

