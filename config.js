// Paste from Supabase > Project Settings > API (Project URL + anon/publishable key). The anon key is safe to expose; the database rules protect the data.
window.CONFIG = {
  SUPABASE_URL: "PASTE_PROJECT_URL",
  SUPABASE_ANON_KEY: "PASTE_ANON_KEY",
  USE_WHATSAPP_OTP: false,   // set true after the send-otp function and Meta setup work
  recoveryDays: 7
};
