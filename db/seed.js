import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const seedLocations = async () => {
  try {
    // Read seed data from JSON file
    const seedDataPath = path.join(__dirname, 'seed-data.json');
    const seedDataRaw = fs.readFileSync(seedDataPath, 'utf-8');
    const seedData = JSON.parse(seedDataRaw);

    console.log(`Seeding ${seedData.offices.length} office locations...`);

    const { error: insertError } = await supabase
      .from('locations')
      .insert(seedData.offices);

    if (insertError) {
      console.error('Error inserting locations:', insertError);
      throw insertError;
    }

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

await seedLocations();

// node --env-file=.env db/seed.js