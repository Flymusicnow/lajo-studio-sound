

# Phase 2: Kalender, Filuppladdning & E-postautomation

## Översikt

Bygger vidare på Phase 1 med tre huvudfunktioner: admin-kalendervy med slot-kontroll, filuppladdningssystem för kunder, och utökad e-postautomation för hela bokningsflödet.

## Vad som byggs

### 1. Kalender + Slot-kontroll

**Databas:**
- `blocked_dates` tabell — `id`, `date (DATE)`, `reason (TEXT)`, `created_at`
- `studio_settings` tabell — `id`, `monthly_slot_cap (INT, default 7)`, `updated_at`
- RLS: admin-only via `is_admin()`

**Admin-kalender (`/admin/calendar`):**
- Månadsvy som visar bekräftade bokningar och blockerade datum
- Klicka på datum för att blockera/avblockera
- Visa bokade sessioner per datum
- Redigerbar monthly slot cap
- Visuell indikator för tillgänglighet

**Public booking integration:**
- Uppdatera bokningsformuläret (Step 7) med datumväljare som visar tillgängliga datum
- Blockerade datum disabled i kalendern
- Visa "Begränsad tillgänglighet" om få platser kvar

### 2. Filuppladdningssystem

**Databas:**
- Storage bucket `project-files` (privat)
- Uppdatera `project_status` tabell — redan har `file_status`, `file_link`, `file_notes`

**Kund-filuppladdning (`/upload/:bookingId`):**
- Publik sida (ingen auth krävs) med unik booking-länk
- Ladda upp ZIP-fil direkt till storage
- Alternativt: klistra in extern länk (WeTransfer/Google Drive)
- Projektanteckningar-fält
- Filinstruktioner (namngivning, format, etc.)
- Bekräftelseskärm efter uppladdning

**Admin filöversikt:**
- Visa filstatus i request detail view
- Knapp "Begär filer" som uppdaterar file_status
- Visa uppladdade filer / externa länkar
- Ladda ner filer direkt

### 3. E-postautomation

**Utökar befintlig Resend edge function** med nya e-posttyper. Skapar en ny generisk `send-studio-email` edge function:

E-posttyper:
- `booking_approved` — Skickas när admin godkänner bokning
- `booking_declined` — Skickas vid nekad bokning  
- `payment_request` — Skickas med betalningslänk
- `payment_received` — Bekräftelse vid betalning
- `files_requested` — Instruktioner för filuppladdning med unik länk
- `files_received` — Bekräftelse att filer mottagits

Alla e-postmejl i samma premium-design som befintligt bokningsbekräftelse-mejl.

Admin-knappar i RequestDetail som triggar rätt e-post vid statusändring.

## Filer som skapas/ändras

```
Nya:
- src/pages/admin/Calendar.tsx
- src/pages/FileUpload.tsx  
- src/components/admin/CalendarView.tsx
- supabase/functions/send-studio-email/index.ts

Ändrade:
- src/App.tsx (nya routes)
- src/components/admin/AdminLayout.tsx (calendar nav)
- src/pages/admin/RequestDetail.tsx (filstatus + email-knappar)
- src/pages/admin/Dashboard.tsx (slot data från studio_settings)
```

## Tekniska detaljer

- Kalendervy byggs med CSS grid (7 kolumner), inte externt bibliotek
- Storage bucket skapas via migration med RLS: authenticated kan läsa, anon kan ladda upp till specifik path
- E-post edge function tar `type` parameter och renderar rätt template
- Filuppladdningslänk: `/upload/{booking_request_id}` — booking ID fungerar som access token
- Alla admin-sidor fortsätter använda AdminLayout med dark premium design

