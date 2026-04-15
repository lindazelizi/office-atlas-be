import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getAllLocations } from './services/locationService.js';
import * as userController from './controllers/user.controller.js';
import { auth } from './middleware/auth.js';
import { loginValidation, registerValidation, handleValidationErrors } from './middleware/validators.js';
import { loginLimiter } from './middleware/limit.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
})); app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/locations', auth, async (req: Request, res: Response) => {
    try {
        const typeQuery = (typeof req.query.type === 'string' ? req.query.type : undefined) as string | undefined;

        const locations = await getAllLocations(typeQuery);
        res.status(200).json(locations);
    } catch (error) {
        console.error('Error in GET /locations:', error);
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
});


app.post('/login', loginLimiter, loginValidation, handleValidationErrors, userController.loginOne);
app.post('/register', registerValidation, handleValidationErrors, userController.registerOne);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
