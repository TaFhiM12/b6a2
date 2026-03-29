import { Request, Response } from "express";
import { userService } from "./user.service";

const getUser = async (req: Request, res: Response) => {
    try {
        const users = await userService.getUsers();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const updateUser = async(req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId as string);
        const currentUser = req.user;
        if (currentUser.role !== "admin" && currentUser.id !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own profile"
            });
        }
        if (req.body.role && currentUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can change roles"
            });
        }
        const updatedUser = await userService.updateUser(userId, req.body);
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const userController = {
    getUser,
    updateUser
}