import { createClient } from '@supabase/supabase-js';
import type { GooglePlacesLocation } from '../types/location.js';
import { mapGoogleTypeToLocationType } from '../utils/general.js';

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
);

const PLACE_TYPES = {
    restaurant: 'restaurant',
    train: 'transit_station',
    bus: 'bus_station',
};

export async function storeLocationInDatabase(
    location: GooglePlacesLocation & { googleId?: string }
) {
    try {
        const { error } = await supabase.from('external_locations').upsert({
            id: location.id,
            name: location.name,
            type: location.type,
            coordinates: location.coordinates,
            rating: location.rating,
            user_rating_count: location.userRatingCount,
            price_level: location.priceLevel,
            business_status: location.businessStatus,
            phone_number: location.phoneNumber,
            website_uri: location.websiteUri,
            google_maps_uri: location.googleMapsUri,
            opening_hours: location.openingHours,
            last_fetched: new Date().toISOString(),
            last_checked: new Date().toISOString()
        });

        if (error) console.error(`❌ Failed to store "${location.name}":`, error);
    } catch (err) {
        console.error(`❌ Exception storing "${location.name}":`, err);
    }
}

// API LIMIT REACHED - Commenting out Google Places API calls
// Will be re-enabled when API quota is refreshed
/*
export async function fetchNearbyLocations(
    lat: number,
    lng: number,
    radiusInMeters: number,
    type?: 'restaurant' | 'train' | 'bus',
): Promise<GooglePlacesLocation[]> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
        throw new Error('GOOGLE_PLACES_API_KEY environment variable is not set');
    }

    const types = type ? [PLACE_TYPES[type]] : Object.values(PLACE_TYPES);

    try {
        const locations: GooglePlacesLocation[] = [];

        for (const placeType of types) {
            console.log(`📍 Fetching ${placeType}...`);
            const requestBody = {
                includedTypes: [placeType],
                maxResultCount: 20,
                locationRestriction: {
                    circle: {
                        center: {
                            latitude: lat,
                            longitude: lng,
                        },
                        radius: radiusInMeters,
                    },
                },
            };

            const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.googleMapsUri,places.websiteUri,places.nationalPhoneNumber,places.currentOpeningHours,places.priceLevel,places.businessStatus,places.types',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.status === 503) {
                console.log('⏳ Service unavailable, retrying in 5 seconds...');
                await new Promise(resolve => setTimeout(resolve, 5000));
                continue;
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Google Places API error: ${response.statusText} - ${errorText}`);
            }

            const data = await response.json() as any;

            if (data.error) {
                throw new Error(`Google Places API: ${data.error.message}`);
            }

            console.log(`✅ Got ${data.places?.length || 0} raw results for ${placeType}`);

            if (data.places && Array.isArray(data.places)) {
                for (const place of data.places) {
                    const mappedType = mapGoogleTypeToLocationType(place.types);
                    if (!mappedType) continue;

                    const location: GooglePlacesLocation & { googleId?: string } = {
                        id: place.id,
                        name: place.displayName?.text || 'Unknown',
                        type: mappedType,
                        coordinates: {
                            lat: place.location.latitude,
                            lng: place.location.longitude,
                        },
                        description: place.formattedAddress || 'No address available',
                        rating: place.rating,
                        userRatingCount: place.userRatingCount,
                        googleMapsUri: place.googleMapsUri,
                        websiteUri: place.websiteUri,
                        phoneNumber: place.nationalPhoneNumber,
                        priceLevel: place.priceLevel,
                        businessStatus: place.businessStatus,
                        openingHours: place.currentOpeningHours ? {
                            weekdayDescriptions: place.currentOpeningHours.weekdayDescriptions,
                        } : undefined,
                        googleId: place.id
                    };

                    locations.push(location);
                    await storeLocationInDatabase(location);
                }
            }
            console.log(`💾 Stored ${locations.length} total locations so far`);

        }
        console.log(`🎉 Finished: ${locations.length} locations total`);

        return locations;
    } catch (error) {
        console.error('Error fetching from Google Places API:', error);
        throw error;
    }
}
*/

// Stub function while API is unavailable
export async function fetchNearbyLocations(
    lat: number,
    lng: number,
    radiusInMeters: number,
    type?: 'restaurant' | 'train' | 'bus',
): Promise<GooglePlacesLocation[]> {
    console.log('⏸️  API calls disabled - using database only');
    return [];
}