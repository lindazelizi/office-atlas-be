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