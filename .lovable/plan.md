

# File Upload Improvements + Quick Studio Booking

## Overview

Two additions: (1) Improve the existing `/upload/:bookingId` page with better UX, checklist, and file size handling. (2) Add a "Quick Studio Booking" path as a tab/toggle on the `/booking` page for fast, no-frills session booking.

## 1. Improved File Upload Page

**File: `src/pages/FileUpload.tsx`** — Full rewrite

Changes:
- English UI text (matching the prompt): "Upload your project files"
- Add a **checklist section** with preparation tips (name files clearly, remove unused, include reference, BPM/key, avoid clipping, compress as ZIP)
- ZIP upload as **primary action** with drag-and-drop area
- External link as **secondary option** below a divider
- **File size limit**: 50MB for direct upload. If file exceeds this, show a message prompting the external link method
- Name/Email/Notes fields (name and email pre-filled from booking data when available)
- Progress indicator during upload
- Success confirmation with "Files received" message
- Mobile-friendly, same dark premium design

**Backend behavior** (already exists, minor updates):
- `project_status.file_status` updated to `'received'` on submission
- Studio email notification via `send-studio-email` edge function (already wired)
- Add `file_received_at` timestamp tracking — requires a small migration adding a column to `project_status`

**Database migration:**
```sql
ALTER TABLE public.project_status 
ADD COLUMN IF NOT EXISTS file_received_at timestamptz,
ADD COLUMN IF NOT EXISTS file_method text DEFAULT 'direct';
```

## 2. Quick Studio Booking

**New file: `src/pages/QuickBooking.tsx`**

A single-page, 3-step inline flow (no multi-page wizard):

- **Step 1**: Select session — two cards: "4h Studio Session – 3 200 SEK" / "8h Studio Session – 5 900 SEK"
- **Step 2**: Select date — calendar picker (blocked dates excluded, same logic as main booking)
- **Step 3**: Contact details — Name, Email, Phone, optional message
- **CTA**: "Send booking request"

Positioning text at top: "Quick booking for artists who already know what they need and just want studio time."

**New route**: `/quick-booking` in `App.tsx`

**Backend**: Inserts into existing `booking_requests` table with `session_type = '4h-quick'` or `'8h-quick'`, `creative_types = []`, no add-ons, no result package. Sets `total_price` and `deposit_amount`. Creates/finds customer same as main booking. Sends booking email notification.

**Quick booking prices** (different from full session builder):
- 4h: 3200 SEK
- 8h: 5900 SEK

These are defined as constants in the component.

**Admin side**: Quick bookings appear in the same Requests list — no changes needed. The `session_type` field distinguishes them.

## 3. Navigation

- Add a link/button to Quick Booking from the main `/booking` page header: "Just need studio time? Quick book here →"
- Add Quick Booking to the nav or as a secondary CTA where appropriate

## 4. Translations

Add SV/EN translations for:
- Quick booking page labels
- File upload page labels
- Checklist items

## Files changed

```
src/pages/FileUpload.tsx          — Rewrite with improved UX
src/pages/QuickBooking.tsx        — New quick booking page
src/App.tsx                       — Add /quick-booking route
src/pages/Booking.tsx             — Add link to quick booking
src/contexts/LanguageContext.tsx   — Add translation keys
Migration                         — Add file_received_at, file_method to project_status
```

## Technical details

- Quick booking uses `supabase.from('blocked_dates').select('date')` to disable dates in the calendar
- File upload uses existing `project-files` storage bucket with 50MB client-side size check
- Both pages use the existing Layout component with premium dark styling
- No new database tables needed — reuses `booking_requests`, `customers`, `project_status`

