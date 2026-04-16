import dotenv from 'dotenv';
dotenv.config();

import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const SECRET_KEY_ENV = process.env.SUPER_SECRET_KEY || 'fallback-key';
export const SECRET_KEY: Secret = SECRET_KEY_ENV as string;

if (!process.env.SUPER_SECRET_KEY) {
    console.warn('SUPER_SECRET_KEY not set in environment!');
}

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        (req as CustomRequest).token = decoded;

        next();
    } catch (err) {
        res.status(401).send('Please authenticate');
    }
};