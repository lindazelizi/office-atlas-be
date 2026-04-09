import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getAllLocations, getNearbyLocations } from './services/locationService.js';
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

        const offices = await getAllLocations(typeQuery);

        let externalLocations: any[] = [];
        if (!typeQuery || ['restaurant', 'train', 'bus'].includes(typeQuery)) {
            const { data } = await supabase.from('external_locations').select('*');
            externalLocations = data || [];

            externalLocations = externalLocations.map(row => ({
                id: row.id,
                name: row.name,
                type: row.type,
                coordinates: row.coordinates,
                description: row.description,
                rating: row.rating,
                userRatingCount: row.user_rating_count,
                googleMapsUri: row.google_maps_uri,
                websiteUri: row.website_uri,
                phoneNumber: row.phone_number,
                priceLevel: row.price_level,
                businessStatus: row.business_status,
                openingHours: row.opening_hours,
            }));

            if (typeQuery) {
                externalLocations = externalLocations.filter(loc => loc.type === typeQuery);
            }
        }

        // Merge offices + external locations
        const allLocations = [...offices, ...externalLocations];
        res.status(200).json(allLocations);
    } catch (error) {
        console.error('Error in GET /locations:', error);
        res.status(500).json({ error: 'Failed to fetch locations' });
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// API LIMIT REACHED - All data pulled from database only
// Commenting out API calls until quota is refreshed

/*
(async () => {
    try {
        console.log('🔄 Populating location cache...');
        await fetchNearbyLocations(
            SODERTALJE_CENTER.lat,
            SODERTALJE_CENTER.lng,
            SODERTALJE_RADIUS_METERS
        );
        console.log('✅ Cache populated successfully');
    } catch (err) {
        console.error('⚠️ Cache population error:', err);
    }
})();
*/