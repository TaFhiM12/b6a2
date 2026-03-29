import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const auth = (requireAdmin: boolean = false) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized"
            });
        }
        try {
            const decoded = jwt.verify(token, config.secret as string);
            req.user = decoded;

            if (requireAdmin && req.user?.role !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. Admins only."
                });
            }

            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
    };
};

export default auth;