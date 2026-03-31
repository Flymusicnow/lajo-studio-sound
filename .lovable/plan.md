

# Lägg till signup på admin login-sidan

## Vad som byggs

Utöka `/admin/login` med en toggle mellan "Logga in" och "Skapa konto". Signup-formuläret använder `supabase.auth.signUp()` med e-post och lösenord. Eftersom `handle_new_user`-triggern redan skapar en profil med `role = 'admin'` behövs inga databasändringar.

## Ändringar

### `src/pages/admin/Login.tsx`
- Lägg till state `isSignUp` som togglar mellan login och signup
- Vid signup: anropa `supabase.auth.signUp({ email, password })`
- Visa bekräftelsemeddelande efter signup ("Kolla din e-post för att verifiera kontot")
- Lägg till lösenordsbekräftelse-fält vid signup
- Toggle-länk: "Har du inget konto? Skapa ett" / "Har du redan ett konto? Logga in"

### `src/hooks/useAuth.tsx`
- Lägg till `signUp`-funktion i AuthContext som wrapper kring `supabase.auth.signUp()`

## Säkerhet
- Befintlig `handle_new_user`-trigger skapar automatiskt en profil med `role = 'admin'` — detta fungerar för en studio med en ägare
- Inga nya tabeller eller RLS-ändringar behövs

