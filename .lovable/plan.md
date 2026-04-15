

# Fix Pricing Page — Missing Translations

## Problem
All text on the `/pricing` page shows raw translation keys (e.g. `pricing.title`, `pricing.service.mixing`) because no translations were added to `LanguageContext.tsx`.

## Solution
Add all ~40 pricing translation keys to both `sv` and `en` sections in `LanguageContext.tsx`.

### Keys to add (SV / EN)

| Key | Svenska | English |
|-----|---------|---------|
| `pricing.title` | Priser | Pricing |
| `pricing.subtitle` | Bygg din session och se priset direkt | Build your session and see the price |
| `pricing.configurator.title` | Prisberäknare | Price Calculator |
| `pricing.service` | Tjänst | Service |
| `pricing.service.recording` | Inspelning | Recording |
| `pricing.service.mixing` | Mixning | Mixing |
| `pricing.service.mastering` | Mastering | Mastering |
| `pricing.service.production` | Produktion | Production |
| `pricing.package` | Paket | Package |
| `pricing.package.basic` | Basic | Basic |
| `pricing.package.premium` | Premium | Premium |
| `pricing.package.highend` | High-End | High-End |
| `pricing.package.recommend` | Rekommenderat | Recommended |
| `pricing.tracks` | Antal spår | Track count |
| `pricing.tracks.0-30` | 0–30 spår | 0–30 tracks |
| `pricing.tracks.31-60` | 31–60 spår | 31–60 tracks |
| `pricing.tracks.61-100` | 61–100 spår | 61–100 tracks |
| `pricing.tracks.100+` | 100+ spår | 100+ tracks |
| `pricing.delivery` | Leverans | Delivery |
| `pricing.delivery.standard` | Standard (5–7 dagar) | Standard (5–7 days) |
| `pricing.delivery.priority` | Prioriterad (2–3 dagar) | Priority (2–3 days) |
| `pricing.total` | Totalt | Total |
| `pricing.from` | Från | From |
| `pricing.book` | Boka nu | Book now |
| `pricing.mixing.title` | Mixning | Mixing |
| `pricing.mastering.title` | Mastering | Mastering |
| `pricing.recording.title` | Inspelning | Recording |
| `pricing.production.title` | Produktion | Production |
| `pricing.revisions` | revisioner | revisions |
| `pricing.unlimited` | Obegränsade revisioner | Unlimited revisions |
| `pricing.stereo` | Stereo Mastering | Stereo Mastering |
| `pricing.hybrid` | Hybrid Mastering | Hybrid Mastering |
| `pricing.stem` | Stem Mastering | Stem Mastering |
| `pricing.halfday` | Halvdag (4h) | Half-day (4h) |
| `pricing.fullday` | Heldag (8h) | Full-day (8h) |
| `pricing.weekend` | Helg | Weekend |
| `pricing.exclusive` | Exklusiv beat/produktion | Exclusive beat/production |

## File Changed
```
EDIT: src/contexts/LanguageContext.tsx — add ~40 pricing keys to both sv and en
```

