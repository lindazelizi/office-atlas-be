-- Create enum type for location type
CREATE TYPE location_type AS ENUM ('office', 'control_point', 'reception', 'parking');

-- Create locations table
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type location_type NOT NULL,
    coordinates JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(50) NOT NULL,
    password VARCHAR(60) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    unique key (email)
);


-- Create an index on type for faster queries
CREATE INDEX idx_locations_type ON locations(type);