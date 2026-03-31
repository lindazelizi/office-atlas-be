import { faker } from '@faker-js/faker';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)


const seedLocations = async (numEntries) => {
  const locations = [];

  for (let i = 0; i < numEntries; i++) {
    const name = faker.lorem.words(3);
    const type = faker.helpers.arrayElement(['office', 'restaurant', 'train', 'bus']);
    const coordinates = {
      lat: faker.location.latitude(),
      lng: faker.location.longitude()
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