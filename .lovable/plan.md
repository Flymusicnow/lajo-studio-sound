

# Interactive "Build Your Session" Booking Module

## Overview

Full rewrite of `/booking` from a simple form into a multi-step interactive session builder with live pricing, smart nudges, and structured email confirmation. Single-page flow, no new routes.

## Architecture

**State**: Single `useReducer` in `Booking.tsx` managing all selections and current step. Price calculation as a derived pure function.

**Layout**: Two-column on desktop (steps left, sticky price panel right). Single column on mobile with sticky bottom price bar.

**Steps consolidated into 8 visible steps** (combining contact + payment into fewer screens for speed):

### Step 1 -- Choose Session (required, single select)
Cards: 4h Producer (4 500 SEK), 8h Producer (8 500 SEK, badge "Mest populär"), Custom (text input).

### Step 2 -- What Are We Creating? (multi-select, no price impact)
Tiles: New song, Develop existing, Topline writing, Beat production, Mixing, Other (text).

### Step 3 -- Creative Add-Ons (multi-select, priced)
- Arrangement & structure: 1 500 SEK
- Vocal production: 2 000 SEK
- Sound design: 1 500 SEK
- Extra revision: 1 000 SEK
- Express delivery: 2 500 SEK

### Step 4 -- Mastering
No mastering / Mastering per track (1 500 SEK/track, number input). Note: included in Radio Ready & EP Package.

### Step 5 -- Result Package (single select)
Session only / Record Your Song (8 900) / Radio Ready (18 000, badge "Bäst värde") / EP Package (45 000). Each with outcome description.

### Step 6 -- Mixing Scope
0-20 tracks (standard) / 20-50 (advanced) / 50+ (complex). Subtle note about larger projects.

### Step 7 -- Project Details + Contact + Payment
Combined into one step: songs count, tracks/stems, reference URL, deadline (date picker), description (300 chars), name, email, phone, payment choice (50% deposit default / full).

### Step 8 -- Review & Submit
Full summary, "Säkra din session" CTA button.

## Live Price Panel (Step 6 area -- always visible)
Sticky sidebar on desktop (`sticky top-24`), fixed bottom bar on mobile. Shows: selected items, total (large gold), deposit 50%, remaining. CSS transition on price changes.

## Conversion Features
- Progress bar: "Steg X av 8 -- Bygg din session"
- Smart nudge when "Session only" selected
- Badges on popular/best-value options
- "You're almost done" after step 5
- Track prep info block in Step 7
- Outcome labels (Demo ready / Release ready / Full EP)

## Files

### New (11 components under `src/components/booking/`)
- `SessionStep.tsx` -- Step 1
- `CreativeTypeStep.tsx` -- Step 2
- `AddOnsStep.tsx` -- Step 3
- `MasteringStep.tsx` -- Step 4
- `ResultPackageStep.tsx` -- Step 5
- `MixingScopeStep.tsx` -- Step 6
- `DetailsStep.tsx` -- Step 7 (project + contact + payment combined)
- `ReviewStep.tsx` -- Step 8 (summary + CTA)
- `PriceSummary.tsx` -- Sticky price panel
- `StepIndicator.tsx` -- Progress bar
- `SelectableCard.tsx` -- Reusable selectable card component

### Modified
- `src/pages/Booking.tsx` -- Full rewrite: useReducer state, step navigation, layout with price panel
- `src/contexts/LanguageContext.tsx` -- All new booking builder translation keys (SV + EN)
- `supabase/functions/send-booking-email/index.ts` -- Accept rich structured payload, render detailed summary in email

## Technical Details

- Selectable cards: `border-border` inactive, `border-primary` active with gold checkmark
- Price animation via `transition-all duration-300` on total display
- Date picker uses existing Shadcn Calendar + Popover
- Mobile: steps stack vertically, price bar fixed at bottom with slide-up expand
- All add-on prices defined as constants in a shared config object
- Stripe-ready: payment step is UI only, prepared for future integration
- Edge function updated to parse and render the full structured booking data in the confirmation email

