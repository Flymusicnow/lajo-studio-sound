
-- Allow anyone to insert customers (for public booking forms)
CREATE POLICY "Anyone can insert customers"
  ON public.customers FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to select customers by email (for duplicate check)
CREATE POLICY "Anyone can select customer by email"
  ON public.customers FOR SELECT
  TO public
  USING (true);
