# SurgiNext Pilot Build

Start with **DEPLOY_GUIDE.md** (step by step, for beginners). Run the SQL files in this order: `schema.sql`, `migration_2.sql`, `migration_3.sql`, then `seed.sql`.

## What it does
- Patient app: login, consent, recovery-day strip, follow-up countdown, daily care tip, tap-to-check eye drops, reminders, symptom picker with doctor-approved answers, red urgent screen with a call button. English and Bengali.
- Hospital desk (`admin.html`): enroll patients, set follow-up dates, issue reset codes, see doses logged today, and a log of recent urgent taps.

## Edit content
`content.js` has every drop, tip, reminder and symptom answer in English and Bengali. It is an AI-written DRAFT: a doctor must approve every line, and a native Bengali speaker must check the Bengali. `red: true` symptoms go straight to the urgent screen. Hospital name and escalation number: Supabase Table Editor > `hospitals`.

## Hand to Antigravity
Convert `style.css` to Tailwind and add minimal motion. Keep large text, 56px tap targets, the sticky Call bar, and do not change `supabase/` or how `app.js` calls database functions.

## Important limits
- The demo code `123456` is the only second factor right now. Anyone who knows a patient's ID and phone can log in. **Use dummy data only** until a real OTP exists.
- Urgent taps are logged but nobody is alerted. It is not a monitored emergency system.
- Free Supabase pauses after 7 days of inactivity. Upgrade to Pro before real data.

## Optional, later: WhatsApp (needs a Meta account)
`supabase/functions/` has `send-otp` and `send-reminders`, plus lockout and OTP logic already in `migration_2.sql`. Not needed for the demo. To use them: set up Meta WhatsApp Cloud API with templates `surginext_otp` (Authentication) and `surginext_followup` (Utility), deploy the functions with the Supabase CLI (`--no-verify-jwt`), set secrets `WA_TOKEN`, `WA_PHONE_ID`, `CRON_SECRET`, set `USE_WHATSAPP_OTP: true`, then `update settings set v='off' where k='demo_otp';`.

## Not built yet
Doctor digest, a real OTP, other procedures, Santali, EasyCare integration.
