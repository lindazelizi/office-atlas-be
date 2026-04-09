import { createClient } from '@supabase/supabase-js';
import { fetchNearbyLocations, storeLocationInDatabase } from './googlePlacesService.js';
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

// Get cached external locations from database
async function getCachedExternalLocations() {
    try {
        let query = supabase.from('external_locations').select('*');
        const { data, error } = await query;
        if (error) throw error;

        return (data || []).map(row => ({
            id: row.id,
            name: row.name,
            type: row.type as 'restaurant' | 'train' | 'bus',
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
    } catch (error) {
        console.error('Error fetching cached external locations:', error);
        return [];
    }
}


export async function getNearbyLocations(
    officeIdOrCoords: string | { lat: number; lng: number },
    radiusInMeters: number = 1000,
    type?: 'restaurant' | 'train' | 'bus'
) {
    let office;

    if (typeof officeIdOrCoords === 'string') {
        office = await getLocationById(officeIdOrCoords);
        if (!office) throw new Error(`Office with ID ${officeIdOrCoords} not found`);
        if (office.type !== 'office') throw new Error(`Location ${officeIdOrCoords} is not an office`);
    } else {
        office = { coordinates: officeIdOrCoords };
    }

    const cachedLocations = await getCachedExternalLocations();

    //TODO: Implement smarter cache refreshing logic. Currently we just fetch all cached data.
    let allLocations = [...cachedLocations];

    if (cachedLocations.length === 0) {
        const freshLocations = await fetchNearbyLocations(
            office.coordinates.lat,
            office.coordinates.lng,
            radiusInMeters,
            type,
        );
        allLocations = freshLocations as typeof cachedLocations;
    }
    const locationsWithDistance = allLocations
        .map((loc) => ({
            ...loc,
            distance_km: haversineDistance(
                office.coordinates.lat,
                office.coordinates.lng,
                loc.coordinates.lat,
                loc.coordinates.lng
            ),
        }))
        .filter(loc => loc.distance_km * 1000 <= radiusInMeters);

    return locationsWithDistance.sort((a, b) => a.distance_km - b.distance_km);
}