
-- Create admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
$$;

-- Drop overly permissive policies
DROP POLICY "Authenticated users can insert customers" ON public.customers;
DROP POLICY "Authenticated users can update customers" ON public.customers;
DROP POLICY "Authenticated users can view customers" ON public.customers;

DROP POLICY "Authenticated users can view booking_requests" ON public.booking_requests;
DROP POLICY "Authenticated users can update booking_requests" ON public.booking_requests;

DROP POLICY "Authenticated users can insert project_status" ON public.project_status;
DROP POLICY "Authenticated users can update project_status" ON public.project_status;
DROP POLICY "Authenticated users can view project_status" ON public.project_status;

-- Recreate with admin check
CREATE POLICY "Admins can view customers" ON public.customers FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update customers" ON public.customers FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can view booking_requests" ON public.booking_requests FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can update booking_requests" ON public.booking_requests FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can view project_status" ON public.project_status FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert project_status" ON public.project_status FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update project_status" ON public.project_status FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
