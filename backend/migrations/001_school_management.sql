-- Migration to add school invitation and parent-school relationship tables

-- Table for school invitations
CREATE TABLE IF NOT EXISTS school_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    invitation_code VARCHAR(50) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    used_at TIMESTAMP NULL
);

-- Table for parent-school relationships (for parents with children in multiple schools)
CREATE TABLE IF NOT EXISTS parent_school_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    relationship VARCHAR(50) NOT NULL DEFAULT 'guardian',
    is_primary_contact BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(parent_id, school_id)
);

-- Add parent_id to students table if it doesn't exist
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_school_invitations_code ON school_invitations(invitation_code);
CREATE INDEX IF NOT EXISTS idx_school_invitations_school ON school_invitations(school_id);
CREATE INDEX IF NOT EXISTS idx_parent_school_links_parent ON parent_school_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_school_links_school ON parent_school_links(school_id);
CREATE INDEX IF NOT EXISTS idx_students_parent ON students(parent_id);

-- Insert sample invitation code for demo school
INSERT INTO school_invitations (school_id, invitation_code, expires_at, is_active)
VALUES ('00000000-0000-0000-0000-000000000001', 'DEMO2024', NOW() + INTERVAL '365 days', true)
ON CONFLICT (invitation_code) DO NOTHING;