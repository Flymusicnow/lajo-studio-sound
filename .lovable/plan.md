

# Add Remote Services to Topliner Production

## Overview
Extend the business to clearly support both in-studio and remote clients. This touches the website (new section), booking flow (new first step), database (new column), and admin (visible label).

## Changes

### 1. Website — New "Remote" Section
**New file: `src/components/RemoteServices.tsx`**

A dedicated section placed after ThreeWays on the homepage. Headline: "Work with us from anywhere" (EN) / "Jobba med oss var du än befinner dig" (SV). Lists remote services: Mixing, Mastering, Production help, Topline/vocal production, Track development. CTA links to `/booking?mode=remote`.

**Edit: `src/pages/Index.tsx`** — Add `<RemoteServices />` after ThreeWays.

### 2. Booking Flow — New Step 0: Work Mode
**New file: `src/components/booking/WorkModeStep.tsx`**

Two selectable cards:
- **I studion** / **In studio** — microphone icon
- **Remote / Skicka filer** / **Remote / Send files** — globe icon

This becomes Step 1. All existing steps shift +1 (total becomes 9).

**Edit: `src/components/booking/bookingConfig.ts`**:
- Add `workMode: 'studio' | 'remote' | ''` to `BookingState` and initial state
- Add `SET_WORK_MODE` action
- Update reducer

**Edit: `src/pages/Booking.tsx`**:
- `TOTAL_STEPS = 9`
- Insert WorkModeStep at step 1, shift all others
- When `workMode === 'remote'`: skip SessionStep (step 2) — session not applicable, auto-set to `'remote'`
- Adjust `canProceed` for new step numbering
- Include `work_mode` in the Supabase insert and email payload
- Update Telegram notification to show 🏠 Remote or 🎙 Studio

### 3. Conditional Booking Logic
When remote is selected:
- **Step 2 (Session)**: Skipped — no studio session needed. Auto-set `session = 'remote'`
- **Step 3 (Creative Types)**: Show all, but labels feel remote-appropriate (already fine: mixing, topline, etc.)
- **Step 5 (Result Package)**: Hide "Session Only" option (irrelevant for remote)
- **Confirmation page**: Show message about file upload instructions coming via email

### 4. Database — Add `work_mode` Column
**Migration**: Add `work_mode text default 'studio'` to `booking_requests`.

### 5. Admin — Show Work Mode Badge
**Edit: `src/pages/admin/RequestDetail.tsx`** — Show "🏠 Remote" or "🎙 Studio" badge near the top.
**Edit: `src/pages/admin/Requests.tsx`** — Add work mode indicator in the list view.
**Edit: `src/pages/admin/Workload.tsx`** — Show icon on Kanban cards.

### 6. Translations
**Edit: `src/contexts/LanguageContext.tsx`** — Add ~25 keys:
- `remote.title`, `remote.subtitle`, `remote.desc`, `remote.service.mixing`, etc.
- `bb.s0.title`, `bb.s0.sub`, `bb.s0.studio`, `bb.s0.studio.desc`, `bb.s0.remote`, `bb.s0.remote.desc`
- `bb.confirm.remote.note`

### 7. Add `'remote'` session to config
**Edit: `src/components/booking/bookingConfig.ts`** — Add `{ id: 'remote', price: 0, isCustom: false, baseHours: 0 }` to SESSIONS so pricing logic handles it.

## Files

```
NEW:  src/components/RemoteServices.tsx
NEW:  src/components/booking/WorkModeStep.tsx
EDIT: src/pages/Index.tsx                    — add RemoteServices section
EDIT: src/components/booking/bookingConfig.ts — workMode state + remote session
EDIT: src/pages/Booking.tsx                   — 9 steps, skip logic, work_mode in DB
EDIT: src/contexts/LanguageContext.tsx         — ~25 translation keys
EDIT: src/pages/admin/RequestDetail.tsx        — show work mode badge
EDIT: src/pages/admin/Requests.tsx             — work mode in list
EDIT: src/pages/admin/Workload.tsx             — icon on kanban cards
MIGRATION: add work_mode column to booking_requests
```

## Technical Notes
- Remote bookings skip step 2 (session selection) by auto-advancing and setting `session = 'remote'`
- `calculateTotal` already handles `session.price = 0` correctly
- The `work_mode` column defaults to `'studio'` so all existing bookings remain unaffected
- URL param `?mode=remote` from the CTA pre-selects remote in WorkModeStep

