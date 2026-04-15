

# Round 2: Admin Panel → Studio OS Rebuild

## Overview
Transform the current basic admin panel into a premium "Studio OS" — a calm, intelligent, and actionable operations dashboard. This is broken into manageable pieces.

## What Changes

### A. New Dashboard — "Today" Focus
**Replace `src/pages/admin/Dashboard.tsx`** completely.

**Desktop layout** (2-column):
- **Left column (wide)**: 
  - Greeting header: "God morgon" + date + week number
  - **Action cards row**: New requests needing attention, pending payments, files uploaded — each with count + quick-action button
  - **Active Projects timeline**: Horizontal pipeline showing projects by workflow stage (awaiting files → mixing → mastering → delivery) with project name, customer, and days-in-stage
  - **This week's calendar strip**: Mon–Sun showing booked/blocked/free slots at a glance

- **Right column (narrow sidebar)**:
  - **Capacity meter**: Visual ring/bar showing `slotsUsed / slotCap` for this month
  - **Revenue this month**: Sum of paid bookings
  - **Upcoming deadlines**: Next 3 deadlines with days remaining, color-coded (green/amber/red)

**Mobile layout**: Stack as "Today" view — action cards first, then active projects, then capacity.

### B. Workload Manager — New Page
**New file: `src/pages/admin/Workload.tsx`**

A Kanban-style board showing all active projects across workflow stages:
- Columns: `Inväntar filer` → `Förberedelse` → `Mixing` → `Mastering` → `Leverans redo` → `Levererad`
- Each card shows: customer name, session type, deadline (with days remaining), estimated hours
- Cards are draggable between columns (updates `project_status.status`)
- Color-coded deadline indicators: green (>3 days), amber (1-3 days), red (overdue)
- Header shows total estimated hours across all active projects

### C. Calendar Capacity Visualization
**Update `src/pages/admin/Calendar.tsx`** and **`src/components/admin/CalendarView.tsx`**:
- Add capacity bar at top: `X / Y sessions booked this month` with visual progress bar
- Each day cell shows remaining capacity (if applicable)
- Week view option alongside month view
- Color intensity on booked days scales with number of sessions

### D. AdminLayout Upgrade
**Update `src/components/admin/AdminLayout.tsx`**:
- Add "Workload" nav item (icon: `Layers`)
- Rename nav items to Swedish: Dashboard → Översikt, Requests → Förfrågningar, Customers → Kunder, Calendar → Kalender, Content → Innehåll
- Add subtle gold accent line on active nav item (left border)
- Show mini capacity indicator in sidebar footer (e.g., "4/7 slots")

### E. StatusBadge Update
**Update `src/components/admin/StatusBadge.tsx`**:
- Add missing statuses from Round 1 enum expansion: `awaiting_deposit`, `awaiting_files`, `files_received`, `in_progress`, `ready_for_final_payment`, `final_payment_pending`, `delivered`

### F. StatsCard Redesign
**Update `src/components/admin/StatsCard.tsx`**:
- Add optional `subtitle` prop for secondary info
- Add optional `trend` indicator (up/down arrow + percentage)
- Slightly larger padding, more breathing room

## New Files
```
NEW:  src/pages/admin/Workload.tsx
```

## Files Changed
```
EDIT: src/pages/admin/Dashboard.tsx        — complete rewrite to "Today" focus
EDIT: src/pages/admin/Calendar.tsx         — capacity bar + week view
EDIT: src/components/admin/AdminLayout.tsx  — add Workload nav + Swedish labels + capacity footer
EDIT: src/components/admin/CalendarView.tsx — capacity visualization per day
EDIT: src/components/admin/StatusBadge.tsx  — add new statuses
EDIT: src/components/admin/StatsCard.tsx    — subtitle + trend props
EDIT: src/App.tsx                          — add /admin/workload route
```

## Database
No schema changes needed — all data comes from existing tables (`booking_requests`, `project_status`, `studio_settings`, `blocked_dates`).

## Technical Notes
- Workload Kanban uses local drag state + Supabase update on drop (no external DnD library — simple `onDragStart`/`onDrop` HTML5 API)
- Dashboard fetches all data in parallel with `Promise.all`
- Capacity meter: simple SVG circle or CSS progress bar
- Deadline color logic: `daysLeft > 3 → green`, `1-3 → amber`, `≤0 → red`
- Active projects pipeline: query `project_status` joined with `booking_requests` + `customers`
- Revenue calculation: sum `total_price` where `payment_status in ('deposit_paid', 'fully_paid')` and `created_at` in current month

## What's NOT in Round 2 (deferred to Round 3)
- Timekeeper / hour logging per project
- SMS notifications
- Promo code backend validation
- Automated final payment trigger

