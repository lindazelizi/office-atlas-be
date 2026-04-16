import { Request, Response } from 'express';
import * as userServices from '../services/userService.js';
import { recordFailedLogin, resetLoginAttempts } from '../middleware/limit.js';

export const loginOne = async (req: Request, res: Response) => {
    try {
        const foundUser = await userServices.login(req.body);
        resetLoginAttempts(req.body.email);
        res.status(200).json(foundUser);
    } catch (error) {
        recordFailedLogin(req.body.email);
        return res.status(401).json({
            error: error instanceof Error ? error.message : 'Invalid email or password'
        });
    }
};

export const registerOne = async (req: Request, res: Response) => {
    try {
        await userServices.register(req.body);
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        return res.status(500).send((error));
    }
};
