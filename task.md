# Task: Fix Cookie Consent Integration

## Current State
- Files corrupted by bad sed script adding `<CookieConsent />` multiple times
- cookie-consent.tsx component exists and is good
- catalog.tsx and index.tsx are OK (need verification)
- project.tsx, turnkey.tsx, invest.tsx, mortgage.tsx are corrupted

## Plan
1. Check if we can restore from initial setup backups
2. If not, manually reconstruct each file by removing all duplicate CookieConsent lines
3. Add it once at the right place (after first Fragment opens in return statement)
4. Verify all imports are correct
5. Run build test

## Files to Fix
- [ ] project.tsx (666 lines, corrupted)
- [ ] turnkey.tsx (662 lines, corrupted)
- [ ] invest.tsx (719 lines, corrupted)
- [ ] mortgage.tsx (615 lines, corrupted)
- [ ] catalog.tsx (verify OK)
- [ ] index.tsx (verify OK)
