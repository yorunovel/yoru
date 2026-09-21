window.Yoru = window.Yoru || {};

const SUPABASE_URL = 'https://bjpxyorymeurvemtliyj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_wApH4PCnF9tg-nw8Cj-wZg_NnS9eumd';

// Initialize the Supabase client and attach it to the Yoru namespace
window.Yoru.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
