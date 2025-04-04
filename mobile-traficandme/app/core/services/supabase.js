import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';


const supabaseUrl = process.env.EXPO_PUBLIC_API_URL;
const supabaseKey = process.env.EXPO_PUBLIC_API_KEY;



export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
