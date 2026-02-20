-- Create teacher_subjects table for teacher qualification management
CREATE TABLE IF NOT EXISTS teacher_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(teacher_id, subject_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teacher_subjects_teacher ON teacher_subjects(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_subjects_subject ON teacher_subjects(subject_id);

-- Populate initial data: copy existing qualifications from teacher_assignments
INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT DISTINCT teacher_id, subject_id
FROM teacher_assignments
ON CONFLICT (teacher_id, subject_id) DO NOTHING;