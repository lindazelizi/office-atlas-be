import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
);

const SECRET_KEY = process.env.SUPER_SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error('SUPER_SECRET_KEY environment variable is not set');
}

const JWT_SECRET = SECRET_KEY as string;

export async function register(user: { email: string; password: string }): Promise<void> {
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const { error } = await supabase
            .from('users')
            .insert([{ email: user.email, password: hashedPassword }]);

        if (error) {
            console.error('Supabase error:', error);
            throw new Error(error.message || JSON.stringify(error));
        }
    } catch (error) {
        throw error;
    }
}

export async function login(user: { email: string; password: string }) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single();

        if (error || !data) {
            throw new Error('Email not found');
        }

        const isMatch = await bcrypt.compare(user.password, data.password);

        if (isMatch) {
            const token = jwt.sign({ user_id: data.user_id }, JWT_SECRET, {
                expiresIn: '24h',
            });

            return { user_id: data.user_id, email: data.email, token };
        } else {
            throw new Error('Password is not correct');
        }
    } catch (error) {
        throw error;
    }
}