import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getAllLocations } from './services/locationService.js';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/locations', async (req: Request, res: Response) => {
    try {
        const typeQuery = (typeof req.query.type === 'string' ? req.query.type : undefined) as string | undefined;

        const locations = await getAllLocations(typeQuery);
        res.status(200).json(locations);
    } catch (error) {
        console.error('Error in GET /locations:', error);
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
