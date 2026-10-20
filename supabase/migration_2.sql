-- Run AFTER schema.sql (and before seed.sql if you haven't seeded yet). Adds: follow-up dates, real OTP, lockout.
alter table patients add column followup_date date, add column reminder_sent_at timestamptz,
  add column fails int not null default 0, add column locked_until timestamptz;
create function reset_reminder() returns trigger language plpgsql as $$
begin if new.followup_date is distinct from old.followup_date then new.reminder_sent_at := null; end if; return new; end $$;
create trigger trg_reset_reminder before update of followup_date on patients for each row execute function reset_reminder();

create table settings(k text primary key, v text not null);
insert into settings values('demo_otp','on');   -- turn OFF once WhatsApp OTP works: update settings set v='off' where k='demo_otp';
create table otp_codes(patient_id uuid primary key references patients on delete cascade, code_hash text not null,
  expires_at timestamptz not null, sends int not null default 1, window_start timestamptz not null default now());
alter table settings enable row level security; alter table otp_codes enable row level security;

-- Called ONLY by the send-otp edge function (service role). Max 3 codes per hour per patient.
create function request_otp(p_hospital text, p_patient text, p_phone text) returns json language plpgsql security definer set search_path=public,extensions as $$
declare h hospitals; p patients; o otp_codes; b bytea; c text; fresh boolean;
begin
  select * into h from hospitals where upper(code)=upper(trim(p_hospital));
  select * into p from patients where hospital_id=h.id and lower(patient_code)=lower(trim(p_patient)) and phone=trim(p_phone);
  if p.id is null then return null; end if;
  select * into o from otp_codes where patient_id=p.id;
  fresh := o.patient_id is null or o.window_start <= now()-interval '1 hour';
  if not fresh and o.sends >= 3 then return null; end if;
  b := gen_random_bytes(4);
  c := (100000 + (get_byte(b,0)::bigint*16777216 + get_byte(b,1)*65536 + get_byte(b,2)*256 + get_byte(b,3)) % 900000)::text;
  insert into otp_codes(patient_id,code_hash,expires_at,sends,window_start)
    values(p.id, encode(digest(c||p.id::text,'sha256'),'hex'), now()+interval '10 minutes', case when fresh then 1 else o.sends+1 end, case when fresh then now() else o.window_start end)
  on conflict(patient_id) do update set code_hash=excluded.code_hash, expires_at=excluded.expires_at, sends=excluded.sends, window_start=excluded.window_start;
  return json_build_object('code',c,'phone',p.phone);
end $$;
revoke execute on function request_otp(text,text,text) from public, anon, authenticated;
grant execute on function request_otp(text,text,text) to service_role;

create or replace function patient_login(p_hospital text, p_patient text, p_phone text, p_otp text) returns json language plpgsql security definer set search_path=public,extensions as $$
declare h hospitals; p patients; o otp_codes; tok text; ok boolean := false; demo boolean; code text := trim(p_otp);
begin
  select * into h from hospitals where upper(code)=upper(trim(p_hospital));
  select * into p from patients where hospital_id=h.id and lower(patient_code)=lower(trim(p_patient)) and phone=trim(p_phone);
  if p.id is null or (p.locked_until is not null and p.locked_until > now()) then return json_build_object('error','invalid'); end if;
  select v='on' into demo from settings where k='demo_otp';
  if coalesce(demo,false) and code='123456' then ok := true;
  elsif p.reset_code is not null and code=p.reset_code then ok := true; update patients set reset_code=null where id=p.id;
  else
    select * into o from otp_codes where patient_id=p.id;
    if o.patient_id is not null and o.expires_at > now() and o.code_hash = encode(digest(code||p.id::text,'sha256'),'hex') then
      ok := true; delete from otp_codes where patient_id=p.id;
    end if;
  end if;
  if not ok then  -- 5 wrong tries locks this patient for 15 minutes
    update patients set locked_until=case when fails+1>=5 then now()+interval '15 minutes' end, fails=case when fails+1>=5 then 0 else fails+1 end where id=p.id;
    return json_build_object('error','invalid');
  end if;
  update patients set fails=0, locked_until=null where id=p.id;
  tok := encode(gen_random_bytes(24),'hex');
  insert into sessions values(tok, p.id, now()+interval '30 days');
  return json_build_object('token', tok);
end $$;

create or replace function patient_me(p_token text, p_day date) returns json language sql stable security definer set search_path=public as $$
  select json_build_object('name',p.name,'surgery_date',p.surgery_date,'followup',p.followup_date,'hospital',h.name,'escalation',h.escalation_number,'consent',p.consent_at is not null,
    'done',coalesce((select json_agg(d.idx) from dose_logs d where d.patient_id=p.id and d.day=p_day),'[]'::json))
  from patients p join hospitals h on h.id=p.hospital_id where p.id=pid(p_token) $$;
