-- Create enum type for location type
CREATE TYPE location_type AS ENUM ('office', 'restaurant', 'train', 'bus');

-- Create locations table
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type location_type NOT NULL,
    coordinates JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on type for faster queries
CREATE INDEX idx_locations_type ON locations(type);

CREATE TABLE external_locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    coordinates JSONB NOT NULL,
    rating NUMERIC,
    user_rating_count INTEGER,
    price_level TEXT,
    business_status TEXT,
    phone_number TEXT,
    website_uri TEXT,
    google_maps_uri TEXT,
    opening_hours JSONB,  
    last_fetched TIMESTAMP,
    google_id TEXT UNIQUE,
    last_checked TIMESTAMP,
);