# SurgiNext: Deploy Guide for Beginners

Goal: get the app running on a public web link you can open on your phone. Time: about 45 minutes. Cost: ₹0.
You do NOT need to install anything. You need a computer, a phone, and an email address.
Use **dummy data only**. Do not enter real patient information anywhere in this guide.

---

## Step 0: Unzip the files
1. Download `surginext.zip`, right-click > **Extract All** (Windows) or double-click (Mac).
2. You now have a folder `surginext` containing `index.html`, `admin.html`, `config.js`, `content.js` and a folder `supabase`.

## Step 1: Create the database (Supabase)
1. Go to **supabase.com** > **Start your project** > sign up.
2. **New project**. Name: `surginext`. Pick a strong database password and **save it somewhere**.
3. Region: **Mumbai (South Asia)** or the closest to India. Click **Create new project**. Wait about 2 minutes.

## Step 2: Create the tables
You will paste 3 files, one at a time, from the `supabase` folder.
1. In Supabase click **SQL Editor** (left) > **New query**.
2. Open `supabase/schema.sql` in Notepad. Press Ctrl+A, then Ctrl+C.
3. Paste into the Supabase box and click **Run**. You should see "Success. No rows returned".
4. Repeat in this order with a fresh query each time: `migration_2.sql`, then `migration_3.sql`.
Do not run `seed.sql` yet.

If you see a red error, stop, copy the error text and send it to me.

## Step 3: Create the hospital desk login
1. Left side: **Authentication** > **Users** > **Add user** > **Create new user**.
2. Enter an email and a password you will remember. Tick **Auto Confirm User**. Create.
3. Stop strangers signing up: **Authentication** > **Sign In / Providers**. Turn **OFF** "Allow new users to sign up". Save.

## Step 4: Add the demo hospital and patient
1. Open `supabase/seed.sql` in Notepad. Replace `YOUR_DESK_EMAIL` with the email from Step 3 (keep the quotes). Save.
2. Copy everything, paste into a new SQL query, **Run**. Now a demo hospital (code `DEMO`) and demo patient exist.

## Step 5: Connect the app to the database
1. In Supabase: **Project Settings** (gear icon) > **API Keys** (or **Data API**).
2. Copy the **Project URL** (like `https://abcdxyz.supabase.co`).
3. Copy the **anon** key (or **publishable** key).
4. Open `config.js` in Notepad. Replace `PASTE_PROJECT_URL` and `PASTE_ANON_KEY`. **Keep the quote marks.** Save.
5. **Never paste the `service_role` or "secret" key into these files.** Only anon/publishable.

## Step 6: Put it on the internet (Netlify)
1. Go to **app.netlify.com/drop**.
2. Drag the whole **`surginext` folder** (the one containing `index.html`) onto the page. Not the zip file.
3. After a few seconds you get a link like `https://random-name-123.netlify.app`.
4. **Sign up or log in to Netlify when asked and claim the site.** Otherwise it is deleted after about 1 hour.
5. Optional: **Site configuration** > **Change site name**.

## Step 7: Test it
1. Open `https://YOUR-SITE.netlify.app/admin.html`. Log in with the Step 3 email and password.
2. Enroll a test patient: made-up name, ID `TEST001`, phone `9000000001`, today's date, a follow-up date.
3. On your phone open `https://YOUR-SITE.netlify.app`. Log in with code `DEMO`, ID `TEST001`, phone `9000000001`.
4. Enter the demo code `123456`. Accept consent. You should see the home screen.
5. Tap a dose to mark it done. Close and reopen the app: it should stay done.
6. Phone browser menu > **Add to Home Screen**.

## If something goes wrong
| What you see | Likely fix |
|---|---|
| Blank page or nothing loads | `config.js` not saved correctly. Check quote marks, then drag the folder in again. |
| "We could not log you in" | ID or phone differs by even one character. Code must be `123456`. Hospital code must be `DEMO`. |
| Admin: wrong email or password | User not confirmed (Step 3) or mistyped. Reset it in Authentication > Users. |
| Admin list is empty after login | Step 4 skipped, or the email in seed.sql did not match. |
| Stops working after some days | Free Supabase pauses after 7 days of no use. Open the dashboard, click **Restore project**. |
| You edited a file, nothing changed | Netlify > your site > **Deploys** > drag the folder in again, then refresh. |

## Updating later
Change the files on your computer, then Netlify > your site > **Deploys** > drag the folder again.

## Before real patients (do not skip)
Turn off the demo code `123456`. Upgrade Supabase to Pro. Doctor approves `content.js`. Signed hospital agreement and lawyer-approved consent text. See `README.md`.
