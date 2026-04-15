
ALTER TABLE public.booking_requests 
  ADD COLUMN IF NOT EXISTS promo_code text,
  ADD COLUMN IF NOT EXISTS estimated_workload_hours numeric DEFAULT 0;

ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'awaiting_deposit';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'awaiting_files';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'files_received';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'in_progress';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'ready_for_final_payment';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'final_payment_pending';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'delivered';

ALTER TYPE public.payment_status ADD VALUE IF NOT EXISTS 'final_payment_pending';
