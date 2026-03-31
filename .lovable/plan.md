

# Phase 1: Studio Operations System — Foundation

## Overview

Build the foundation of the studio management system: database schema, admin authentication, dashboard, request management, and customer profiles. The public About page is also included. Future phases will add calendar/slot control, file delivery, email automation, and notifications.

## What gets built

### 1. Public About Page (`/about`)
- Premium "Om mig / About" page with biography, credentials, creative process, and CTAs ("Boka session", "Bygg din session")
- Reuses existing `Layout`, `AnimatedSection` components
- Bilingual SV/EN translations added to `LanguageContext`
- Note: an About page already exists at `src/pages/About.tsx` — it will be rewritten with Topliner Production content and the sections listed in the prompt

### 2. Database Schema (migration)
Tables:

- **`profiles`** — `id (uuid, FK auth.users)`, `email`, `full_name`, `role (text, default 'admin')`, auto-created on signup via trigger
- **`customers`** — `id`, `name`, `email`, `phone`, `status (new/returning/high_value)`, `total_spent`, `notes`, `created_at`, `updated_at`
- **`booking_requests`** — `id`, `customer_id (FK)`, `status` (enum: new, under_review, approved, counter_offer, declined, awaiting_payment, paid, confirmed), `session_type`, `session_price`, `creative_types (jsonb)`, `add_ons (jsonb)`, `mastering_type`, `mastering_tracks`, `result_package`, `result_package_price`, `mixing_scope`, `total_price`, `deposit_amount`, `payment_choice`, `payment_status` (unpaid/deposit_paid/fully_paid), `requested_date`, `song_count`, `track_count`, `reference_url`, `deadline`, `description`, `custom_session_text`, `admin_notes (text)`, `created_at`, `updated_at`
- **`project_status`** — `id`, `booking_request_id (FK)`, `status` (enum: awaiting_files, files_received, prep, mixing, mastering, ready_for_delivery, delivered, completed), `file_status` (not_requested/awaiting/received/reviewed/ready), `file_link`, `file_notes`, `updated_at`

RLS: All tables restricted to authenticated users only. Profiles table: users can only read/update their own profile.

### 3. Admin Authentication
- Login page at `/admin/login` — email + password form
- Auth context/hook for session management
- Protected route wrapper for all `/admin/*` routes
- No signup form (owner creates account once, or we seed it)
- Auto-confirm disabled (standard email verification)

### 4. Admin Dashboard (`/admin`)
Overview cards showing:
- New requests count
- Awaiting review / Awaiting payment / Paid
- Active projects
- Deliveries due this week
- Remaining session slots (configurable cap, default 7/month)

Data fetched from `booking_requests` and `project_status` tables with aggregation queries.

### 5. Request Management (`/admin/requests`)
- List view with search + status filter
- Each row: customer name, date, session type, package, total, deposit, payment status, booking status
- Detail view (`/admin/requests/:id`): full booking data, customer info, pricing breakdown
- Admin actions: Approve, Decline, Mark paid, Add note, Confirm booking — each updates `booking_requests.status` and/or `payment_status`

### 6. Customer CRM (`/admin/customers`)
- List view with search
- Profile view (`/admin/customers/:id`): name, email, phone, status, total spent, booking count, booking history, internal notes
- Derived stats: average order value, last booking

### 7. Booking Form → Database
- Update `Booking.tsx` submit handler to also insert into `booking_requests` + create/find `customers` record
- Keep existing email notification via edge function

## File structure

```text
src/
├── pages/
│   ├── About.tsx (rewrite)
│   ├── admin/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Requests.tsx
│   │   ├── RequestDetail.tsx
│   │   ├── Customers.tsx
│   │   └── CustomerDetail.tsx
├── components/
│   └── admin/
│       ├── AdminLayout.tsx (sidebar nav, dark premium)
│       ├── ProtectedRoute.tsx
│       ├── StatsCard.tsx
│       ├── RequestRow.tsx
│       ├── StatusBadge.tsx
│       └── CustomerRow.tsx
├── hooks/
│   └── useAuth.tsx
```

## Routes added to App.tsx

- `/about` → About page
- `/admin/login` → Login
- `/admin` → Dashboard (protected)
- `/admin/requests` → Request list (protected)
- `/admin/requests/:id` → Request detail (protected)
- `/admin/customers` → Customer list (protected)
- `/admin/customers/:id` → Customer detail (protected)

## Technical details

- Migration creates all tables, enums, RLS policies, and the profile auto-creation trigger in one SQL migration
- Auth uses `supabase.auth.signInWithPassword()` and `onAuthStateChange` listener
- Admin layout: dark sidebar with gold accent nav items, responsive hamburger on mobile
- All admin pages mobile-first with card-based layouts and touch-friendly action buttons
- Status updates via direct `supabase.from('booking_requests').update()` calls
- Customer `total_spent` updated when payment status changes
- Translations added for all admin UI labels (SV/EN)

## What is NOT in Phase 1

- Calendar + slot blocking UI (Phase 2)
- File upload/delivery system (Phase 2)
- Email automation beyond current booking confirmation (Phase 2)
- In-app notifications (Phase 2)
- Payment integration / Stripe (Phase 2)

