-- Site media (audio/video embeds for homepage)
CREATE TABLE public.site_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'audio' CHECK (media_type IN ('audio', 'video')),
  embed_url TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage site_media" ON public.site_media
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Anyone can view visible site_media" ON public.site_media
  FOR SELECT TO public USING (is_visible = true);

-- Testimonials
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_role TEXT,
  quote TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage testimonials" ON public.testimonials
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Anyone can view approved testimonials" ON public.testimonials
  FOR SELECT TO public USING (is_approved = true);