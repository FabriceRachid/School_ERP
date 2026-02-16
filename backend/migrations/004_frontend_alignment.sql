-- Align DB with current frontend data contracts (web + mobile)

-- School activation status for super-admin UI
ALTER TABLE schools
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Additional class metadata used by web dashboards
ALTER TABLE classes
ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 40,
ADD COLUMN IF NOT EXISTS cycle_name VARCHAR(120),
ADD COLUMN IF NOT EXISTS fees NUMERIC(12,2) DEFAULT 0;

-- Timetable slots used in web/admin + mobile schedule views
CREATE TABLE IF NOT EXISTS timetable_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    day_of_week VARCHAR(16) NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timetable_slots_class ON timetable_slots(class_id);
CREATE INDEX IF NOT EXISTS idx_timetable_slots_teacher ON timetable_slots(teacher_id);
CREATE INDEX IF NOT EXISTS idx_timetable_slots_day ON timetable_slots(day_of_week);

-- Attendance prepared for teacher attendance screen
CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(16) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(student_id, class_id, attendance_date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_class_date ON attendance_records(class_id, attendance_date);
