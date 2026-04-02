import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

app.get("/", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.get("/locations", async (_, response) => {
    try {
        const { data, error } = await supabase.from("locations").select();
        console.log(data);
        return response.send(data);
    } catch (error) {
        return response.send({ error });
    }
});


function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

app.get("/locations/near", async (request, response) => {
    const lat = parseFloat(request.query.lat as string);
    const lng = parseFloat(request.query.lng as string);
    const radius = parseFloat((request.query.radius as string) ?? "5");
    const type = request.query.type as string | undefined;

    if (isNaN(lat) || isNaN(lng)) {
        return response.status(400).json({ error: "lat and lng are required query parameters" });
    }

    try {
        let query = supabase.from("locations").select();
        if (type) query = query.eq("type", type);

        const { data, error } = await query;
        if (error) return response.status(500).json({ error });

        const nearby = (data ?? [])
            .map((loc: any) => ({
                ...loc,
                distance_km: haversineDistance(lat, lng, loc.coordinates.lat, loc.coordinates.lng),
            }))
            .filter((loc: any) => loc.distance_km <= radius)
            .sort((a: any, b: any) => a.distance_km - b.distance_km);

        return response.json(nearby);
    } catch (err) {
        return response.status(500).json({ error: err });
    }
});

app.get("/locations/:id", async (request, response) => {
    try {
        const { data, error } = await supabase
            .from("locations")
            .select()
            .eq("id", request.params.id)
        console.log(data);
        return response.send(data);
    } catch (error) {
        return response.send({ error });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
