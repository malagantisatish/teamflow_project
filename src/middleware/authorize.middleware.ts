import { Request, Response, NextFunction } from "express";



export const authorize = ({ requiredRole }: { requiredRole: string }) => {

    // this is HOF and using closure concepts
    return (req: Request, res: Response, next: NextFunction) => {

        if (!req.user) {
            return res.status(401).json({
                status: "error",
                message: "Authentication required"
            })
        }

        if (req.user.role !== requiredRole) {
            return res.status(403).json({
                status: "error",
                messsage: "You are not authorized to access this resource"
            })
        }


        next()

    }

}



