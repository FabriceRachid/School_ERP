-- Allow one teacher account to operate in multiple schools
CREATE TABLE IF NOT EXISTS teacher_school_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(teacher_id, school_id)
);

CREATE INDEX IF NOT EXISTS idx_teacher_school_links_teacher ON teacher_school_links(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_school_links_school ON teacher_school_links(school_id);
