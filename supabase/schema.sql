-- SurgiNext schema. Run once in Supabase > SQL Editor.
-- Safety model: the public (anon) key can NOT read any table. Patients only use the functions below.
-- Hospital staff use Supabase Auth and can only see their own hospital's patients (RLS).
create table hospitals(id uuid primary key default gen_random_uuid(), code text unique not null, name text not null, escalation_number text not null);
create table staff(user_id uuid primary key references auth.users on delete cascade, hospital_id uuid not null references hospitals);
create function my_hospital() returns uuid language sql stable security definer set search_path=public as $$ select hospital_id from staff where user_id=auth.uid() $$;
create table patients(
  id uuid primary key default gen_random_uuid(),
  hospital_id uuid not null default my_hospital() references hospitals,
  patient_code text not null, phone text not null, name text not null,
  procedure text not null default 'cataract', surgery_date date not null,
  reset_code text, consent_at timestamptz,
  unique(hospital_id, patient_code));
create table sessions(token text primary key, patient_id uuid not null references patients on delete cascade, expires_at timestamptz not null);
create table dose_logs(patient_id uuid references patients on delete cascade, day date, idx int, primary key(patient_id, day, idx));
alter table hospitals enable row level security; alter table staff enable row level security; alter table patients enable row level security;
alter table sessions enable row level security; alter table dose_logs enable row level security;
create policy staff_hospital on hospitals for select to authenticated using (id = my_hospital());
create policy staff_patients on patients for all to authenticated using (hospital_id = my_hospital()) with check (hospital_id = my_hospital());

create function pid(t text) returns uuid language sql stable security definer set search_path=public as $$ select patient_id from sessions where token=t and expires_at>now() $$;
revoke execute on function pid(text) from public, anon, authenticated;

create function patient_login(p_hospital text, p_patient text, p_phone text, p_otp text) returns json language plpgsql security definer set search_path=public,extensions as $$
declare h hospitals; p patients; tok text;
begin
  select * into h from hospitals where upper(code)=upper(trim(p_hospital));
  select * into p from patients where hospital_id=h.id and lower(patient_code)=lower(trim(p_patient)) and phone=trim(p_phone);
  -- DEMO OTP '123456'. REMOVE this before real patients; replace with a real OTP check.
  if p.id is null or not (p_otp='123456' or (p.reset_code is not null and p_otp=p.reset_code)) then
    return json_build_object('error','invalid');
  end if;
  if p.reset_code is not null and p_otp=p.reset_code then update patients set reset_code=null where id=p.id; end if;
  tok := encode(gen_random_bytes(24),'hex');
  insert into sessions values(tok, p.id, now()+interval '30 days');
  return json_build_object('token', tok);
end $$;

create function patient_me(p_token text, p_day date) returns json language sql stable security definer set search_path=public as $$
  select json_build_object('name',p.name,'surgery_date',p.surgery_date,'hospital',h.name,'escalation',h.escalation_number,'consent',p.consent_at is not null,
    'done',coalesce((select json_agg(d.idx) from dose_logs d where d.patient_id=p.id and d.day=p_day),'[]'::json))
  from patients p join hospitals h on h.id=p.hospital_id where p.id=pid(p_token) $$;

create function patient_consent(p_token text) returns void language sql security definer set search_path=public as $$
  update patients set consent_at=now() where id=pid(p_token) $$;

create function patient_dose(p_token text, p_day date, p_idx int, p_done boolean) returns void language plpgsql security definer set search_path=public as $$
declare v uuid := pid(p_token);
begin
  if v is null then return; end if;
  if p_done then insert into dose_logs values(v,p_day,p_idx) on conflict do nothing;
  else delete from dose_logs where patient_id=v and day=p_day and idx=p_idx; end if;
end $$;
