

# Fix Pricing Page 404 + Package Price Logic + Step 5 Clarity

## Problems

1. **`/pricing` shows 404** — the route is missing from `App.tsx` (line 52: `<Route path="*"` catches it)
2. **Price stacking bug** — selecting 8h session (8500) + Radio Ready (18000) = 26500. Radio Ready and other result packages should INCLUDE the session cost, not add on top. The package price IS the total for that deliverable.
3. **Step 5 still confusing** — needs clearer messaging that the package replaces/upgrades the session, not adds to it.

## Solution

### A. Add `/pricing` route to `App.tsx`
- Import `Pricing` page and add route before the catch-all `*` route

### B. Fix `calculateTotal` in `bookingConfig.ts`
- When a result package with price > 0 is selected, use the **higher** of session price or package price (not both)
- Logic: `total += Math.max(session.price, pkg.price)` instead of `total += session.price` then `total += pkg.price`
- "Session only" (price 0) keeps normal session price
- This means Radio Ready at 18000 already includes any session up to that value

### C. Update `PriceSummary.tsx`
- When package is selected and its price > session price, show the package as the main line item (not session + package separately)
- When package price is 0 (session only), show session price normally

### D. Update `ResultPackageStep.tsx` step 5 clarity
- Add clearer explanation: "Paketet inkluderar din studiotid" / "The package includes your studio time"
- Show that package price replaces (not adds to) session price

### E. Update `ReviewStep.tsx`
- Reflect the same pricing logic in the review summary

## Files Changed
```
EDIT: src/App.tsx                          — add /pricing route
EDIT: src/components/booking/bookingConfig.ts — fix calculateTotal logic
EDIT: src/components/booking/PriceSummary.tsx  — show correct line items
EDIT: src/components/booking/ResultPackageStep.tsx — clarify step 5
EDIT: src/components/booking/ReviewStep.tsx — reflect pricing in review
```

## Technical Detail
```typescript
// New calculateTotal logic:
const session = SESSIONS.find(s => s.id === state.session);
const pkg = RESULT_PACKAGES.find(p => p.id === state.resultPackage);

if (pkg && pkg.price > 0) {
  // Package includes session — use package price only
  total += pkg.price;
} else if (session) {
  // Session only or no package — use session price
  total += session.price;
}
// Add-ons still stack on top as before
```

