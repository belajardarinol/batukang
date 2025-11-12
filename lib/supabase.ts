import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://pqeknnzavuxfzihqqxfz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZWtubnphdnV4ZnppaHFxeGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzUxNzMsImV4cCI6MjA3MTIxMTE3M30.y-a3EewQiA8kZ_3j9mSeuPW4A4FL9TT7ZAgAKUH4UB8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
