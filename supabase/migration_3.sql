-- Run after migration_2.sql. Adds: urgent-tap log for the desk, and lets desk staff see dose check-offs (own hospital only).
create table alerts(id bigint generated always as identity primary key, patient_id uuid not null references patients on delete cascade, symptom text not null, created_at timestamptz not null default now());
alter table alerts enable row level security;
create policy staff_alerts on alerts for select to authenticated using (exists (select 1 from patients p where p.id=alerts.patient_id and p.hospital_id=my_hospital()));
create policy staff_doses on dose_logs for select to authenticated using (exists (select 1 from patients p where p.id=dose_logs.patient_id and p.hospital_id=my_hospital()));
create function patient_alert(p_token text, p_symptom text) returns void language plpgsql security definer set search_path=public as $$
declare v uuid := pid(p_token);
begin
  if v is null then return; end if;
  if exists (select 1 from alerts where patient_id=v and created_at > now()-interval '1 minute') then return; end if;
  insert into alerts(patient_id,symptom) values(v, left(p_symptom,100));
end $$;
