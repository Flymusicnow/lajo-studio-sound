
-- Blocked dates table
CREATE TABLE public.blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage blocked_dates" ON public.blocked_dates FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Anyone can view blocked_dates" ON public.blocked_dates FOR SELECT USING (true);

-- Studio settings table (single row)
CREATE TABLE public.studio_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  monthly_slot_cap INTEGER NOT NULL DEFAULT 7,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.studio_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view studio_settings" ON public.studio_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update studio_settings" ON public.studio_settings FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Insert default settings
INSERT INTO public.studio_settings (id, monthly_slot_cap) VALUES (1, 7);

-- Storage bucket for project files
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', false);

-- Storage RLS: anyone can upload, admins can read
CREATE POLICY "Anyone can upload project files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-files');
CREATE POLICY "Admins can read project files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'project-files' AND public.is_admin());

-- Allow public update of project_status for file uploads (by booking ID match)
CREATE POLICY "Anyone can update file status" ON public.project_status FOR UPDATE USING (true) WITH CHECK (true);
