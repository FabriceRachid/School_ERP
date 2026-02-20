-- Migration to implement proper parent-student linking system

-- Create parent_student_links table for proper relationship management
CREATE TABLE IF NOT EXISTS parent_student_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    relationship VARCHAR(50) NOT NULL DEFAULT 'parent',
    is_primary BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES users(id), -- Admin who approved the link
    approved_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(parent_id, student_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_parent_student_links_parent ON parent_student_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_links_student ON parent_student_links(student_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_links_school ON parent_student_links(school_id);

-- Create invitation system for parent registration
CREATE TABLE IF NOT EXISTS parent_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    invitation_code VARCHAR(50) UNIQUE NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for parent invitations
CREATE INDEX IF NOT EXISTS idx_parent_invitations_code ON parent_invitations(invitation_code);
CREATE INDEX IF NOT EXISTS idx_parent_invitations_email ON parent_invitations(parent_email);