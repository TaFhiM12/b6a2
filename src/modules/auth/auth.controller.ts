import { Request, Response } from "express";
import { authService } from "./auth.service";

const userRegister = async (req: Request, res: Response) => {
    try {
        const result = await authService.userRegister(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: result.id,
                name: result.name,
                email: result.email,
                phone: result.phone,
                role: result.role
            }
        });
    } catch (err: any) {
        console.error(err); 
        res.status(500).json({ 
            success: false,
            message: "Internal server error"
        });
    }
};

const userLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await authService.userLogin(email, password);
        if (result === null) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (result === false) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });

    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const authController = {
    userRegister,
    userLogin
};