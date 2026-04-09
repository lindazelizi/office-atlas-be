export type locationType =
    | "office"
    | "restaurant"
    | "train"
    | "bus";


export interface Location {
    id: string;
    name: string;
    type: locationType;
    coordinates: {
        lat: number;
        lng: number;
    };
    description: string;
    // Optional fields from Google Places API
    rating?: number;
    userRatingCount?: number;
    googleMapsUri?: string;
    websiteUri?: string;
    phoneNumber?: string;
    priceLevel?: string;
    businessStatus?: string;
    openingHours?: {
        weekdayDescriptions?: string[];
    };
}

export interface GooglePlacesLocation extends Location { }

export interface GooglePlacesResponse {
    error_message?: string;
    places?: GooglePlacesResult[];
    error?: {
        code: number;
        message: string;
    };
}

export interface GooglePlacesResult {
    name: string;
    displayName: {
        text: string;
    };
    location: {
        latitude: number;
        longitude: number;
    };
    formattedAddress: string;
    rating?: number;
    userRatingCount?: number;
    googleMapsUri?: string;
    websiteUri?: string;
    nationalPhoneNumber?: string;
    currentOpeningHours?: {
        weekdayDescriptions?: string[];
    };
    priceLevel?: string;
    businessStatus?: string;
}
