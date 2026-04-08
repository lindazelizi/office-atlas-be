import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getAllLocations, getLocationById, getNearbyLocations } from './services/locationService.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SODERTALJE_CENTER = {
    lat: 59.1922042719759,
    lng: 17.628052241303465
};

const SODERTALJE_RADIUS_METERS = 7000;

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

app.get('/locations/in-bounds', async (req: Request, res: Response) => {
    try {
        const typeStr: string | undefined = (typeof req.query.type === 'string' ? req.query.type : undefined);

        const locationsInBounds = await getNearbyLocations(
            { lat: SODERTALJE_CENTER.lat, lng: SODERTALJE_CENTER.lng },
            SODERTALJE_RADIUS_METERS,
            typeStr as 'restaurant' | 'train' | 'bus' | undefined
        );
        res.status(200).json(locationsInBounds);
    } catch (error: any) {
        console.error('Error in GET /locations/in-bounds:', error);
        res.status(500).json({ error: 'Failed to fetch locations in bounds' });
    }
});

app.get('/locations/nearby/:officeId', async (req: Request, res: Response) => {
    try {
        const officeId = req.params.officeId as string;
        const radiusStr: string = (typeof req.query.radius === 'string' ? req.query.radius : undefined) ?? '1000';
        const typeStr: string | undefined = (typeof req.query.type === 'string' ? req.query.type : undefined);

        const radius = Math.max(100, parseInt(radiusStr, 10) || 1000);
        const type: 'restaurant' | 'train' | 'bus' | undefined = typeStr as 'restaurant' | 'train' | 'bus' | undefined;

        if (isNaN(radius) || radius < 100) {
            return res.status(400).json({
                error: 'Radius must be a number >= 100 meters',
            });
        }

        const nearbyLocations = await getNearbyLocations(officeId, radius, type);
        res.status(200).json(nearbyLocations);
    } catch (error: any) {
        console.error('Error in GET /locations/nearby/:officeId:', error);

        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }

        if (error.message.includes('not an office')) {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({ error: 'Failed to fetch nearby locations', details: error?.message });
    }
});

app.get('/locations/:id', async (req: Request, res: Response) => {
    try {
        const location = await getLocationById(req.params.id as string);

        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }

        res.status(200).json(location);
    } catch (error) {
        console.error('Error in GET /locations/:id:', error);
        res.status(500).json({ error: 'Failed to fetch location' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});