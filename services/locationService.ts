import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
);

export async function getAllLocations(type?: string) {
    try {
        let query = supabase.from('locations').select();

        //In case we add more intern locations in the future, we can filter by type.
        if (type) {
            query = query.eq('type', type);
        }

        const { data, error } = await query;

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Error fetching all locations:', error);
        throw error;
    }
}