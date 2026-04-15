import { Request, Response } from 'express';
import * as userServices from '../services/userService.js';

export const loginOne = async (req: Request, res: Response) => {
    try {
        const foundUser = await userServices.login(req.body);
        res.status(200).send(foundUser);
    } catch (error) {
        return res.status(401).json({ error: 'Invalid email or password' });
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
