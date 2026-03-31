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
