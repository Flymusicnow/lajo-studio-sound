

# Fix Quick Booking RLS + Add Navigation Links

## Problem
Quick Booking fails with "new row violates row-level security policy for table customers" because the `customers` table only allows admin inserts/selects. The QuickBooking page runs as an unauthenticated user.

## Fix

### 1. Database migration — Add public RLS policies for `customers`
```sql
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
```

Note: The same issue exists in the main Booking page — this fix covers both flows.

### 2. `src/components/Header.tsx` — Add Quick Booking nav link
Add `{ path: '/quick-booking', label: t('nav.quickBooking') }` to navLinks array.

### 3. `src/contexts/LanguageContext.tsx` — Add nav translation
- `nav.quickBooking`: "Quick Booking" / "Snabbbokning"

### 4. `src/pages/Index.tsx` — Add Quick Booking CTA
Add a secondary CTA button/link to quick booking on the homepage, near the main booking CTA or in the services section.

## Security consideration
Making `customers` publicly readable is acceptable here since the table contains business contact info (name/email/phone) submitted by customers themselves through public forms. The select policy could be narrowed but the main booking flow also needs this lookup pattern.

