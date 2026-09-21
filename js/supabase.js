window.Yoru = window.Yoru || {};

const SUPABASE_URL = 'https://bjpxyorymeurvemtliyj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqcHh5b3J5bWV1cnZlbXRsaXlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MzQ4MjQsImV4cCI6MjEwNTUxMDgyNH0.xX16dIiAcN_i0FdAz-kxixw78iATp_wTy1uHh9LVqc0';

// Initialize the Supabase client and attach it to the Yoru namespace
window.Yoru.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
