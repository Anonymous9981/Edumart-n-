-- Add explicit mapping from Supabase auth UUID to app user profile.
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "supabaseAuthId" UUID;

CREATE UNIQUE INDEX IF NOT EXISTS "User_supabaseAuthId_key"
ON "User"("supabaseAuthId");

CREATE INDEX IF NOT EXISTS "User_supabaseAuthId_idx"
ON "User"("supabaseAuthId");
