-- Fix RLS Policies for kunden_projekte table
-- This will allow updates and inserts for appointment booking

-- First, let's see the current policies
SELECT * FROM pg_policies WHERE tablename = 'kunden_projekte';

-- Drop existing policies that might be blocking updates
DROP POLICY IF EXISTS "Allow public appointment insert" ON kunden_projekte;
DROP POLICY IF EXISTS "Allow authenticated read" ON kunden_projekte;
DROP POLICY IF EXISTS "Users can insert their own appointments" ON kunden_projekte;
DROP POLICY IF EXISTS "Anyone can read appointments" ON kunden_projekte;
DROP POLICY IF EXISTS "Users can update their own appointments" ON kunden_projekte;

-- Create new policies that allow all operations for appointment booking
CREATE POLICY "Allow all operations for appointments" ON kunden_projekte
FOR ALL USING (true) WITH CHECK (true);

-- Alternative: Create specific policies for each operation
CREATE POLICY "Allow appointment inserts" ON kunden_projekte
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow appointment updates" ON kunden_projekte
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow appointment reads" ON kunden_projekte
FOR SELECT USING (true);

-- Verify the policies are created
SELECT * FROM pg_policies WHERE tablename = 'kunden_projekte'; 