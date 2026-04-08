import { createClient } from '@supabase/supabase-js';
import { fetchNearbyLocations } from './googlePlacesService.js';
import { haversineDistance } from '../utils/general.js';

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
);

export async function getAllLocations(type?: string) {
    try {
        let query = supabase.from('locations').select();

        //In case we add more intern locations in the future, we can filter by type.
        if (type) {
            query = query.eq('type', type);
        }

        const { data, error } = await query;

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Error fetching all locations:', error);
        throw error;
    }
}

export async function getLocationById(id: string) {
    try {
        const { data, error } = await supabase
            .from('locations')
            .select()
            .eq('id', id)
            .single();

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Error fetching location by ID:', error);
        throw error;
    }
}

export async function getNearbyLocations(
    officeIdOrCoords: string | { lat: number; lng: number },
    radiusInMeters: number = 1000,
    type?: 'restaurant' | 'train' | 'bus'
) {
    try {
        let office;

        if (typeof officeIdOrCoords === 'string') {
            office = await getLocationById(officeIdOrCoords);
            if (!office) {
                throw new Error(`Office with ID ${officeIdOrCoords} not found`);
            }
            if (office.type !== 'office') {
                throw new Error(`Location ${officeIdOrCoords} is not an office`);
            }
        } else {
            // By coordinates (for bounding)
            office = { coordinates: officeIdOrCoords };
        }

        const externalLocations = await fetchNearbyLocations(
            office.coordinates.lat,
            office.coordinates.lng,
            radiusInMeters,
            type
        );

        const locationsWithDistance = externalLocations.map((loc) => ({
            ...loc,
            distance_km: haversineDistance(
                office.coordinates.lat,
                office.coordinates.lng,
                loc.coordinates.lat,
                loc.coordinates.lng
            ),
        }));

        return locationsWithDistance.sort((a, b) => a.distance_km - b.distance_km);
    } catch (error) {
        console.error('Error fetching nearby locations:', error);
        throw error;
    }
}