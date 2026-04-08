

# Fix Bugs + Telegram Notifications + Admin Snabbåtkomst

## Problem (från bilderna)

1. **Bild 1 — Bokningssteg**: Stegindikatorns (StepIndicator) steg är inte klickbara. Användaren kan inte hoppa mellan steg i "Bygg din session"-wizarden.
2. **Bild 2 — Header-navigering**: Navlänkarna i headern fungerar inte korrekt — användaren fastnar på `/booking` och kan inte navigera bort. Troligen relaterat till att anchor-länken (`/#paket`) blockerar normal navigation.

## Vad som byggs

### 1. Fix: Klickbara steg i bokningswizarden
**`src/components/booking/StepIndicator.tsx`**
- Gör varje stegnummer till en klickbar knapp
- Tillåt att hoppa tillbaka till tidigare besökta steg (inte framåt förbi nuvarande)
- Visa visuell skillnad: completed (guldprick), active (guldfylld), future (grå)
- Lägg till `onStepClick` callback-prop

**`src/pages/Booking.tsx`**
- Skicka `onStepClick` till StepIndicator som dispatchar `SET_STEP`

### 2. Fix: Header-navigation
**`src/components/Header.tsx`**
- Anchor-länken `/#paket` hanteras korrekt med `useNavigate` istället för vanlig `<a href>`
- Se till att klick på navlänkar stänger mobilmenyn OCH navigerar korrekt

### 3. Admin-ikon i headern (snabbåtkomst)
**`src/components/Header.tsx`**
- Lägg till en liten diskret ikon (t.ex. `Settings` eller `Shield`) längst till höger i headern
- Ikonen syns alltid men är subtil (text-muted-foreground, liten)
- Klick navigerar till `/admin` — om användaren är inloggad kommer de direkt till dashboarden, annars till login
- Ingen text, bara en ikon — clean och diskret

### 4. Telegram-notifikationer vid nya bokningar
**Ny edge function: `supabase/functions/send-telegram/index.ts`**
- Tar emot `message` i body, skickar till Telegram Bot API
- Kräver två secrets: `TELEGRAM_BOT_TOKEN` och `TELEGRAM_CHAT_ID`

**Uppdatera befintliga flöden** (Booking.tsx, QuickBooking.tsx, stripe-webhook)
- Efter lyckad bokning: anropa `send-telegram` med bokningssammanfattning
- Efter betalning (webhook): skicka Telegram-notis "Betalning mottagen"
- Efter filuppladdning: skicka Telegram-notis "Filer mottagna"

### 5. Automatiska e-postmeddelanden vid statusändringar
Dessa finns redan i `send-studio-email` edge function och triggas manuellt från admin. Ändringen är att de nu triggas **automatiskt** när status ändras:
- Godkänd bokning → `booking_approved` e-post (redan implementerat via `updateStatus`)
- Betalning mottagen → `payment_received` e-post (redan implementerat via webhook)
- Filer mottagna → skicka bekräftelse-mejl till kund (lägg till i FileUpload.tsx submit)

### 6. Prissida i navigationen
**`src/components/Header.tsx`**
- Lägg till "Paket" länken som pekar på `/pricing` istället för `/#paket` anchor

### 7. Mobilförbättringar
- Bokningssidans stegindikator: kompaktare på mobil
- Bottom price bar: se till att den inte täcker navigeringsknappar

## Filer som ändras

```
src/components/booking/StepIndicator.tsx  — Klickbara steg
src/pages/Booking.tsx                     — onStepClick prop
src/components/Header.tsx                 — Fix nav + admin-ikon + pricing-länk
supabase/functions/send-telegram/index.ts — Ny edge function
src/pages/QuickBooking.tsx                — Telegram-notis vid bokning
src/pages/FileUpload.tsx                  — E-post + Telegram vid filuppladdning
```

## Secrets som behövs
- `TELEGRAM_BOT_TOKEN` — Token från BotFather
- `TELEGRAM_CHAT_ID` — Ditt chat-ID (kan hämtas via @userinfobot)

## Tekniska detaljer
- StepIndicator får en `onStepClick(step: number)` prop, renderar steg som `<button>` med `disabled={step > currentStep}`
- Admin-ikonen använder `useAuth()` för att visa en subtil guldton om inloggad
- Telegram edge function: `POST https://api.telegram.org/bot{token}/sendMessage` med `chat_id` och `text`
- Pricing-sidan finns redan (`/pricing`) men saknas i nav — lägg till som "Paket"

