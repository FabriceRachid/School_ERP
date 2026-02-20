-- First-login password change support
ALTER TABLE users
ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_users_must_change_password
ON users (must_change_password);
