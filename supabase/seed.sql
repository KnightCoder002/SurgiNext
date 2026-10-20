-- Run AFTER creating the hospital-desk user in Authentication > Users. Replace the email below.
insert into hospitals(code,name,escalation_number) values ('DEMO','Demo Hospital (dummy)','+910000000000');
insert into staff(user_id,hospital_id) select id,(select id from hospitals where code='DEMO') from auth.users where email='YOUR_DESK_EMAIL';
insert into patients(hospital_id,patient_code,phone,name,surgery_date) select id,'DEMO001','9999999999','Demo Patient',current_date-2 from hospitals where code='DEMO';
