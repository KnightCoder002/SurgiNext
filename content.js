// DRAFT written by an AI assistant. NOT medical advice. A doctor must review and edit EVERY line before real patients see it.
// [Doctor: ...] marks a clinical decision. Bengali is a machine draft: needs a native speaker AND the doctor.
window.CONTENT = {
  doses: [
    { label: {en:"Morning",bn:"সকাল"},     note: {en:"[Doctor: drop name and time]",bn:"[ডাক্তার: ড্রপের নাম ও সময় লিখবেন]"} },
    { label: {en:"Afternoon",bn:"দুপুর"},  note: {en:"[Doctor: drop name and time]",bn:"[ডাক্তার: ড্রপের নাম ও সময় লিখবেন]"} },
    { label: {en:"Night",bn:"রাত"},        note: {en:"[Doctor: drop name and time]",bn:"[ডাক্তার: ড্রপের নাম ও সময় লিখবেন]"} }
  ],
  days: [ // shown on the matching recovery day; the last one repeats after day 7
    {en:"Rest today. Use your drops as told. Do not rub the eye. Some watering and a gritty feeling are common.",bn:"আজ বিশ্রাম নিন। নিয়ম মতো ড্রপ দিন। চোখ ঘষবেন না। সামান্য জল পড়া ও কিরকির করা স্বাভাবিক।"},
    {en:"Keep using your drops on time. Wear the shield or dark glasses as told. Stay away from dust and smoke.",bn:"সময় মতো ড্রপ দিন। ডাক্তারের কথামতো শিল্ড বা কালো চশমা পরুন। ধুলো ও ধোঁয়া থেকে দূরে থাকুন।"},
    {en:"Vision may still be blurry. This is common. Do not rub the eye. Keep soap and water out of it.",bn:"এখনও ঝাপসা দেখতে পারেন, এটা স্বাভাবিক। চোখ ঘষবেন না। চোখে সাবান ও জল ঢুকতে দেবেন না।"},
    {en:"Wash your hands before every drop. Do not do heavy lifting. [Doctor: confirm activity limits]",bn:"প্রতিবার ড্রপ দেওয়ার আগে হাত ধুয়ে নিন। ভারী জিনিস তুলবেন না। [ডাক্তার: কাজের নিয়ম নিশ্চিত করুন]"},
    {en:"Your eye may feel better. Keep using all your drops. Do not stop early unless the doctor says so.",bn:"চোখ ভালো লাগলেও সব ড্রপ চালিয়ে যান। ডাক্তার না বললে বন্ধ করবেন না।"},
    {en:"Stay away from dusty fields, smoke and swimming. [Doctor: confirm for how long]",bn:"ধুলোময় মাঠ, ধোঁয়া ও পুকুরে স্নান থেকে দূরে থাকুন। [ডাক্তার: কত দিন, নিশ্চিত করুন]"},
    {en:"Check your follow-up date above. Keep your drop schedule until the doctor changes it.",bn:"উপরে ফলো-আপের তারিখ দেখুন। ডাক্তার না বদলালে ড্রপের নিয়ম চালিয়ে যান।"}
  ],
  reminders: [
    {en:"Wash your hands with soap before using drops.",bn:"ড্রপ দেওয়ার আগে সাবান দিয়ে হাত ধুয়ে নিন।"},
    {en:"Do not rub or press your eye.",bn:"চোখ ঘষবেন না বা চাপ দেবেন না।"},
    {en:"Keep soap and dirty water out of your eye. [Doctor: confirm for how many days]",bn:"চোখে সাবান বা নোংরা জল ঢুকতে দেবেন না। [ডাক্তার: কত দিন, নিশ্চিত করুন]"},
    {en:"Wear the eye shield or dark glasses as told. [Doctor: confirm, including night use]",bn:"ডাক্তারের কথামতো চোখের শিল্ড বা কালো চশমা পরুন। [ডাক্তার: রাতে পরার নিয়ম নিশ্চিত করুন]"},
    {en:"No heavy lifting or hard work. [Doctor: confirm for how many days]",bn:"ভারী জিনিস তুলবেন না, কঠিন কাজ করবেন না। [ডাক্তার: কত দিন, নিশ্চিত করুন]"},
    {en:"Do not put kajal, oil or any home medicine in the eye.",bn:"চোখে কাজল, তেল বা ঘরোয়া কোনো ওষুধ দেবেন না।"},
    {en:"Come for your check-up on the date the doctor gave you.",bn:"ডাক্তারের দেওয়া তারিখে চেক-আপে আসুন।"}
  ],
  symptoms: [ // red:true goes straight to the urgent screen. Doctor must confirm this list.
    { icon:"💧", red:false, label:{en:"Eye watering or itching",bn:"চোখ দিয়ে জল পড়া বা চুলকানো"},
      answer:{en:"Some watering and mild itching are common in the first days after surgery. Do not rub the eye. Keep using your drops as the doctor told you.",bn:"অস্ত্রোপচারের পর প্রথম কয়েকদিন সামান্য জল পড়া ও চুলকানি স্বাভাবিক। চোখ ঘষবেন না। ডাক্তারের কথামতো ড্রপ দিতে থাকুন।"} },
    { icon:"🪨", red:false, label:{en:"Gritty feeling, like something in the eye",bn:"কিরকির করছে, চোখে কিছু আছে মনে হচ্ছে"},
      answer:{en:"A gritty feeling is common in the first few days. Do not rub or press the eye. [Doctor: add if artificial tears are allowed.]",bn:"প্রথম কয়েকদিন এমন লাগা স্বাভাবিক। চোখ ঘষবেন না বা চাপ দেবেন না। [ডাক্তার: কৃত্রিম অশ্রু চলবে কি না লিখবেন]"} },
    { icon:"🔴", red:false, label:{en:"A little redness",bn:"একটু লালচে ভাব"},
      answer:{en:"A little redness is common after surgery. Keep using your drops as told. If it is spreading, or you also have pain or less vision, tap the button below.",bn:"অস্ত্রোপচারের পর একটু লাল হওয়া স্বাভাবিক। নিয়ম মতো ড্রপ দিন। লালচে ভাব ছড়ালে, বা ব্যথা হলে বা দেখতে কম লাগলে নিচের বোতাম চাপুন।"} },
    { icon:"🌫️", red:false, label:{en:"Vision is blurry",bn:"ঝাপসা দেখছি"},
      answer:{en:"Vision can be blurry or hazy in the first days while the eye heals. If it suddenly becomes much worse, tap the button below.",bn:"চোখ সেরে ওঠার প্রথম কয়েকদিন ঝাপসা দেখা যেতে পারে। হঠাৎ অনেক খারাপ হলে নিচের বোতাম চাপুন।"} },
    { icon:"☀️", red:false, label:{en:"Light bothers my eye",bn:"আলোয় চোখে অস্বস্তি হচ্ছে"},
      answer:{en:"Bright light can bother you at first. Wear the dark glasses when you go outside. [Doctor: confirm.]",bn:"প্রথমদিকে উজ্জ্বল আলোয় অস্বস্তি হতে পারে। বাইরে গেলে কালো চশমা পরুন। [ডাক্তার: নিশ্চিত করুন]"} },
    { icon:"😣", red:true, label:{en:"Strong pain, or pain with vomiting",bn:"তীব্র ব্যথা, বা ব্যথার সঙ্গে বমি"} },
    { icon:"👁️", red:true, label:{en:"Vision suddenly worse, dark curtain, or flashes of light",bn:"হঠাৎ দেখা খারাপ, কালো পর্দা, বা আলোর ঝলক"} },
    { icon:"🟡", red:true, label:{en:"Pus or thick sticky discharge",bn:"পুঁজ বা ঘন চটচটে স্রাব"} },
    { icon:"💥", red:true, label:{en:"My eye was hit or hurt",bn:"চোখে আঘাত লেগেছে"} },
    { icon:"❓", red:true, label:{en:"Something else",bn:"অন্য কিছু"} }
  ]
};
