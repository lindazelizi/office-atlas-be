
export const SODERTALJE_CENTER = {
    lat: 59.1922042719759,
    lng: 17.628052241303465
};

export const SODERTALJE_RADIUS_METERS = 7000;

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
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
export function mapGoogleTypeToLocationType(googleTypes: string[]): 'restaurant' | 'train' | 'bus' | null {
    if (!googleTypes) return null;

    const busTypes = ['bus_stop', 'bus_station', 'transit_stop'];
    if (googleTypes.some(t => busTypes.includes(t))) return 'bus';

    const trainTypes = ['train_station', 'subway_station', 'light_rail_station', 'tram_stop'];
    if (googleTypes.some(t => trainTypes.includes(t))) return 'train';

    if (googleTypes.includes('transit_station')) return 'train';

    const restaurantTypes = [
        'acai_shop', 'afghani_restaurant', 'african_restaurant', 'american_restaurant',
        'argentinian_restaurant', 'asian_fusion_restaurant', 'asian_restaurant', 'australian_restaurant',
        'austrian_restaurant', 'bagel_shop', 'bakery', 'bangladeshi_restaurant', 'bar', 'bar_and_grill',
        'barbecue_restaurant', 'basque_restaurant', 'bavarian_restaurant', 'beer_garden', 'belgian_restaurant',
        'bistro', 'brazilian_restaurant', 'breakfast_restaurant', 'brewery', 'brewpub', 'british_restaurant',
        'brunch_restaurant', 'buffet_restaurant', 'burmese_restaurant', 'burrito_restaurant', 'cafe',
        'cafeteria', 'cajun_restaurant', 'cake_shop', 'californian_restaurant', 'cambodian_restaurant',
        'candy_store', 'cantonese_restaurant', 'caribbean_restaurant', 'cat_cafe', 'chicken_restaurant',
        'chicken_wings_restaurant', 'chilean_restaurant', 'chinese_noodle_restaurant', 'chinese_restaurant',
        'chocolate_factory', 'chocolate_shop', 'cocktail_bar', 'coffee_roastery', 'coffee_shop', 'coffee_stand',
        'colombian_restaurant', 'confectionery', 'croatian_restaurant', 'cuban_restaurant', 'czech_restaurant',
        'danish_restaurant', 'deli', 'dessert_restaurant', 'dessert_shop', 'dim_sum_restaurant', 'diner',
        'dog_cafe', 'donut_shop', 'dumpling_restaurant', 'dutch_restaurant', 'eastern_european_restaurant',
        'ethiopian_restaurant', 'european_restaurant', 'falafel_restaurant', 'family_restaurant',
        'fast_food_restaurant', 'filipino_restaurant', 'fine_dining_restaurant', 'fish_and_chips_restaurant',
        'fondue_restaurant', 'food_court', 'french_restaurant', 'fusion_restaurant', 'gastropub',
        'german_restaurant', 'greek_restaurant', 'gyro_restaurant', 'halal_restaurant', 'hamburger_restaurant',
        'hawaiian_restaurant', 'hookah_bar', 'hot_dog_restaurant', 'hot_dog_stand', 'hot_pot_restaurant',
        'hungarian_restaurant', 'ice_cream_shop', 'indian_restaurant', 'indonesian_restaurant', 'irish_pub',
        'irish_restaurant', 'israeli_restaurant', 'italian_restaurant', 'japanese_curry_restaurant',
        'japanese_izakaya_restaurant', 'japanese_restaurant', 'juice_shop', 'kebab_shop', 'korean_barbecue_restaurant',
        'korean_restaurant', 'latin_american_restaurant', 'lebanese_restaurant', 'lounge_bar', 'malaysian_restaurant',
        'meal_delivery', 'meal_takeaway', 'mediterranean_restaurant', 'mexican_restaurant', 'middle_eastern_restaurant',
        'mongolian_barbecue_restaurant', 'moroccan_restaurant', 'noodle_shop', 'north_indian_restaurant',
        'oyster_bar_restaurant', 'pakistani_restaurant', 'pastry_shop', 'persian_restaurant', 'peruvian_restaurant',
        'pizza_delivery', 'pizza_restaurant', 'polish_restaurant', 'portuguese_restaurant', 'pub', 'ramen_restaurant',
        'restaurant', 'romanian_restaurant', 'russian_restaurant', 'salad_shop', 'sandwich_shop', 'scandinavian_restaurant',
        'seafood_restaurant', 'shawarma_restaurant', 'snack_bar', 'soul_food_restaurant', 'soup_restaurant',
        'south_american_restaurant', 'south_indian_restaurant', 'southwestern_us_restaurant', 'spanish_restaurant',
        'sports_bar', 'sri_lankan_restaurant', 'steak_house', 'sushi_restaurant', 'swiss_restaurant', 'taco_restaurant',
        'taiwanese_restaurant', 'tapas_restaurant', 'tea_house', 'tex_mex_restaurant', 'thai_restaurant',
        'tibetan_restaurant', 'tonkatsu_restaurant', 'turkish_restaurant', 'ukrainian_restaurant', 'vegan_restaurant',
        'vegetarian_restaurant', 'vietnamese_restaurant', 'western_restaurant', 'wine_bar', 'winery',
        'yakiniku_restaurant', 'yakitori_restaurant'
    ];
    if (googleTypes.some(t => restaurantTypes.includes(t))) return 'restaurant';

    return null;
}