

# Fix: Admin Login Redirect + Email Message

## Problem
1. **Signup works but doesn't redirect** — Auto-confirm is enabled, so signup immediately returns a session with access_token. But the code shows "Kolla din e-post" message instead of redirecting to `/admin`.
2. **First login attempts failed** — The user hadn't signed up yet. The credentials `Totalsuccess2026` and `Totalsuccess2026$` both failed because no account existed. After signing up with `Totalsuccess2026$`, the account was created successfully.
3. **User is now locked out** — The signup success screen tells them to check email, but no verification email is needed (auto-confirm is on).

## Solution

### Fix `src/pages/admin/Login.tsx`
When signup returns a session (access_token present), redirect directly to `/admin` instead of showing the email verification message.

```typescript
// In handleSubmit, after signUp:
const { data, error } = await signUp(email, password);
if (error) {
  setError(error.message || 'Kunde inte skapa konto.');
} else if (data?.session) {
  // Auto-confirm is on — user already has a session
  navigate('/admin');
} else {
  // Email verification required
  setSignUpSuccess(true);
}
```

### Check `useAuth.tsx` signUp return type
Ensure the `signUp` function returns `{ data, error }` so we can check for `data.session`.

## Files Changed
```
EDIT: src/pages/admin/Login.tsx — redirect on auto-confirmed signup
EDIT: src/hooks/useAuth.tsx     — ensure signUp returns data (if needed)
```

## Immediate workaround
The user already has a valid session from signup. They should be able to navigate directly to `/admin` right now — the session is stored in localStorage. If the page was refreshed, they can log in with `lajomou@gmail.com` / `Totalsuccess2026$` (the password used during successful signup).

