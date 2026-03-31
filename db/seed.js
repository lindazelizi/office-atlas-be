import { faker } from '@faker-js/faker';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)


const seedLocations = async (numEntries) => {
  const locations = [];

  const SODERTALJE_BOUNDS = {
    minLat: 58.9,
    maxLat: 59.5,
    minLng: 17.4,
    maxLng: 17.8
  };
  for (let i = 0; i < numEntries; i++) {
    const name = faker.lorem.words(3);
    const type = faker.helpers.arrayElement(['office', 'restaurant', 'train', 'bus']);
    const coordinates = {
      lat: faker.location.latitude({
        min: SODERTALJE_BOUNDS.minLat,
        max: SODERTALJE_BOUNDS.maxLat
      }),
      lng: faker.location.longitude({
        min: SODERTALJE_BOUNDS.minLng,
        max: SODERTALJE_BOUNDS.maxLng
      })
    }
    const description = faker.lorem.sentence();


    locations.push({
      name: name,
      type: type,
      coordinates: coordinates,
      description: description
    });

  }
  // query supabase to create the data rows from the locations array
  await supabase.from('locations').insert(locations);
};

await seedLocations(4);

// node --env-file=.env db/seed.js