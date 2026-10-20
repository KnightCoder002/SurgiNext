const C=CONFIG,K=CONTENT,$=s=>document.querySelector(s);
const LS={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}},del(k){try{localStorage.removeItem(k)}catch{}}};
const today=()=>new Date().toLocaleDateString('sv'); // local date YYYY-MM-DD
const R=(fn,args)=>fetch(C.SUPABASE_URL+'/rest/v1/rpc/'+fn,{method:'POST',headers:{apikey:C.SUPABASE_ANON_KEY,'Content-Type':'application/json'},body:JSON.stringify(args)})
 .then(r=>r.ok?r.text():Promise.reject(r)).then(t=>t?JSON.parse(t):null);
const I={en:{
 login:'Log in',code:'Hospital code',pid:'Patient ID',phone:'Phone number',next:'Continue',otp:'Enter the code sent to you',verify:'Verify',
 consentT:'Before you start',consent:'[Placeholder: explain what data is shared, with whom, that we will send you WhatsApp messages about your care and follow-up, and that you can opt out. Lawyer must approve this text.]',agree:'I agree',
 hi:'Hello',tip:"Today's care",fu:'Follow-up visit',today:'Today',tomorrow:'Tomorrow',inN:'In {n} days',fuPast:'The date has passed. Please call the hospital.',fuNone:'Ask the hospital desk for your date.',day:'Day after surgery',drops:"Today's eye drops",rem:'Remember',help:'Need help?',ask:'Ask a question',call:'Call hospital',feel:'What are you feeling?',tap:'Tap the one that fits best.',
 worse:'Is it getting worse?',yes:'Yes, it is getting worse',no:'No, I understand',urgT:'Call the hospital now',urgB:'Do not wait for this to pass. Do not rub or press your eye.',back:'← Back',out:'Log out',
 bad:'We could not log you in. Check your details, or ask the hospital desk for a reset code.',net:'No connection. Please try again.'},
bn:{login:'লগ ইন',code:'হাসপাতাল কোড',pid:'রোগীর আইডি',phone:'ফোন নম্বর',next:'এগিয়ে যান',otp:'আপনাকে পাঠানো কোডটি লিখুন',verify:'যাচাই করুন',
 consentT:'শুরু করার আগে',consent:'[নমুনা লেখা: কোন তথ্য কার সঙ্গে ভাগ হবে, এবং আপনি বেরিয়ে আসতে পারেন।]',agree:'আমি রাজি',
 hi:'নমস্কার',tip:'আজকের যত্ন',fu:'ফলো-আপ ভিজিট',today:'আজ',tomorrow:'আগামীকাল',inN:'আর {n} দিন',fuPast:'তারিখ পেরিয়ে গেছে। হাসপাতালে ফোন করুন।',fuNone:'তারিখের জন্য হাসপাতালের ডেস্কে জিজ্ঞাসা করুন।',day:'অস্ত্রোপচারের পর দিন',drops:'আজকের চোখের ড্রপ',rem:'মনে রাখুন',help:'সাহায্য লাগবে?',ask:'প্রশ্ন করুন',call:'হাসপাতালে ফোন করুন',feel:'আপনি কী অনুভব করছেন?',tap:'সবচেয়ে মানানসইটি চাপুন।',
 worse:'কি আরও খারাপ হচ্ছে?',yes:'হ্যাঁ, খারাপ হচ্ছে',no:'না, বুঝেছি',urgT:'এখনই হাসপাতালে ফোন করুন',urgB:'অপেক্ষা করবেন না। চোখ ঘষবেন না।',back:'← পিছনে',out:'লগ আউট',
 bad:'লগ ইন করা যায়নি। তথ্য দেখুন, বা হাসপাতালের ডেস্ক থেকে রিসেট কোড নিন।',net:'সংযোগ নেই। আবার চেষ্টা করুন।'}}; // Bengali = machine draft, needs native-speaker review
const L=x=>typeof x=='string'?x:(x[lang]||x.en);
let lang=LS.get('sn_lang','en'),who=null;
const t=k=>I[lang][k]||k;
function paint(){document.documentElement.lang=lang;$('#lang').textContent=lang=='en'?'বাংলা':'English';
 document.querySelectorAll('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));
 if(who&&$('#home').classList.contains('on'))home();
 if($('#ask').classList.contains('on'))ask();}
function go(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id==id));$('main').scrollTop=0;$('.callbar').hidden=['login','otp','consent'].includes(id);}
async function sendOtp(){$('#e1').textContent='';
 if(C.USE_WHATSAPP_OTP){try{await fetch(C.SUPABASE_URL+'/functions/v1/send-otp',{method:'POST',headers:{apikey:C.SUPABASE_ANON_KEY,'Content-Type':'application/json'},body:JSON.stringify({hospital:$('#hc').value,patient:$('#pid').value,phone:$('#ph').value})})}catch{$('#e1').textContent=t('net');return}}
 go('otp');}
async function verify(){$('#e2').textContent='';
 try{const r=await R('patient_login',{p_hospital:$('#hc').value,p_patient:$('#pid').value,p_phone:$('#ph').value,p_otp:$('#code').value.trim()});
  if(!r||r.error){$('#e2').textContent=t('bad');return}
  LS.set('sn_token',r.token);await load();}catch{$('#e2').textContent=t('net')}}
async function load(){const tok=LS.get('sn_token');if(!tok){go('login');return}
 try{who=await R('patient_me',{p_token:tok,p_day:today()});}catch{who=null}
 if(!who){LS.del('sn_token');go('login');return}
 document.querySelectorAll('.tel').forEach(a=>a.href='tel:'+who.escalation);
 who.consent?home():go('consent');}
function home(){const s=new Date(who.surgery_date+'T00:00:00'),n=new Date(today()+'T00:00:00'),d=Math.max(1,Math.round((n-s)/864e5)+1);
 $('#nm').textContent=t('hi')+', '+who.name;$('#dn').textContent=t('day')+': '+d;
 $('#path').innerHTML='';for(let i=1;i<=C.recoveryDays;i++){const e=document.createElement('div');e.className='day'+(i<d?' past':i==d?' now':'');e.textContent=i;$('#path').append(e)}
 let f=t('fuNone');if(who.followup){const fd=new Date(who.followup+'T00:00:00'),k=Math.round((fd-n)/864e5),ds=fd.toLocaleDateString(lang=='bn'?'bn-IN':'en-IN',{day:'numeric',month:'short',year:'numeric'});
  f=ds+(k<0?'. '+t('fuPast'):k==0?' ('+t('today')+')':k==1?' ('+t('tomorrow')+')':' ('+t('inN').replace('{n}',k)+')')}
 $('#fuT').textContent=f;
 $('#tip').textContent=L(K.days[Math.min(d,K.days.length)-1]);
 $('#rem').innerHTML='';K.reminders.forEach(x=>{const li=document.createElement('li');li.textContent=L(x);$('#rem').append(li)});
 $('#doses').innerHTML='';
 K.doses.forEach((x,i)=>{const b=document.createElement('button');b.className='dose'+(who.done.includes(i)?' done':'');
  b.innerHTML='<span class="box"><svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6"/></svg></span><span class="t"><b></b><span class="sub"></span></span>';
  b.querySelector('b').textContent=L(x.label);b.querySelector('.sub').textContent=L(x.note);
  b.onclick=()=>{const on=!b.classList.contains('done');b.classList.toggle('done',on);
   who.done=on?[...who.done,i]:who.done.filter(j=>j!=i);
   R('patient_dose',{p_token:LS.get('sn_token'),p_day:today(),p_idx:i,p_done:on}).catch(()=>{b.classList.toggle('done',!on);who.done=on?who.done.filter(j=>j!=i):[...who.done,i]})};
  $('#doses').append(b)});
 go('home');}
let last='';
function urgent(sym){R('patient_alert',{p_token:LS.get('sn_token'),p_symptom:sym}).catch(()=>{});go('urgent')}
function ask(){$('#syms').innerHTML='';K.symptoms.forEach(s=>{const b=document.createElement('button');b.className='btn';b.innerHTML='<span class="i"></span><span></span>';
 b.children[0].textContent=s.icon;b.children[1].textContent=L(s.label);b.onclick=()=>{if(s.red)urgent(s.label.en);else{last=s.label.en;$('#ans').textContent=L(s.answer);go('answer')}};$('#syms').append(b)});go('ask');}
async function consent(){try{await R('patient_consent',{p_token:LS.get('sn_token')});who.consent=true;home()}catch{}}
function logout(){LS.del('sn_token');who=null;go('login')}
$('#lang').onclick=()=>{lang=lang=='en'?'bn':'en';LS.set('sn_lang',lang);paint()};
paint();load();
