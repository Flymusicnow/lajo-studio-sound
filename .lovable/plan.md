

# Lösning: Aktivera auto-confirm för admin-signup

## Problem
Användaren har skapat ett konto men verifieringsmejlet nådde rate limit vid upprepade försök. Kontot finns men är inte bekräftat.

## Lösning
Aktivera auto-confirm för e-post signup via `cloud--configure_auth`. Detta bekräftar alla nya konton automatiskt (inklusive det befintliga kontot vid nästa inloggningsförsök).

## Steg
1. Anropa `cloud--configure_auth` med `enable_signup: true, double_confirm_email: false` för att slå på auto-confirm
2. Användaren kan sedan logga in direkt på `/admin/login` med sin e-post och lösenord

## Alternativ
Om användaren hellre vill behålla e-postverifiering: vänta ~1 timme tills rate limit nollställs, sedan registrera sig igen eller be mig manuellt bekräfta kontot.

