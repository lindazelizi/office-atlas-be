import { randomUUID } from 'crypto';
import type { GooglePlacesLocation } from '../types/location.js';
import { raw } from 'express';

const PLACE_TYPES = {
    restaurant: 'restaurant',
    train: 'transit_station',
    bus: 'bus_station',
};

function mapGoogleTypeToLocationType(googleTypes: string[]): 'restaurant' | 'train' | 'bus' | null {
    if (!googleTypes) return null;

    const busTypes = [
        'bus_stop',
        'bus_station',
        'transit_stop'
    ];
    if (googleTypes.some(t => busTypes.includes(t))) return 'bus';

    const trainTypes = [
        'train_station',
        'subway_station',
        'light_rail_station',
        'tram_stop'
    ];
    if (googleTypes.some(t => trainTypes.includes(t))) return 'train';

    if (googleTypes.includes('transit_station')) return 'train';

    const restaurantTypes = [
        'restaurant',
        'cafe',
        'coffee_shop',
        'buffet',
        'bakery',
        'bar',
        'fast_food_restaurant',
        'pizza_restaurant',
        'ramen_restaurant',
        'sushi_restaurant',
        'steak_house',
        'tea_house'
    ];
    if (googleTypes.some(t => restaurantTypes.includes(t))) return 'restaurant';

    return null;
}

export async function fetchNearbyLocations(
    lat: number,
    lng: number,
    radiusInMeters: number,
    type?: 'restaurant' | 'train' | 'bus'
): Promise<GooglePlacesLocation[]> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
        throw new Error('GOOGLE_PLACES_API_KEY environment variable is not set');
    }

    const types = type ? [PLACE_TYPES[type]] : Object.values(PLACE_TYPES);

    try {
        const locations: GooglePlacesLocation[] = [];

        for (const placeType of types) {
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
                    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.googleMapsUri,places.websiteUri,places.nationalPhoneNumber,places.currentOpeningHours,places.photos,places.priceLevel,places.businessStatus,places.types',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Error response:', errorText);
                throw new Error(`Google Places API error: ${response.statusText} - ${errorText}`);
            }

            const data = await response.json() as any;

            if (data.error) {
                throw new Error(`Google Places API: ${data.error.message}`);
            }

            if (data.places && Array.isArray(data.places)) {
                locations.push(
                    ...data.places
                        .map((place: any) => {
                            const mappedType = mapGoogleTypeToLocationType(place.types);
                            if (!mappedType) return null;

                            return {
                                id: `gp-${randomUUID()}`,
                                name: place.displayName?.text || 'Unknown',
                                type: mappedType,
                                rawGoogleTypes: place.types,
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
                                photos: place.photos,
                            };
                        })
                        .filter((loc: any) => loc !== null)
                );
            }
        }

        return locations;
    } catch (error) {
        console.error('Error fetching from Google Places API:', error);
        throw error;
    }
}