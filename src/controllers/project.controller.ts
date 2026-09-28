import { Request, Response } from "express";
import { createProjectQuery, deleteProject, getProjectById, getProjectsByOwnerid, updateProject } from "../services/projects.service";

export const createProjectController = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const ownerId = req.user?.userId;

        if (!name) {
            return res.status(400).json({
                status: "error",
                message: "Project name is required"
            })
        }

        if (!ownerId) {
            return res.status(403).json({
                status: "error",
                message: "Unauthorized"
            })
        }

        const project = await createProjectQuery({ description: description ?? null, name: name, ownerid: ownerId });

        return res.status(201).json({
            status: "success",
            message: "project created successfully",
            project
        })



    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message: "Failed to create project"
        })

    }

}


export const getProjectsController = async (req: Request, res: Response) => {
    try {
        const ownerId = req.user?.userId;
        if (!ownerId) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized"
            });
        }

        const projects = await getProjectsByOwnerid({ ownerId: ownerId })
        return res.status(200).json({
            status: "success",
            projects

        })

    } catch (error: any) {
        console.log(error)
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch the  projects"
        })
    }
}


export const getProjectByidController = async (req: Request, res: Response) => {
    try {
        const ownerId = req.user?.userId;
        const { id } = req.params;
        if (!ownerId) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized"
            })
        }

        const project = await getProjectById({ ownerId: ownerId, projectid: id as string });
        if (!project) {
            return res.status(404).json({
                status: "error",
                message: "Project not found"
            })
        }
        return res.status(200).json({
            status: "Success",
            project
        })

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch project"
        })
    }
}

export const updateProjectController = async (req: Request, res: Response) => {
    try {
        const ownerId = req.user?.userId;
        const { id } = req.params;

        const { name, description } = req.body;

        if (!ownerId) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized"
            })
        }

        if (!name) {
            return res.status(400).json({
                status: "error",
                message: "Project name is required"
            })
        }

        const project = await updateProject({ description: description, name: name, ownerId: ownerId as string, projectId: id as string });
        if (!project) {
            return res.status(404).json({
                status: "error",
                message: "Project not found"
            })

        }
        return res.status(200).json({
            status: "Success",
            project

        })

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message: "Project updation failed"
        })
    }
}


export const deleteProjectController = async (req: Request, res: Response) => {
    try {
        const ownerId = req.user?.userId;
        const { id } = req.params;
        if (!ownerId) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized"
            })
        }

        const result = await deleteProject({ ownerId: ownerId as string, projectId: id as string });
        if (!result) {
            return res.status(404).json({
                status: "error",
                message: "Project not found"
            })
        }
        return res.status(200).json({
            status: "success",
            message: "Project deleted successfully"
        })

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message: "Failed to delete the project"
        })
    }
}