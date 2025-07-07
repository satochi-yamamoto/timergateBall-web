import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xtgxebkszgbgfvqvlojc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Z3hlYmtzemdiZ2Z2cXZsb2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4OTcwNjcsImV4cCI6MjA2NzQ3MzA2N30.s-pydpjLT630fKcz4py7wb8PGChI64vor1Y3uzzIEqU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
