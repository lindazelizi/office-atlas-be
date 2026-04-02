import { faker } from '@faker-js/faker';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)


const seedLocations = async (numEntries) => {
  const locations = [];

  const SODERTALJE_BOUNDS = {
    minLat: 59.15,
    maxLat: 59.21,
    minLng: 17.62,
    maxLng: 17.77
  };

  const trainStations = [
    { name: 'Södertälje hamn station', lat: 59.17914819612049, lng: 17.646560016733883 },
    { name: 'Östertälje station', lat: 59.18483947588986, lng: 17.65975052638767 },
    { name: 'Södertälje centrum', lat: 59.19253241875105, lng: 17.627096229061006 },
    { name: 'Södertälje Syd Station', lat: 59.16251019345716, lng: 17.646680041545622 },
    { name: 'Rönninge station', lat: 59.19750319804218, lng: 17.76481999145191 }
  ];

  const namesByType = {
    office: [
      `Building ${faker.number.int({ min: 100, max: 300 })}`,
      `SmartLab ${faker.number.int({ min: 1, max: 10 })}`,
    ],
    restaurant: [
      `${faker.word.adjective()} ${faker.word.noun()}`,
      `${faker.company.name()} Bistro`,
      `${faker.word.adjective()} Kitchen`,
      `The ${faker.word.noun()}`,
      `${faker.person.lastName()} Restaurant`
    ],
    bus: [
      `Bus Stop ${faker.number.int({ min: 1, max: 50 })}`,
    ]
  };

  const descriptionsByType = {
    office: [
      'Modern office space with state-of-the-art facilities. Hours: {hours}. {warning}',
      'Professional workplace environment. Hours: {hours}. {warning}',
    ],
    restaurant: [
      '{cuisine} cuisine. Hours: {hours}. Seating: {seating} persons.',
      'Full-service restaurant with bar. Hours: {hours}. Capacity: {seating} guests.',
    ],
    train: [
      'Departure times: {hours}.',
      'Regional railway. Service hours: {hours}.',
    ],
    bus: [
      'Public transit bus stop. Service: {hours}. Routes: {routes}. {weather}',
      'Bus station. Hours: {hours}. Covered waiting area available.',
    ]
  };

  const openingHours = ['08:00 - 17:00', '09:00 - 18:00', '07:00 - 19:00', '10:00 - 16:00'];
  const warnings = ['Only authorized personnel', 'Badge access required', 'Visitor registration required', 'Hard hat required', 'No public access', 'Restricted area'];
  const cuisines = ['Italian', 'Swedish', 'Asian', 'Mediterranean', 'Mexican'];

  for (let i = 0; i < numEntries; i++) {
    const type = faker.helpers.arrayElement(['office', 'restaurant', 'train', 'bus']);
    let name, coordinates;

    if (type === 'train') {
      const station = faker.helpers.arrayElement(trainStations);
      name = station.name;
      coordinates = { lat: station.lat, lng: station.lng };
    } else {
      name = faker.helpers.arrayElement(namesByType[type]);
      coordinates = {
        lat: faker.location.latitude({
          min: SODERTALJE_BOUNDS.minLat,
          max: SODERTALJE_BOUNDS.maxLat
        }),
        lng: faker.location.longitude({
          min: SODERTALJE_BOUNDS.minLng,
          max: SODERTALJE_BOUNDS.maxLng
        })
      };
    }

    let description = faker.helpers.arrayElement(descriptionsByType[type]);
    description = description
      .replace('{hours}', faker.helpers.arrayElement(openingHours))
      .replace('{warning}', `⚠️ ${faker.helpers.arrayElement(warnings)}`)
      .replace('{seating}', faker.number.int({ min: 20, max: 200 }))
      .replace('{reservation}', faker.datatype.boolean() ? 'Required' : 'Not required')
      .replace('{routes}', faker.number.int({ min: 1, max: 99 }))
      .replace('{cuisine}', faker.helpers.arrayElement(cuisines))
      .replace('{weather}', faker.datatype.boolean(0.5) ? '⚠️ Weather shelter available' : '');

    locations.push({
      name: name,
      type: type,
      coordinates: coordinates,
      description: description.trim()
    });
  }

  await supabase.from('locations').insert(locations);
};

await seedLocations(20);

// node --env-file=.env db/seed.js