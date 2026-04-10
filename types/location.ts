export type locationType =
    | "office"
    | "control_point"
    | "reception"
    | "parking"

export interface Location {
    id: string;
    name: string;
    type: locationType;
    coordinates: {
        lat: number;
        lng: number;
    };
    description: string;
}