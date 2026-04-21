import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://caqjnfyqbvjqnuktgsnr.supabase.co/rest/v1/';
const supabaseAnonKey = 'sb_publishable_LXNQC0-1GhPhwFtxrgMYQA_23M7Gj4B';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);