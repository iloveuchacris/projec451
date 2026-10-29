import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'supabaseUrl';
const supabaseAnonKey = 'supabaseAnonKey';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
