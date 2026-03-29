import { pool } from "../../config/db";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import config from "../../config";

export type UserRole = 'admin' | 'customer';
export interface IUserInfo {
    id?: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: UserRole;
    created_at?: Date;
    updated_at?: Date;
}

const userRegister = async (payload: IUserInfo) => {
    const { name, email, password, phone, role } = payload;
    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        role
            ? `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`
            : `INSERT INTO users(name, email, password, phone) VALUES($1, $2, $3, $4) RETURNING *`,
        role ? [name, email, hashedPassword, phone, role] : [name, email, hashedPassword, phone]
    );
    return result.rows[0];
};

const userLogin = async (email: string, password: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) {
        return null; 
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return false; 
    }
    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        config.secret as string,
        { expiresIn: "7d" }
    );
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    };
}

export const authService = {
    userRegister,
    userLogin
}