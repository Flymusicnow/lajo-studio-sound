

# Add Remote-Specific Packages to Booking Flow

## What Changes

### 1. New Remote Packages in `bookingConfig.ts`
Add 4 remote-specific result packages to `RESULT_PACKAGES`:

| Package | Price (SEK) | Includes Mastering |
|---------|------------|-------------------|
| `mixing-only` | 5 500 | No |
| `mastering-only` | 1 500 | Yes |
| `mix-and-master` | 6 500 | Yes |
| `production-support` | 12 000 | No |

Add a `remoteOnly` and `studioOnly` flag to the `ResultPackage` interface so the UI can filter correctly.

### 2. Update `ResultPackageStep.tsx`
- Add the 4 new remote packages with their own includes/notIncluded lists
- Filter packages: show `remoteOnly` packages only when remote, show `studioOnly` packages only when studio
- Shared packages (like `radio-ready`, `ep-package`) show for both modes
- Mark `session-only` and `record-your-song` as `studioOnly`

### 3. Translations in `LanguageContext.tsx`
Add ~20 keys for the new packages:
- `bb.s5.mixOnly` / `bb.s5.mixOnly.desc`
- `bb.s5.masterOnly` / `bb.s5.masterOnly.desc`
- `bb.s5.mixMaster` / `bb.s5.mixMaster.desc`
- `bb.s5.prodSupport` / `bb.s5.prodSupport.desc`
- Include/exclude list items for each

### 4. Update `PriceSummary.tsx`
Add the new package IDs to the label mapping so prices display correctly in the sidebar.

### 5. Update `ReviewStep.tsx`
Ensure new package IDs render correct labels in the review summary.

## Files Changed
```
EDIT: src/components/booking/bookingConfig.ts   — add 4 remote packages + remoteOnly/studioOnly flags
EDIT: src/components/booking/ResultPackageStep.tsx — add remote packages + filter by workMode
EDIT: src/components/booking/PriceSummary.tsx     — handle new package labels
EDIT: src/components/booking/ReviewStep.tsx        — handle new package labels
EDIT: src/contexts/LanguageContext.tsx             — ~20 translation keys
```

## Technical Notes
- `calculateTotal` already works — it looks up package by ID from `RESULT_PACKAGES`
- No database changes needed — `result_package` is a free text field
- Radio Ready and EP Package remain available for both studio and remote users
- Session Only and Record Your Song are studio-only (hidden for remote)

