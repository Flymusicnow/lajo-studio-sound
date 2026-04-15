

# Topliner System — Fas 1 Rebuild + Payment Automation

This is a large, multi-phase implementation. To keep it manageable and shippable, I'll break it into **3 implementation rounds**. This plan covers **Round 1** (the most critical changes). Rounds 2-3 will follow after testing.

---

## Round 1: Core UX Fixes + Homepage Redesign + Payment Flow

### A. Homepage — New "Första gången?" Section
**File: `src/components/StudioEntry.tsx`** (new)
- Two side-by-side cards below Hero:
  - **"Starta enkelt"** → links to `/quick-booking` (from 4 500 kr)
  - **"Bygg din låt"** → links to `/booking` (full process)
- Sub-text: "Osäker? Börja enkelt. Vi guidar dig vidare."
- Gold CTAs, right card slightly larger (premium feel)

**File: `src/pages/Index.tsx`** — Insert `<StudioEntry />` between Hero and ThreeWays

### B. Booking Wizard UX Fixes

**1. Package clarity — Expandable cards** (`ResultPackageStep.tsx`)
- Selected package expands to show: what's included, what you get, what's NOT included
- Unselected packages stay compact (name + price only)

**2. "Annat" text field** (`CreativeTypeStep.tsx`)
- Replace `<Input>` with `<Textarea>` that auto-grows (min-h-[80px], no max)

**3. Mastering track count fix** (`MasteringStep.tsx`)
- Replace bare `<Input type="number">` with +/– stepper buttons
- Allow range 1–99
- Larger touch targets for mobile

**4. Step 5 rename** (`ResultPackageStep.tsx`)
- Title: "Välj ditt slutresultat" / "Choose your final result"
- Add explanation text: "Din session är tiden. Det här är vad du vill lämna med."
- Make options visually distinct with included/not-included lists

**5. Add-ons with time estimates** (`AddOnsStep.tsx`, `bookingConfig.ts`)
- Add `estimatedHours` to each add-on config
- Display time impact next to each add-on (e.g. "+2h")
- Add `estimated_workload` field to booking submission

**6. Promo code** (`bookingConfig.ts`, `DetailsStep.tsx`, `ReviewStep.tsx`)
- Add promo code input field in DetailsStep (before payment choice)
- Show original price, discount, new total in ReviewStep
- Store promo code in booking_requests table (new column)

**7. Deadline buffer** (`DetailsStep.tsx`)
- Calculate minimum deadline based on workload (base 5 days + add-ons)
- Disable dates before minimum
- Show message: "Baserat på ditt projekt, tidigaste leverans är X"

### C. Database Migration
```sql
ALTER TABLE booking_requests 
  ADD COLUMN IF NOT EXISTS promo_code text,
  ADD COLUMN IF NOT EXISTS estimated_workload_hours numeric DEFAULT 0;
```

### D. Payment Status Expansion
**Migration:**
```sql
-- Add new statuses to booking_status enum
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'awaiting_deposit';
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'awaiting_files';
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'files_received';
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'in_progress';
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'ready_for_final_payment';
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'final_payment_pending';
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'delivered';

-- Add new payment statuses
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'final_payment_pending';
```

### E. Admin — "Approve & Send Payment Link" Combined Action
**File: `src/pages/admin/RequestDetail.tsx`**
- New button: "Godkänn & skicka betalningslänk"
- One click: approves booking → creates Stripe checkout → sends email with payment link → updates status to `awaiting_deposit`
- Stripe webhook already handles `deposit_paid` transition

### F. Stripe Webhook Enhancement
**File: `supabase/functions/stripe-webhook/index.ts`**
- On `checkout.session.completed` with `payment_stage=deposit`:
  - Status → `deposit_paid`
  - Send upload instructions email
  - Send Telegram notification
- On `payment_stage=final`:
  - Status → `fully_paid`
  - Send delivery email

### G. Mobile UX
- Larger input fields (h-12 minimum)
- +/– buttons for number inputs
- Sticky CTA always visible on mobile (already exists, refine spacing)
- Better step indicator spacing on mobile

---

## What's NOT in Round 1 (deferred to Round 2-3)
- Full admin redesign (workload manager, timekeeper, left rail navigation)
- Calendar capacity visualization
- Automated final payment trigger
- SMS notifications
- Promo code validation backend (Round 1 just stores it, admin reviews)

---

## Files Changed/Created

```
NEW:  src/components/StudioEntry.tsx
EDIT: src/pages/Index.tsx
EDIT: src/components/booking/ResultPackageStep.tsx
EDIT: src/components/booking/CreativeTypeStep.tsx
EDIT: src/components/booking/MasteringStep.tsx
EDIT: src/components/booking/AddOnsStep.tsx
EDIT: src/components/booking/DetailsStep.tsx
EDIT: src/components/booking/ReviewStep.tsx
EDIT: src/components/booking/bookingConfig.ts
EDIT: src/pages/Booking.tsx
EDIT: src/pages/admin/RequestDetail.tsx
EDIT: supabase/functions/stripe-webhook/index.ts
EDIT: supabase/functions/create-checkout/index.ts
MIGRATION: Add promo_code, estimated_workload_hours columns + new enum values
```

## Technical Notes
- Expandable cards use CSS transition (max-height) for smooth open/close
- Workload estimation: session base hours + add-on hours + mastering tracks × 0.5h
- Deadline buffer: Math.max(5, Math.ceil(estimatedHours / 4)) days from today
- Promo codes stored as text — no backend validation in Round 1 (admin decides)
- All new translations added for SV/EN

