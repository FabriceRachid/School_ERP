-- Fix database constraint to include parent role
-- This migration adds 'parent' to the allowed roles in users table

-- First, drop the existing constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add the new constraint with parent role included
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN ('admin', 'teacher', 'student', 'parent'));