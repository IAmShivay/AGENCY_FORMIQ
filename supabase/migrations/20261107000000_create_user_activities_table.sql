CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID DEFAULT auth.uid() REFERENCES public.users(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_activities_created_at_idx ON public.user_activities (created_at DESC);
CREATE INDEX IF NOT EXISTS user_activities_user_id_idx ON public.user_activities (user_id);
CREATE INDEX IF NOT EXISTS user_activities_type_idx ON public.user_activities (activity_type);

-- SECURITY DEFINER reads users without triggering users' own RLS (avoids the recursion fixed in 20250809000003).
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND (is_admin = TRUE OR is_manager = TRUE)
  );
$$;

ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own activities" ON public.user_activities;
DROP POLICY IF EXISTS "Admins and managers read all activities" ON public.user_activities;
DROP POLICY IF EXISTS "Authenticated users log activities" ON public.user_activities;
DROP POLICY IF EXISTS "Service role full access on user_activities" ON public.user_activities;

CREATE POLICY "Users read own activities" ON public.user_activities
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Admins and managers read all activities" ON public.user_activities
  FOR SELECT TO authenticated USING (public.is_admin_or_manager());

CREATE POLICY "Authenticated users log activities" ON public.user_activities
  FOR INSERT TO authenticated WITH CHECK (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Service role full access on user_activities" ON public.user_activities
  FOR ALL TO service_role USING (true) WITH CHECK (true);
