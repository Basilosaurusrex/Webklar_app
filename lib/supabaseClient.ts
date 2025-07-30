import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rndjwuupvsoxwjqozomf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZGp3dXVwdnNveHdqcW96b21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NjI0NjcsImV4cCI6MjA2ODIzODQ2N30.0SGmIpzMgPSXXEUurRdG3IJCutJSdoP1ByJaKAENw3Q';
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 