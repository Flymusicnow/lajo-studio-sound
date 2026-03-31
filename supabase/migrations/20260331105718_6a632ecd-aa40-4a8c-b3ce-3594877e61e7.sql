
-- Enums
CREATE TYPE public.booking_status AS ENUM ('new', 'under_review', 'approved', 'counter_offer', 'declined', 'awaiting_payment', 'paid', 'confirmed');
CREATE TYPE public.payment_status AS ENUM ('unpaid', 'deposit_paid', 'fully_paid');
CREATE TYPE public.customer_status AS ENUM ('new', 'returning', 'high_value');
CREATE TYPE public.project_workflow_status AS ENUM ('awaiting_files', 'files_received', 'prep', 'mixing', 'mastering', 'ready_for_delivery', 'delivered', 'completed');
CREATE TYPE public.file_status AS ENUM ('not_requested', 'awaiting', 'received', 'reviewed', 'ready');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status customer_status NOT NULL DEFAULT 'new',
  total_spent NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view customers" ON public.customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update customers" ON public.customers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Booking requests table
CREATE TABLE public.booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  status booking_status NOT NULL DEFAULT 'new',
  session_type TEXT,
  session_price NUMERIC NOT NULL DEFAULT 0,
  creative_types JSONB DEFAULT '[]',
  add_ons JSONB DEFAULT '[]',
  mastering_type TEXT,
  mastering_tracks INTEGER DEFAULT 0,
  result_package TEXT,
  result_package_price NUMERIC NOT NULL DEFAULT 0,
  mixing_scope TEXT,
  total_price NUMERIC NOT NULL DEFAULT 0,
  deposit_amount NUMERIC NOT NULL DEFAULT 0,
  payment_choice TEXT DEFAULT 'deposit',
  payment_status payment_status NOT NULL DEFAULT 'unpaid',
  requested_date DATE,
  song_count TEXT,
  track_count TEXT,
  reference_url TEXT,
  deadline DATE,
  description TEXT,
  custom_session_text TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view booking_requests" ON public.booking_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can insert booking_requests" ON public.booking_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update booking_requests" ON public.booking_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Project status table
CREATE TABLE public.project_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_request_id UUID NOT NULL REFERENCES public.booking_requests(id) ON DELETE CASCADE,
  status project_workflow_status NOT NULL DEFAULT 'awaiting_files',
  file_status file_status NOT NULL DEFAULT 'not_requested',
  file_link TEXT,
  file_notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.project_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view project_status" ON public.project_status FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert project_status" ON public.project_status FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update project_status" ON public.project_status FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
