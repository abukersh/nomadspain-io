
/* NOMADSPAIN.IO - COMPLETE JAVASCRIPT */

/* PAGE ROUTING */
function showPage(name) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById(name + '-page').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });
  var navKb = document.getElementById('nav-kb');
  if (navKb) navKb.classList.toggle('active', name === 'knowledge');
  closeMenu();
  if (name === 'home') setTimeout(initFadeUps, 60);
  if (name === 'knowledge') { clearSearch(); resetFilter(); renderKbGrid(); renderFaqGrid(); phConsulateActive=null; renderConsulateGuides('kb-consulate-grid','kb-consulate-detail'); }
  if (name === 'portal') { renderPortalBg(); }
}
function goTo(id) {
  setTimeout(function() { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 80);
}
function goHome(id) {
  if (document.getElementById('home-page').classList.contains('active')) { goTo(id); }
  else { showPage('home'); setTimeout(function() { goTo(id); }, 140); }
}
function toggleMenu() { document.getElementById('mobileMenu').classList.toggle('open'); }
function closeMenu() { document.getElementById('mobileMenu').classList.remove('open'); }

/* FADE UPS */
function initFadeUps() {
  var els = document.querySelectorAll('#home-page .fade-up');
  if (!els.length) return;
  // If IntersectionObserver not available, just show everything
  if (!window.IntersectionObserver) {
    els.forEach(function(el) { el.classList.add('visible'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
  els.forEach(function(el) {
    el.classList.remove('visible');
    // If already in viewport on load, make visible immediately
    var rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible');
    } else {
      obs.observe(el);
    }
  });
}
/* initFadeUps called in DOMContentLoaded */

/* CAROUSEL */
/* Derive flag emoji from ISO-3166-1 alpha-2 code using Regional Indicator symbols.
   U+1F1E6 = Regional Indicator A (decimal 127462). No surrogate-pair escapes needed. */
function countryFlag(cc) {
  var base = 127397; /* 127462 - 65 */
  return String.fromCodePoint(base + cc.charCodeAt(0), base + cc.charCodeAt(1));
}
var MENA_COUNTRIES = [
  ['SA','Saudi Arabia'],['AE','UAE'],['KW','Kuwait'],['QA','Qatar'],
  ['BH','Bahrain'],['OM','Oman'],['EG','Egypt'],['MA','Morocco'],
  ['TN','Tunisia'],['DZ','Algeria'],['LY','Libya'],['JO','Jordan'],
  ['LB','Lebanon'],['PS','Palestine'],['SD','Sudan'],['YE','Yemen'],
  ['SY','Syria'],['IQ','Iraq']
];
var REST_COUNTRIES = [
  ['US','United States'],['GB','United Kingdom'],['CA','Canada'],['AU','Australia'],
  ['BR','Brazil'],['MX','Mexico'],['IN','India'],['PK','Pakistan'],
  ['NG','Nigeria'],['ZA','South Africa'],['KE','Kenya'],['JP','Japan'],
  ['KR','South Korea'],['CN','China'],['TR','Turkey'],['PH','Philippines'],
  ['ID','Indonesia'],['MY','Malaysia'],['VN','Vietnam'],['TH','Thailand'],
  ['AR','Argentina'],['CO','Colombia'],['CL','Chile'],['PE','Peru'],
  ['RU','Russia'],['UA','Ukraine'],['GE','Georgia'],['SG','Singapore'],
  ['NZ','New Zealand'],['PT','Portugal'],['DE','Germany'],['FR','France'],
  ['IT','Italy'],['NL','Netherlands'],['SE','Sweden'],['NO','Norway'],
  ['CH','Switzerland'],['PL','Poland'],['CZ','Czech Republic'],['HU','Hungary']
];
function shuffleArr(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
function initCarousel() {
  var track = document.getElementById('carouselTrack');
  if (!track) return;
  var ordered = MENA_COUNTRIES.concat(shuffleArr(REST_COUNTRIES));
  var doubled = ordered.concat(ordered); /* seamless loop */
  track.innerHTML = doubled.map(function(c) {
    return '<div class="logo-pill">' + countryFlag(c[0]) + '&nbsp;' + c[1] + '</div>';
  }).join('');
}

/* TESTIMONIALS SLIDER */
var testiPos = 0;
function initTesti() {
  var cards = document.querySelectorAll('.testi-track .t-card');
  var total = cards.length;
  var perView = window.innerWidth < 768 ? 1 : 3;
  var pages = Math.ceil(total / perView);
  var dotsCont = document.getElementById('testiDots');
  if (!dotsCont) return;
  dotsCont.innerHTML = '';
  for (var i = 0; i < pages; i++) {
    (function(idx){
      var d = document.createElement('div');
      d.className = 'testi-dot' + (idx === 0 ? ' active' : '');
      d.onclick = function() { testiGoTo(idx); };
      dotsCont.appendChild(d);
    })(i);
  }
  setTestitPos(0);
  setInterval(function() { testiMove(1); }, 5500);
}
function setTestitPos(idx) {
  var cards = document.querySelectorAll('.testi-track .t-card');
  var total = cards.length;
  var perView = window.innerWidth < 768 ? 1 : 3;
  var pages = Math.ceil(total / perView);
  testiPos = ((idx % pages) + pages) % pages;
  var track = document.getElementById('testiTrack');
  if (track && track.parentElement) {
    var w = track.parentElement.offsetWidth;
    var cardW = (w - (perView-1)*20) / perView;
    track.style.transform = 'translateX(-' + (testiPos * perView * (cardW + 20)) + 'px)';
  }
  document.querySelectorAll('.testi-dot').forEach(function(d,i){ d.classList.toggle('active', i===testiPos); });
}
function testiMove(dir) { setTestitPos(testiPos + dir); }
function testiGoTo(idx) { setTestitPos(idx); }

/* DEPENDENTS PRICING */
var depCount = 1;
function changeDep(delta) {
  depCount = Math.max(0, depCount + delta);
  var total = 2500 + depCount * 500;
  document.getElementById('depVal').textContent = depCount;
  document.getElementById('familyPrice').textContent = '\u20AC' + total.toLocaleString();
  if (depCount === 0) {
    document.getElementById('familyPriceSub').textContent = ' base';
    document.getElementById('depNote').textContent = 'No dependents \u2014 base price \u20AC2,500';
  } else {
    document.getElementById('familyPriceSub').textContent = ' total';
    document.getElementById('depNote').textContent =
      '\u20AC2,500 base + ' + depCount + ' \xd7 \u20AC500 = \u20AC' + total.toLocaleString();
  }
  /* keep portal package selector in sync */
  var selPkg = document.getElementById('selPkg');
  var payTotal = document.getElementById('payTotal');
  if (selPkg && selPkg.textContent.indexOf('Family') !== -1) {
    selPkg.textContent = 'Family \u2014 \u20AC' + total.toLocaleString();
    if (payTotal) payTotal.textContent = '\u20AC' + total.toLocaleString();
  }
}

/* ELIGIBILITY CHECKER */
var _checkerResult = 'unknown';
function checkEligibility() {
  var nat = document.getElementById('nationality').value;
  var inc = document.getElementById('income').value;
  var work = document.getElementById('work').value;
  var crim = document.getElementById('criminal').value;
  var famEl = document.getElementById('familyMembers');
  var famCount = famEl ? parseInt(famEl.value) || 0 : 0;
  var emailG = document.getElementById('emailCollectGroup');
  var box = document.getElementById('resultBox');
  var title = document.getElementById('resultTitle');
  var text = document.getElementById('resultText');
  var discount = document.getElementById('discountBox');
  var capture = document.getElementById('checkerEmailCapture');
  var label = document.getElementById('checkerEmailLabel');
  var emailInput = document.getElementById('checkerEmailInput');
  if (!nat || !inc || !work || !crim) { showToast('Please answer all questions'); return; }
  box.style.display = 'block';
  discount.style.display = 'none';
  capture.style.display = 'none';
  if(emailG) emailG.style.display = 'none';
  box.className = 'result-box';
  if(emailInput) emailInput.value = '';
  document.getElementById('checkerEmailBtn').textContent = 'Get my code \u2192';
  document.getElementById('checkerEmailBtn').disabled = false;
  var isEuEea = nat === 'eu_eea';
  var hasCriminal = crim === 'yes';
  var workForSpanish = work === 'spanish_employer';

  /* SMI-based income threshold calculation */
  var requiredIncome = calcIncomeThreshold(famCount);
  var incomeLow = inc === 'below2000' || (inc === '2000_2849' && requiredIncome > 2849);

  /* Show income breakdown */
  var incomeBreakdown = '\u20AC' + requiredIncome.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}) + '/month required';
  if(famCount > 0) {
    incomeBreakdown += ' (SMI 200% = \u20AC' + SMI_200.toFixed(2);
    incomeBreakdown += ' + 1st dep \u20AC' + SMI_75.toFixed(2);
    if(famCount > 1) incomeBreakdown += ' + ' + (famCount-1) + ' dep(s) \u00D7 \u20AC' + SMI_25.toFixed(2);
    incomeBreakdown += ')';
  }

  if (isEuEea) {
    box.classList.add('ineligible');
    title.textContent = '\u274C Not Eligible \u2014 EU/EEA Nationals';
    text.textContent = 'The Spain Digital Nomad Visa is only available to non-EU/EEA nationals. As an EU/EEA citizen you do not require a visa to live and work in Spain \u2014 you can register directly as an EU resident.';
    label.textContent = 'Leave your email and we\u2019ll send you a free EU residency registration guide.';
    _checkerResult = 'eu_eea';
    capture.style.display = 'block'; return;
  }
  if (hasCriminal) {
    box.classList.add('assist');
    title.textContent = '\u26A0\uFE0F Criminal Record \u2014 We Can Still Help';
    text.textContent = 'A criminal record creates challenges but is not automatically disqualifying. Our team specialises in securing the right documents and evidence to support your case.';
    label.textContent = 'Leave your email and we\u2019ll reach out with a personalised plan.';
    _checkerResult = 'criminal';
    capture.style.display = 'block'; return;
  }
  if (incomeLow) {
    box.classList.add('ineligible');
    title.textContent = '\u274C Currently Below Income Threshold';
    text.textContent = 'The Spanish Digital Nomad Visa requires ' + incomeBreakdown + '. Your current income is below this threshold. However, we can help you plan for eligibility.';
    label.textContent = 'Leave your email and we\u2019ll send you a free income growth roadmap.';
    _checkerResult = 'low_income';
    capture.style.display = 'block'; return;
  }
  if (workForSpanish) {
    box.classList.add('ineligible');
    title.textContent = '\u26A0\uFE0F Spanish Employer \u2014 Different Visa Required';
    text.textContent = 'The Digital Nomad Visa requires income from non-Spanish companies. If working for a Spanish employer you need a standard work permit. We can guide you through the correct process.';
    label.textContent = 'Enter your email and we\u2019ll send you the correct permit options for your situation.';
    _checkerResult = 'spanish_employer';
    capture.style.display = 'block'; return;
  }
  box.classList.add('eligible');
  title.textContent = '\u2705 You Qualify for the Spain Digital Nomad Visa!';
  text.textContent = 'Based on your answers, you meet the key requirements. ' + incomeBreakdown + '. Enter your email below to claim your exclusive 5% discount on the Full Visa package.';
  label.textContent = '\uD83C\uDF89 Enter your email to unlock your exclusive discount code:';
  _checkerResult = 'eligible';
  capture.style.display = 'block';
  fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({nationality:nat,income:inc,work_type:work,criminal:crim,family_members:famCount,required_income:requiredIncome,result:'eligible',email:null})}).catch(function(){});
}
function claimCheckerDiscount() {
  var emailInput = document.getElementById('checkerEmailInput');
  var btn = document.getElementById('checkerEmailBtn');
  var email = (emailInput ? emailInput.value : '').trim();
  if (!email || !email.includes('@')) { showToast('Please enter a valid email address.'); return; }
  btn.disabled = true; btn.textContent = 'Saving\u2026';
  /* grab checker form values for richer lead data */
  var nat  = (document.getElementById('nationality')||{}).value || '';
  var inc  = (document.getElementById('income')||{}).value || '';
  var work = (document.getElementById('work')||{}).value || '';
  var crim = (document.getElementById('criminal')||{}).value || '';
  var famEl = document.getElementById('familyMembers');
  var famCount = famEl ? parseInt(famEl.value) || 0 : 0;
  var requiredIncome = calcIncomeThreshold(famCount);
  var resultLabels = {
    eligible: '\u2705 Eligible',
    eu_eea: '\u274C EU/EEA \u2014 Not eligible',
    criminal: '\u26A0\uFE0F Criminal record',
    low_income: '\u274C Below income threshold',
    spanish_employer: '\u26A0\uFE0F Spanish employer'
  };
  var msgParts = ['[Eligibility Checker]', 'Result: ' + (resultLabels[_checkerResult] || _checkerResult)];
  if (nat)  msgParts.push('Nationality: ' + nat);
  if (inc)  msgParts.push('Income: ' + inc);
  if (work) msgParts.push('Work type: ' + work);
  if (crim) msgParts.push('Criminal record: ' + crim);
  if (famCount > 0) msgParts.push('Family members: ' + famCount);
  msgParts.push('Required income: \u20AC' + requiredIncome.toFixed(2));
  /* save to ns_leads localStorage */
  try {
    var leads = pGetLeads();
    leads.unshift({ id: Date.now(), first: '', last: '', email: email, nationality: nat, message: msgParts.join(' | '), date: new Date().toISOString(), status: 'new', source: 'checker', family_members: famCount, required_income: requiredIncome, checker_result: _checkerResult });
    pSaveLeads(leads);
  } catch(e) {}
  /* Save lead email to users table with role='user', status='lead' for CM follow-up */
  try {
    var users = pGetUsers();
    var existingUser = users.find(function(u){return u.email.toLowerCase()===email.toLowerCase();});
    if(!existingUser){
      users.push({
        id:'u_lead_'+Date.now(),email:email.toLowerCase(),pass:'',role:'customer',first:'',last:'',phone:'',
        cmId:null,created:new Date().toISOString(),lead_status:'lead',checker_result:_checkerResult,
        nationality:nat,family_members:famCount
      });
      pSaveUsers(users);
    }
  } catch(e) {}
  /* also post to backend */
  fetch('/api/leads', { method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email: email, nationality: nat, income: inc, work_type: work, criminal: crim, family_members: famCount, required_income: requiredIncome, result: _checkerResult }) }).catch(function(){});
  document.getElementById('checkerEmailCapture').style.display = 'none';
  if (_checkerResult === 'eligible') {
    document.getElementById('discountBox').style.display = 'block';
  } else {
    var thanksEl = document.getElementById('checkerThanks');
    if (thanksEl) { thanksEl.style.display = 'block'; }
  }
  showToast('Got it! Check your inbox shortly \uD83D\uDCEC');
}

/* CONTACT FORM */
function handleSubmit(btn) {
  var first = (document.getElementById('contactFirst')||{}).value||'';
  var last  = (document.getElementById('contactLast')||{}).value||'';
  var email = (document.getElementById('contactEmail')||{}).value||'';
  var nat   = (document.getElementById('contactNat')||{}).value||'';
  var msg   = (document.getElementById('contactMessage')||{}).value||'';
  if (!first.trim() || !email.trim() || !msg.trim()) { showToast('Please fill in your name, email and message.'); return; }
  btn.disabled = true; btn.textContent = 'Sending\u2026';
  fetch('/api/contact', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({first_name:first.trim(),last_name:last.trim(),email:email.trim(),nationality:nat,message:msg.trim()})
  }).then(function(r){return r.json();}).then(function(data){
    if (data.ok) {
      btn.textContent = '\u2713 Sent!'; btn.style.background = '#16A34A';
      /* save lead to localStorage */
      var leads = JSON.parse(localStorage.getItem('ns_leads')||'[]');
      leads.unshift({id:Date.now(),first:first.trim(),last:last.trim(),email:email.trim(),nationality:nat,message:msg.trim(),date:new Date().toISOString(),status:'new',source:'contact'});
      localStorage.setItem('ns_leads',JSON.stringify(leads));
      document.getElementById('contactFirst').value='';document.getElementById('contactLast').value='';
      document.getElementById('contactEmail').value='';document.getElementById('contactNat').value='';
      document.getElementById('contactMessage').value='';
      showToast('Message sent! We\'ll reply within a few hours.');
      setTimeout(function(){btn.textContent='Send message \u2192';btn.style.background='';btn.disabled=false;},3500);
    } else { showToast(data.error||'Something went wrong. Please try again.'); btn.textContent='Send message \u2192';btn.disabled=false; }
  }).catch(function(){showToast('Could not send message. Please email us directly.');btn.textContent='Send message \u2192';btn.disabled=false;});
}

/* UTILITIES */
function escHtml(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtDate(d) { if (!d) return ''; try { return new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}); } catch(e){ return d; } }
function fmtDateTime(d) { if (!d) return ''; try { return new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})+' · '+new Date(d).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}); } catch(e){ return d; } }
function showToast(msg) {
  var t = document.getElementById('nsToast');
  if (!t) {
    t = document.createElement('div'); t.id = 'nsToast';
    t.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(20px);background:#1A1916;color:#fff;padding:12px 24px;border-radius:50px;font-family:\'Bricolage Grotesque\',sans-serif;font-size:14px;font-weight:600;z-index:9999;opacity:0;transition:all 0.3s;pointer-events:none;white-space:nowrap;box-shadow:0 8px 32px rgba(0,0,0,0.25);';
    document.body.appendChild(t);
  }
  t.textContent = msg; t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)';
  setTimeout(function(){ t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(20px)'; }, 2800);
}

/* STORAGE */
function getArticles() { try { var s=localStorage.getItem('ns_articles'); if(s){var p=JSON.parse(s);if(Array.isArray(p))return p;} }catch(e){} return []; }
function saveArticles(a) { try{localStorage.setItem('ns_articles',JSON.stringify(a));}catch(e){} }
function getAdminData() { try{return JSON.parse(localStorage.getItem('ns_admin_data')||'{}');}catch(e){return {};} }
function setAdminData(key,val) { var d=getAdminData(); d[key]=val; localStorage.setItem('ns_admin_data',JSON.stringify(d)); }
function getNewsletterEmails() { try{return JSON.parse(localStorage.getItem('ns_nl_emails')||'[]');}catch(e){return [];} }
function saveNewsletterEmail(email) {
  var emails=getNewsletterEmails();
  if(!emails.find(function(e){return e.email===email;})){
    emails.push({email:email,date:new Date().toISOString()});
    localStorage.setItem('ns_nl_emails',JSON.stringify(emails));
  }
}
function getTestimonials() { try{return JSON.parse(localStorage.getItem('ns_testimonials')||'null')||DEFAULT_TESTI;}catch(e){return DEFAULT_TESTI;} }
function saveTestimonials(t) { localStorage.setItem('ns_testimonials',JSON.stringify(t)); }
function getFaqData() { try{return JSON.parse(localStorage.getItem('ns_faq')||'null')||DEFAULT_FAQ;}catch(e){return DEFAULT_FAQ;} }
function saveFaqData(f) { localStorage.setItem('ns_faq',JSON.stringify(f)); }

/* DEFAULT DATA */
var DEFAULT_TESTI = [
  {id:'t1',name:'Jake K.',meta:'Software engineer \u00B7 Austin \u2192 Barcelona',quote:'NomadSpain made the entire process effortless. My case manager was always available and I got my visa approved in under 4 months.'},
  {id:'t2',name:'\u0644\u0645\u064A\u0627\u0621 \u0645.',meta:'\u0645\u062F\u064A\u0631\u0629 \u062A\u0633\u0648\u064A\u0642 \u0631\u0642\u0645\u064A \u00B7 \u0627\u0644\u0631\u064A\u0627\u0636 \u2192 \u0645\u062F\u0631\u064A\u062F',quote:'\u0645\u0646 \u0627\u0644\u0631\u064A\u0627\u0636 \u0625\u0644\u0649 \u0645\u062F\u0631\u064A\u062F \u2014 \u0643\u0627\u0646 \u0627\u0644\u0641\u0631\u064A\u0642 \u0645\u062A\u0627\u062D\u0627\u064B \u0639\u0644\u0649 \u0648\u0627\u062A\u0633\u0627\u0628 \u0641\u064A \u0623\u064A \u0648\u0642\u062A\u060C \u0648\u0623\u0646\u062C\u0632\u0648\u0627 \u0643\u0644 \u0627\u0644\u0623\u0648\u0631\u0627\u0642 \u0628\u0633\u0631\u0639\u0629 \u0644\u0645 \u0623\u062A\u0648\u0642\u0639\u0647\u0627. \u0623\u0646\u0635\u062D \u0627\u0644\u062C\u0645\u064A\u0639!'},
  {id:'t3',name:'Carlos R.',meta:'Dise\u00F1ador freelance \u00B7 M\u00E9xico \u2192 Valencia',quote:'Incre\u00EDble servicio. Gracias a NomadSpain consegu\u00ED mi visa en tiempo r\u00E9cord. El gestor de casos habla espa\u00F1ol y eso lo hace todo m\u00E1s f\u00E1cil.'},
  {id:'t4',name:'\u062E\u0627\u0644\u062F \u0639.',meta:'\u0645\u0637\u0648\u0651\u0631 \u0628\u0631\u0627\u0645\u062C \u00B7 \u062F\u0628\u064A \u2192 \u0628\u0631\u0634\u0644\u0648\u0646\u0629',quote:'\u0643\u0646\u062A \u0642\u0644\u0642\u0627\u064B \u0645\u0646 \u062A\u0639\u0642\u064A\u062F\u0627\u062A \u0627\u0644\u0623\u0648\u0631\u0627\u0642\u060C \u0644\u0643\u0646 \u0627\u0644\u0641\u0631\u064A\u0642 \u062A\u0643\u0641\u0651\u0644 \u0628\u0643\u0644 \u0634\u064A\u0621 \u0645\u0646 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0644\u0644\u0646\u0647\u0627\u064A\u0629. \u0627\u0644\u0622\u0646 \u0623\u0639\u064A\u0634 \u0641\u064A \u0628\u0631\u0634\u0644\u0648\u0646\u0629 \u0648\u0623\u0639\u0645\u0644 \u0645\u0646 \u0627\u0644\u0634\u0627\u0637\u0626!'},
  {id:'t5',name:'Sophie L.',meta:'UX Designer \u00B7 London \u2192 Sevilla',quote:'The team handled everything \u2014 documents, translation, embassy appointment. I just showed up and signed. Best investment I made.'},
  {id:'t6',name:'Mar\u00EDa A.',meta:'Consultora \u00B7 Buenos Aires \u2192 Valencia',quote:'\u00A1El mejor servicio! Me ayudaron con toda la documentaci\u00F3n para mi familia. Ahora vivimos en Valencia con visa aprobada para todos.'}
];
var DEFAULT_FAQ = [
  {id:'f1',cat:'general',q:'What is the Spanish Digital Nomad Visa?',a:'The Spanish Digital Nomad Visa is a permit for non-EU/EEA remote workers and freelancers to live and work in Spain. Established under Law No. 28/2022 (the Startup Act), it allows professionals to reside in Spain while working for companies or clients primarily located outside the country.'},
  {id:'f2',cat:'eligibility',q:'What are the key eligibility requirements?',a:'You must be at least 18, have a university degree or 3+ years professional experience, earn at least \u20AC2,849/month from remote work, have at least 80% of income from non-Spanish clients, have worked for your employer/clients for at least 3 months, and have no criminal record in the past 5 years.'},
  {id:'f3',cat:'eligibility',q:'Can EU/EEA nationals apply?',a:'EU/EEA nationals do not need the Digital Nomad Visa as they already have the right to live and work in Spain under EU freedom of movement rules. They simply need to register at their local town hall (empadronamiento) and obtain a NIE.'},
  {id:'f4',cat:'documents',q:'What documents do I need?',a:'Main documents: valid passport, apostilled criminal record certificate, proof of income (contract + bank statements), degree or CV with 3+ years experience, health insurance covering Spain, proof of accommodation, and completed visa application form with Tasa 790-038 payment receipt.'},
  {id:'f5',cat:'documents',q:'How do I get my documents apostilled?',a:'Step 1: Certify documents with the issuing authority, then get them apostilled by your Ministry of Foreign Affairs. Step 2: Book an appointment at the Spanish embassy in your country for a second apostille. Do NOT translate until AFTER the Spanish embassy apostille.'},
  {id:'f6',cat:'documents',q:'When should I get documents translated?',a:'ONLY after both apostilles are complete. The translator must be approved by the Spanish Ministry of Foreign Affairs (traductor jurado). Other legal translations will not be accepted.'},
  {id:'f7',cat:'application',q:'How do I submit my application?',a:'Option A (Embassy): Book appointment at Spanish embassy in your home country. Processing: 3\u20135 months. Option B (From Spain): Enter on a valid Schengen visa and apply in Spain. Processing: 20 working days + 10 for document requests. You must stay in the Schengen Zone during processing.'},
  {id:'f8',cat:'after',q:'What happens after approval?',a:'After a positive decision you still need to: book a TIE appointment (1\u20132 weeks wait), have fingerprints taken, then wait 30 days to personally collect your TIE card. You are not a legal resident until you physically pick up the card.'},
  {id:'f9',cat:'after',q:'When do I become a legal resident?',a:'You are not a legal resident until you have physically collected your TIE card. Once you have it, you can travel freely within the Schengen Zone and enjoy full resident rights in Spain.'},
  {id:'f10',cat:'general',q:'Can I bring my family?',a:'Yes! Your spouse/partner and dependent children can be included. Each dependent requires their own documents and adds \u20AC500 to the service fee. All applications can be processed concurrently.'},
  {id:'f11',cat:'general',q:'How long does the visa/residency last?',a:'Via embassy: 1-year visa converted to 3-year residence card upon arrival in Spain. Via Spain: 3-year residence card directly. Can be renewed for another 2 years, then indefinitely.'},
  {id:'f12',cat:'eligibility',q:'Do I need health insurance?',a:'Yes. You must have private health insurance providing full coverage in Spain. The policy must be from a company authorised to operate in Spain. Your home country public health insurance is not accepted.'}
];

/* KB TAG DATA */
var TAG_LABELS={visa:'Visa Process',tax:'Tax & Finance',lifestyle:'Lifestyle & Cities',legal:'Legal & Docs',housing:'Housing',community:'Community'};
var EMOJIS={visa:'\uD83D\uDEC2',tax:'\uD83D\uDCB0',lifestyle:'\uD83C\uDF1E',legal:'\u2696\uFE0F',housing:'\uD83C\uDFE0',community:'\uD83E\uDD1D'};
var CARD_BG={visa:'linear-gradient(135deg,#FFF1F2,#FFE4E6)',tax:'linear-gradient(135deg,#EEF2FF,#E0E7FF)',lifestyle:'linear-gradient(135deg,#FFF7ED,#FEE0C0)',legal:'linear-gradient(135deg,#F0FFF4,#DCFCE7)',housing:'linear-gradient(135deg,#ECFDF5,#D1FAE5)',community:'linear-gradient(135deg,#F5F3FF,#EDE9FE)'};

/* KB GRID */
var activeFilter='all', currentQuery='';
function renderKbGrid() {
  var articles=getArticles(), grid=document.getElementById('blogGrid');
  if(!grid) return;
  grid.innerHTML='';
  var count=0;
  articles.forEach(function(a) {
    var tagOk=activeFilter==='all'||(a.category||'').indexOf(activeFilter)!==-1;
    var qOk=!currentQuery||(a.title+' '+a.summary+' '+(a.body||'')).toLowerCase().indexOf(currentQuery)!==-1;
    if(!tagOk||!qOk) return;
    count++;
    var card=document.createElement('div'); card.className='blog-card';
    card.onclick=function(){openKbReader(a.id);};
    var imgHtml=a.image?'<img src="'+escHtml(a.image)+'" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'">':'<span style="font-size:36px;">'+(a.emoji||EMOJIS[a.category]||'\uD83D\uDCF0')+'</span>';
    card.innerHTML='<div class="blog-card-img" style="background:'+(CARD_BG[a.category]||CARD_BG.visa)+';display:flex;align-items:center;justify-content:center;">'+imgHtml
      +'<div class="blog-card-overlay"><button class="blog-card-overlay-btn">\uD83D\uDCD6 Read Article</button></div></div>'
      +'<div class="blog-card-body"><span class="kb-tag">'+(TAG_LABELS[a.category]||a.category)+'</span><h3>'+escHtml(a.title)+'</h3><p>'+escHtml(a.summary)+'</p>'
      +'<div class="kb-meta">\uD83D\uDCD6 '+(a.readTime||'5 min')+' \u00B7 '+fmtDate(a.date)+'</div><div class="read-link">Read article \u2192</div></div>';
    grid.appendChild(card);
  });
  var noRes=document.getElementById('noResults'); if(noRes) noRes.style.display=count===0?'block':'none';
  var sc=document.getElementById('searchCount');
  if(sc&&currentQuery) sc.textContent=count+' result'+(count!==1?'s':'')+' for "'+currentQuery+'"';
  else if(sc) sc.textContent='';
}

/* KB TEASER ON HOME */
function renderKbtGrid() {
  var grid=document.getElementById('kbtGrid'); if(!grid) return;
  var articles=getArticles().slice(0,6);
  if(articles.length===0){
    grid.innerHTML='<div class="kbt-empty"><div class="ke-emoji">\uD83D\uDCDA</div><p>Articles added in the admin panel will appear here.</p></div>'
      +'<div class="kbt-cta" style="grid-column:1/-1;"><p>Explore our <span>Knowledge Hub</span> for guides, tips &amp; checklists</p><button onclick="showPage(\'knowledge\')" class="btn btn-primary">Browse all guides \u2192</button></div>';
    return;
  }
  grid.innerHTML=articles.map(function(a){
    var imgHtml=a.image?'<img src="'+escHtml(a.image)+'" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'">':'<span style="font-size:36px;">'+(a.emoji||EMOJIS[a.category]||'\uD83D\uDCF0')+'</span>';
    return '<div class="kbt-card" onclick="showPage(\'knowledge\')">'
      +'<div class="kbt-card-img" style="background:'+(CARD_BG[a.category]||CARD_BG.visa)+';display:flex;align-items:center;justify-content:center;">'+imgHtml+'</div>'
      +'<div class="kbt-card-body"><span class="kb-tag">'+(TAG_LABELS[a.category]||a.category)+'</span><h4>'+escHtml(a.title)+'</h4><p>'+escHtml(a.summary)+'</p>'
      +'<div class="kb-meta">\uD83D\uDCD6 '+(a.readTime||'5 min')+' \u00B7 '+fmtDate(a.date)+'</div></div></div>';
  }).join('')+'<div class="kbt-cta" style="grid-column:1/-1;"><p>See all <span>guides</span> in the Knowledge Hub</p><button onclick="showPage(\'knowledge\')" class="btn btn-primary">Explore all \u2192</button></div>';
}

function handleSearch(q){currentQuery=q.toLowerCase();renderKbGrid();}
function filterKb(tag,el){activeFilter=tag;document.querySelectorAll('.filter-pill').forEach(function(p){p.classList.remove('active');});if(el)el.classList.add('active');renderKbGrid();}
function clearSearch(){currentQuery='';var s=document.getElementById('kbSearch');if(s)s.value='';}
function resetFilter(){activeFilter='all';document.querySelectorAll('.filter-pill').forEach(function(p,i){p.classList.toggle('active',i===0);});}

/* FAQ */
var activeFaqCat='all';
function renderFaqGrid(){
  var faqs=getFaqData(), grid=document.getElementById('faqGrid'), empty=document.getElementById('faqEmpty');
  if(!grid) return;
  var filtered=activeFaqCat==='all'?faqs:faqs.filter(function(f){return f.cat===activeFaqCat;});
  if(filtered.length===0){grid.innerHTML='';if(empty)empty.style.display='block';return;}
  if(empty)empty.style.display='none';
  grid.innerHTML=filtered.map(function(f){
    return '<div class="faq-item" id="fi-'+f.id+'">'
      +'<div class="faq-q" onclick="toggleFaq(\'fi-'+f.id+'\')">'
      +'<h4>'+escHtml(f.q)+'</h4><div class="faq-toggle">+</div></div>'
      +'<div class="faq-a"><p>'+escHtml(f.a)+'</p></div></div>';
  }).join('');
}
function filterFaq(cat,el){
  activeFaqCat=cat;
  document.querySelectorAll('.faq-cat-btn').forEach(function(b){b.classList.remove('active');});
  if(el)el.classList.add('active');
  renderFaqGrid();
}
function toggleFaq(id){
  var item=document.getElementById(id); if(!item) return;
  var wasOpen=item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(i){i.classList.remove('open');});
  if(!wasOpen)item.classList.add('open');
}

/* CONSULATE GUIDES */
var CONSULATE_GUIDES=[
  {id:'serbia',flag:'🇷🇸',name:'Serbia',color:'#C6363C',items:[
    {icon:'📅',label:'Validity','text':'Permit must be valid for 6+ months after expected departure date.'},
    {icon:'📬',label:'Submission','text':'Submit to the consulate 8 months before your permit ends.'},
    {icon:'🪪',label:'NIE First','text':'You must obtain your NIE before the consulate will review your package.'},
    {icon:'📄',label:'Format','text':'Hard copies required. "Jurado" (sworn) translations delivered to Serbia recommended.'},
    {icon:'✉️',label:'Appointment','text':'Email emb.belgrado.citas@maec.es with visa type, entry dates, names & passport numbers.'},
    {icon:'💶',label:'Fee','text':'~€80, payable in cash (RSD).'}
  ]},
  {id:'india',flag:'🇮🇳',name:'India',color:'#FF9933',items:[
    {icon:'📅',label:'Booking','text':'Appointments via BLS International at the Mumbai consulate.'},
    {icon:'🪪',label:'NIE','text':'Requested separately via email at cog.mumbai@maec.es. 2024 fee: Rs. 895.'},
    {icon:'🏥',label:'Insurance','text':'Even contractors must hold Spanish health insurance for one year.'},
    {icon:'🩺',label:'Medical','text':'Medical certificate from a DOH-accredited hospital required (valid 3 months).'},
    {icon:'📝',label:'Translations','text':'Sworn (Jurado) translators available in India for fast processing.'},
    {icon:'💰',label:'Income','text':'Minimum ~€2,160/month for main applicant.'},
    {icon:'⚠️',label:'Constraint','text':'Cannot apply while currently employed in India.'}
  ]},
  {id:'mexico',flag:'🇲🇽',name:'Mexico',color:'#006847',items:[
    {icon:'📍',label:'Jurisdiction','text':'Apply within your consular district (Guadalajara, Mexico City, or Monterrey) with proof of residency (e.g., electricity bill).'},
    {icon:'📅',label:'Booking','text':'Mexico City: BLS International. Guadalajara: own booking service. Monterrey: cog.monterrey.vis@maec.es.'},
    {icon:'🪪',label:'NIE','text':'Submitted simultaneously with visa application. Fees paid on-site in local currency.'},
    {icon:'💡',label:'Passport Tip','text':'If booking system shows an error, try starting your passport number with a capital "G".'}
  ]},
  {id:'russia',flag:'🇷🇺',name:'Russia',color:'#003893',items:[
    {icon:'✉️',label:'Appointment','text':'Email cog.moscu.citas@maec.es. Attach proof of work experience (diploma/contracts) to receive booking credentials.'},
    {icon:'📄',label:'Translations','text':'Digital signatures allowed, but a printed copy must also be provided. Email PDF to consulate on or before submission day.'},
    {icon:'💶',label:'Fees','text':'Cash only; exact change required.'},
    {icon:'📍',label:'St. Petersburg','text':'Residents of St. Petersburg must apply there — process is reportedly longer and more complex than Moscow.'}
  ]},
  {id:'uk',flag:'🇬🇧',name:'United Kingdom',color:'#012169',items:[
    {icon:'✈️',label:'Visa-Free Entry','text':'British passport holders can enter Spain visa-free and apply for a 3-year residence permit directly from within Spain.'},
    {icon:'🏢',label:'Company Docs','text':'Order company registration certificates from Companies House (with apostille).'},
    {icon:'📜',label:'Criminal Record','text':'Use the ACRO website. Standard: 20 days (£65). Premium: 2 days (£115).'},
    {icon:'🔏',label:'Social Security','text':'A1 certificate requires a notarial apostille.'}
  ]},
  {id:'usa',flag:'🇺🇸',name:'USA',color:'#3C3B6E',items:[
    {icon:'✈️',label:'Visa-Free Entry','text':'US passport holders can enter as tourists and apply for the 3-year residency permit directly, bypassing the 1-year consulate visa.'},
    {icon:'📍',label:'Jurisdiction','text':'Apply to the consulate covering your state (e.g., Chicago, Miami, LA). State ID or Driver\'s License required.'},
    {icon:'📜',label:'Criminal Record','text':'Only FBI (Department of Justice) background checks accepted — state or local checks not valid.'},
    {icon:'🌍',label:'Non-Americans','text':'Must provide Green Card or long-term visa. B1/B2 holders cannot apply from within the US.'}
  ]}
];

var phConsulateActive=null;
function renderConsulateGuides(gridId,detailId){
  var grid=document.getElementById(gridId);
  var detail=document.getElementById(detailId);
  if(!grid||!detail) return;
  if(!phConsulateActive) phConsulateActive=CONSULATE_GUIDES[0].id;
  grid.innerHTML=CONSULATE_GUIDES.map(function(c){
    var active=c.id===phConsulateActive;
    return '<div class="consulate-flag-btn'+(active?' active':'')+'" onclick="selectConsulate(\''+c.id+'\',\''+gridId+'\',\''+detailId+'\')" style="border-color:'+(active?c.color:'var(--border)')+';background:'+(active?c.color+'18':'var(--white)')+'">'
      +'<span style="font-size:26px;">'+c.flag+'</span>'
      +'<span style="font-size:12px;font-weight:700;color:'+(active?c.color:'var(--text2)')+';">'+c.name+'</span>'
      +'</div>';
  }).join('');
  var guide=CONSULATE_GUIDES.find(function(c){return c.id===phConsulateActive;})||CONSULATE_GUIDES[0];
  detail.innerHTML='<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">'
    +'<span style="font-size:36px;">'+guide.flag+'</span>'
    +'<div><div style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:20px;font-weight:800;">'+guide.name+'</div>'
    +'<div style="font-size:12px;color:var(--text3);">Consulate-specific requirements</div></div></div>'
    +guide.items.map(function(item,i){
      return '<div style="display:flex;gap:14px;padding:12px 0;'+(i<guide.items.length-1?'border-bottom:1px solid var(--border);':'')+'">'
        +'<div style="font-size:20px;flex-shrink:0;margin-top:1px;">'+item.icon+'</div>'
        +'<div><div style="font-size:13px;font-weight:700;color:var(--brand);margin-bottom:2px;">'+item.label+'</div>'
        +'<div style="font-size:13px;color:var(--text2);line-height:1.6;">'+item.text+'</div></div></div>';
    }).join('');
}
function selectConsulate(id,gridId,detailId){
  phConsulateActive=id;
  renderConsulateGuides(gridId,detailId);
}

/* QUICK RESOURCES */
var RESOURCE_DATA={
  checklist:{title:'Document Checklist',body:'<style>.cl-item{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid #f0ede8;cursor:pointer;user-select:none}.cl-item:last-of-type{border:none}.cl-cb{width:20px;height:20px;min-width:20px;border-radius:5px;border:2px solid #D4D0C8;display:flex;align-items:center;justify-content:center;transition:all 0.15s;margin-top:1px;font-size:11px}.cl-item.checked .cl-cb{background:#16A34A;border-color:#16A34A;color:#fff}.cl-item.checked .cl-label{text-decoration:line-through;color:#A8A49C}.cl-label{font-size:14px;color:#1A1916;line-height:1.5}.cl-prog{background:#f0ede8;border-radius:50px;height:7px;margin:10px 0 18px;overflow:hidden}.cl-bar{background:linear-gradient(135deg,#E8422A,#F5A623);height:100%;border-radius:50px;transition:width 0.3s;width:0%}</style><div style=\'display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;\'><span id=\'cl_count\' style=\'font-size:13px;color:#6B6860;font-weight:600;\'>0 of 14 completed</span><button onclick=\'resetCl()\' style=\'font-size:12px;color:#E8422A;background:none;border:none;cursor:pointer;\'>Reset</button></div><div class=\'cl-prog\'><div class=\'cl-bar\' id=\'cl_bar\'></div></div><div style=\'font-size:14px;font-weight:800;margin:16px 0 6px;font-family:Bricolage Grotesque,sans-serif;\'>General Documents</div><div class=\'cl-item\' onclick=\'toggleCl(this)\'><div class=\'cl-cb\'></div><span class=\'cl-label\'>Valid passport (min. 1 year validity remaining)</span></div><div class=\'cl-item\' onclick=\'toggleCl(this)\'><div class=\'cl-cb\'></div><span class=\'cl-label\'>Completed national visa application form</span></div><div class=\'cl-item\' onclick=\'toggleCl(this)\'><div class=\'cl-cb\'></div><span class=\'cl-label\'>Recent passport-sized photographs</span></div><div class=\'cl-item\' onclick=\'toggleCl(this)\'><div class=\'cl-cb\'></div><span class=\'cl-label\'>Tasa 790-038 government fee payment</span></div><div class=\'cl-item\' onclick=\'toggleCl(this)\'><div class=\'cl-cb\'></div><span class=\'cl-label\'>Apostilled criminal record certificate (within last 3 months)</span></div><div class=\'cl-item\' onclick=\'toggleCl(this)\'><div class=\'cl-cb\'></div><span class=\'cl-label\'>Private health insurance covering Spain (full coverage)</span></div><div class=\'cl-item\' onclick=\'toggleCl(this)\'><div class=\'cl-cb\'></div><span class=\'cl-label\'>Proof of accommodation in Spain</span></div><div style=\'font-size:14px;font-weight:800;margin:16px 0 6px;font-family:Bricolage Grotesque,sans-serif;\'>Employment / Income</div><div class=\'cl-item\' onclick=\'toggleCl(this)\'><div class=\'cl-cb\'></div><span class=\'cl-label\'>Employment contract with foreign company (min. 3 months old)</span></div><div class=\'cl-item\' onclick=\'toggleCl(this)\'><div class=\'cl-cb\'></div><span class=\'cl-label\'>Employer letter confirming remote work authorization</span></div><div class=\'cl-item\' onclick=\'toggleCl(this)\'><div class=\'cl-cb\'></div><span class=\'cl-label\'>Last 3\u20136 months bank statements</span></div><div class=\'cl-item\' onclick=\'toggleCl(this)\'><div class=\'cl-cb\'></div><span class=\'cl-label\'>Company registration documents (apostilled)</span></div><div style=\'font-size:14px;font-weight:800;margin:16px 0 6px;font-family:Bricolage Grotesque,sans-serif;\'>Education / Experience</div><div class=\'cl-item\' onclick=\'toggleCl(this)\'><div class=\'cl-cb\'></div><span class=\'cl-label\'>University degree (apostilled) OR CV showing 3+ years experience</span></div><div style=\'font-size:14px;font-weight:800;margin:16px 0 6px;font-family:Bricolage Grotesque,sans-serif;\'>Family Members (if applicable)</div><div class=\'cl-item\' onclick=\'toggleCl(this)\'><div class=\'cl-cb\'></div><span class=\'cl-label\'>Marriage certificate (apostilled)</span></div><div class=\'cl-item\' onclick=\'toggleCl(this)\'><div class=\'cl-cb\'></div><span class=\'cl-label\'>Birth certificates for children (apostilled)</span></div><p style=\'margin-top:14px;font-size:13px;background:rgba(232,66,42,0.06);padding:12px;border-radius:10px;\'>\u26a0\ufe0f <strong>Order matters:</strong> Apostille home country first \u2192 Spanish embassy apostille \u2192 THEN translate into Spanish.</p>'},
  income:{title:'Income Requirements',body:'<h3>Minimum Thresholds (2024\u20132025)</h3><ul><li><strong>Main applicant:</strong> \u20AC2,849/month</li><li><strong>Spouse/partner:</strong> +\u20AC712/month</li><li><strong>Each child:</strong> +\u20AC285/month</li></ul><h3>Examples</h3><ul><li>Single: \u20AC2,849/month</li><li>Couple: \u20AC3,561/month</li><li>Couple + 1 child: \u20AC3,846/month</li><li>Couple + 2 children: \u20AC4,131/month</li></ul><h3>Rules</h3><ul><li>80%+ income from non-Spanish clients</li><li>Income from employment, freelancing, or both</li><li>Last 6 months bank statements required</li><li>Income must be consistent and verifiable</li></ul>'},
  timeline:{title:'Processing Timeline',body:'<h3>Via Embassy (Abroad)</h3><ul><li><strong>Weeks 1\u20132:</strong> Gather and apostille documents</li><li><strong>Week 3:</strong> Spanish embassy apostille</li><li><strong>Week 4:</strong> Document translation</li><li><strong>Week 5:</strong> Embassy appointment &amp; submission</li><li><strong>Weeks 6\u201318:</strong> Processing (2\u20134 months)</li><li><strong>After approval:</strong> Travel to Spain within 30\u201390 days</li></ul><h3>Via Spain (on Schengen Visa)</h3><ul><li><strong>Day 1:</strong> Enter Spain</li><li><strong>Day 1\u20137:</strong> Submit at immigration office (UGE)</li><li><strong>Days 8\u201328:</strong> 20 working day processing</li><li><strong>After approval:</strong> Book TIE appointment</li><li><strong>30 days after fingerprints:</strong> Collect TIE card</li></ul><p><strong>Embassy route: 4\u20136 months total</strong><br><strong>Spain route: 6\u201310 weeks total</strong></p>'},
  apostille:{title:'Apostille Guide',body:'<h3>What is an Apostille?</h3><p>An official government seal verifying document authenticity for international use, required under the Hague Convention.</p><h3>Two-Step Process</h3><p><strong>Step 1 \u2014 Home Country:</strong></p><ul><li>Get documents certified by issuing authority</li><li>Apostille by your Ministry of Foreign Affairs</li></ul><p><strong>Step 2 \u2014 Spanish Embassy:</strong></p><ul><li>Book appointment at Spanish embassy</li><li>Bring original apostilled documents (untranslated)</li><li>Pay embassy apostille fee</li></ul><h3>After Both Apostilles</h3><p>ONLY now get documents translated by a Spanish Ministry-approved translator (traductor jurado).</p>'},
  tax:{title:'Tax Guide for Nomads in Spain',body:'<h3>The Beckham Law</h3><p>New residents can be taxed as non-residents for up to 6 years under the Special Regime for Impatriates.</p><h3>Benefits</h3><ul><li>Flat 24% rate on Spanish income up to \u20AC600,000</li><li>Foreign income generally exempt</li><li>No wealth tax on foreign assets</li><li>No Modelo 720 obligation</li></ul><h3>Who Qualifies?</h3><ul><li>Not a Spanish tax resident in previous 5 years</li><li>Move due to employment, company director role, or digital nomad under Startup Act</li><li>Apply within 6 months of registering as resident</li></ul><h3>Standard Rates (without Beckham)</h3><ul><li>Up to \u20AC12,450: 19%</li><li>\u20AC12,451\u2013\u20AC20,200: 24%</li><li>\u20AC20,201\u2013\u20AC35,200: 30%</li><li>\u20AC35,201\u2013\u20AC60,000: 37%</li><li>Above \u20AC60,000: 45\u201347%</li></ul>'},
  cities:{title:'City Comparison',body:'<h3>Barcelona</h3><ul><li><strong>Monthly cost:</strong> \u20AC1,600\u20132,200 | <strong>Rent (1BR):</strong> \u20AC1,100\u20131,800</li><li>Best for: Tech, beach, international community</li></ul><h3>Madrid</h3><ul><li><strong>Monthly cost:</strong> \u20AC1,400\u20132,000 | <strong>Rent (1BR):</strong> \u20AC900\u20131,600</li><li>Best for: Business, culture, nightlife</li></ul><h3>Valencia</h3><ul><li><strong>Monthly cost:</strong> \u20AC1,000\u20131,600 | <strong>Rent (1BR):</strong> \u20AC700\u20131,200</li><li>Best for: Affordable, beach, 300+ sunny days/year</li></ul><h3>Sevilla</h3><ul><li><strong>Monthly cost:</strong> \u20AC900\u20131,400 | <strong>Rent (1BR):</strong> \u20AC600\u20131,000</li><li>Best for: Most affordable, authentic Spain, culture</li></ul>'}
};
/* CHECKLIST INTERACTIONS - must be global (not in innerHTML script) */
function toggleCl(el) {
  el.classList.toggle('checked');
  var t = document.querySelectorAll('.cl-item').length,
      d = document.querySelectorAll('.cl-item.checked').length;
  document.getElementById('cl_count').textContent = d + ' of ' + t + ' completed';
  document.getElementById('cl_bar').style.width = Math.round(d / t * 100) + '%';
}
function resetCl() {
  document.querySelectorAll('.cl-item.checked').forEach(function(e) { e.classList.remove('checked'); });
  document.getElementById('cl_count').textContent = '0 of 14 completed';
  document.getElementById('cl_bar').style.width = '0%';
}

/* DEFAULT ARTICLES - seeded from NomadSpain.io blog on first load */
function seedDefaultArticles() {
  if (getArticles().length > 0) return;
  var defaults = [
    {
      id: 'dnv-2026',
      title: 'Spain Digital Nomad Visa 2026',
      summary: 'Complete 2026 guide covering income thresholds, professional criteria, and the Beckham Law flat 24% tax rate for remote workers.',
      category: 'visa', date: '2026-03-17', readTime: '5 min',
      image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1024,h=555,fit=crop/AzGM9DRxOGCo1GRM/360_f_1370358097_u9gd9c7ucwiesjmgiztdkzjdjmrbekvu-m6L2LqXzV7Iwz0NV.jpg',
      body: ''
    },
    {
      id: 'living-dream-nomad',
      title: 'Living the Dream: A Guide to Being a Digital Nomad in Spain',
      summary: 'Why Spain tops the list for remote professionals \u2014 high-speed internet, affordable living, and a clear visa pathway for 2026.',
      category: 'lifestyle', date: '2026-03-17', readTime: '6 min',
      image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1024,h=565,fit=crop/AzGM9DRxOGCo1GRM/gemini_generated_image_1b7wp51b7wp51b7w-Mq4WiF8zJxe73OLS.png',
      body: ''
    },
    {
      id: 'dnv-requirements',
      title: 'Spain Digital Nomad Visa Requirements',
      summary: 'Full eligibility breakdown: professional credentials, income proofs (\u20AC31,752/yr minimum), criminal record checks, and Social Security compliance.',
      category: 'visa', date: '2025-05-01', readTime: '7 min',
      image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=756,fit=crop,f=jpeg/AzGM9DRxOGCo1GRM/priscilla-du-preez-xkkcui44im0-unsplash-AoP4lqzpjLHp7Q9K.jpg',
      body: ''
    },
    {
      id: 'self-employed-spain-2025',
      title: 'Complete Guide to Becoming Self-Employed in Spain in 2025',
      summary: 'How to register as an aut\u00f3nomo: tax authority and Social Security enrolment, monthly fees, and ongoing compliance obligations.',
      category: 'tax', date: '2025-04-01', readTime: '8 min',
      image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=756,fit=crop,f=jpeg/AzGM9DRxOGCo1GRM/bigstock-self-employed-sign-with-a-beau-82320527-1024x633-mePgP1k7eLUg6xba.jpg',
      body: ''
    },
    {
      id: 'immigration-law-2025',
      title: "Key Updates on Spain\u2019s Immigration Law for 2025",
      summary: 'Major 2025 reforms: simplified residence permit procedures, expanded family reunification, and new arraigo and temporary worker pathways.',
      category: 'legal', date: '2025-08-01', readTime: '5 min',
      image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1024,h=434,fit=crop/AzGM9DRxOGCo1GRM/closeup-shot-realistic-waving-flag-spain-mP434w8L9au2w5Lq.jpg',
      body: ''
    },
    {
      id: 'non-lucrative-visa',
      title: 'Complete Guide to the Non-Lucrative Visa in Spain',
      summary: 'Everything you need to know about residency without working rights: \u20AC28,800/yr income proof, private health insurance, and consulate application steps.',
      category: 'visa', date: '2025-02-01', readTime: '7 min',
      image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1282,fit=crop/AzGM9DRxOGCo1GRM/towfiqu-barbhuiya-joqwsi9u_xm-unsplash-m7VDL52GDqSQLEOz.jpg',
      body: ''
    },
    {
      id: 'dnv-nationality',
      title: 'Does the Digital Nomad Visa Count Towards Nationality?',
      summary: 'Yes \u2014 time on the DNV accrues 1:1 toward Spanish citizenship. Standard path is 10 years; Ibero-American nationals qualify in just 2.',
      category: 'visa', date: '2026-02-01', readTime: '5 min',
      image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1024,h=535,fit=crop/AzGM9DRxOGCo1GRM/gemini_generated_image_1xm4un1xm4un1xm4-IVDElHWBAO411tjd.png',
      body: ''
    },
    {
      id: 'visa-processing-times-2025',
      title: 'Spain Visa Processing Times in 2025: What to Expect',
      summary: 'Tourist visas: 15\u201330 days. Work permits: 5\u20136 weeks. How Spain\u2019s May 2025 reforms affect timelines and how to avoid common delays.',
      category: 'visa', date: '2025-03-01', readTime: '5 min',
      image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1282,fit=crop/AzGM9DRxOGCo1GRM/spanish-work-visa-application-with-flag-and-passport-scaled-AQEeE8wNjXTgnaqB.jpg',
      body: ''
    },
    {
      id: 'schengen-area',
      title: 'What is the Schengen Area and Which Countries Are Part of It?',
      summary: '27 European countries, zero internal border controls. A practical explainer for nomads planning multi-country stays across the EU.',
      category: 'lifestyle', date: '2025-01-01', readTime: '4 min',
      image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1559,fit=crop/AzGM9DRxOGCo1GRM/screenshot-2025-09-03-at-12.50.39a-pm-mv0P0Lv0WxHB8r82.png',
      body: ''
    },
    {
      id: 'tech-tools-relocation',
      title: 'Tech Tools & Tapas: The Ultimate Spain Relocation Checklist',
      summary: 'NIE, TIE, neobanks, local apps \u2014 everything the modern remote worker needs to hit the ground running when moving to Spain.',
      category: 'lifestyle', date: '2026-03-17', readTime: '6 min',
      image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=756,fit=crop,f=jpeg/AzGM9DRxOGCo1GRM/gemini_generated_image_v091lhv091lhv091-nAOTaC8JeU7SGNOc.png',
      body: ''
    },
    {
      id: 'portable-power-nomad',
      title: 'Portable Power: Essential Tech for the Spanish Nomad',
      summary: 'Best power banks, portable stations, and solar panels for van life and co-working across Spain. Keep your mobile office running anywhere.',
      category: 'lifestyle', date: '2026-02-01', readTime: '5 min',
      image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1024,h=538,fit=crop/AzGM9DRxOGCo1GRM/gemini_generated_image_y93c4by93c4by93c-wLHRoQgvpxrJzN8Q.png',
      body: ''
    },
    {
      id: 'get-residency-nomadspain',
      title: 'Get Your Spain Residency Permit with NomadSpain.io',
      summary: 'Our five-step concierge process: expert consultation, dedicated case manager, document prep, final review, and full application support.',
      category: 'visa', date: '2026-02-15', readTime: '4 min',
      image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1024,h=568,fit=crop/AzGM9DRxOGCo1GRM/gemini_generated_image_7vj7fj7vj7fj7vj7-HxdJHGZEmnZ5ai4j.png',
      body: ''
    }
  ];
  saveArticles(defaults);
}

function openResource(key){
  var data=RESOURCE_DATA[key]; if(!data) return;
  document.getElementById('rmTitle').textContent=data.title;
  document.getElementById('rmBody').innerHTML=data.body;
  document.getElementById('resourceModal').classList.add('open');
}
function closeResourceModal(){document.getElementById('resourceModal').classList.remove('open');}

/* KB READER */
function mdToHtml(md){
  if(!md) return '';
  var html=md.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/^## (.+)$/gm,'</p><h2>$1</h2><p>').replace(/^### (.+)$/gm,'</p><h3>$1</h3><p>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/^- (.+)$/gm,'<li-item>$1</li-item>');
  html=html.replace(/(<li-item>[^<]*<\/li-item>\n?)+/g,function(match){
    var items=match.match(/<li-item>([^<]*)<\/li-item>/g).map(function(i){return '<li>'+i.replace(/<\/?li-item>/g,'')+'</li>';}).join('');
    return '</p><ul>'+items+'</ul><p>';
  });
  html='<p>'+html.replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br>')+'</p>';
  html=html.replace(/<p>\s*<\/p>/g,'').replace(/<p>(<[hul])/g,'$1').replace(/(<\/[hul][^>]*>)<\/p>/g,'$1');
  return html;
}
function openKbReader(id){
  var articles=getArticles(); var a=articles.find(function(x){return x.id===id;}); if(!a) return;
  var html='<div class="kb-tag">'+(TAG_LABELS[a.category]||a.category)+'</div>'
    +'<h1 style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:clamp(24px,4vw,42px);font-weight:800;letter-spacing:-1.5px;margin:16px 0 12px;line-height:1.1;">'+escHtml(a.title)+'</h1>'
    +'<div style="font-size:13px;color:var(--text3);margin-bottom:36px;">\uD83D\uDCD6 '+(a.readTime||'5 min')+' \u00B7 '+fmtDate(a.date)+'</div>';
  if(a.image) html+='<img src="'+escHtml(a.image)+'" style="width:100%;border-radius:16px;margin-bottom:32px;" onerror="this.remove()">';
  html+='<div style="font-size:16px;line-height:1.9;color:var(--text);">'+mdToHtml(a.body||'')+'</div>';
  document.getElementById('kbReaderContent').innerHTML=html;
  document.getElementById('kbReaderOverlay').style.display='block';
  window.scrollTo({top:0,behavior:'instant'});
}
function closeKbReader(){document.getElementById('kbReaderOverlay').style.display='none';}

/* NEWSLETTER */
function handleNewsletter(){
  var inp=document.getElementById('nlEmail'); if(!inp) return;
  var email=inp.value.trim();
  if(!email||!/^[^@]+@[^@]+\.[^@]+$/.test(email)){showToast('Please enter a valid email address');return;}
  fetch('/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email,source:'newsletter'})})
    .then(function(r){return r.json();}).then(function(data){
      if(data.ok){saveNewsletterEmail(email);inp.value='';showToast('\u2713 You\'re subscribed! Welcome to the NomadSpain community.');}
      else{showToast(data.error||'Could not subscribe. Please try again.');}
    }).catch(function(){saveNewsletterEmail(email);inp.value='';showToast('\u2713 You\'re subscribed!');});
}

/* ═══════════════════════════════════════════════
   PORTAL RBAC PLATFORM
═══════════════════════════════════════════════ */
var pUser = null;
var pActiveThread = null;
var pSelectedPkg = null;
var pPromoDiscount=0;var coDepCount=0;

/* ── DATA HELPERS ── */
function pGetUsers(){return JSON.parse(localStorage.getItem('ns_pu')||'[]');}
function pSaveUsers(u){localStorage.setItem('ns_pu',JSON.stringify(u));}
function pGetApps(){return JSON.parse(localStorage.getItem('ns_apps')||'[]');}
function pSaveApps(a){localStorage.setItem('ns_apps',JSON.stringify(a));}
function pGetMsgs(){return JSON.parse(localStorage.getItem('ns_pmsgs')||'[]');}
function pSaveMsgs(m){localStorage.setItem('ns_pmsgs',JSON.stringify(m));}
function pGetPays(){return JSON.parse(localStorage.getItem('ns_pays')||'[]');}
function pSavePays(p){localStorage.setItem('ns_pays',JSON.stringify(p));}
function pGetPromos(){return JSON.parse(localStorage.getItem('ns_promos')||'[]');}
function pSavePromos(p){localStorage.setItem('ns_promos',JSON.stringify(p));}
function pGetTemplates(){return JSON.parse(localStorage.getItem('ns_doc_tpls')||'[]');}
function pSaveTemplates(t){localStorage.setItem('ns_doc_tpls',JSON.stringify(t));}
function pGetPricing(){return JSON.parse(localStorage.getItem('ns_pricing')||'{"consultation":50,"solo":2500,"family":3000,"dep":500}');}
function pHasPaidApp(){
  var pays=pGetPays().filter(function(p){return p.userId===pUser.id&&p.status==='paid';});
  return pays.length>0;
}
function pSavePricing2(p){localStorage.setItem('ns_pricing',JSON.stringify(p));}
/* Profiles table */
function pGetProfiles(){return JSON.parse(localStorage.getItem('ns_profiles')||'{}');}
function pSaveProfiles(p){localStorage.setItem('ns_profiles',JSON.stringify(p));}
function pGetProfile(userId){var p=pGetProfiles();return p[userId]||null;}
function pSaveProfile(userId,data){var p=pGetProfiles();p[userId]=data;pSaveProfiles(p);}
/* Documents table (normalised — separate from app.docs legacy) */
function pGetDocuments(){return JSON.parse(localStorage.getItem('ns_documents')||'[]');}
function pSaveDocuments(d){localStorage.setItem('ns_documents',JSON.stringify(d));}
function pGetAppDocuments(appId){return pGetDocuments().filter(function(d){return d.application_id===appId;});}
/* Leads table */
function pGetLeads(){return JSON.parse(localStorage.getItem('ns_leads')||'[]');}
function pSaveLeads(l){localStorage.setItem('ns_leads',JSON.stringify(l));}
/* Appointments table */
function pGetAppointments(){return JSON.parse(localStorage.getItem('ns_appointments')||'[]');}
function pSaveAppointments(a){localStorage.setItem('ns_appointments',JSON.stringify(a));}
function pGetAppAppointments(appId){return pGetAppointments().filter(function(a){return a.application_id===appId;});}
/* Province metrics table */
function pGetProvinceMetrics(){return JSON.parse(localStorage.getItem('ns_province_metrics')||'[]');}
function pSaveProvinceMetrics(m){localStorage.setItem('ns_province_metrics',JSON.stringify(m));}
/* System status */
function pGetSystemStatus(){return localStorage.getItem('ns_system_status')||'Normal';}
function pSaveSystemStatus(s){localStorage.setItem('ns_system_status',s);}

var PROFILE_CHECKLISTS={
  main:[
    {cat:'Identity',docs:[
      {key:'passport',icon:'🛂',name:'Passport',sub:'Valid 1yr+, biometric page clear'},
      {key:'passport_scans',icon:'📑',name:'All-Page Scans',sub:'All stamped & visa pages included'}
    ]},
    {cat:'Professional',docs:[
      {key:'diploma',icon:'🎓',name:'Diploma / Experience',sub:'3yr+ relevant experience or degree'},
      {key:'remote_work_proof',icon:'💻',name:'Remote Work Proof',sub:'Contract or client agreements (3mo+)'},
      {key:'company_age',icon:'🏢',name:'Company Age Proof',sub:'Company registered 1yr+ (registration cert)'}
    ]},
    {cat:'Financial',docs:[
      {key:'income_proof',icon:'💰',name:'Proof of Income',sub:'€2,849/month minimum'},
      {key:'bank_statements',icon:'🏦',name:'Bank Statements',sub:'Last 3 months'},
      {key:'contracts_invoices',icon:'📄',name:'Contracts / Invoices',sub:'Client agreements or invoices'},
      {key:'employer_letter',icon:'✉️',name:'Employer Letter',sub:'On company letterhead'}
    ]},
    {cat:'Legal',docs:[
      {key:'criminal_record',icon:'📜',name:'Criminal Record Certificate',sub:'Last 2 years, apostilled'},
      {key:'no_record_declaration',icon:'🔏',name:'5yr No-Record Declaration',sub:'Signed statutory declaration'},
      {key:'mi_t_form',icon:'📋',name:'MI-T Form',sub:'Completed and signed'}
    ]},
    {cat:'Health',docs:[
      {key:'health_insurance',icon:'🏥',name:'Health Insurance',sub:'Full Spanish coverage or coverage certificate'}
    ]},
    {cat:'Fees',docs:[
      {key:'state_fee',icon:'💳',name:'Paid State Fee',sub:'Proof of payment'},
      {key:'tasa_790',icon:'🧾',name:'Tasa 790-038',sub:'Completed fee form'}
    ]}
  ],
  spouse:[
    {cat:'Identity',docs:[
      {key:'passport',icon:'🛂',name:'Passport',sub:'Valid 1yr+'},
      {key:'marriage_cert',icon:'💍',name:'Marriage Certificate',sub:'Apostilled & translated'},
      {key:'birth_cert',icon:'👶',name:'Birth Certificate',sub:'Apostilled & translated'}
    ]},
    {cat:'Legal',docs:[
      {key:'criminal_record',icon:'📜',name:'Criminal Record',sub:'Apostilled'},
      {key:'no_record_declaration',icon:'🔏',name:'5yr No-Record Declaration',sub:'Signed declaration'}
    ]},
    {cat:'Health',docs:[
      {key:'insurance_coverage',icon:'🏥',name:'Insurance Coverage Cert',sub:'Full Spanish coverage'}
    ]},
    {cat:'Fees',docs:[
      {key:'tasa_790',icon:'🧾',name:'Tasa 790-038',sub:'Completed fee form'}
    ]}
  ],
  dependent_minor:[
    {cat:'Identity',docs:[
      {key:'passport',icon:'🛂',name:'Passport',sub:'Valid 1yr+'},
      {key:'birth_cert',icon:'👶',name:'Birth Certificate',sub:'Apostilled & translated'}
    ]},
    {cat:'Admin',docs:[
      {key:'mi_t_form',icon:'📋',name:'Form MI-T',sub:'Completed and signed'},
      {key:'tasa_790',icon:'🧾',name:'Tasa 790-038',sub:'Completed fee form'}
    ]},
    {cat:'Health',docs:[
      {key:'insurance_coverage',icon:'🏥',name:'Insurance Coverage Cert',sub:'Full Spanish coverage'}
    ]}
  ],
  dependent_adult:[
    {cat:'Identity',docs:[
      {key:'passport',icon:'🛂',name:'Passport',sub:'Valid 1yr+'},
      {key:'birth_cert_apostilled',icon:'👶',name:'Birth Certificate',sub:'Apostilled & translated'}
    ]},
    {cat:'Dependency',docs:[
      {key:'proof_of_study',icon:'🎓',name:'Proof of Study',sub:'University enrollment letter'},
      {key:'bank_transfers',icon:'🏦',name:'Bank Transfers',sub:'Financial dependency evidence'},
      {key:'single_status_proof',icon:'📄',name:'Single Status Proof',sub:'Certificate of civil status'}
    ]},
    {cat:'Legal',docs:[
      {key:'criminal_record',icon:'📜',name:'Criminal Record',sub:'Apostilled'},
      {key:'no_record_declaration',icon:'🔏',name:'5yr No-Record Declaration',sub:'Signed declaration'},
      {key:'mi_t_form',icon:'📋',name:'MI-T Form',sub:'Completed and signed'}
    ]},
    {cat:'Health',docs:[
      {key:'insurance_coverage',icon:'🏥',name:'Full-Coverage Private Insurance',sub:'No copay clause'}
    ]},
    {cat:'ID',docs:[
      {key:'nie_number',icon:'🪪',name:'NIE Number',sub:'Número de Identidad de Extranjero'}
    ]}
  ]
};
var PROFILE_TYPE_LABELS={main:'Main Applicant',spouse:'Legal Spouse',dependent_minor:'Dependent (Under 18)',dependent_adult:'Dependent (Over 18)'};
var P_STAGES=['Onboarding','Document Prep','Under Review','Embassy Filing','Pending Decision','Approved'];
var P_PKG_NAMES={consultation:'360\u00b0 Strategy Session',solo:'The Nomad Solo',family:'Family Package'};
var P_PKG_PRICES={consultation:50,solo:2500,family:2500};

/* ══ ENUMS & RBAC ══ */
/* ══ ENUMS (Mirrors SQL ENUM types) ══ */
var USER_ROLE={ADMIN:'admin',MANAGER:'case_manager',USER:'customer'};
var APP_STATUS_ENUM={LEAD:'lead',PAYMENT_PENDING:'payment_pending',DOCUMENT_PREP:'document_prep',SUBMITTED:'submitted',APPROVED:'approved',REJECTED:'rejected'};
/* Legacy compat */
var APP_STATUS={REGISTERED:'registered',PAID:'paid',APP_STARTED:'app_started',SUBMITTED:'submitted'};
var DOC_STATUS_ENUM={MISSING:'missing',UPLOADED:'uploaded',APOSTILLED:'apostilled',TRANSLATED:'translated',VERIFIED:'verified'};
var REFERRAL_SOURCES=['organic','referral','social','ads','partner'];
var CM_MAX_CAPACITY=20;
var DOC_EXPIRY_WARN_DAYS=15;
var URGENCY_DAYS=5;

/* ══ REJECTION REASONS ══ */
var REJECTION_REASONS=[
  'Document expired','Illegible / low quality','Wrong document type',
  'Missing apostille','Missing translation','Name mismatch',
  'Incomplete document','Fraudulent / tampered','Not notarised',
  'Income insufficient','Other (see notes)'
];

/* ══ APPOINTMENT TYPES ══ */
var APPT_TYPES={DIGITAL_CERT:'digital_cert',SUBMISSION:'submission',FINGERPRINTS:'fingerprints'};
var APPT_TYPE_LABELS={digital_cert:'Digital Certificate',submission:'Embassy Submission',fingerprints:'Fingerprints / Biometrics'};
var APPT_STATUS={SCHEDULED:'scheduled',COMPLETED:'completed',CANCELLED:'cancelled',MISSED:'missed'};
var APPT_URGENT_DAYS=3;

/* ══ PROVINCE METRICS ══ */
var DIFFICULTY_RATINGS=['Easy','Moderate','Critical'];
var SPAIN_PROVINCES=[
  'Madrid','Barcelona','Valencia','Sevilla','Málaga','Zaragoza','Bilbao',
  'Alicante','Granada','Girona','Guadalajara','Murcia','Palma de Mallorca',
  'Las Palmas','Santa Cruz de Tenerife','A Coruña','Cádiz','Tarragona'
];

/* ══ EX-17 FIELD MAPPING ══ */
/* Maps profile/user fields → official EX-17 PDF form field IDs */
var EX17_MAPPING={
  passport:'f1_1',nie:'f1_2',surname:'f1_3',name:'f1_4',
  birth_date:'f1_5',nationality:'f1_6',sex:'f1_7',
  marital_status:'f1_8',father_name:'f1_9',mother_name:'f1_10',
  address:'f2_1',city:'f2_2',province:'f2_3',postal_code:'f2_4',
  phone:'f2_5',email:'f2_6',
  initial_residence_box:'f4_1_1',renewal_box:'f4_1_2',
  residence_auth_box:'f4_2_1'
};

/* ══ SYSTEM STATUS (Regularisation Surge) ══ */
var SYSTEM_STATUS_OPTIONS=['Normal','Moderate Congestion','High Congestion','Critical — Regularisation Surge'];

/* ══ SMI (Salario Mínimo Interprofesional) 2026 ══ */
var SMI_100=1424.50;
var SMI_200=SMI_100*2; /* €2,849 — main applicant threshold */
var SMI_75=SMI_100*0.75; /* €1,068.38 — first dependent */
var SMI_25=SMI_100*0.25; /* €356.13 — each additional dependent */

function calcIncomeThreshold(familyCount){
  var threshold=SMI_200;
  if(familyCount>0) threshold+=SMI_75; /* first dependent */
  if(familyCount>1) threshold+=SMI_25*(familyCount-1); /* each additional */
  return Math.round(threshold*100)/100;
}

/* ══ RBAC (Row Level Security in JS) ══ */
function isAdmin(){return pUser&&pUser.role===USER_ROLE.ADMIN;}
function isManager(){return pUser&&pUser.role===USER_ROLE.MANAGER;}
function isCustomer(){return pUser&&pUser.role===USER_ROLE.USER;}

/* RLS: Filter data based on role — like Postgres RLS policies */
function rlsFilterApps(apps){
  if(!pUser) return [];
  if(isAdmin()) return apps; /* Admin: SELECT * FROM applications */
  if(isManager()) return apps.filter(function(a){return a.cmId===pUser.id;}); /* CM: WHERE assigned_manager_id = current_user */
  return apps.filter(function(a){return a.userId===pUser.id;}); /* User: WHERE user_id = current_user */
}
function rlsFilterDocs(docs,appId){
  /* Simulates RLS on documents table */
  if(!pUser) return [];
  var apps=rlsFilterApps(pGetApps());
  var appIds=apps.map(function(a){return a.id;});
  return docs.filter(function(d){return appIds.indexOf(d.appId||appId)!==-1;});
}
function rlsFilterPays(pays){
  if(!pUser) return [];
  if(isAdmin()) return pays;
  if(isManager()) return []; /* CM/User: No access to global financials */
  return pays.filter(function(p){return p.userId===pUser.id;});
}
function rlsFilterUsers(users){
  if(!pUser) return [];
  if(isAdmin()) return users;
  if(isManager()){
    /* CM sees own profile + assigned customers */
    return users.filter(function(u){return u.id===pUser.id||u.cmId===pUser.id;});
  }
  return users.filter(function(u){return u.id===pUser.id;}); /* User sees only self */
}

/* Derive APP_STATUS from app data — uses SQL enum values */
function getAppStatus(app){
  if(!app)return null;
  if(app.app_status) return app.app_status; /* Use stored value if available */
  var pays=pGetPays();var hasPaid=pays.some(function(p){return p.appId===app.id&&p.status==='paid';});
  if(app.stage>=5)return APP_STATUS_ENUM.APPROVED;
  if(app.stage>=3)return APP_STATUS_ENUM.SUBMITTED;
  if(app.stage>=1)return APP_STATUS_ENUM.DOCUMENT_PREP;
  if(hasPaid)return APP_STATUS_ENUM.PAYMENT_PENDING;
  return APP_STATUS_ENUM.LEAD;
}

/* Urgency flag renderer */
function pUrgencyFlag(lastDate){
  var now=new Date();var last=new Date(lastDate);
  var diffDays=Math.floor((now-last)/(1000*60*60*24));
  if(diffDays>URGENCY_DAYS) return '<span class="urgency-flag urgent"><span class="urgency-dot"></span>'+diffDays+'d idle</span>';
  if(diffDays>3) return '<span class="urgency-flag warning"><span class="urgency-dot"></span>'+diffDays+'d</span>';
  return '<span class="urgency-flag ok"><span class="urgency-dot"></span>Active</span>';
}

/* Doc progress bar renderer */
function pDocProgressBar(app){
  var required=app.requiredDocs||['passport','income','criminal','degree','insurance','other'];
  var total=required.length;
  var uploaded=0;
  required.forEach(function(k){var s=(app.docs||{})[k];if(s==='uploaded'||s==='verified')uploaded++;});
  var pct=total?Math.round(uploaded/total*100):0;
  var cls=pct<40?'low':pct<75?'mid':'high';
  return '<div class="doc-prog-wrap"><div class="doc-prog-bar"><div class="doc-prog-fill '+cls+'" style="width:'+pct+'%;"></div></div><span class="doc-prog-text">'+uploaded+'/'+total+'</span></div>';
}

/* Capacity bar renderer */
function pCapacityBar(active,max){
  var pct=max?Math.round(active/max*100):0;
  var cls=pct<50?'low':pct<80?'mid':'high';
  return '<div class="cap-wrap"><div class="cap-bar"><div class="cap-fill '+cls+'" style="width:'+Math.min(pct,100)+'%;"></div></div><span class="cap-text">'+active+'/'+max+'</span></div>';
}

/* Document expiry checker */
function pGetDocExpiries(apps,users){
  var results=[];
  apps.forEach(function(app){
    var u=users.find(function(x){return x.id===app.userId;})||{first:'Unknown',last:''};
    var docExpiries=app.docExpiries||{};
    Object.keys(docExpiries).forEach(function(docKey){
      var expDate=new Date(docExpiries[docKey]);
      var now=new Date();
      var daysLeft=Math.floor((expDate-now)/(1000*60*60*24));
      results.push({appId:app.id,userId:app.userId,userName:u.first+' '+u.last,docKey:docKey,expiryDate:docExpiries[docKey],daysLeft:daysLeft,status:daysLeft<0?'expired':daysLeft<=DOC_EXPIRY_WARN_DAYS?'expiring':'valid'});
    });
  });
  return results.sort(function(a,b){return a.daysLeft-b.daysLeft;});
}

/* Avg time-in-stage calculator */
function pCalcAvgTimeInStage(apps){
  var stageTimes={};
  P_STAGES.forEach(function(s,i){stageTimes[i]=[];});
  apps.forEach(function(app){
    if(!app.stageDates)return;
    var keys=Object.keys(app.stageDates).map(Number).sort(function(a,b){return a-b;});
    for(var k=0;k<keys.length-1;k++){
      var from=new Date(app.stageDates[keys[k]]);
      var to=new Date(app.stageDates[keys[k+1]]);
      var days=Math.max(0,Math.round((to-from)/(1000*60*60*24)));
      stageTimes[keys[k]].push(days);
    }
  });
  var avgs={};
  Object.keys(stageTimes).forEach(function(k){
    var arr=stageTimes[k];
    avgs[k]=arr.length?Math.round(arr.reduce(function(s,v){return s+v;},0)/arr.length):0;
  });
  return avgs;
}

/* ══ PRIORITY SCORE ══ */
/* Formula: (days_since_update * 2) + (missing_docs * 5) */
function calculatePriorityScore(app){
  var now=new Date();
  var lastUpdate=new Date(app.last_activity||app.updated||app.created);
  var daysSinceUpdate=Math.max(0,Math.floor((now-lastUpdate)/(1000*60*60*24)));
  var docs=pGetAppDocuments(app.id);
  var missingDocs=0;
  if(docs.length){
    docs.forEach(function(d){if(d.status==='missing')missingDocs++;});
  } else {
    /* Fallback to legacy app.docs */
    var requiredDocs=app.requiredDocs||['passport','income','criminal','degree','insurance','other'];
    requiredDocs.forEach(function(k){if(!(app.docs||{})[k]||((app.docs||{})[k]==='missing'))missingDocs++;});
  }
  return (daysSinceUpdate*2)+(missingDocs*5);
}

function pPriorityBadge(score){
  var cls=score>=20?'high':score>=10?'med':'low';
  var label=score>=20?'High':score>=10?'Medium':'Low';
  return '<span class="priority-score '+cls+'">'+score+' — '+label+'</span>';
}

/* ══ FINANCIAL HEALTH (SMI 2026 Gap Analysis) ══ */
function calculateFinancialHealth(app,profile){
  var familyCount=app.family_members_count||0;
  var required=calcIncomeThreshold(familyCount);
  var proven=profile?profile.monthly_income||0:0;
  var gap=Math.max(0,required-proven);
  var pct=required>0?Math.min(100,Math.round(proven/required*100)):0;
  var status=pct>=100?'sufficient':pct>=75?'close':'insufficient';
  return {required:required,proven:proven,gap:gap,pct:pct,status:status,familyCount:familyCount};
}

function pRenderFinancialHealth(app,profile){
  var fh=calculateFinancialHealth(app,profile);
  var statusLabel=fh.status==='sufficient'?'✓ Income Sufficient':fh.status==='close'?'⚠ Almost There':'✗ Insufficient Income';
  var statusCls=fh.status==='sufficient'?'sufficient':fh.status==='close'?'close':'insufficient';
  var html='<div class="fin-health">'
    +'<div class="fin-health-header">'
    +'<div class="fin-health-title">Financial Health — SMI 2026</div>'
    +'<span class="fin-health-status '+statusCls+'">'+statusLabel+'</span>'
    +'</div>'
    +'<div class="fin-health-bar"><div class="fin-health-fill '+statusCls+'" style="width:'+fh.pct+'%;"></div></div>'
    +'<div class="fin-health-row"><span>Proven Monthly Income</span><span style="font-weight:700;">€'+fh.proven.toLocaleString()+'</span></div>'
    +'<div class="fin-health-row"><span>Required (200% SMI'+(fh.familyCount>0?' + '+fh.familyCount+' dep'+(fh.familyCount>1?'s':''):'')+')</span><span style="font-weight:700;">€'+fh.required.toLocaleString()+'</span></div>';
  if(fh.gap>0){
    html+='<div class="fin-health-gap">Gap: €'+fh.gap.toLocaleString()+'/mo needed</div>';
  }
  html+='</div>';
  return html;
}

/* ══ TRI-STATE PROGRESS BAR ══ */
/* green=verified, yellow=uploaded/pending, grey=missing */
function pTriStateBar(app){
  var docs=pGetAppDocuments(app.id);
  var verified=0,pending=0,missing=0,total=0;
  if(docs.length){
    total=docs.length;
    docs.forEach(function(d){
      if(d.status==='verified')verified++;
      else if(d.status==='uploaded'||d.status==='apostilled'||d.status==='translated')pending++;
      else missing++;
    });
  } else {
    /* Fallback to legacy app.docs */
    var required=app.requiredDocs||['passport','income','criminal','degree','insurance','other'];
    total=required.length;
    required.forEach(function(k){
      var s=(app.docs||{})[k]||'missing';
      if(s==='verified')verified++;
      else if(s==='uploaded'||s==='pending'||s==='apostilled'||s==='translated')pending++;
      else missing++;
    });
  }
  if(!total)total=1;
  var pctV=Math.round(verified/total*100);
  var pctP=Math.round(pending/total*100);
  var pctM=100-pctV-pctP;
  return '<div class="tri-bar" title="'+verified+' verified · '+pending+' pending · '+missing+' missing">'
    +'<div class="tri-bar-green" style="width:'+pctV+'%;"></div>'
    +'<div class="tri-bar-yellow" style="width:'+pctP+'%;"></div>'
    +'<div class="tri-bar-grey" style="width:'+pctM+'%;"></div>'
    +'</div>'
    +'<div style="font-size:10px;color:var(--text3);margin-top:2px;">'+verified+'✓ '+pending+'⏳ '+missing+'—</div>';
}

/* ══ SIDE-BY-SIDE DOCUMENT REVIEWER ══ */
var cmReviewDocId=null;

function pCMDocReview(appId,docId){
  cmReviewDocId=docId;
  cmManageTab='reviewer';
  cmManageAppId=appId;
  pRenderCMManage();
}

function pCMRenderReviewer(app){
  var docs=pGetAppDocuments(app.id);
  if(!docs.length) return '<div class="p-card" style="text-align:center;padding:30px;color:var(--text3);">No normalised documents found. Documents need to be uploaded first.</div>';

  var selectedDoc=cmReviewDocId?docs.find(function(d){return d.id===cmReviewDocId;}):docs[0];
  if(!selectedDoc) selectedDoc=docs[0];
  cmReviewDocId=selectedDoc.id;

  var profile=pGetProfile(app.userId);
  var user=(pGetUsers()).find(function(u){return u.id===app.userId;})||{first:'Unknown',last:''};

  /* Doc list sidebar */
  var docListHtml='<div class="doc-rv-list">';
  docs.forEach(function(d){
    var active=d.id===selectedDoc.id?' active':'';
    var sBadge=d.status==='verified'?'verified':d.status==='uploaded'?'uploaded':d.status==='apostilled'?'apostilled':d.status==='translated'?'translated':d.status==='missing'?'missing':'uploaded';
    docListHtml+='<div class="doc-rv-list-item'+active+'" onclick="pCMDocReview(\''+app.id+'\',\''+d.id+'\')">'
      +'<div class="doc-rv-list-name">'+escHtml(d.name)+'</div>'
      +'<span class="cm-doc-badge '+sBadge+'">'+escHtml(d.status)+'</span>'
      +'</div>';
  });
  docListHtml+='</div>';

  /* Left pane — Preview */
  var leftHtml='<div class="doc-rv-left">'
    +'<div class="doc-rv-toolbar">'
    +'<span style="font-weight:700;">'+escHtml(selectedDoc.name)+'</span>'
    +'<span class="cm-doc-badge '+selectedDoc.status+'">'+escHtml(selectedDoc.status)+'</span>'
    +'</div>'
    +'<div class="doc-rv-preview">';
  if(selectedDoc.file_url){
    leftHtml+='<img src="'+escHtml(selectedDoc.file_url)+'" style="max-width:100%;border-radius:8px;" onerror="this.parentElement.innerHTML=\'<div style=padding:40px;text-align:center;color:var(--text3)>Could not load preview</div>\'">';
  } else {
    leftHtml+='<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--text3);">'
      +'<div style="font-size:48px;margin-bottom:12px;">📄</div>'
      +'<div style="font-size:14px;font-weight:600;">No file uploaded</div>'
      +'<div style="font-size:12px;margin-top:4px;">Document preview will appear here once uploaded</div>'
      +'</div>';
  }
  leftHtml+='</div></div>';

  /* Right pane — Verification engine */
  var ocrConf=selectedDoc.ocr_confidence||0;
  var ocrBar=ocrConf>0?'<div class="doc-rv-ocr"><div class="doc-rv-ocr-label">OCR Confidence</div>'
    +'<div class="fin-health-bar"><div class="fin-health-fill '+(ocrConf>=80?'sufficient':ocrConf>=50?'close':'insufficient')+'" style="width:'+ocrConf+'%;"></div></div>'
    +'<div style="font-size:11px;color:var(--text3);margin-top:2px;">'+ocrConf+'% — '+(ocrConf>=80?'High confidence':ocrConf>=50?'Review recommended':'Manual verification required')+'</div>'
    +'</div>':'';

  /* Comparison flags */
  var compFlags='<div class="doc-rv-section"><div class="doc-rv-section-title">Comparison Flags</div>';
  var flagItems=[];
  if(profile){
    if(selectedDoc.name.toLowerCase().indexOf('passport')!==-1){
      var nameMatch=(profile.full_name||'').toLowerCase()===(user.first+' '+user.last).toLowerCase();
      flagItems.push({label:'Name Match',value:nameMatch?'✓ Match':'✗ Mismatch',ok:nameMatch});
      if(profile.passport_expiry){
        var pExp=new Date(profile.passport_expiry);
        var validPP=pExp>new Date(Date.now()+365*24*3600*1000);
        flagItems.push({label:'Passport Expiry',value:profile.passport_expiry+(validPP?' ✓':' ⚠ <1yr'),ok:validPP});
      }
    }
    if(selectedDoc.name.toLowerCase().indexOf('income')!==-1||selectedDoc.name.toLowerCase().indexOf('proof')!==-1){
      var fh=calculateFinancialHealth(app,profile);
      flagItems.push({label:'Income vs Required',value:'€'+fh.proven.toLocaleString()+' / €'+fh.required.toLocaleString(),ok:fh.pct>=100});
    }
  }
  if(selectedDoc.expiry_date){
    var expDt=new Date(selectedDoc.expiry_date);
    var dLeft=Math.floor((expDt-new Date())/(1000*60*60*24));
    flagItems.push({label:'Document Expiry',value:selectedDoc.expiry_date+(dLeft<0?' EXPIRED':dLeft<30?' ⚠ '+dLeft+'d':' ✓'),ok:dLeft>30});
  }
  if(!flagItems.length) flagItems.push({label:'Status',value:'No automated flags for this document type',ok:true});
  flagItems.forEach(function(f){
    compFlags+='<div class="doc-rv-field"><span class="doc-rv-field-label">'+f.label+'</span><span style="color:'+(f.ok?'#065f46':'#dc2626')+';font-weight:600;">'+f.value+'</span></div>';
  });
  compFlags+='</div>';

  /* Apostille & Translation sub-tasks */
  var isCriminal=selectedDoc.name.toLowerCase().indexOf('criminal')!==-1;
  var isApostilled=selectedDoc.is_apostilled||false;
  var isTranslated=selectedDoc.is_translated||false;
  var subTasksHtml='';
  if(isCriminal||selectedDoc.name.toLowerCase().indexOf('degree')!==-1){
    subTasksHtml='<div class="doc-rv-section"><div class="doc-rv-section-title">Sub-Task Requirements</div>'
      +'<label class="doc-subtask"><input type="checkbox" '+(isApostilled?'checked':'')+' onchange="pCMToggleSubtask(\''+app.id+'\',\''+selectedDoc.id+'\',\'is_apostilled\',this.checked)"> Apostille obtained</label>'
      +'<label class="doc-subtask"><input type="checkbox" '+(isTranslated?'checked':'')+' onchange="pCMToggleSubtask(\''+app.id+'\',\''+selectedDoc.id+'\',\'is_translated\',this.checked)"> Sworn translation complete</label>';
    if(isCriminal&&(!isApostilled||!isTranslated)){
      subTasksHtml+='<div style="font-size:11px;color:#dc2626;margin-top:6px;font-weight:600;">⚠ Cannot approve criminal record without apostille AND translation</div>';
    }
    subTasksHtml+='</div>';
  }

  /* Internal notes */
  var notesHtml='<div class="doc-rv-section"><div class="doc-rv-section-title">Internal Notes</div>'
    +'<textarea class="cm-note-area" id="rv-doc-notes" rows="2" style="width:100%;font-size:12px;">'+escHtml(selectedDoc.internal_notes||'')+'</textarea>'
    +'<button class="p-btn p-btn-ghost p-btn-sm" style="margin-top:6px;" onclick="pCMSaveDocNote(\''+app.id+'\',\''+selectedDoc.id+'\')">Save Note</button>'
    +'</div>';

  /* Rejection reason (if rejected) */
  var rejReasonHtml='';
  if(selectedDoc.rejection_reason){
    rejReasonHtml='<div class="doc-rv-section"><div class="doc-rv-section-title" style="color:#dc2626;">Rejection Reason</div>'
      +'<div style="font-size:13px;color:#dc2626;font-weight:600;">'+escHtml(selectedDoc.rejection_reason)+'</div></div>';
  }

  /* Action buttons */
  var canApprove=isManager()||isAdmin();
  var blockApproval=isCriminal&&(!isApostilled||!isTranslated);
  var actionsHtml='<div class="doc-rv-actions">';
  if(canApprove&&selectedDoc.status!=='verified'){
    actionsHtml+='<button class="p-btn p-btn-success" '+(blockApproval?'disabled title="Apostille & translation required"':'')+' onclick="pCMReviewAction(\''+app.id+'\',\''+selectedDoc.id+'\',\'verified\')">✓ Approve</button>';
  }
  if(canApprove&&selectedDoc.status!=='missing'){
    actionsHtml+='<div style="position:relative;display:inline-block;">'
      +'<button class="p-btn p-btn-danger" onclick="pCMToggleRejectDropdown(\''+selectedDoc.id+'\')">✗ Reject</button>'
      +'<div class="reject-dropdown" id="reject-dd-'+selectedDoc.id+'">'
      +'<div style="font-weight:700;font-size:12px;margin-bottom:6px;">Select Reason:</div>';
    REJECTION_REASONS.forEach(function(reason){
      actionsHtml+='<div class="reject-reason" onclick="pCMReviewAction(\''+app.id+'\',\''+selectedDoc.id+'\',\'rejected\',\''+escHtml(reason)+'\')">'+escHtml(reason)+'</div>';
    });
    actionsHtml+='</div></div>';
  }
  if(!canApprove){
    actionsHtml+='<div style="font-size:12px;color:var(--text3);font-style:italic;">Only managers and admins can approve/reject documents.</div>';
  }
  actionsHtml+='</div>';

  var rightHtml='<div class="doc-rv-right">'
    +ocrBar
    +compFlags
    +subTasksHtml
    +rejReasonHtml
    +notesHtml
    +actionsHtml
    +'</div>';

  return docListHtml+'<div class="doc-reviewer">'+leftHtml+rightHtml+'</div>';
}

/* Reviewer helpers */
function pCMToggleRejectDropdown(docId){
  var dd=document.getElementById('reject-dd-'+docId);
  if(dd) dd.classList.toggle('open');
}

function pCMReviewAction(appId,docId,newStatus,rejReason){
  var docs=pGetDocuments();var now=new Date().toISOString();
  docs=docs.map(function(d){
    if(d.id===docId){
      d.status=newStatus;
      if(newStatus==='rejected'&&rejReason){d.rejection_reason=rejReason;}
      else{d.rejection_reason=null;}
      d.reviewed_at=now;d.reviewed_by=pUser.id;
    }
    return d;
  });
  pSaveDocuments(docs);

  /* Log activity on app */
  var apps=pGetApps();
  apps=apps.map(function(a){
    if(a.id===appId){
      if(!a.activityLog)a.activityLog=[];
      var doc=docs.find(function(dd){return dd.id===docId;});
      var actionLabel=newStatus==='verified'?'Approved':newStatus==='rejected'?'Rejected':'Updated';
      a.activityLog.push({ts:now,icon:newStatus==='verified'?'✅':'❌',type:'doc',text:actionLabel+': '+(doc?doc.name:'document')+(rejReason?' — '+rejReason:'')});
      a.updated=now;a.last_activity=now;

      /* Update app_status if rejected */
      if(newStatus==='rejected'){
        a.app_status=APP_STATUS_ENUM.REJECTED;
        if(!a.statusHistory)a.statusHistory=[];
        a.statusHistory.push({status:APP_STATUS_ENUM.REJECTED,at:now});
      }
    }
    return a;
  });
  pSaveApps(apps);

  /* Notify client */
  if(newStatus==='rejected'&&rejReason){
    var msgs=pGetMsgs();
    var app=apps.find(function(a){return a.id===appId;});
    if(app){
      var doc=docs.find(function(dd){return dd.id===docId;});
      msgs.push({id:'msg'+Date.now(),fromId:pUser.id,toId:app.userId,body:'❌ Document Rejected: '+(doc?doc.name:'document')+' — Reason: '+rejReason+'. Please re-upload.',ts:now,read:false});
      pSaveMsgs(msgs);
    }
  }

  pRenderCMManage();
  showToast(newStatus==='verified'?'✓ Document approved':newStatus==='rejected'?'Document rejected — client notified':'Status updated');
}

function pCMToggleSubtask(appId,docId,field,checked){
  var docs=pGetDocuments();
  docs=docs.map(function(d){
    if(d.id===docId){d[field]=checked;}
    return d;
  });
  pSaveDocuments(docs);

  /* Log */
  var apps=pGetApps();var now=new Date().toISOString();
  apps=apps.map(function(a){
    if(a.id===appId){
      if(!a.activityLog)a.activityLog=[];
      var label=field==='is_apostilled'?'Apostille':'Translation';
      a.activityLog.push({ts:now,icon:'📋',type:'doc',text:label+(checked?' confirmed':' removed')+' for document'});
      a.updated=now;a.last_activity=now;
    }
    return a;
  });
  pSaveApps(apps);
  pRenderCMManage();
}

function pCMSaveDocNote(appId,docId){
  var note=((document.getElementById('rv-doc-notes')||{}).value||'').trim();
  var docs=pGetDocuments();
  docs=docs.map(function(d){
    if(d.id===docId){d.internal_notes=note;}
    return d;
  });
  pSaveDocuments(docs);
  showToast('✓ Note saved');
}

/* ══ APPOINTMENT CRUD ══ */
function pCMRenderAppointments(app){
  var appts=pGetAppAppointments(app.id);
  var user=(pGetUsers()).find(function(u){return u.id===app.userId;})||{first:'Unknown',last:''};
  var now=new Date();

  var html='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">'
    +'<div style="font-size:15px;font-weight:700;">Appointments</div>'
    +'<button class="p-btn p-btn-primary p-btn-sm" onclick="pCMShowAddAppt(\''+app.id+'\')">+ New Appointment</button>'
    +'</div>';

  /* Add appointment form (hidden by default) */
  html+='<div id="appt-add-form" style="display:none;margin-bottom:16px;" class="p-card">'
    +'<div class="p-field"><label>Type</label><select id="appt-type" class="p-input">';
  Object.keys(APPT_TYPE_LABELS).forEach(function(k){
    html+='<option value="'+k+'">'+APPT_TYPE_LABELS[k]+'</option>';
  });
  html+='</select></div>'
    +'<div class="p-field-row"><div class="p-field"><label>Date</label><input type="date" id="appt-date" class="p-input"></div>'
    +'<div class="p-field"><label>Time</label><input type="time" id="appt-time" class="p-input" value="10:00"></div></div>'
    +'<div class="p-field"><label>Location / Notes</label><input type="text" id="appt-location" class="p-input" placeholder="Embassy, police station, etc."></div>'
    +'<div style="display:flex;gap:8px;margin-top:10px;">'
    +'<button class="p-btn p-btn-primary p-btn-sm" onclick="pCMSaveAppt(\''+app.id+'\')">Save</button>'
    +'<button class="p-btn p-btn-ghost p-btn-sm" onclick="document.getElementById(\'appt-add-form\').style.display=\'none\'">Cancel</button>'
    +'</div></div>';

  if(!appts.length){
    html+='<div class="p-card" style="text-align:center;padding:24px;color:var(--text3);">No appointments scheduled.</div>';
    return html;
  }

  /* Sort by date ascending */
  appts.sort(function(a,b){return new Date(a.datetime)-new Date(b.datetime);});

  appts.forEach(function(apt){
    var dt=new Date(apt.datetime);
    var daysUntil=Math.floor((dt-now)/(1000*60*60*24));
    var isUrgent=daysUntil>=0&&daysUntil<=APPT_URGENT_DAYS&&apt.status==='scheduled';
    var isPast=dt<now;
    var icon=apt.type==='digital_cert'?'💻':apt.type==='submission'?'🏛️':'🖐️';
    var statusCls=apt.status==='completed'?'done':apt.status==='cancelled'?'cancel':apt.status==='missed'?'miss':'sched';

    html+='<div class="appt-card'+(isUrgent?' urgent':'')+'">'
      +'<div class="appt-icon">'+icon+'</div>'
      +'<div style="flex:1;">'
      +'<div style="font-weight:700;font-size:14px;">'+escHtml(APPT_TYPE_LABELS[apt.type]||apt.type)+'</div>'
      +'<div style="font-size:12px;color:var(--text3);margin-top:2px;">'+fmtDate(apt.datetime)+(apt.location?' · '+escHtml(apt.location):'')+'</div>'
      +(isUrgent?'<div style="font-size:11px;color:#dc2626;font-weight:700;margin-top:4px;">⚠ '+daysUntil+' day'+(daysUntil!==1?'s':'')+' away!</div>':'')
      +'</div>'
      +'<div style="display:flex;align-items:center;gap:8px;">'
      +'<span class="appt-status '+statusCls+'">'+escHtml(apt.status)+'</span>';
    if(apt.status==='scheduled'){
      html+='<button class="p-btn p-btn-success p-btn-sm" onclick="pCMApptStatus(\''+apt.id+'\',\'completed\')">✓</button>'
        +'<button class="p-btn p-btn-ghost p-btn-sm" onclick="pCMApptStatus(\''+apt.id+'\',\'cancelled\')">✗</button>';
    }
    html+='</div></div>';
  });
  return html;
}

function pCMShowAddAppt(appId){
  var form=document.getElementById('appt-add-form');
  if(form)form.style.display='block';
}

function pCMSaveAppt(appId){
  var type=(document.getElementById('appt-type')||{}).value;
  var date=(document.getElementById('appt-date')||{}).value;
  var time=(document.getElementById('appt-time')||{}).value||'10:00';
  var location=(document.getElementById('appt-location')||{}).value||'';
  if(!date){showToast('Please select a date');return;}
  var datetime=date+'T'+time+':00';
  var appts=pGetAppointments();
  appts.push({id:'appt'+Date.now(),application_id:appId,type:type,datetime:datetime,location:location,status:'scheduled',created:new Date().toISOString()});
  pSaveAppointments(appts);

  /* Log */
  var apps=pGetApps();var now=new Date().toISOString();
  apps=apps.map(function(a){
    if(a.id===appId){
      if(!a.activityLog)a.activityLog=[];
      a.activityLog.push({ts:now,icon:'📅',type:'action',text:'Appointment scheduled: '+APPT_TYPE_LABELS[type]+' on '+date});
      a.updated=now;a.last_activity=now;
    }
    return a;
  });
  pSaveApps(apps);
  pRenderCMManage();
  showToast('✓ Appointment scheduled');
}

function pCMApptStatus(apptId,newStatus){
  var appts=pGetAppointments();
  appts=appts.map(function(a){
    if(a.id===apptId){a.status=newStatus;}
    return a;
  });
  pSaveAppointments(appts);
  pRenderCMManage();
  showToast('✓ Appointment '+newStatus);
}

/* ══════════════════════════════════════════
   PROVINCE WAIT-TIME TRACKER (Heatmap)
══════════════════════════════════════════ */

function pRenderProvinceHeatmap(containerId,isAdmin){
  var metrics=pGetProvinceMetrics();
  if(!metrics.length){setHTML(containerId,'<p style="color:var(--text3);font-size:13px;">No province data yet.</p>');return;}

  /* Sort by wait days desc */
  metrics.sort(function(a,b){return b.avg_wait_days-a.avg_wait_days;});
  var maxWait=metrics[0].avg_wait_days||1;

  var html='';

  /* Smart reroute suggestions for CM */
  if(!isAdmin){
    var myApps=pGetApps().filter(function(a){return a.cmId===pUser.id;});
    var profiles=pGetProfiles();
    var suggestions=[];
    myApps.forEach(function(app){
      var prof=profiles[app.userId];
      if(!prof||!prof.preferred_province)return;
      var userProv=metrics.find(function(m){return m.province===prof.preferred_province;});
      if(!userProv||userProv.difficulty!=='Critical')return;
      /* Find nearby easy provinces */
      var nearby=pGetNearbyProvinces(prof.preferred_province);
      var alternatives=metrics.filter(function(m){return nearby.indexOf(m.province)!==-1&&m.difficulty==='Easy';});
      if(alternatives.length){
        var user=pGetUsers().find(function(u){return u.id===app.userId;})||{first:'Unknown',last:''};
        suggestions.push({user:user.first+' '+user.last,from:prof.preferred_province,fromWait:userProv.avg_wait_days,to:alternatives[0].province,toWait:alternatives[0].avg_wait_days,notes:alternatives[0].notes});
      }
    });
    if(suggestions.length){
      html+='<div class="p-card" style="margin-bottom:14px;border-color:#3b82f6;background:#eff6ff;">';
      html+='<div class="p-card-title" style="margin-bottom:10px;color:#1e40af;">💡 Smart Reroute Suggestions</div>';
      suggestions.forEach(function(s){
        html+='<div style="padding:8px 0;border-bottom:1px solid #bfdbfe;font-size:13px;">'
          +'<strong>'+escHtml(s.user)+'</strong> is in <span style="color:#dc2626;font-weight:700;">'+escHtml(s.from)+' ('+s.fromWait+'d wait)</span>. '
          +'Suggest <span style="color:#16a34a;font-weight:700;">'+escHtml(s.to)+' ('+s.toWait+'d wait)</span>.'
          +(s.notes?' <em style="color:var(--text3);">'+escHtml(s.notes)+'</em>':'')
          +'</div>';
      });
      html+='</div>';
    }
  }

  /* Heatmap table */
  html+='<div class="p-table-wrap"><table class="p-table"><thead><tr>'
    +'<th>Province</th><th>Avg Wait</th><th>Difficulty</th><th>Last Slot</th>'
    +(isAdmin?'<th>Notes</th><th>Actions</th>':'<th>Notes</th>')
    +'</tr></thead><tbody>';

  metrics.forEach(function(m){
    var diffCls=m.difficulty==='Critical'?'crit':m.difficulty==='Moderate'?'mod':'easy';
    var diffIcon=m.difficulty==='Critical'?'🔴':m.difficulty==='Moderate'?'🟡':'🟢';
    var barPct=Math.round(m.avg_wait_days/maxWait*100);
    var barColor=m.difficulty==='Critical'?'#dc2626':m.difficulty==='Moderate'?'#d97706':'#16a34a';
    var lastSlot=m.last_slot_found?fmtDate(m.last_slot_found):'Never';
    var daysSinceSlot=m.last_slot_found?Math.floor((new Date()-new Date(m.last_slot_found))/(1000*60*60*24)):999;

    html+='<tr>'
      +'<td style="font-weight:700;">'+escHtml(m.province)+'</td>'
      +'<td><div style="display:flex;align-items:center;gap:8px;"><div style="flex:1;height:6px;background:#e5e5e5;border-radius:3px;overflow:hidden;min-width:60px;"><div style="height:100%;width:'+barPct+'%;background:'+barColor+';border-radius:3px;"></div></div><span style="font-weight:800;font-size:13px;">'+m.avg_wait_days+'d</span></div></td>'
      +'<td><span class="priority-score '+diffCls+'" style="text-transform:capitalize;">'+diffIcon+' '+escHtml(m.difficulty)+'</span></td>'
      +'<td style="font-size:12px;">'+lastSlot+(daysSinceSlot>3?' <span style="color:#dc2626;">⚠</span>':'')+'</td>'
      +'<td style="font-size:12px;max-width:200px;color:var(--text2);">'+escHtml(m.notes||'')+'</td>';
    if(isAdmin){
      html+='<td><div class="p-tbl-actions">'
        +'<button class="p-btn p-btn-ghost p-btn-sm" onclick="pEditProvince(\''+escHtml(m.province)+'\')">Edit</button>'
        +'</div></td>';
    }
    html+='</tr>';
  });
  html+='</tbody></table></div>';

  /* Log Cita button (for CMs) */
  if(!isAdmin){
    html+='<div style="margin-top:14px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">'
      +'<select id="cita-province" class="p-input" style="max-width:200px;"><option value="">Select province…</option>';
    SPAIN_PROVINCES.forEach(function(p){html+='<option value="'+p+'">'+p+'</option>';});
    html+='</select>'
      +'<input type="date" id="cita-date" class="p-input" style="max-width:160px;">'
      +'<button class="p-btn p-btn-primary p-btn-sm" onclick="pLogCitaFound()">📍 Log Cita Found</button>'
      +'</div>';
  }

  setHTML(containerId,html);
}

/* Nearby province mapping for reroute suggestions */
function pGetNearbyProvinces(province){
  var nearby={
    'Madrid':['Guadalajara','Toledo','Segovia','Ávila'],
    'Barcelona':['Girona','Tarragona','Lleida'],
    'Valencia':['Castellón','Alicante','Murcia'],
    'Sevilla':['Cádiz','Huelva','Córdoba'],
    'Málaga':['Granada','Cádiz','Córdoba'],
    'Alicante':['Murcia','Valencia','Albacete'],
    'Bilbao':['San Sebastián','Santander','Vitoria'],
    'Palma de Mallorca':[] /* Island — no reroute */
  };
  return nearby[province]||[];
}

function pLogCitaFound(){
  var province=(document.getElementById('cita-province')||{}).value;
  var date=(document.getElementById('cita-date')||{}).value;
  if(!province){showToast('Select a province');return;}
  if(!date){showToast('Select the appointment date');return;}

  var metrics=pGetProvinceMetrics();
  var now=new Date();
  var apptDate=new Date(date);
  var waitDays=Math.max(0,Math.floor((apptDate-now)/(1000*60*60*24)));

  var existing=metrics.find(function(m){return m.province===province;});
  if(existing){
    /* Rolling average */
    existing.avg_wait_days=Math.round((existing.avg_wait_days+waitDays)/2);
    existing.last_slot_found=now.toISOString();
    /* Auto-update difficulty based on wait */
    existing.difficulty=waitDays<=14?'Easy':waitDays<=40?'Moderate':'Critical';
    metrics=metrics.map(function(m){return m.province===province?existing:m;});
  } else {
    metrics.push({
      province:province,
      avg_wait_days:waitDays,
      last_slot_found:now.toISOString(),
      difficulty:waitDays<=14?'Easy':waitDays<=40?'Moderate':'Critical',
      notes:'First logged by '+pUser.first+' '+pUser.last
    });
  }
  pSaveProvinceMetrics(metrics);
  /* Re-render whichever panel is showing the heatmap */
  var cmEl=document.getElementById('cm-province-heatmap');
  if(cmEl) pRenderProvinceHeatmap('cm-province-heatmap',false);
  var adEl=document.getElementById('ad-province-heatmap');
  if(adEl) pRenderProvinceHeatmap('ad-province-heatmap',true);
  showToast('✓ Cita logged: '+province+' — '+waitDays+' day wait');
}

function pEditProvince(province){
  var metrics=pGetProvinceMetrics();
  var m=metrics.find(function(x){return x.province===province;});
  if(!m)return;
  var overlay=document.getElementById('pModalOverlay');var body=document.getElementById('pModalBody');var title=document.getElementById('pModalTitle');
  if(!overlay||!body||!title)return;
  overlay.classList.add('open');
  title.textContent='Edit Province: '+province;
  body.innerHTML='<div class="p-field"><label>Average Wait (days)</label><input type="number" id="pm-prov-wait" class="p-input" value="'+m.avg_wait_days+'"></div>'
    +'<div class="p-field"><label>Difficulty Rating</label><select id="pm-prov-diff" class="p-input">';
  DIFFICULTY_RATINGS.forEach(function(d){body.innerHTML;});
  /* rebuild properly */
  var h='<div class="p-field"><label>Average Wait (days)</label><input type="number" id="pm-prov-wait" class="p-input" value="'+m.avg_wait_days+'"></div>'
    +'<div class="p-field"><label>Difficulty Rating</label><select id="pm-prov-diff" class="p-input">';
  DIFFICULTY_RATINGS.forEach(function(d){h+='<option value="'+d+'"'+(m.difficulty===d?' selected':'')+'>'+d+'</option>';});
  h+='</select></div>'
    +'<div class="p-field"><label>Notes</label><textarea id="pm-prov-notes" class="p-input" rows="3">'+escHtml(m.notes||'')+'</textarea></div>'
    +'<button class="p-btn p-btn-primary" style="width:100%;justify-content:center;margin-top:10px;" onclick="pSaveProvinceEdit(\''+escHtml(province)+'\')">Save Changes</button>';
  body.innerHTML=h;
}

function pSaveProvinceEdit(province){
  var wait=parseInt((document.getElementById('pm-prov-wait')||{}).value)||0;
  var diff=(document.getElementById('pm-prov-diff')||{}).value||'Moderate';
  var notes=((document.getElementById('pm-prov-notes')||{}).value||'').trim();
  var metrics=pGetProvinceMetrics();
  metrics=metrics.map(function(m){
    if(m.province===province){m.avg_wait_days=wait;m.difficulty=diff;m.notes=notes;}
    return m;
  });
  pSaveProvinceMetrics(metrics);
  pCloseModal();
  pRenderProvinceHeatmap('ad-province-heatmap',true);
  showToast('✓ Province updated');
}

/* ══════════════════════════════════════════
   SYSTEM STATUS BANNER (Regularisation Surge)
══════════════════════════════════════════ */

function pRenderSystemStatusBanner(containerId,isAdmin){
  var status=pGetSystemStatus();
  var isNormal=status==='Normal';
  var isCritical=status.indexOf('Critical')!==-1||status.indexOf('High')!==-1;
  var bannerCls=isNormal?'status-normal':isCritical?'status-critical':'status-moderate';

  var html='<div class="system-status-banner '+bannerCls+'">';
  html+='<div class="system-status-icon">'+(isNormal?'🟢':isCritical?'🔴':'🟡')+'</div>';
  html+='<div class="system-status-body">'
    +'<div class="system-status-title">Cita Previa System Status: '+escHtml(status)+'</div>';
  if(isCritical){
    html+='<div class="system-status-detail">⚠ Spain\'s 2026 Regularisation Programme (500,000 applicants) is causing severe delays across all provinces. Plan for extended processing times and consider alternative provinces.</div>';
  } else if(!isNormal){
    html+='<div class="system-status-detail">Moderate delays across major cities. Monitor province metrics for optimal booking windows.</div>';
  } else {
    html+='<div class="system-status-detail">All systems operating normally. Standard processing times apply.</div>';
  }
  html+='</div>';

  if(isAdmin){
    html+='<div class="system-status-controls">'
      +'<select id="system-status-select" class="p-input" style="min-width:180px;" onchange="pUpdateSystemStatus(this.value)">';
    SYSTEM_STATUS_OPTIONS.forEach(function(opt){
      html+='<option value="'+opt+'"'+(status===opt?' selected':'')+'>'+opt+'</option>';
    });
    html+='</select></div>';
  }
  html+='</div>';

  setHTML(containerId,html);
}

function pUpdateSystemStatus(newStatus){
  pSaveSystemStatus(newStatus);
  /* Re-render all status banners */
  var adEl=document.getElementById('ad-system-status');
  if(adEl) pRenderSystemStatusBanner('ad-system-status',true);
  var cmEl=document.getElementById('cm-system-status');
  if(cmEl) pRenderSystemStatusBanner('cm-system-status',false);
  showToast('✓ System status updated to: '+newStatus);
}

/* ══════════════════════════════════════════
   EX-17 AUTO-FILL (TIE Application Form)
══════════════════════════════════════════ */

function pCMRenderEX17(app){
  var user=pGetUsers().find(function(u){return u.id===app.userId;})||{first:'Unknown',last:''};
  var profile=pGetProfile(app.userId)||{};
  var isInitial=profile.is_initial_application!==false;

  var html='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">'
    +'<div><div style="font-size:15px;font-weight:700;">EX-17 Auto-Fill</div>'
    +'<div style="font-size:12px;color:var(--text3);">Solicitud de Tarjeta de Identidad de Extranjero (TIE)</div></div>'
    +'<div style="display:flex;gap:8px;">'
    +'<button class="p-btn p-btn-primary p-btn-sm" onclick="pPrintEX17(\''+app.id+'\')">🖨️ Print (×2 copies)</button>'
    +'</div></div>';

  html+='<div class="ex17-form">';

  /* Section 1: Datos del Extranjero */
  html+='<div class="ex17-section">'
    +'<div class="ex17-section-title">Sección 1 — Datos del Extranjero</div>'
    +'<div class="ex17-grid">'
    +pEX17Field('PASAPORTE',profile.passport_number||'','f1_1',!!profile.passport_number)
    +pEX17Field('NIE',profile.nie_number||'(Pending)','f1_2',!!profile.nie_number)
    +pEX17Field('APELLIDOS',user.last||'','f1_3',!!user.last)
    +pEX17Field('NOMBRE',user.first||'','f1_4',!!user.first)
    +pEX17Field('FECHA NACIMIENTO',profile.birth_date||'','f1_5',!!profile.birth_date)
    +pEX17Field('NACIONALIDAD',(profile.nationality||'').toUpperCase(),'f1_6',!!profile.nationality)
    +pEX17Field('SEXO',profile.sex||'','f1_7',!!profile.sex)
    +pEX17Field('ESTADO CIVIL',profile.marital_status||'','f1_8',!!profile.marital_status)
    +pEX17Field('NOMBRE DEL PADRE',profile.father_name||'','f1_9',!!profile.father_name)
    +pEX17Field('NOMBRE DE LA MADRE',profile.mother_name||'','f1_10',!!profile.mother_name)
    +'</div></div>';

  /* Section 2: Domicilio en España */
  html+='<div class="ex17-section">'
    +'<div class="ex17-section-title">Sección 2 — Domicilio en España</div>'
    +'<div class="ex17-grid">'
    +pEX17Field('DIRECCIÓN',profile.address||'','f2_1',!!profile.address)
    +pEX17Field('LOCALIDAD',profile.city||'','f2_2',!!profile.city)
    +pEX17Field('PROVINCIA',profile.province||'','f2_3',!!profile.province)
    +pEX17Field('CÓDIGO POSTAL',profile.postal_code||'','f2_4',!!profile.postal_code)
    +pEX17Field('TELÉFONO',user.phone||'','f2_5',!!user.phone)
    +pEX17Field('EMAIL',user.email||'','f2_6',!!user.email)
    +'</div></div>';

  /* Section 4: Datos Relativos a la Solicitud */
  html+='<div class="ex17-section">'
    +'<div class="ex17-section-title">Sección 4 — Datos Relativos a la Solicitud</div>'
    +'<div class="ex17-checkboxes">'
    +'<label class="ex17-check'+(isInitial?' checked':'')+'"><span class="ex17-check-box">'+(isInitial?'☑':'☐')+'</span> TARJETA INICIAL (Primera concesión)</label>'
    +'<label class="ex17-check'+(!isInitial?' checked':'')+'"><span class="ex17-check-box">'+(!isInitial?'☑':'☐')+'</span> RENOVACIÓN</label>'
    +'</div>'
    +'<div class="ex17-checkboxes" style="margin-top:8px;">'
    +'<label class="ex17-check checked"><span class="ex17-check-box">☑</span> Residencia con autorización de trabajo por cuenta ajena/propia</label>'
    +'</div></div>';

  /* Completeness check */
  var fields=[profile.passport_number,user.last,user.first,profile.birth_date,profile.nationality,profile.address,profile.city,profile.province,profile.postal_code,user.email];
  var filled=fields.filter(function(f){return f&&f.toString().trim()!=='';}).length;
  var total=fields.length;
  var pct=Math.round(filled/total*100);

  html+='<div class="ex17-completeness">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">'
    +'<span style="font-size:12px;font-weight:700;">Form Completeness</span>'
    +'<span style="font-size:12px;font-weight:800;color:'+(pct===100?'#16a34a':'#d97706')+';">'+pct+'% ('+filled+'/'+total+')</span></div>'
    +'<div class="fin-health-bar"><div class="fin-health-fill '+(pct===100?'sufficient':'close')+'" style="width:'+pct+'%;"></div></div>';
  if(pct<100){
    html+='<div style="font-size:11px;color:#d97706;margin-top:4px;">⚠ Missing fields — update client profile to auto-fill remaining.</div>';
  }
  html+='</div>';

  html+='</div>';
  return html;
}

function pEX17Field(label,value,fieldId,isFilled){
  return '<div class="ex17-field">'
    +'<div class="ex17-field-label">'+label+' <span style="color:var(--text3);font-size:9px;">['+fieldId+']</span></div>'
    +'<div class="ex17-field-value'+(isFilled?'':' empty')+'">'+escHtml(value||'—')+'</div>'
    +'</div>';
}

function pPrintEX17(appId){
  var app=pGetApps().find(function(a){return a.id===appId;});if(!app)return;
  var user=pGetUsers().find(function(u){return u.id===app.userId;})||{first:'Unknown',last:''};
  var profile=pGetProfile(app.userId)||{};
  var isInitial=profile.is_initial_application!==false;

  var printHtml='<!DOCTYPE html><html><head><title>EX-17 — '+escHtml(user.first+' '+user.last)+'</title>'
    +'<style>'
    +'body{font-family:Arial,sans-serif;font-size:12px;margin:20px;color:#000;}'
    +'h1{font-size:16px;text-align:center;margin-bottom:4px;}'
    +'h2{font-size:11px;text-align:center;color:#666;margin-bottom:20px;}'
    +'.section{margin-bottom:16px;border:1px solid #ccc;padding:12px;}'
    +'.section-title{font-size:13px;font-weight:bold;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:8px;}'
    +'.field-row{display:flex;gap:12px;margin-bottom:6px;}'
    +'.field{flex:1;}'
    +'.field-label{font-size:9px;text-transform:uppercase;color:#666;}'
    +'.field-value{border-bottom:1px solid #000;padding:2px 0;min-height:16px;font-weight:bold;}'
    +'.checkbox{margin:4px 0;font-size:11px;}'
    +'.copy-note{text-align:center;font-size:10px;color:#999;margin-top:20px;page-break-after:always;}'
    +'@media print{.no-print{display:none;}}'
    +'</style></head><body>';

  /* Generate 2 copies */
  for(var copy=1;copy<=2;copy++){
    printHtml+='<h1>SOLICITUD DE TARJETA DE IDENTIDAD DE EXTRANJERO (EX-17)</h1>'
      +'<h2>Modelo oficial — Copia '+(copy===1?'para la Administración':'para el interesado')+'</h2>';

    printHtml+='<div class="section"><div class="section-title">1. DATOS DEL EXTRANJERO</div>'
      +'<div class="field-row"><div class="field"><div class="field-label">Nº PASAPORTE</div><div class="field-value">'+escHtml(profile.passport_number||'')+'</div></div>'
      +'<div class="field"><div class="field-label">N.I.E.</div><div class="field-value">'+escHtml(profile.nie_number||'')+'</div></div></div>'
      +'<div class="field-row"><div class="field"><div class="field-label">APELLIDOS</div><div class="field-value">'+escHtml(user.last||'')+'</div></div>'
      +'<div class="field"><div class="field-label">NOMBRE</div><div class="field-value">'+escHtml(user.first||'')+'</div></div></div>'
      +'<div class="field-row"><div class="field"><div class="field-label">FECHA NACIMIENTO</div><div class="field-value">'+escHtml(profile.birth_date||'')+'</div></div>'
      +'<div class="field"><div class="field-label">NACIONALIDAD</div><div class="field-value">'+escHtml((profile.nationality||'').toUpperCase())+'</div></div>'
      +'<div class="field"><div class="field-label">SEXO</div><div class="field-value">'+escHtml(profile.sex||'')+'</div></div></div>'
      +'<div class="field-row"><div class="field"><div class="field-label">ESTADO CIVIL</div><div class="field-value">'+escHtml(profile.marital_status||'')+'</div></div>'
      +'<div class="field"><div class="field-label">NOMBRE DEL PADRE</div><div class="field-value">'+escHtml(profile.father_name||'')+'</div></div>'
      +'<div class="field"><div class="field-label">NOMBRE DE LA MADRE</div><div class="field-value">'+escHtml(profile.mother_name||'')+'</div></div></div>'
      +'</div>';

    printHtml+='<div class="section"><div class="section-title">2. DOMICILIO EN ESPAÑA</div>'
      +'<div class="field-row"><div class="field" style="flex:2;"><div class="field-label">DIRECCIÓN</div><div class="field-value">'+escHtml(profile.address||'')+'</div></div>'
      +'<div class="field"><div class="field-label">LOCALIDAD</div><div class="field-value">'+escHtml(profile.city||'')+'</div></div></div>'
      +'<div class="field-row"><div class="field"><div class="field-label">PROVINCIA</div><div class="field-value">'+escHtml(profile.province||'')+'</div></div>'
      +'<div class="field"><div class="field-label">C.P.</div><div class="field-value">'+escHtml(profile.postal_code||'')+'</div></div>'
      +'<div class="field"><div class="field-label">TELÉFONO</div><div class="field-value">'+escHtml(user.phone||'')+'</div></div></div>'
      +'</div>';

    printHtml+='<div class="section"><div class="section-title">4. DATOS RELATIVOS A LA SOLICITUD</div>'
      +'<div class="checkbox">['+(isInitial?'X':' ')+'] TARJETA DE IDENTIDAD DE EXTRANJERO QUE DOCUMENTA LA PRIMERA CONCESIÓN</div>'
      +'<div class="checkbox">['+(!isInitial?'X':' ')+'] RENOVACIÓN DE TARJETA DE IDENTIDAD DE EXTRANJERO</div>'
      +'<div class="checkbox" style="margin-top:8px;">[X] Residencia con autorización de trabajo por cuenta ajena/propia</div>'
      +'</div>';

    printHtml+='<div style="margin-top:30px;display:flex;justify-content:space-between;">'
      +'<div style="border-top:1px solid #000;width:200px;text-align:center;padding-top:4px;font-size:10px;">Firma del solicitante</div>'
      +'<div style="text-align:center;font-size:10px;">Fecha: ____/____/________</div>'
      +'</div>';

    if(copy===1) printHtml+='<div class="copy-note">— Copia 1 de 2 (Administración) — Cortar aquí ✂ —</div>';
  }

  printHtml+='<div class="copy-note" style="page-break-after:auto;">— Copia 2 de 2 (Interesado) —</div>';
  printHtml+='</body></html>';

  var printWindow=window.open('','_blank','width=800,height=1000');
  if(printWindow){
    printWindow.document.write(printHtml);
    printWindow.document.close();
    setTimeout(function(){printWindow.print();},500);
  }
  showToast('✓ EX-17 generated with 2 copies for '+user.first+' '+user.last);
}

/* ── SEED ── */
function pSeedData(){
  if(localStorage.getItem('ns_pu_seeded')) return;
  var users=[
    {id:'u_admin',email:'ahmed@ahmed.com',pass:'ahmed@ahmed.com',role:'admin',first:'Ahmed',last:'Al-Admin',phone:'',created:'2024-01-01T00:00:00Z'},
    {id:'u_cm1',email:'sarah@nomadspain.io',pass:'cm1234',role:'case_manager',first:'Sarah',last:'Gonzalez',phone:'+34 600 111 222',created:'2024-01-05T00:00:00Z',maxCapacity:20},
    {id:'u_c1',email:'john@example.com',pass:'demo1234',role:'customer',first:'John',last:'Carter',phone:'+44 7700 900001',cmId:'u_cm1',created:'2024-02-01T00:00:00Z'},
    {id:'u_c2',email:'maria@example.com',pass:'demo1234',role:'customer',first:'Maria',last:'Santos',phone:'+1 555 000 1234',cmId:'u_cm1',created:'2024-02-15T00:00:00Z'}
  ];
  var apps=[
    {id:'app1',userId:'u_c1',pkg:'solo',stage:2,status:'in_progress',app_status:'document_prep',cmId:'u_cm1',created:'2024-02-02T00:00:00Z',updated:'2024-03-10T00:00:00Z',
     family_members_count:0,total_required_income:2849,
     docs:{passport:'uploaded',income:'uploaded',criminal:'pending',degree:'missing',insurance:'missing',other:'missing'},
     requiredDocs:['passport','income','criminal','degree','insurance','other'],
     docExpiries:{passport:'2026-08-15T00:00:00Z',criminal:'2026-04-20T00:00:00Z'},
     notes:'Priority client. Passport apostille pending.',
     stageDates:{0:'2024-02-02T10:30:00Z',1:'2024-02-20T14:15:00Z',2:'2024-03-10T00:00:00Z'},
     statusHistory:[{status:'lead',at:'2024-02-02T10:30:00Z'},{status:'payment_pending',at:'2024-02-03T00:00:00Z'},{status:'document_prep',at:'2024-02-20T14:15:00Z'}],
     last_activity:'2024-03-10T00:00:00Z'},
    {id:'app2',userId:'u_c2',pkg:'family',stage:0,status:'new',app_status:'lead',cmId:'u_cm1',created:'2024-02-16T00:00:00Z',updated:'2024-02-16T00:00:00Z',
     family_members_count:2,total_required_income:3561.63,
     docs:{passport:'missing',income:'missing',criminal:'missing',degree:'missing',insurance:'missing',other:'missing'},
     requiredDocs:['passport','income','criminal','degree','insurance','other'],
     docExpiries:{},
     notes:'Initial consultation booked. Family of 3.',
     stageDates:{0:'2024-02-16T09:00:00Z'},
     statusHistory:[{status:'lead',at:'2024-02-16T09:00:00Z'}],
     last_activity:'2024-02-16T00:00:00Z'}
  ];
  var msgs=[
    {id:'m1',fromId:'u_c1',toId:'u_cm1',appId:'app1',body:'Hi Sarah, I\'ve uploaded my passport. Can you confirm you received it?',ts:'2024-03-10T09:00:00Z',read:true},
    {id:'m2',fromId:'u_cm1',toId:'u_c1',appId:'app1',body:'Hi John! Yes, I can see your passport scan. It looks great. Still waiting on the criminal record certificate.',ts:'2024-03-10T09:30:00Z',read:true},
    {id:'m3',fromId:'u_c1',toId:'u_cm1',appId:'app1',body:'I\'ll get the criminal record apostilled this week.',ts:'2024-03-10T10:00:00Z',read:false}
  ];
  var pays=[
    {id:'pay1',userId:'u_c1',appId:'app1',amount:2500,type:'payment',status:'paid',date:'2024-02-05T00:00:00Z',desc:'Nomad Solo — Full payment',referral_source:'organic',coupon_code:'',coupon_discount:0},
    {id:'pay2',userId:'u_c2',appId:'app2',amount:30,type:'payment',status:'paid',date:'2024-02-16T00:00:00Z',desc:'360\u00b0 Strategy Session',referral_source:'referral',coupon_code:'WELCOME30',coupon_discount:30}
  ];
  var promos=[
    {id:'pr1',code:'NOMAD5',discount:5,type:'percent',active:true,uses:12,max:100},
    {id:'pr2',code:'WELCOME30',discount:30,type:'fixed',active:true,uses:3,max:50}
  ];
  var tpls=[
    {id:'tpl1',visaType:'Digital Nomad Visa',docs:[
      {name:'Passport',required:true,desc:'Clear scan of all pages + biometric page'},
      {name:'Proof of Income',required:true,desc:'Last 3 months bank statements + client contracts'},
      {name:'Criminal Record Certificate',required:true,desc:'National police clearance, apostilled'},
      {name:'Degree or Work Experience',required:true,desc:'University diploma or equivalent CV'},
      {name:'Health Insurance',required:true,desc:'Full coverage in Spain (min 12 months)'},
      {name:'Other Documents',required:false,desc:'Any additional supporting materials'}
    ]},
    {id:'tpl2',visaType:'Non-Lucrative Visa (NLV)',docs:[
      {name:'Passport',required:true,desc:'Valid for 12+ months'},
      {name:'Proof of Funds',required:true,desc:'\u20AC28,000+ in bank account'},
      {name:'Health Insurance',required:true,desc:'Comprehensive Spanish coverage'},
      {name:'Criminal Record Certificate',required:true,desc:'Apostilled, within 3 months'}
    ]}
  ];
  /* Profiles table (mirrors SQL profiles) */
  var profiles={
    'u_c1':{user_id:'u_c1',full_name:'John Carter',nationality:'gb',current_residency:'United Kingdom',monthly_income:4200,has_degree:true,years_experience:6,passport_expiry:'2027-08-15',
      passport_number:'GB1234567',nie_number:'Y1234567X',birth_date:'1990-05-14',sex:'M',marital_status:'Single',
      father_name:'Robert Carter',mother_name:'Elizabeth Carter',
      address:'Calle Gran Vía 45, 3A',city:'Madrid',province:'Madrid',postal_code:'28013',
      is_initial_application:true,preferred_province:'Madrid'},
    'u_c2':{user_id:'u_c2',full_name:'Maria Santos',nationality:'br',current_residency:'Brazil',monthly_income:3100,has_degree:false,years_experience:4,passport_expiry:'2028-03-22',
      passport_number:'BR9876543',nie_number:'',birth_date:'1988-11-22',sex:'F',marital_status:'Married',
      father_name:'Carlos Santos',mother_name:'Ana Santos',
      address:'Avda Diagonal 200, 5B',city:'Barcelona',province:'Barcelona',postal_code:'08018',
      is_initial_application:true,preferred_province:'Barcelona'}
  };
  /* Documents table (normalised — mirrors SQL documents) */
  var documents=[
    {id:'doc1',application_id:'app1',name:'Passport',file_url:null,status:'uploaded',expiry_date:'2026-08-15',internal_notes:'Biometric page clear.',ocr_confidence:92,is_apostilled:false,is_translated:false,rejection_reason:null},
    {id:'doc2',application_id:'app1',name:'Proof of Income',file_url:null,status:'uploaded',expiry_date:null,internal_notes:'3 months bank statements received.',ocr_confidence:85,is_apostilled:false,is_translated:false,rejection_reason:null},
    {id:'doc3',application_id:'app1',name:'Criminal Record Certificate',file_url:null,status:'missing',expiry_date:'2026-04-20',internal_notes:'Needs apostille.',ocr_confidence:0,is_apostilled:false,is_translated:false,rejection_reason:null},
    {id:'doc4',application_id:'app1',name:'Health Insurance',file_url:null,status:'missing',expiry_date:null,internal_notes:'',ocr_confidence:0,is_apostilled:false,is_translated:false,rejection_reason:null},
    {id:'doc5',application_id:'app1',name:'Degree',file_url:null,status:'missing',expiry_date:null,internal_notes:'',ocr_confidence:0,is_apostilled:false,is_translated:false,rejection_reason:null},
    {id:'doc6',application_id:'app2',name:'Passport',file_url:null,status:'missing',expiry_date:null,internal_notes:'',ocr_confidence:0,is_apostilled:false,is_translated:false,rejection_reason:null}
  ];
  /* Appointments table */
  var appointments=[
    {id:'appt1',application_id:'app1',type:'digital_cert',datetime:'2026-04-15T10:00:00',location:'Madrid Police HQ',status:'scheduled',created:'2024-03-10T00:00:00Z'},
    {id:'appt2',application_id:'app1',type:'submission',datetime:'2026-05-01T09:30:00',location:'Spanish Embassy, London',status:'scheduled',created:'2024-03-10T00:00:00Z'}
  ];
  /* Province metrics (crowdsourced wait-time data) */
  var provinceMetrics=[
    {province:'Madrid',avg_wait_days:72,last_slot_found:'2026-04-01T14:30:00Z',difficulty:'Critical',notes:'Regularisation surge — extremely limited slots. Consider Guadalajara or Toledo.'},
    {province:'Barcelona',avg_wait_days:58,last_slot_found:'2026-04-03T09:15:00Z',difficulty:'Critical',notes:'High demand. Girona has better availability (1hr by train).'},
    {province:'Valencia',avg_wait_days:34,last_slot_found:'2026-04-05T11:00:00Z',difficulty:'Moderate',notes:'Improving but still congested for TIE renewals.'},
    {province:'Sevilla',avg_wait_days:21,last_slot_found:'2026-04-06T16:45:00Z',difficulty:'Moderate',notes:'Good availability for initial applications.'},
    {province:'Málaga',avg_wait_days:42,last_slot_found:'2026-04-02T10:00:00Z',difficulty:'Moderate',notes:'Tourist season creating backlog.'},
    {province:'Guadalajara',avg_wait_days:8,last_slot_found:'2026-04-07T08:00:00Z',difficulty:'Easy',notes:'Fastest in central Spain. Only 45min from Madrid by AVE.'},
    {province:'Girona',avg_wait_days:12,last_slot_found:'2026-04-06T13:20:00Z',difficulty:'Easy',notes:'Alternative to Barcelona. 38min by AVE.'},
    {province:'Bilbao',avg_wait_days:18,last_slot_found:'2026-04-04T15:00:00Z',difficulty:'Easy',notes:'Low demand, efficient processing.'},
    {province:'Zaragoza',avg_wait_days:15,last_slot_found:'2026-04-05T09:30:00Z',difficulty:'Easy',notes:'Good mid-point option.'},
    {province:'Granada',avg_wait_days:28,last_slot_found:'2026-04-03T12:00:00Z',difficulty:'Moderate',notes:'University city — seasonal fluctuations.'},
    {province:'Alicante',avg_wait_days:38,last_slot_found:'2026-04-01T10:00:00Z',difficulty:'Moderate',notes:'Large expat community causing demand.'},
    {province:'Murcia',avg_wait_days:14,last_slot_found:'2026-04-06T08:45:00Z',difficulty:'Easy',notes:'Under-utilised. Good alternative to Alicante.'},
    {province:'Palma de Mallorca',avg_wait_days:45,last_slot_found:'2026-03-28T11:30:00Z',difficulty:'Critical',notes:'Island logistics — limited slots, hard to reroute.'},
    {province:'Las Palmas',avg_wait_days:30,last_slot_found:'2026-04-02T14:00:00Z',difficulty:'Moderate',notes:'Canary Islands — improving.'},
    {province:'A Coruña',avg_wait_days:10,last_slot_found:'2026-04-07T09:00:00Z',difficulty:'Easy',notes:'Very fast processing in Galicia.'}
  ];
  pSaveUsers(users);pSaveApps(apps);pSaveMsgs(msgs);pSavePays(pays);pSavePromos(promos);pSaveTemplates(tpls);
  pSaveProfiles(profiles);pSaveDocuments(documents);pSaveAppointments(appointments);pSaveProvinceMetrics(provinceMetrics);
  pSaveSystemStatus('High Congestion');
  localStorage.setItem('ns_pu_seeded','1');
}

/* ── INIT & AUTH ── */
function pMigrateStageDates(){
  var apps=pGetApps();var changed=false;
  apps=apps.map(function(a){
    if(!a.stageDates){
      a.stageDates={};
      // backfill: assume each completed stage was done at app.updated
      for(var i=0;i<a.stage;i++) a.stageDates[i]=a.updated||a.created;
      if(a.stage===0) a.stageDates[0]=a.created;
      changed=true;
    }
    return a;
  });
  if(changed) pSaveApps(apps);
}
function pMigrateNewFields(){
  var apps=pGetApps();var changed=false;
  apps=apps.map(function(a){
    if(!a.requiredDocs){a.requiredDocs=['passport','income','criminal','degree','insurance','other'];changed=true;}
    if(!a.docExpiries){a.docExpiries={};changed=true;}
    if(!a.last_activity){a.last_activity=a.updated||a.created;changed=true;}
    if(a.family_members_count===undefined){a.family_members_count=a.deps||0;changed=true;}
    if(!a.total_required_income){a.total_required_income=calcIncomeThreshold(a.family_members_count||0);changed=true;}
    if(!a.app_status){
      /* Derive app_status from stage */
      a.app_status=a.stage>=5?APP_STATUS_ENUM.APPROVED:a.stage>=3?APP_STATUS_ENUM.SUBMITTED:a.stage>=1?APP_STATUS_ENUM.DOCUMENT_PREP:APP_STATUS_ENUM.LEAD;
      changed=true;
    }
    if(!a.statusHistory){
      a.statusHistory=[{status:APP_STATUS_ENUM.LEAD,at:a.created}];
      var pays=pGetPays();
      if(pays.some(function(p){return p.appId===a.id&&p.status==='paid';})){
        a.statusHistory.push({status:APP_STATUS_ENUM.PAYMENT_PENDING,at:a.created});
        a.statusHistory.push({status:APP_STATUS_ENUM.DOCUMENT_PREP,at:a.stageDates&&a.stageDates[1]?a.stageDates[1]:a.updated});
      }
      if(a.stage>=3)a.statusHistory.push({status:APP_STATUS_ENUM.SUBMITTED,at:a.stageDates&&a.stageDates[3]?a.stageDates[3]:a.updated});
      if(a.stage>=5)a.statusHistory.push({status:APP_STATUS_ENUM.APPROVED,at:a.stageDates&&a.stageDates[5]?a.stageDates[5]:a.updated});
      changed=true;
    }
    return a;
  });
  if(changed)pSaveApps(apps);
  /* Migrate payments */
  var pays=pGetPays();var pc=false;
  pays=pays.map(function(p){
    if(!p.referral_source){p.referral_source='organic';pc=true;}
    if(p.coupon_code===undefined){p.coupon_code='';p.coupon_discount=0;pc=true;}
    if(!p.stripe_session_id){p.stripe_session_id='';pc=true;}
    return p;
  });
  if(pc)pSavePays(pays);
  /* Migrate CM maxCapacity */
  var users=pGetUsers();var uc=false;
  users=users.map(function(u){
    if(u.role==='case_manager'&&!u.maxCapacity){u.maxCapacity=CM_MAX_CAPACITY;uc=true;}
    return u;
  });
  if(uc)pSaveUsers(users);
  /* Ensure normalised documents exist */
  var docs=pGetDocuments();
  if(docs.length===0){
    apps.forEach(function(a){
      (a.requiredDocs||[]).forEach(function(docKey){
        var docStatus=(a.docs||{})[docKey]||'missing';
        docs.push({id:'doc_mig_'+a.id+'_'+docKey,application_id:a.id,name:docKey.replace(/_/g,' '),file_url:null,status:docStatus,expiry_date:(a.docExpiries||{})[docKey]||null,internal_notes:'',ocr_confidence:0,is_apostilled:false,is_translated:false,rejection_reason:null});
      });
    });
    if(docs.length>0)pSaveDocuments(docs);
  } else {
    /* Migrate existing docs to add new fields */
    var dc=false;
    docs=docs.map(function(d){
      if(d.ocr_confidence===undefined){d.ocr_confidence=0;dc=true;}
      if(d.is_apostilled===undefined){d.is_apostilled=false;dc=true;}
      if(d.is_translated===undefined){d.is_translated=false;dc=true;}
      if(d.rejection_reason===undefined){d.rejection_reason=null;dc=true;}
      return d;
    });
    if(dc)pSaveDocuments(docs);
  }
}
function renderPortalBg(){
  pSeedData();pMigrateStageDates();pMigrateNewFields();
  try{var s=localStorage.getItem('ns_portal_session');if(s){pUser=JSON.parse(s);pShowDashboard();return;}}catch(e){}
  pShowAuth();
}
function pShowAuth(){
  document.getElementById('pAuth').style.display='flex';
  document.querySelectorAll('.p-dash').forEach(function(d){d.classList.remove('active');});
  document.body.classList.remove('portal-active');
}
function pAuthTab(tab,el){
  document.querySelectorAll('.p-auth-tab').forEach(function(t){t.classList.remove('active');});
  if(el) el.classList.add('active');
  else document.querySelectorAll('.p-auth-tab').forEach(function(t,i){t.classList.toggle('active',(tab==='login'&&i===0)||(tab==='signup'&&i===1));});
  document.querySelectorAll('.p-auth-panel').forEach(function(p){p.classList.remove('active');});
  var panel=document.getElementById(tab==='login'?'pLoginPanel':'pSignupPanel');if(panel)panel.classList.add('active');
}
/* ══ PRELOADER ══ */
var PRELOADER_WORDS=['\u00a1Hola!','\u0645\u0631\u062d\u0628\u0627','Ciao','\u3084\u3042','Hall\u00e5','Hello','NomadSpain.io'];
function pShowPreloader(callback){
  var el=document.getElementById('preloader');
  var wordEl=document.getElementById('preloader-word');
  var pathEl=document.getElementById('preloader-path');
  if(!el||!wordEl)return callback();
  el.style.display='flex';el.classList.remove('exit');
  var w=window.innerWidth,h=window.innerHeight;
  var initPath='M0 0 L'+w+' 0 L'+w+' '+h+' Q'+(w/2)+' '+(h+300)+' 0 '+h+' L0 0';
  var exitPath='M0 0 L'+w+' 0 L'+w+' '+h+' Q'+(w/2)+' '+h+' 0 '+h+' L0 0';
  if(pathEl)pathEl.setAttribute('d',initPath);
  var idx=0;
  wordEl.textContent=PRELOADER_WORDS[0];
  function nextWord(){
    if(idx>=PRELOADER_WORDS.length-1){
      setTimeout(function(){
        if(pathEl)pathEl.setAttribute('d',exitPath);
        el.classList.add('exit');
        setTimeout(function(){
          el.style.display='none';el.classList.remove('exit');
          callback();
        },900);
      },800);
      return;
    }
    idx++;wordEl.textContent=PRELOADER_WORDS[idx];
    setTimeout(nextWord,idx===1?800:150);
  }
  setTimeout(nextWord,800);
}

function pDoLogin(){
  var email=(document.getElementById('pLoginEmail').value||'').trim().toLowerCase();
  var pass=document.getElementById('pLoginPass').value||'';
  if(!email||!pass){showToast('Please enter email and password');return;}
  var users=pGetUsers();
  var u=users.find(function(x){return x.email.toLowerCase()===email&&x.pass===pass;});
  if(!u){showToast('Invalid email or password');return;}
  pUser=u;localStorage.setItem('ns_portal_session',JSON.stringify(u));
  pShowPreloader(function(){pShowDashboard();showToast('\u2713 Welcome back, '+u.first+'!');});
}
function pDoSignup(){
  var first=(document.getElementById('pSFirst').value||'').trim();
  var last=(document.getElementById('pSLast').value||'').trim();
  var email=(document.getElementById('pSEmail').value||'').trim().toLowerCase();
  var pass=document.getElementById('pSPass').value||'';
  var pass2=document.getElementById('pSPass2').value||'';
  if(!first||!last||!email||!pass){showToast('Please fill in all fields');return;}
  if(pass!==pass2){showToast('Passwords do not match');return;}
  if(pass.length<8){showToast('Password must be at least 8 characters');return;}
  if(!/^[^@]+@[^@]+\.[^@]+$/.test(email)){showToast('Please enter a valid email');return;}
  var users=pGetUsers();
  /* Check if this email exists as a lead — upgrade instead of blocking */
  var existingLead=users.find(function(u){return u.email.toLowerCase()===email&&u.lead_status==='lead';});
  if(existingLead){
    /* Upgrade lead to full user */
    users=users.map(function(u){
      if(u.id===existingLead.id){u.first=first;u.last=last;u.pass=pass;u.lead_status=null;}
      return u;
    });
    pSaveUsers(users);
    var upgraded=users.find(function(u){return u.id===existingLead.id;});
    pUser=upgraded;localStorage.setItem('ns_portal_session',JSON.stringify(upgraded));
    /* Create profile */
    pSaveProfile(upgraded.id,{user_id:upgraded.id,full_name:first+' '+last,nationality:upgraded.nationality||'',current_residency:'',monthly_income:0,has_degree:false,years_experience:0,passport_expiry:null});
    pShowPreloader(function(){pShowDashboard();showToast('\u2713 Account created! Welcome, '+first+'!');});
    return;
  }
  if(users.find(function(u){return u.email.toLowerCase()===email;})){showToast('Email already registered');return;}
  var nu={id:'u'+Date.now(),email:email,pass:pass,role:'customer',first:first,last:last,phone:'',cmId:null,created:new Date().toISOString()};
  users.push(nu);pSaveUsers(users);
  /* Create empty profile — mirrors SQL profiles table */
  pSaveProfile(nu.id,{user_id:nu.id,full_name:first+' '+last,nationality:'',current_residency:'',monthly_income:0,has_degree:false,years_experience:0,passport_expiry:null});
  pUser=nu;localStorage.setItem('ns_portal_session',JSON.stringify(nu));
  pShowPreloader(function(){pShowDashboard();showToast('\u2713 Account created! Welcome, '+first+'!');});
}
function pLogout(){
  pUser=null;pActiveThread=null;pSelectedPkg=null;
  localStorage.removeItem('ns_portal_session');
  pShowAuth();showToast('You have been signed out.');
}
/* ── ROUTING ── */
function pShowDashboard(){
  if(!pUser) return;
  document.getElementById('pAuth').style.display='none';
  document.body.classList.add('portal-active');
  if(pUser.role==='admin'){
    document.querySelectorAll('.p-dash').forEach(function(d){d.classList.remove('active');});
    document.getElementById('pAdmin').classList.add('active');
    setText('ad-avatar',(pUser.first||'A')[0].toUpperCase());setText('ad-name',pUser.first+' '+pUser.last);
    pRenderAdmin();
  } else if(pUser.role==='case_manager'){
    document.querySelectorAll('.p-dash').forEach(function(d){d.classList.remove('active');});
    document.getElementById('pCM').classList.add('active');
    setText('cm-avatar',(pUser.first||'C')[0].toUpperCase());setText('cm-name',pUser.first+' '+pUser.last);
    setText('cm-email-top',pUser.email);
    pRenderCM();
  } else {
    document.querySelectorAll('.p-dash').forEach(function(d){d.classList.remove('active');});
    document.getElementById('pCustomer').classList.add('active');
    setText('cu-avatar',(pUser.first||'U')[0].toUpperCase());setText('cu-name',pUser.first+' '+pUser.last);
    setText('cu-email-top',pUser.email);setText('cu-greeting','Welcome back, '+pUser.first+' \uD83D\uDC4B');
    pRenderCustomer();
  }
}
function pNav(role,panel,el){
  var prefix=role==='admin'?'ad':role==='cm'?'cm':'cu';
  document.querySelectorAll('#p'+{admin:'Admin',cm:'CM',customer:'Customer'}[role==='admin'?'admin':role==='cm'?'cm':'customer']+' .p-nav-item').forEach(function(n){n.classList.remove('active');});
  if(el) el.classList.add('active');
  document.querySelectorAll('#p'+{admin:'Admin',cm:'CM',customer:'Customer'}[role==='admin'?'admin':role==='cm'?'cm':'customer']+' .p-panel').forEach(function(p){p.classList.remove('active');});
  var panelEl=document.getElementById(prefix+'-'+panel);if(panelEl)panelEl.classList.add('active');
  var titleEl=document.getElementById(prefix+'-topbar-title');
  if(titleEl) titleEl.textContent=panel.charAt(0).toUpperCase()+panel.slice(1).replace(/-/g,' ');
  /* lazy render */
  if(role==='admin'){
    if(panel==='analytics')pRenderAdAnalytics();
    else if(panel==='users')pRenderAdUsers();
    else if(panel==='cms')pRenderAdCMs();
    else if(panel==='applications')pRenderAdApps();
    else if(panel==='products')pRenderAdProducts();
    else if(panel==='financials')pRenderAdFinancials();
    else if(panel==='support')pRenderAdSupport();
    else if(panel==='compliance')pRenderAdCompliance();
    else if(panel==='provinces')pRenderAdProvinces();
  } else if(role==='cm'){
    if(panel==='worklist')pRenderCMWorklist();
    else if(panel==='applications')pRenderCMApps();
    else if(panel==='support')pRenderCMSupport();
    else if(panel==='settings')pLoadCMSettings();
    else if(panel==='provinces')pRenderCMProvinces();
  } else {
    var LOCKED=['status','documents','support','finance'];
    if(LOCKED.indexOf(panel)!==-1&&!pHasPaidApp()){
      // revert nav active to marketplace and fix topbar title
      document.querySelectorAll('#pCustomer .p-nav-item').forEach(function(n){n.classList.remove('active');});
      var mktNav=document.querySelector('#pCustomer .p-nav-item[onclick*="marketplace"]');if(mktNav)mktNav.classList.add('active');
      document.querySelectorAll('#pCustomer .p-panel').forEach(function(p){p.classList.remove('active');});
      var mktPanel=document.getElementById('cu-marketplace');if(mktPanel)mktPanel.classList.add('active');
      if(titleEl)titleEl.textContent='Marketplace';
      showToast('🔒 Complete your purchase to unlock this feature');
      return;
    }
    if(panel==='overview')pRenderCuOverview();
    else if(panel==='status')pRenderCuStatus();
    else if(panel==='documents')pRenderCuDocuments();
    else if(panel==='support')pRenderCuSupport();
    else if(panel==='finance')pRenderCuFinance();
    else if(panel==='hub')pRenderCuHub();
    else if(panel==='settings')pLoadCuSettings();
  }
}
function setText(id,v){var e=document.getElementById(id);if(e)e.textContent=v;}
function setHTML(id,v){var e=document.getElementById(id);if(e)e.innerHTML=v;}

/* ══ CUSTOMER RENDERS ══ */
function pRenderCustomer(){
  pRenderCuOverview();pRenderCuDocuments();pLoadCuSettings();
  // show/hide lock icons
  var locked=['status','documents','support','finance'];
  var paid=pHasPaidApp();
  locked.forEach(function(p){
    var el=document.getElementById('cu-lock-'+p);
    if(el)el.style.display=paid?'none':'inline';
  });
  // ensure settings panel is hidden on load (only hub default or overview)
  var settingsPanel=document.getElementById('cu-settings');
  if(settingsPanel)settingsPanel.classList.remove('active');
}
function pGetMyApp(){
  var apps=pGetApps();
  return apps.find(function(a){return a.userId===pUser.id;})||null;
}
function pRenderCuOverview(){
  var app=pGetMyApp();
  var apps=pGetApps().filter(function(a){return a.userId===pUser.id;});
  var pays=pGetPays().filter(function(p){return p.userId===pUser.id&&p.status==='paid';});
  var msgs=pGetMsgs().filter(function(m){return m.toId===pUser.id&&!m.read;});
  var uploaded=app?Object.values(app.docs||{}).filter(function(v){return v==='uploaded'||v==='verified';}).length:0;
  var required=app?(app.requiredDocs||['passport','income','criminal','degree','insurance','other']):[];
  var totalDocs=required.length||6;
  setText('cu-stat-apps',apps.length);setText('cu-stat-docs',uploaded+'/'+totalDocs);
  setText('cu-stat-msgs',msgs.length);setText('cu-stat-balance',app&&pays.length===0?'\u20AC'+P_PKG_PRICES[app.pkg||'solo'].toLocaleString():'\u20AC0');
  /* stepper */
  var stage=app?app.stage:0;
  setHTML('cu-overview-stepper',pBuildStepper(stage,4));
  setText('cu-overview-stage',app?'Stage '+(stage+1)+'/'+P_STAGES.length+' \u2014 '+P_STAGES[stage]:'No active application');
  /* feed */
  var feed=[
    {dot:'green',text:'<strong>Account created</strong>',time:fmtDate(pUser.created)},
    app?{dot:'brand',text:'<strong>Application started</strong> \u2014 '+P_PKG_NAMES[app.pkg||'solo'],time:fmtDate(app.created)}:null,
    app&&app.stage>=1?{dot:'brand',text:'<strong>Document checklist sent</strong>',time:fmtDate(app.updated)}:null,
    app&&uploaded>0?{dot:'green',text:'<strong>'+uploaded+' document(s) uploaded</strong>',time:'Recently'}:null,
    app&&app.stage>=2?{dot:'grey',text:'<strong>Application under review</strong>',time:'In progress'}:null
  ].filter(Boolean);
  setHTML('cu-activity-feed',feed.map(function(f){
    return '<div class="p-feed-item"><div class="p-feed-dot '+(f.dot==='brand'?'':f.dot)+(f.dot==='brand'?' ':' ')+'"></div><div><div class="p-feed-text">'+f.text+'</div><div class="p-feed-time">'+f.time+'</div></div></div>';
  }).join('')||'<p style="font-size:13px;color:var(--text3);">No recent activity.</p>');

  /* ═══ My Progress ═══ */
  var progressHtml='';
  if(app){
    var appStatus=getAppStatus(app);
    var statusLabel={registered:'Registered',paid:'Payment Complete',app_started:'Application In Progress',submitted:'Submitted for Review'};
    var docPct=totalDocs?Math.round(uploaded/totalDocs*100):0;
    var daysInStage=0;
    if(app.stageDates&&app.stageDates[app.stage]){
      daysInStage=Math.floor((new Date()-new Date(app.stageDates[app.stage]))/(1000*60*60*24));
    }
    progressHtml+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">'
      +'<div style="background:var(--bg2);border-radius:10px;padding:14px;text-align:center;">'
      +'<div style="font-size:12px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Status</div>'
      +'<div style="font-size:14px;font-weight:700;color:#9b2c2c;">'+(statusLabel[appStatus]||'Unknown')+'</div></div>'
      +'<div style="background:var(--bg2);border-radius:10px;padding:14px;text-align:center;">'
      +'<div style="font-size:12px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Documents</div>'
      +pDocProgressBar(app)+'</div>'
      +'<div style="background:var(--bg2);border-radius:10px;padding:14px;text-align:center;">'
      +'<div style="font-size:12px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Days in Stage</div>'
      +'<div style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:22px;font-weight:800;color:var(--text);">'+daysInStage+'</div></div>'
      +'</div>';
  } else {
    progressHtml='<p style="color:var(--text3);font-size:13px;">No active application. Start by choosing a package.</p>';
  }
  setHTML('cu-my-progress',progressHtml);

  /* ═══ Document Expiry Alerts (Customer) ═══ */
  var expiryWrap=document.getElementById('cu-expiry-alerts-wrap');
  if(expiryWrap&&app){
    var expiries=pGetDocExpiries([app],[pUser]);
    var urgent=expiries.filter(function(e){return e.status==='expired'||e.status==='expiring';});
    if(urgent.length){
      var alertHtml='<div class="p-card" style="margin-bottom:0;">'
        +'<div class="p-card-title" style="margin-bottom:10px;">Document Renewal Alerts</div>';
      urgent.forEach(function(e){
        var isExpired=e.status==='expired';
        alertHtml+='<div class="expiry-alert-card'+(isExpired?'':' warn')+'">'
          +'<div class="expiry-alert-icon">'+(isExpired?'\uD83D\uDEA8':'\u23F0')+'</div>'
          +'<div class="expiry-alert-body">'
          +'<div class="expiry-alert-title">'+escHtml(e.docKey.replace(/_/g,' '))+'</div>'
          +'<div class="expiry-alert-sub">'+(isExpired?'This document expired '+Math.abs(e.daysLeft)+' days ago. Please re-upload.':'Expires in '+e.daysLeft+' days. Please renew before expiry.')+'</div>'
          +'</div>'
          +'<span class="expiry-badge '+e.status+'">'+(isExpired?'Expired':'Renew Soon')+'</span>'
          +'</div>';
      });
      alertHtml+='</div>';
      expiryWrap.innerHTML=alertHtml;
      expiryWrap.style.marginBottom='20px';
    } else {
      expiryWrap.innerHTML='';expiryWrap.style.marginBottom='0';
    }
  }
}
function pBuildStepper(current,showCount){
  var total=Math.min(showCount||6,P_STAGES.length);
  var html='<div class="p-stepper">';
  for(var i=0;i<total;i++){
    var cls=i<current?'done':i===current?'curr':'';
    html+='<div class="p-step '+cls+'">';
    html+='<div class="p-step-row">';
    html+='<div class="p-step-dot">'+(i<current?'✓':(i+1))+'</div>';
    if(i<total-1) html+='<div class="p-step-conn"></div>';
    html+='</div>';
    html+='<div class="p-step-lbl">'+P_STAGES[i]+'</div>';
    html+='</div>';
  }
  return html+'</div>';
}
function pRenderCuStatus(){
  var app=pGetMyApp();
  if(!app){setHTML('cu-status-stepper-wrap','<p style="color:var(--text3);font-size:14px;">No active application. <button class="p-btn p-btn-primary p-btn-sm" onclick="pNav(\'cu\',\'marketplace\',null)">Browse packages</button></p>');setHTML('cu-stage-timeline','');return;}
  setHTML('cu-status-stepper',pBuildStepper(app.stage,6));
  document.getElementById('cu-status-badge').className='p-badge '+(app.stage===5?'bd-done':'bd-prog');
  document.getElementById('cu-status-badge').textContent=P_STAGES[app.stage];
  /* CM info */
  var cm=app.cmId?pGetUsers().find(function(u){return u.id===app.cmId;}):null;
  setText('cu-cm-name',cm?cm.first+' '+cm.last:'Not yet assigned');
  setText('cu-cm-email',cm?cm.email:'');
  /* timeline */
  var stageDates=app.stageDates||{};
  var timeline=P_STAGES.map(function(s,i){
    var done=i<app.stage,curr=i===app.stage;
    var timeLabel=done?('Completed'+(stageDates[i]?' · '+fmtDateTime(stageDates[i]):'')):(curr?'In progress'+(stageDates[i]?' · '+fmtDateTime(stageDates[i]):''):'Pending');
    return '<div class="p-feed-item" style="opacity:'+(done||curr?1:0.4)+'">'
      +'<div class="p-feed-dot '+(done?'green':curr?'':' grey')+'"></div>'
      +'<div><div class="p-feed-text"><strong>'+s+'</strong>'+(curr?' <span class="p-badge bd-prog" style="font-size:10px;">Current</span>':'')+'</div>'
      +'<div class="p-feed-time">'+timeLabel+'</div></div></div>';
  }).join('');
  setHTML('cu-stage-timeline',timeline);
}
function pRenderCuDocuments(){
  var app=pGetMyApp();
  if(!app){
    setHTML('cu-profile-row','<p style="color:var(--text3);font-size:14px;">No active application.</p>');
    setHTML('cu-profile-docs','');setHTML('cu-doc-submit-wrap','');return;
  }
  // init profiles if needed
  if(!app.profiles||app.profiles.length===0){
    var apps=pGetApps();
    apps=apps.map(function(a){if(a.id===app.id){a.profiles=pGetOrInitProfiles(a);} return a;});
    pSaveApps(apps);app=pGetMyApp();
  }
  var profiles=app.profiles;
  var limit=pGetProfileLimit(app);
  var atLimit=profiles.length>=limit;
  // default active profile
  if(!pActiveProfileId||!profiles.find(function(p){return p.id===pActiveProfileId;})){
    pActiveProfileId=profiles[0].id;
  }
  // Render profile cards
  var isFamily=app.pkg==='family';
  var hasSpouse=profiles.some(function(p){return p.type==='spouse';});
  var cardsHtml=profiles.map(function(prof){
    var prog=pGetProfileProgress(app,prof.id);
    var isActive=prof.id===pActiveProfileId;
    var initials=prof.name.split(' ').map(function(w){return w[0]||'';}).join('').toUpperCase().slice(0,2)||'?';
    var canDelete=prof.type!=='main'&&!app.docsSubmitted;
    var isSubmitted=!!prof.submitted;
    return '<div class="p-profile-card'+(isActive?' active':'')+'" onclick="pSelectProfile(\''+prof.id+'\')" id="pcard-'+prof.id+'">'
      +(canDelete?'<button class="p-profile-del" onclick="event.stopPropagation();pRemoveProfile(\''+prof.id+'\')">✕</button>':'')
      +'<div class="p-profile-avatar" style="'+(isSubmitted?'background:#10B981;':'')+'">'+initials+'</div>'
      +'<div class="p-profile-name" id="pname-'+prof.id+'" ondblclick="event.stopPropagation();pStartRename(\''+prof.id+'\')">'+escHtml(prof.name)+'</div>'
      +'<div class="p-profile-type">'+escHtml(PROFILE_TYPE_LABELS[prof.type]||prof.type)+'</div>'
      +(isSubmitted
        ?'<div style="font-size:11px;color:#10B981;font-weight:700;margin-top:4px;">✅ Files Submitted</div>'
        :'<div class="p-profile-prog-bar"><div class="p-profile-prog-fill" style="width:'+prog.pct+'%"></div></div>'
         +'<div class="p-profile-pct">'+prog.done+'/'+prog.total+' · '+prog.pct+'%</div>'
      )
      +'</div>';
  }).join('');
  // Add profile buttons — disabled when limit reached
  if(isFamily){
    if(!hasSpouse&&!app.docsSubmitted){
      if(atLimit){
        cardsHtml+='<div class="p-profile-card add-card" style="opacity:0.4;cursor:not-allowed;" title="Profile limit reached for your package"><div style="font-size:24px;">💍</div><div style="font-size:12px;font-weight:700;">Add Spouse</div><div style="font-size:10px;color:var(--text3);">Limit reached</div></div>';
      } else {
        cardsHtml+='<div class="p-profile-card add-card" onclick="pAddProfile(\'spouse\')"><div style="font-size:24px;">💍</div><div style="font-size:12px;font-weight:700;">Add Spouse</div></div>';
      }
    }
    if(!app.docsSubmitted){
      if(atLimit){
        cardsHtml+='<div class="p-profile-card add-card" style="opacity:0.4;cursor:not-allowed;" title="Profile limit reached for your package"><div style="font-size:24px;">👶</div><div style="font-size:12px;font-weight:700;">Add Dependent</div><div style="font-size:10px;color:var(--text3);">Limit reached</div></div>';
      } else {
        cardsHtml+='<div class="p-profile-card add-card" onclick="pShowAddDependent()"><div style="font-size:24px;">👶</div><div style="font-size:12px;font-weight:700;">Add Dependent</div></div>';
      }
    }
  }
  // Package limit info banner
  var pkgLabel=app.pkg==='solo'?'Nomad Solo (€2,500)':app.pkg==='family'?(app.deps>=1?'Family +'+(app.deps)+' (€'+(3000+(app.deps||0)*500).toLocaleString()+')':'Family +1 (€3,000)'):'Standard';
  cardsHtml='<div style="font-size:11px;color:var(--text3);margin-bottom:10px;display:flex;align-items:center;gap:8px;"><span>📦 <strong>'+escHtml(pkgLabel)+'</strong> — up to <strong>'+limit+'</strong> profile'+(limit>1?'s':'')+'</span>'+(atLimit?'<span style="color:#10B981;font-weight:700;">✓ All slots filled</span>':'<span style="color:var(--text3);">('+profiles.length+'/'+limit+' used)</span>')+'</div>'+cardsHtml;
  setHTML('cu-profile-row',cardsHtml);
  // Render active profile docs
  pRenderProfileDocs(app);
  // Bottom CTA area
  var allSubmitted=pAllProfilesSubmitted(app);
  var globalSubmitted=app.docsSubmitted;
  if(globalSubmitted){
    // Post-submission UI: timestamp + CM details
    var cm=app.cmId?pGetUsers().find(function(u){return u.id===app.cmId;}):null;
    var cmHtml=cm
      ?'<div style="display:flex;align-items:center;gap:16px;margin-top:18px;padding:16px;background:var(--bg);border-radius:10px;border:1.5px solid var(--border);">'
        +'<div style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,var(--brand),#e05c1a);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">👤</div>'
        +'<div><div style="font-size:14px;font-weight:700;color:var(--text1);">'+escHtml(cm.first+' '+cm.last)+'</div>'
        +'<div style="font-size:12px;color:var(--text2);margin-top:2px;">📧 '+escHtml(cm.email)+'</div>'
        +'<div style="font-size:12px;color:var(--text3);margin-top:2px;">Your Case Manager</div>'
        +'</div></div>'
      :'';
    setHTML('cu-doc-submit-wrap',
      '<div style="padding:20px 22px;background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;">'
      +'<div style="font-size:15px;font-weight:700;color:#15803d;">✅ Submission Complete</div>'
      +'<div style="font-size:12px;color:#166534;margin-top:4px;">Submitted on '+fmtDateTime(globalSubmitted)+'</div>'
      +'<div style="font-size:13px;color:var(--text2);margin-top:10px;">Your Case Manager is reviewing your documents and will be in touch shortly.</div>'
      +cmHtml
      +'</div>');
  } else {
    // Tally per-profile submission progress
    var submittedCount=profiles.filter(function(p){return !!p.submitted;}).length;
    var allReady=allSubmitted||(profiles.length===limit&&submittedCount===limit);
    var hint='';
    if(!allReady){
      var remaining=[];
      if(profiles.length<limit) remaining.push('add all '+(limit-profiles.length)+' remaining profile'+(limit-profiles.length>1?'s':''));
      var needSubmit=profiles.filter(function(p){return !p.submitted;});
      if(needSubmit.length>0) remaining.push('submit '+needSubmit.map(function(p){return p.name;}).join(', '));
      hint='<p style="font-size:12px;color:var(--text3);margin-top:8px;">To unlock: '+remaining.join(' & ')+'.</p>';
    }
    setHTML('cu-doc-submit-wrap',
      '<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">'
      +'<div><div style="font-size:12px;color:var(--text3);margin-bottom:4px;">Profiles submitted: <strong>'+submittedCount+'/'+limit+'</strong></div>'
      +'<div style="height:6px;width:220px;background:var(--border);border-radius:3px;"><div style="height:6px;background:var(--brand);border-radius:3px;transition:width 0.3s;width:'+(limit>0?Math.round(submittedCount/limit*100):0)+'%;"></div></div></div>'
      +'<button class="p-btn p-btn-primary" style="'+(allReady?'':'opacity:0.45;cursor:not-allowed;')+'" '+(allReady?'onclick="pCompleteSubmission()"':'disabled')+'>🏁 Complete Submission</button>'
      +'</div>'+hint);
  }
}
function pRenderProfileDocs(app){
  var profiles=pGetOrInitProfiles(app);
  var prof=profiles.find(function(p){return p.id===pActiveProfileId;})||profiles[0];
  if(!prof){setHTML('cu-profile-docs','');return;}
  var prog=pGetProfileProgress(app,prof.id);
  var checklist=PROFILE_CHECKLISTS[prof.type]||[];
  var globalSubmitted=app.docsSubmitted;
  var profSubmitted=!!prof.submitted;
  var locked=profSubmitted||!!globalSubmitted;
  var html='<div class="p-vault-progress">'
    +'<div style="flex-shrink:0;font-size:13px;font-weight:700;">'+escHtml(prof.name)+'</div>'
    +(profSubmitted
      ?'<div style="flex:1;font-size:12px;color:#10B981;font-weight:700;">✅ Files submitted on '+fmtDateTime(prof.submitted)+'</div>'
      :'<div class="p-vault-prog-bar"><div class="p-vault-prog-fill" style="width:'+prog.pct+'%"></div></div>'
       +'<div style="flex-shrink:0;font-size:13px;font-weight:700;color:var(--brand);">'+prog.pct+'%</div>'
       +'<div style="flex-shrink:0;font-size:12px;color:var(--text3);">'+prog.done+'/'+prog.total+' docs</div>'
    )
    +'</div>';
  html+='<div class="p-card">';
  checklist.forEach(function(section){
    html+='<div class="p-doc-cat">'+escHtml(section.cat)+'</div>';
    section.docs.forEach(function(d){
      var status=prof.docs[d.key]||'missing';
      var fname=(prof.docFiles&&prof.docFiles[d.key])||'';
      var clickable=!locked&&status!=='pending'&&status!=='verified';
      var badgeClass=status==='verified'?'verified':status==='uploaded'?'ok':status==='pending'?'pend':status==='rejected'?'rejected':'miss';
      var badgeLabel=status==='verified'?'✓ Verified':status==='uploaded'?'✓ Uploaded':status==='pending'?'⏳ Under Review':status==='rejected'?'✗ Rejected':'+ Upload';
      html+='<div class="p-doc-row'+(clickable?'':' locked')+'"'+(clickable?' onclick="pUploadDoc(\''+d.key+'\')"':'')+' style="'+(status==='uploaded'||status==='verified'?'border-left:3px solid #10B981;padding-left:13px;':'')+'">'
        +'<div class="p-doc-row-icon">'+d.icon+'</div>'
        +'<div class="p-doc-row-body"><div class="p-doc-row-name">'+escHtml(d.name)+'</div><div class="p-doc-row-sub">'+escHtml(d.sub)+'</div></div>'
        +'<div class="p-doc-row-status"><span class="p-doc-badge '+badgeClass+'">'+badgeLabel+'</span>'+(fname?'<span class="p-doc-fname">'+escHtml(fname)+'</span>':'')+'</div>'
        +'</div>';
    });
  });
  html+='</div>';
  // Per-profile Submit Files button
  if(!globalSubmitted){
    if(profSubmitted){
      html+='<div style="margin-top:14px;padding:12px 16px;background:#f0fdf4;border:1.5px solid #86efac;border-radius:10px;font-size:13px;color:#15803d;font-weight:600;">✅ Files for <strong>'+escHtml(prof.name)+'</strong> submitted — awaiting global completion.</div>';
    } else {
      var canSubmit=prog.pct===100;
      html+='<div style="margin-top:14px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;">'
        +'<button class="p-btn p-btn-secondary" style="'+(canSubmit?'':'opacity:0.45;cursor:not-allowed;')+'" '+(canSubmit?'onclick="pSubmitProfile(\''+prof.id+'\')"':'disabled')+'>'
        +'📤 Submit Files for '+escHtml(prof.name)
        +'</button>'
        +(canSubmit?'':'<span style="font-size:12px;color:var(--text3);">Upload all '+(prog.total-prog.done)+' remaining doc'+(prog.total-prog.done===1?'':'s')+' to enable.</span>')
        +'</div>';
    }
  }
  setHTML('cu-profile-docs',html);
}
var pActiveProfileId=null;
function pGetOrInitProfiles(app){
  if(app.profiles&&app.profiles.length>0) return app.profiles;
  // migrate old docs structure to new profiles
  var mainDocs={};
  var checklist=PROFILE_CHECKLISTS.main;
  checklist.forEach(function(cat){cat.docs.forEach(function(d){mainDocs[d.key]='missing';});});
  // copy over any old uploaded docs by rough key matching
  var oldDocs=app.docs||{};
  if(oldDocs.passport) mainDocs.passport=oldDocs.passport;
  if(oldDocs.income) mainDocs.income_proof=oldDocs.income;
  if(oldDocs.criminal) mainDocs.criminal_record=oldDocs.criminal;
  if(oldDocs.degree) mainDocs.diploma=oldDocs.degree;
  if(oldDocs.insurance) mainDocs.health_insurance=oldDocs.insurance;
  return [{id:'main',type:'main',name:'Main Applicant',docs:mainDocs,docFiles:{}}];
}
function pGetProfileProgress(app,profileId){
  var profiles=pGetOrInitProfiles(app);
  var prof=profiles.find(function(p){return p.id===profileId;});
  if(!prof) return {done:0,total:0,pct:0};
  var checklist=PROFILE_CHECKLISTS[prof.type]||[];
  var total=0,done=0;
  checklist.forEach(function(cat){cat.docs.forEach(function(d){total++;var s=prof.docs[d.key]||'missing';if(s==='uploaded'||s==='verified'||s==='pending')done++;});});
  return {done:done,total:total,pct:total>0?Math.round(done/total*100):0};
}
function pAllProfilesComplete(app){
  var profiles=pGetOrInitProfiles(app);
  return profiles.every(function(prof){
    var prog=pGetProfileProgress(app,prof.id);
    return prog.pct===100;
  });
}
/* Returns max number of profiles allowed for this application based on package + dependants */
function pGetProfileLimit(app){
  if(!app) return 1;
  var pkg=app.pkg||'solo';
  if(pkg==='solo') return 1;
  // family: 1 main + N dependants (each dep adds 1 profile slot)
  return 1+(app.deps||0);
}
/* True when every allowed profile has been individually submitted */
function pAllProfilesSubmitted(app){
  var profiles=pGetOrInitProfiles(app);
  if(!profiles||profiles.length===0) return false;
  var limit=pGetProfileLimit(app);
  // must have reached the allowed limit AND all are submitted
  if(profiles.length<limit) return false;
  return profiles.every(function(prof){return !!prof.submitted;});
}
var pPendingDocKey=null;
function pUploadDoc(key){
  var app=pGetMyApp();if(!app){showToast('No active application');return;}
  pPendingDocKey=key;
  var fi=document.getElementById('cu-doc-file-input');
  if(fi){fi.value='';fi.click();}
}
function pHandleFileUpload(input){
  if(!input.files||!input.files[0]||!pPendingDocKey){return;}
  var file=input.files[0];
  var app=pGetMyApp();if(!app){return;}
  showToast('⏳ Uploading '+file.name+'…');
  var key=pPendingDocKey;var profileId=pActiveProfileId;pPendingDocKey=null;
  setTimeout(function(){
    var apps=pGetApps();
    apps=apps.map(function(a){
      if(a.id===app.id){
        if(!a.profiles||a.profiles.length===0) a.profiles=pGetOrInitProfiles(a);
        a.profiles=a.profiles.map(function(p){
          if(p.id===profileId){
            p.docs[key]='uploaded';
            if(!p.docFiles)p.docFiles={};
            p.docFiles[key]=file.name;
          }
          return p;
        });
        a.updated=new Date().toISOString();
      }
      return a;
    });
    pSaveApps(apps);pRenderCuDocuments();pRenderCuOverview();
    showToast('\u2713 '+file.name+' uploaded');
  },800);
}
/* Submit files for a single profile */
function pSubmitProfile(profileId){
  var app=pGetMyApp();if(!app){return;}
  var prof=(app.profiles||[]).find(function(p){return p.id===profileId;});
  if(!prof){return;}
  var prog=pGetProfileProgress(app,profileId);
  if(prog.pct<100){showToast('Upload all documents for this profile first');return;}
  var ts=new Date().toISOString();
  var apps=pGetApps();
  apps=apps.map(function(a){
    if(a.id===app.id&&a.profiles){
      a.profiles=a.profiles.map(function(p){
        if(p.id===profileId){
          p.submitted=ts;
          Object.keys(p.docs).forEach(function(k){if(p.docs[k]==='uploaded')p.docs[k]='pending';});
        }
        return p;
      });
      a.updated=ts;
    }
    return a;
  });
  pSaveApps(apps);pRenderCuDocuments();showToast('✓ Files submitted for '+prof.name);
}
/* Complete the overall submission — fires when all profiles are submitted */
function pCompleteSubmission(){
  var app=pGetMyApp();if(!app){return;}
  if(!pAllProfilesSubmitted(app)){showToast('Submit all profile files first');return;}
  var ts=new Date().toISOString();
  var apps=pGetApps();
  apps=apps.map(function(a){
    if(a.id===app.id){
      a.docsSubmitted=ts;
      a.updated=ts;
    }
    return a;
  });
  pSaveApps(apps);pRenderCuDocuments();showToast('🏁 Submission complete! Your Case Manager will be in touch.');
}
function pSelectProfile(profileId){
  pActiveProfileId=profileId;
  // update card active states
  document.querySelectorAll('.p-profile-card').forEach(function(c){c.classList.remove('active');});
  var card=document.getElementById('pcard-'+profileId);if(card)card.classList.add('active');
  var app=pGetMyApp();if(app)pRenderProfileDocs(app);
}
function pAddProfile(type){
  var app=pGetMyApp();if(!app){return;}
  var limit=pGetProfileLimit(app);
  var profiles=pGetOrInitProfiles(app);
  if(profiles.length>=limit){
    showToast('⚠️ Profile limit reached for your package ('+limit+' max)');return;
  }
  var apps=pGetApps();
  var defaultNames={spouse:'Spouse',dependent_minor:'Child',dependent_adult:'Adult Dependent'};
  var newId='p'+Date.now();
  var checklist=PROFILE_CHECKLISTS[type]||[];
  var newDocs={};checklist.forEach(function(cat){cat.docs.forEach(function(d){newDocs[d.key]='missing';});});
  apps=apps.map(function(a){
    if(a.id===app.id){
      if(!a.profiles||a.profiles.length===0)a.profiles=pGetOrInitProfiles(a);
      a.profiles.push({id:newId,type:type,name:defaultNames[type]||'Profile',docs:newDocs,docFiles:{}});
    }
    return a;
  });
  pSaveApps(apps);pActiveProfileId=newId;pRenderCuDocuments();showToast('✓ Profile added');
}
function pShowAddDependent(){
  var app=pGetMyApp();if(!app)return;
  var limit=pGetProfileLimit(app);
  var profiles=pGetOrInitProfiles(app);
  if(profiles.length>=limit){showToast('⚠️ Profile limit reached for your package ('+limit+' max)');return;}
  var overlay=document.getElementById('pModalOverlay');var body=document.getElementById('pModalBody');var title=document.getElementById('pModalTitle');
  if(!overlay||!body||!title)return;
  overlay.classList.add('open');
  title.textContent='Add Dependent';
  body.innerHTML='<p style="font-size:13px;color:var(--text2);margin-bottom:16px;">Select the dependent\'s age category to load the correct document checklist.</p>'
    +'<div style="display:flex;flex-direction:column;gap:10px;">'
    +'<button class="p-btn p-btn-ghost" style="justify-content:flex-start;padding:14px 16px;" onclick="pCloseModal();pAddProfile(\'dependent_minor\')"><strong>👶 Under 18</strong> <span style="font-size:12px;color:var(--text3);margin-left:8px;">Passport, Birth Cert, MI-T Form, Insurance</span></button>'
    +'<button class="p-btn p-btn-ghost" style="justify-content:flex-start;padding:14px 16px;" onclick="pCloseModal();pAddProfile(\'dependent_adult\')"><strong>🎓 Over 18</strong> <span style="font-size:12px;color:var(--text3);margin-left:8px;">Full checklist incl. proof of study & NIE</span></button>'
    +'</div>';
}
function pRemoveProfile(profileId){
  if(!confirm('Remove this profile and all its documents?'))return;
  var app=pGetMyApp();if(!app)return;
  var apps=pGetApps();
  apps=apps.map(function(a){
    if(a.id===app.id){a.profiles=(a.profiles||[]).filter(function(p){return p.id!==profileId;});}
    return a;
  });
  pSaveApps(apps);
  if(pActiveProfileId===profileId)pActiveProfileId=null;
  pRenderCuDocuments();showToast('Profile removed');
}
function pStartRename(profileId){
  var el=document.getElementById('pname-'+profileId);if(!el)return;
  var current=el.textContent.trim();
  el.innerHTML='<input type="text" value="'+escHtml(current)+'" style="border:1.5px solid var(--brand);border-radius:6px;padding:3px 7px;font-size:13px;font-weight:700;width:100%;background:var(--white);color:var(--text1);outline:none;" onblur="pSaveRename(\''+profileId+'\',this.value)" onkeydown="if(event.key===\'Enter\')this.blur();if(event.key===\'Escape\')this.blur();" onclick="event.stopPropagation()">';
  var inp=el.querySelector('input');if(inp){inp.focus();inp.select();}
}
function pSaveRename(profileId,newName){
  newName=(newName||'').trim();if(!newName)return;
  var app=pGetMyApp();if(!app)return;
  var apps=pGetApps();
  apps=apps.map(function(a){
    if(a.id===app.id&&a.profiles){a.profiles=a.profiles.map(function(p){if(p.id===profileId)p.name=newName;return p;});}
    return a;
  });
  pSaveApps(apps);pRenderCuDocuments();
}
function pRenderCuSupport(){
  var msgs=pGetMsgs();
  var cm=pUser.cmId?pGetUsers().find(function(u){return u.id===pUser.cmId;}):null;
  var html=cm?'<div class="p-msg-thread active" onclick="pOpenThread(\''+cm.id+'\',\'cu\')">'
    +'<div class="p-msg-thread-name">'+escHtml(cm.first+' '+cm.last)+'</div>'
    +'<div class="p-msg-thread-prev">Case Manager</div></div>'
    :'<div style="padding:16px;font-size:13px;color:var(--text3);">No case manager assigned yet.</div>';
  setHTML('cu-msg-list',html);
  if(cm) pOpenThread(cm.id,'cu');
}
function pOpenThread(otherId,role){
  pActiveThread=otherId;
  var other=pGetUsers().find(function(u){return u.id===otherId;})||{first:'Unknown',last:'',email:''};
  var prefix=role==='admin'?'ad':role==='cm'?'cm':'cu';
  var headerEl=document.getElementById(prefix+'-msg-header');
  if(headerEl) headerEl.textContent=(other.first+' '+other.last).trim();
  /* mark read */
  var msgs=pGetMsgs();
  msgs=msgs.map(function(m){if(m.fromId===otherId&&m.toId===pUser.id)m.read=true;return m;});
  pSaveMsgs(msgs);
  pRenderThread(prefix);
}
/* ── RICH MESSAGING ── */
var pMsgPending={};var pMsgRecorder={};var pMsgVoiceChunks={};
var pVoiceSeconds=0;var pVoiceIntervalId=null;
var CHAT_EMOJIS=['😀','😊','😂','🥰','😎','🤔','🙏','👍','👎','❤️','🎉','✅','⚠️','🔥','💯','📎','📝','🎯','🌟','💪','👋','🤝','✈️','🏖️','🇪🇸','📅','⏰','✍️','📞','🔑'];
var REACTION_EMOJIS=['👍','❤️','😂','😮','😢','🙏'];
function pToggleMsgEmoji(prefix){
  var picker=document.getElementById(prefix+'-emoji-picker');if(!picker)return;
  if(!picker.innerHTML){
    picker.innerHTML=CHAT_EMOJIS.map(function(e){
      return '<button class="p-emoji-btn" onclick="pInsertEmoji(\''+prefix+'\',\''+e+'\')">'+e+'</button>';
    }).join('');
  }
  picker.style.display=picker.style.display==='none'||picker.style.display===''?'flex':'none';
}
function pInsertEmoji(prefix,emoji){
  var inp=document.getElementById(prefix+'-msg-input');if(!inp)return;
  var pos=inp.selectionStart||inp.value.length;
  inp.value=inp.value.slice(0,pos)+emoji+inp.value.slice(pos);
  inp.focus();
  var picker=document.getElementById(prefix+'-emoji-picker');if(picker)picker.style.display='none';
}
function pTriggerMsgAttach(prefix){
  var fi=document.getElementById(prefix+'-attach-input');if(fi){fi.value='';fi.click();}
}
function pHandleMsgAttach(prefix,input){
  if(!input.files||!input.files[0])return;
  var file=input.files[0];
  if(file.size>10*1024*1024){showToast('File too large (max 10MB)');return;}
  if(!pMsgPending[prefix])pMsgPending[prefix]={};
  var reader=new FileReader();
  reader.onload=function(e){
    pMsgPending[prefix].attachment={name:file.name,type:file.type,size:file.size,dataUrl:e.target.result};
    var prev=document.getElementById(prefix+'-attach-preview');
    var nameEl=document.getElementById(prefix+'-attach-name');
    if(prev)prev.style.display='flex';
    if(nameEl)nameEl.textContent=file.name+' ('+Math.round(file.size/1024)+'KB)';
    showToast('\u2713 Attached: '+file.name);
  };
  reader.readAsDataURL(file);
}
function pClearMsgAttach(prefix){
  if(pMsgPending[prefix])pMsgPending[prefix].attachment=null;
  var prev=document.getElementById(prefix+'-attach-preview');if(prev)prev.style.display='none';
}
function pToggleVoice(prefix){
  if(pMsgRecorder[prefix]&&pMsgRecorder[prefix].state==='recording'){
    pMsgRecorder[prefix].stop();return;
  }
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){showToast('Microphone not supported in this browser');return;}
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
    var recorder=new MediaRecorder(stream);
    pMsgVoiceChunks[prefix]=[];
    recorder.ondataavailable=function(e){if(e.data.size>0)pMsgVoiceChunks[prefix].push(e.data);};
    recorder.onstop=function(){
      stream.getTracks().forEach(function(t){t.stop();});
      var blob=new Blob(pMsgVoiceChunks[prefix],{type:'audio/webm'});
      var reader2=new FileReader();
      reader2.onload=function(e2){
        if(!pMsgPending[prefix])pMsgPending[prefix]={};
        pMsgPending[prefix].voice={dataUrl:e2.target.result,duration:pVoiceSeconds};
        var btn=document.getElementById(prefix+'-voice-btn');
        if(btn){btn.textContent='\uD83C\uDF99\uFE0F';btn.classList.remove('active');}
        var ind=document.getElementById(prefix+'-voice-indicator');if(ind)ind.style.display='none';
        clearInterval(pVoiceIntervalId);
        showToast('\u2713 Voice note ready ('+pVoiceSeconds+'s) \u2014 click Send');
      };
      reader2.readAsDataURL(blob);
    };
    recorder.start(100);
    pMsgRecorder[prefix]=recorder;
    var btn=document.getElementById(prefix+'-voice-btn');
    if(btn){btn.textContent='\u23F9';btn.classList.add('active');}
    var ind=document.getElementById(prefix+'-voice-indicator');if(ind)ind.style.display='flex';
    pVoiceSeconds=0;clearInterval(pVoiceIntervalId);
    pVoiceIntervalId=setInterval(function(){
      pVoiceSeconds++;
      var timerEl=document.getElementById(prefix+'-voice-timer');
      if(timerEl)timerEl.textContent=Math.floor(pVoiceSeconds/60)+':'+String(pVoiceSeconds%60).padStart(2,'0');
    },1000);
  }).catch(function(){showToast('Microphone access denied');});
}
function pRenderThread(prefix){
  var bodyEl=document.getElementById(prefix+'-msg-body');if(!bodyEl)return;
  if(!pActiveThread){bodyEl.innerHTML='<p style="color:var(--text3);font-size:13px;text-align:center;margin-top:40px;">Select a conversation</p>';return;}
  var msgs=pGetMsgs().filter(function(m){
    return (m.fromId===pUser.id&&m.toId===pActiveThread)||(m.fromId===pActiveThread&&m.toId===pUser.id);
  }).sort(function(a,b){return new Date(a.ts)-new Date(b.ts);});
  bodyEl.innerHTML=msgs.length?msgs.map(function(m){
    var sent=m.fromId===pUser.id;
    var attachHtml='';
    if(m.attachment){
      var isImg=m.attachment.type&&m.attachment.type.startsWith('image/');
      if(isImg){
        attachHtml='<div style="margin-top:6px;"><img src="'+escHtml(m.attachment.dataUrl)+'" style="max-width:200px;max-height:200px;border-radius:8px;display:block;cursor:pointer;" onclick="window.open(\''+escHtml(m.attachment.dataUrl)+'\',\'_blank\')"></div>';
      } else {
        attachHtml='<a class="p-bubble-attach" href="'+escHtml(m.attachment.dataUrl)+'" download="'+escHtml(m.attachment.name)+'">'
          +'<span style="font-size:22px;">📎</span>'
          +'<div><div class="p-bubble-attach-name">'+escHtml(m.attachment.name)+'</div>'
          +'<div style="font-size:10px;opacity:0.65;">'+Math.round((m.attachment.size||0)/1024)+'KB · Download</div></div></a>';
      }
    }
    var voiceHtml='';
    if(m.voice&&m.voice.dataUrl){
      voiceHtml='<div style="margin-top:6px;"><audio class="p-bubble-audio" controls src="'+escHtml(m.voice.dataUrl)+'"></audio>'
        +'<div style="font-size:10px;opacity:0.6;margin-top:2px;">\uD83C\uDF99\uFE0F Voice note \u00B7 '+(m.voice.duration||0)+'s</div></div>';
    }
    var reactions=m.reactions||{};
    var reactionBadges=Object.keys(reactions).filter(function(e){return reactions[e]&&reactions[e].length>0;}).map(function(e){
      var mine=reactions[e].indexOf(pUser.id)!==-1;
      return '<button class="p-reaction-badge'+(mine?' mine':'')+'" onclick="pAddReaction(\''+m.id+'\',\''+prefix+'\',\''+e+'\')">'+e+' '+reactions[e].length+'</button>';
    }).join('');
    var reactionAddBtn='<button class="p-reaction-add" onclick="pShowReactionPicker(\''+m.id+'\',\''+prefix+'\',this)" title="React">\uFF0B</button>';
    return '<div class="p-bubble '+(sent?'sent':'recv')+'" id="pmsg-'+m.id+'">'
      +(m.body?'<div class="p-bubble-text">'+escHtml(m.body)+'</div>':'')
      +attachHtml+voiceHtml
      +'<div class="p-bubble-meta">'+fmtDateTime(m.ts)+(sent?' \u00B7 You':'')+'</div>'
      +'<div class="p-bubble-reactions">'+reactionBadges+reactionAddBtn+'</div>'
      +'</div>';
  }).join(''):'<p style="color:var(--text3);font-size:13px;text-align:center;margin-top:40px;">No messages yet. Start the conversation!</p>';
  bodyEl.scrollTop=bodyEl.scrollHeight;
}
function pSendMsg(role){
  var prefix=role==='admin'?'ad':role==='cm'?'cm':'cu';
  var inp=document.getElementById(prefix+'-msg-input');if(!inp)return;
  var body=(inp.value||'').trim();
  var pending=pMsgPending[prefix]||{};
  if(!body&&!pending.attachment&&!pending.voice){if(!pActiveThread)showToast('Select a conversation first');return;}
  if(!pActiveThread){showToast('Select a conversation first');return;}
  var msg={id:'m'+Date.now(),fromId:pUser.id,toId:pActiveThread,appId:null,body:body,ts:new Date().toISOString(),read:false,reactions:{}};
  if(pending.attachment){msg.attachment=pending.attachment;pMsgPending[prefix].attachment=null;var prev=document.getElementById(prefix+'-attach-preview');if(prev)prev.style.display='none';}
  if(pending.voice){msg.voice=pending.voice;pMsgPending[prefix].voice=null;}
  var msgs=pGetMsgs();msgs.push(msg);pSaveMsgs(msgs);inp.value='';pRenderThread(prefix);
}
function pAddReaction(msgId,prefix,emoji){
  var msgs=pGetMsgs();
  msgs=msgs.map(function(m){
    if(m.id===msgId){
      if(!m.reactions)m.reactions={};
      if(!m.reactions[emoji])m.reactions[emoji]=[];
      var idx=m.reactions[emoji].indexOf(pUser.id);
      if(idx===-1){m.reactions[emoji].push(pUser.id);}else{m.reactions[emoji].splice(idx,1);}
    }
    return m;
  });
  pSaveMsgs(msgs);pRenderThread(prefix);
}
function pShowReactionPicker(msgId,prefix,btn){
  var old=document.getElementById('p-reaction-float');
  if(old){var prevId=old.dataset.msgId;old.remove();if(prevId===msgId)return;}
  var picker=document.createElement('div');
  picker.id='p-reaction-float';picker.dataset.msgId=msgId;
  picker.style.cssText='position:fixed;background:var(--white);border:1.5px solid var(--border);border-radius:30px;padding:6px 10px;display:flex;gap:6px;box-shadow:0 4px 20px rgba(0,0,0,0.14);z-index:9999;';
  picker.innerHTML=REACTION_EMOJIS.map(function(e){
    return '<button onclick="pAddReaction(\''+msgId+'\',\''+prefix+'\',\''+e+'\');var f=document.getElementById(\'p-reaction-float\');if(f)f.remove();" style="font-size:22px;background:none;border:none;cursor:pointer;padding:2px 4px;border-radius:6px;transition:transform 0.1s;" onmouseover="this.style.transform=\'scale(1.35)\'" onmouseout="this.style.transform=\'scale(1)\'">'+e+'</button>';
  }).join('');
  var rect=btn.getBoundingClientRect();
  picker.style.top=(rect.top-54)+'px';
  picker.style.left=Math.max(10,rect.left-80)+'px';
  document.body.appendChild(picker);
  setTimeout(function(){
    function closeHandler(e){if(!picker.contains(e.target)){picker.remove();document.removeEventListener('click',closeHandler);}}
    document.addEventListener('click',closeHandler);
  },100);
}
function pRenderCuFinance(){
  var pays=pGetPays().filter(function(p){return p.userId===pUser.id;});
  var paid=pays.filter(function(p){return p.status==='paid';}).reduce(function(s,p){return s+p.amount;},0);
  var pend=pays.filter(function(p){return p.status==='pending';}).reduce(function(s,p){return s+p.amount;},0);
  setText('cu-fin-paid','\u20AC'+paid.toLocaleString());setText('cu-fin-due','\u20AC'+pend.toLocaleString());setText('cu-fin-count',pays.length);
  setHTML('cu-pay-tbody',pays.map(function(p){
    return '<tr><td>'+fmtDate(p.date)+'</td><td>'+escHtml(p.desc)+'</td><td style="font-family:\'Bricolage Grotesque\',sans-serif;font-weight:700;">\u20AC'+p.amount.toLocaleString()+'</td>'
      +'<td><span class="p-badge '+(p.status==='paid'?'bd-paid':'bd-pending')+'">'+p.status+'</span></td>'
      +'<td><button class="p-btn p-btn-ghost p-btn-sm" onclick="pDownloadInvoice(\''+p.id+'\')">PDF</button></td></tr>';
  }).join('')||'<tr><td colspan="5" style="text-align:center;color:var(--text3);padding:24px;">No transactions yet.</td></tr>');
}
function pDownloadInvoice(id){
  var pay=pGetPays().find(function(p){return p.id===id;});
  if(!pay){showToast('Invoice not found');return;}
  var u=pUser;
  var inv=window.open('','_blank','width=700,height=900');
  if(!inv){showToast('Allow pop-ups to download invoice');return;}
  var num='INV-'+(pay.id||id).replace(/[^0-9]/g,'').slice(-6).padStart(6,'0');
  var html='<!DOCTYPE html><html><head><title>Invoice '+num+'</title>'
    +'<style>body{font-family:\'Helvetica Neue\',Arial,sans-serif;margin:0;padding:40px;color:#1a1a1a;background:#fff;}'
    +'.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #f0f0f0;}'
    +'.brand{font-size:22px;font-weight:900;color:#E8421A;}'
    +'.inv-num{text-align:right;font-size:13px;color:#666;}'
    +'.inv-num strong{display:block;font-size:18px;color:#1a1a1a;margin-bottom:4px;}'
    +'.meta{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:40px;}'
    +'.meta-block label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:6px;display:block;}'
    +'.meta-block p{font-size:14px;margin:0;font-weight:600;}'
    +'.meta-block p.sub{font-weight:400;color:#555;font-size:13px;}'
    +'table{width:100%;border-collapse:collapse;margin-bottom:32px;}'
    +'th{background:#f9f9f9;padding:11px 14px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#888;border-bottom:1px solid #e5e5e5;}'
    +'td{padding:14px;border-bottom:1px solid #f0f0f0;font-size:14px;}'
    +'.total-row{display:flex;justify-content:flex-end;margin-bottom:32px;}'
    +'.total-box{background:#f9f9f9;border-radius:10px;padding:20px 28px;min-width:220px;}'
    +'.total-box .tl{font-size:12px;color:#888;margin-bottom:6px;}'
    +'.total-box .tv{font-size:28px;font-weight:900;color:#E8421A;}'
    +'.footer{text-align:center;font-size:11px;color:#aaa;border-top:1px solid #f0f0f0;padding-top:20px;}'
    +'@media print{body{padding:20px;}button{display:none!important;}}'
    +'</style></head><body>'
    +'<div class="header"><div><div class="brand">NomadSpain.io</div><div style="font-size:12px;color:#888;margin-top:4px;">Your Spain Visa Partner</div></div>'
    +'<div class="inv-num"><strong>'+num+'</strong><div>Date: '+fmtDate(pay.date)+'</div><div style="margin-top:4px;"><span style="background:'+(pay.status==='paid'?'#d1fae5':'#fef3c7')+';color:'+(pay.status==='paid'?'#065f46':'#92400e')+';padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;">'+pay.status.toUpperCase()+'</span></div></div></div>'
    +'<div class="meta"><div class="meta-block"><label>Billed To</label><p>'+escHtml(u.first+' '+u.last)+'</p><p class="sub">'+escHtml(u.email)+'</p></div>'
    +'<div class="meta-block"><label>Issued By</label><p>NomadSpain.io</p><p class="sub">hello@nomadspain.io</p></div></div>'
    +'<table><thead><tr><th>Description</th><th>Amount</th></tr></thead><tbody>'
    +'<tr><td>'+escHtml(pay.desc||'Service')+'</td><td style="font-weight:700;">€'+pay.amount.toLocaleString()+'</td></tr>'
    +'</tbody></table>'
    +'<div class="total-row"><div class="total-box"><div class="tl">Total Paid</div><div class="tv">€'+pay.amount.toLocaleString()+'</div></div></div>'
    +'<div style="text-align:center;margin-bottom:24px;"><button onclick="window.print()" style="background:#E8421A;color:#fff;border:none;padding:12px 32px;border-radius:50px;font-size:14px;font-weight:700;cursor:pointer;">🖨 Print / Save as PDF</button></div>'
    +'<div class="footer">Thank you for choosing NomadSpain.io · VAT not applicable · This is your official payment receipt</div>'
    +'</body></html>';
  inv.document.write(html);inv.document.close();
}
var phFilter='all', phQuery='', phFaqCat='all';
function pRenderCuHub(){
  phFilter='all'; phQuery=''; phFaqCat='all';
  // reset filter pills
  document.querySelectorAll('#ph-filters .filter-pill').forEach(function(p,i){p.classList.toggle('active',i===0);});
  document.querySelectorAll('#ph-faq-cats .faq-cat-btn').forEach(function(b,i){b.classList.toggle('active',i===0);});
  phConsulateActive=null;
  pRenderHubGrid();
  pRenderHubChecklist();
  pRenderHubFaq();
  renderConsulateGuides('ph-consulate-grid','ph-consulate-detail');
}
function pRenderHubGrid(){
  var articles=getArticles?getArticles():[];
  var filtered=articles.filter(function(a){
    var tagOk=phFilter==='all'||(a.category||'').indexOf(phFilter)!==-1;
    var qOk=!phQuery||(a.title+' '+a.summary+' '+(a.body||'')).toLowerCase().indexOf(phQuery)!==-1;
    return tagOk&&qOk;
  });
  var grid=document.getElementById('ph-blog-grid');
  var noRes=document.getElementById('ph-no-results');
  if(!grid)return;
  grid.innerHTML=filtered.map(function(a){
    var imgHtml=a.image?'<img src="'+escHtml(a.image)+'" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'">':'<span style="font-size:36px;">'+(a.emoji||EMOJIS[a.category]||'\uD83D\uDCF0')+'</span>';
    return '<div class="blog-card" onclick="openKbReader(\''+a.id+'\')">'
      +'<div class="blog-card-img" style="background:'+(CARD_BG[a.category]||CARD_BG.visa)+';display:flex;align-items:center;justify-content:center;">'+imgHtml+'</div>'
      +'<div class="blog-card-body"><span class="kb-tag">'+(TAG_LABELS[a.category]||a.category)+'</span><h3>'+escHtml(a.title)+'</h3><p>'+escHtml(a.summary||'')+'</p>'
      +'<div class="kb-meta">\uD83D\uDCD6 '+(a.readTime||'5 min')+' \u00B7 '+fmtDate(a.date)+'</div><div class="read-link">Read article \u2192</div></div></div>';
  }).join('')||'';
  if(noRes)noRes.style.display=filtered.length===0?'block':'none';
}
function pRenderHubChecklist(){
  var el=document.getElementById('ph-checklist');if(!el)return;
  var items=[
    {icon:'🛂',name:'Passport',detail:'Valid for 12+ months · Clear scan of all pages including biometric page'},
    {icon:'💰',name:'Proof of Income',detail:'Min. €2,646/month · Last 3 months bank statements + client contracts'},
    {icon:'📜',name:'Criminal Record Certificate',detail:'National police clearance · Apostilled · Issued within 3 months'},
    {icon:'🎓',name:'Degree or Work Experience',detail:'University diploma or detailed CV + work history'},
    {icon:'🏥',name:'Health Insurance',detail:'Full coverage in Spain · Min. 12-month policy · No co-pay clause'},
    {icon:'📂',name:'Other Supporting Docs',detail:'Cover letter, lease agreement or proof of accommodation in Spain'}
  ];
  el.innerHTML='<div style="display:flex;flex-direction:column;gap:0;">'
    +items.map(function(d,i){
      return '<div style="display:flex;align-items:flex-start;gap:14px;padding:13px 0;'+(i<items.length-1?'border-bottom:1px solid var(--border);':'')+'">'
        +'<div style="font-size:24px;margin-top:2px;">'+d.icon+'</div>'
        +'<div><div style="font-size:14px;font-weight:700;margin-bottom:2px;">'+escHtml(d.name)+'</div>'
        +'<div style="font-size:12px;color:var(--text3);line-height:1.5;">'+escHtml(d.detail)+'</div></div>'
        +'<div style="margin-left:auto;flex-shrink:0;"><div style="width:20px;height:20px;border-radius:50%;border:2px solid var(--border);margin-top:4px;"></div></div></div>';
    }).join('')
    +'</div>';
}
function pRenderHubFaq(){
  var grid=document.getElementById('ph-faq-grid');if(!grid)return;
  var faqs=getFaqData().filter(function(f){return phFaqCat==='all'||f.cat===phFaqCat;});
  grid.innerHTML=faqs.map(function(f){
    return '<div class="faq-item" id="phf-'+f.id+'">'
      +'<div class="faq-q" onclick="toggleFaq(\'phf-'+f.id+'\')">'
      +'<h4>'+escHtml(f.q)+'</h4><div class="faq-toggle">+</div></div>'
      +'<div class="faq-a"><p>'+escHtml(f.a)+'</p></div></div>';
  }).join('')||'<p style="color:var(--text3);font-size:13px;padding:20px 0;">No FAQs in this category.</p>';
}
function pHubSearch(q){phQuery=q.toLowerCase();pRenderHubGrid();}
function pHubFilter(cat,el){
  phFilter=cat;
  document.querySelectorAll('#ph-filters .filter-pill').forEach(function(p){p.classList.remove('active');});
  if(el)el.classList.add('active');
  pRenderHubGrid();
}
function pHubFaqFilter(cat,el){
  phFaqCat=cat;
  document.querySelectorAll('#ph-faq-cats .faq-cat-btn').forEach(function(b){b.classList.remove('active');});
  if(el)el.classList.add('active');
  pRenderHubFaq();
}
function pLoadCuSettings(){
  var s=['cu-set-first','cu-set-last','cu-set-email','cu-set-phone'];
  var vals=[pUser.first,pUser.last,pUser.email,pUser.phone||''];
  s.forEach(function(id,i){var el=document.getElementById(id);if(el)el.value=vals[i];});
}
function pSaveSettings(){
  var first=(document.getElementById('cu-set-first')||{}).value||pUser.first;
  var last=(document.getElementById('cu-set-last')||{}).value||pUser.last;
  var phone=(document.getElementById('cu-set-phone')||{}).value||'';
  var pass=(document.getElementById('cu-set-pass')||{}).value||'';
  var users=pGetUsers();
  users=users.map(function(u){
    if(u.id===pUser.id){u.first=first;u.last=last;u.phone=phone;if(pass&&pass.length>=8)u.pass=pass;return u;}return u;
  });
  pSaveUsers(users);pUser=users.find(function(u){return u.id===pUser.id;});
  localStorage.setItem('ns_portal_session',JSON.stringify(pUser));
  setText('cu-name',pUser.first+' '+pUser.last);showToast('\u2713 Settings saved');
}

/* ── MARKETPLACE ── */
function pSelectPkg(pkg){
  pSelectedPkg=pkg;pPromoDiscount=0;
  document.querySelectorAll('.p-mkt-card').forEach(function(c){c.classList.remove('sel');});
  var card=document.getElementById('mkt-'+pkg);if(card)card.classList.add('sel');
  var pricing=pGetPricing();
  var basePrice=pkg==='family'?(pricing.solo||2500):(pricing[pkg]||2500);
  document.getElementById('cu-checkout').style.display='block';
  setText('co-pkg-name',P_PKG_NAMES[pkg]);
  document.getElementById('co-discount-row').style.display='none';
  var depRow=document.getElementById('co-dep-row');
  if(depRow)depRow.style.display=pkg==='family'?'flex':'none';
  if(pkg==='family'){
    coDepCount=1;
    if(document.getElementById('co-dep-val'))document.getElementById('co-dep-val').textContent='1';
    var depPrice=(pricing.dep||500)*1;
    setText('co-pkg-price','\u20AC'+basePrice.toLocaleString()+' + \u20AC'+depPrice.toLocaleString()+' (1 person)');
    setText('co-total','\u20AC'+(basePrice+depPrice).toLocaleString());
  } else {
    coDepCount=0;
    if(document.getElementById('co-dep-val'))document.getElementById('co-dep-val').textContent='0';
    setText('co-pkg-price','\u20AC'+basePrice.toLocaleString());
    setText('co-total','\u20AC'+basePrice.toLocaleString());
  }
  document.getElementById('cu-checkout').scrollIntoView({behavior:'smooth',block:'nearest'});
}
function pApplyPromo(){
  var code=(document.getElementById('co-promo').value||'').trim().toUpperCase();
  if(!code){showToast('Enter a promo code');return;}
  var promos=pGetPromos();var promo=promos.find(function(p){return p.code===code&&p.active;});
  if(!promo){showToast('Invalid or expired promo code');return;}
  var pricing=pGetPricing();var prices={consultation:pricing.consultation,solo:pricing.solo,family:pricing.family};
  var basePrice=(prices[pSelectedPkg]||2500)+(pSelectedPkg==='family'?(pricing.dep||500)*coDepCount:0);
  pPromoDiscount=promo.type==='percent'?Math.round(basePrice*promo.discount/100):promo.discount;
  var finalPrice=Math.max(0,basePrice-pPromoDiscount);
  document.getElementById('co-discount-row').style.display='flex';
  setText('co-discount-val','-\u20AC'+pPromoDiscount.toLocaleString()+' ('+promo.code+')');
  setText('co-total','\u20AC'+finalPrice.toLocaleString());
  showToast('\u2713 Promo applied: '+promo.code);
}
function coChangeDep(delta){
  var pricing=pGetPricing();
  coDepCount=Math.max(0,coDepCount+delta);
  document.getElementById('co-dep-val').textContent=coDepCount;
  var basePrice=pricing.solo||2500;
  var depPrice=(pricing.dep||500)*coDepCount;
  var total=Math.max(0,basePrice+depPrice-pPromoDiscount);
  var priceLabel=coDepCount>0?'€'+basePrice.toLocaleString()+' + €'+depPrice.toLocaleString()+' ('+coDepCount+' person'+(coDepCount>1?'s':'')+')'   :'€'+basePrice.toLocaleString();
  setText('co-pkg-price',priceLabel);
  setText('co-total','€'+total.toLocaleString());
}
function pCompleteCheckout(){
  if(!pSelectedPkg){showToast('Select a package');return;}
  var pricing=pGetPricing();
  var basePrice=pSelectedPkg==='family'?(pricing.solo||2500):(pricing[pSelectedPkg]||2500);
  var depAddon=pSelectedPkg==='family'?(pricing.dep||500)*coDepCount:0;
  var price=Math.max(0,basePrice+depAddon-pPromoDiscount);
  var appTs=new Date().toISOString();
  var famCount=pSelectedPkg==='family'?coDepCount:0;
  var requiredIncome=calcIncomeThreshold(famCount);
  /* Determine referral source from user or fallback */
  var refSource=pUser.referral_source||'organic';
  var promoCode='';
  if(pPromoDiscount>0){
    var promos=pGetPromos();var usedPromo=promos.find(function(p){return p.active;});
    promoCode=usedPromo?usedPromo.code:'';
  }
  /* Create application — mirrors SQL applications table */
  var apps=pGetApps();
  var existing=apps.find(function(a){return a.userId===pUser.id;});
  if(!existing){
    /* Auto-assign CM with lowest load (load balancing) */
    var cms=pGetUsers().filter(function(u){return u.role==='case_manager';});
    var bestCM=null;var bestLoad=Infinity;
    cms.forEach(function(cm){
      var load=apps.filter(function(a){return a.cmId===cm.id&&a.stage<5;}).length;
      if(load<bestLoad){bestLoad=load;bestCM=cm;}
    });
    var newApp={
      id:'app'+Date.now(),userId:pUser.id,pkg:pSelectedPkg,stage:0,
      status:'new',app_status:APP_STATUS_ENUM.PAYMENT_PENDING,
      cmId:bestCM?bestCM.id:null,created:appTs,updated:appTs,last_activity:appTs,
      family_members_count:famCount,total_required_income:requiredIncome,
      docs:{passport:'missing',income:'missing',criminal:'missing',degree:'missing',insurance:'missing',other:'missing'},
      requiredDocs:['passport','income','criminal','degree','insurance','other'],
      docExpiries:{},notes:'',deps:coDepCount,
      stageDates:{0:appTs},
      statusHistory:[{status:APP_STATUS_ENUM.LEAD,at:appTs},{status:APP_STATUS_ENUM.PAYMENT_PENDING,at:appTs}]
    };
    apps.push(newApp);pSaveApps(apps);
    /* Seed normalised document entries */
    var docs=pGetDocuments();
    newApp.requiredDocs.forEach(function(docKey){
      docs.push({id:'doc'+Date.now()+'_'+docKey,application_id:newApp.id,name:docKey.replace(/_/g,' '),file_url:null,status:DOC_STATUS_ENUM.MISSING,expiry_date:null,internal_notes:''});
    });
    pSaveDocuments(docs);
    /* Update user cmId */
    if(bestCM){var users=pGetUsers();users=users.map(function(u){if(u.id===pUser.id){u.cmId=bestCM.id;}return u;});pSaveUsers(users);pUser.cmId=bestCM.id;localStorage.setItem('ns_portal_session',JSON.stringify(pUser));}
  } else {
    existing.pkg=pSelectedPkg;existing.deps=coDepCount;existing.updated=appTs;existing.last_activity=appTs;
    existing.family_members_count=famCount;existing.total_required_income=requiredIncome;
    existing.app_status=APP_STATUS_ENUM.PAYMENT_PENDING;
    if(!existing.statusHistory)existing.statusHistory=[];
    existing.statusHistory.push({status:APP_STATUS_ENUM.PAYMENT_PENDING,at:appTs});
    pSaveApps(apps);
  }
  /* Record payment — mirrors SQL payments table */
  var pays=pGetPays();
  var appForPay=apps.find(function(a){return a.userId===pUser.id;});
  pays.push({
    id:'pay'+Date.now(),userId:pUser.id,appId:appForPay?appForPay.id:'',
    amount:price,type:'payment',status:'paid',date:appTs,desc:P_PKG_NAMES[pSelectedPkg],
    referral_source:refSource,coupon_code:promoCode,coupon_discount:pPromoDiscount,
    stripe_session_id:'sim_'+Date.now()
  });
  pSavePays(pays);
  /* Update app_status to document_prep after payment */
  if(appForPay){
    apps=pGetApps();apps=apps.map(function(a){
      if(a.id===appForPay.id){
        a.app_status=APP_STATUS_ENUM.DOCUMENT_PREP;a.updated=appTs;a.last_activity=appTs;
        if(!a.statusHistory)a.statusHistory=[];
        a.statusHistory.push({status:APP_STATUS_ENUM.DOCUMENT_PREP,at:appTs});
      }
      return a;
    });pSaveApps(apps);
  }
  document.getElementById('cu-checkout').style.display='none';
  showToast('\u2713 Payment successful! Your application has been created.');
  pNav('cu','overview',null);
}

/* ══ ADMIN RENDERS ══ */
function pRenderAdmin(){pRenderAdAnalytics();}
function pRenderAdAnalytics(){
  /* System status banner at top */
  pRenderSystemStatusBanner('ad-analytics-status',true);
  var apps=pGetApps();var pays=pGetPays();var users=pGetUsers();
  var customers=users.filter(function(u){return u.role==='customer';});
  var paidPays=pays.filter(function(p){return p.status==='paid';});
  var rev=paidPays.reduce(function(s,p){return s+p.amount;},0);
  var approved=apps.filter(function(a){return a.stage===5;}).length;
  var approvalRate=apps.length?Math.round(approved/apps.length*100):0;
  setText('ad-stat-rev','\u20AC'+rev.toLocaleString());
  setText('ad-stat-apps',apps.length);setText('ad-stat-approved',approved);setText('ad-stat-users',customers.length);
  setText('ad-stat-rate',approvalRate+'% rate');

  /* ═══ Conversion Funnel (mirrors SQL app_status ENUM) ═══ */
  var funnelMap={};Object.values(APP_STATUS_ENUM).forEach(function(s){funnelMap[s]=0;});
  apps.forEach(function(app){var st=getAppStatus(app);if(st)funnelMap[st]++;});
  var funnelOrder=[APP_STATUS_ENUM.LEAD,APP_STATUS_ENUM.PAYMENT_PENDING,APP_STATUS_ENUM.DOCUMENT_PREP,APP_STATUS_ENUM.SUBMITTED,APP_STATUS_ENUM.APPROVED];
  var funnelLabels={lead:'Lead',payment_pending:'Payment',document_prep:'Doc Prep',submitted:'Submitted',approved:'Approved',rejected:'Rejected'};
  var funnelTotal=customers.length||1;
  var funnelHtml='<div class="an-funnel">';
  funnelOrder.forEach(function(status,i){
    var count=0;
    /* Funnel counts should be cumulative — everyone at or beyond this status */
    funnelOrder.forEach(function(s,j){if(j>=i)count+=funnelMap[s];});
    var pct=Math.round(count/funnelTotal*100);
    funnelHtml+='<div class="an-funnel-step">'
      +'<div class="an-f-count">'+count+'</div>'
      +'<div class="an-f-label">'+funnelLabels[status]+'</div>'
      +'<div class="an-f-pct">'+pct+'%</div>'
      +'<div class="an-f-bar" style="width:'+pct+'%;"></div>'
      +'</div>';
  });
  funnelHtml+='</div>';
  setHTML('ad-funnel',funnelHtml);

  /* Stage breakdown */
  var stages={};P_STAGES.forEach(function(s,i){stages[s]=apps.filter(function(a){return a.stage===i;}).length;});
  setHTML('ad-stage-breakdown',Object.entries(stages).map(function(e){
    var pct=apps.length?Math.round(e[1]/apps.length*100):0;
    return '<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;"><span>'+e[0]+'</span><span style="font-weight:700;">'+e[1]+'</span></div>'
      +'<div style="background:var(--bg2);border-radius:4px;height:6px;overflow:hidden;"><div style="background:var(--grad);width:'+pct+'%;height:100%;border-radius:4px;"></div></div></div>';
  }).join(''));

  /* ═══ Avg. Time in Stage ═══ */
  var avgTimes=pCalcAvgTimeInStage(apps);
  var timeHtml='<div class="an-avg-stage">';
  P_STAGES.forEach(function(name,i){
    if(i>=P_STAGES.length-1)return;
    timeHtml+='<div class="an-avg-card"><div class="an-avg-val">'+(avgTimes[i]||0)+'d</div><div class="an-avg-lbl">'+name+'</div></div>';
  });
  timeHtml+='</div>';
  setHTML('ad-time-in-stage',timeHtml);

  /* Revenue by pkg */
  var pkgRev={};['consultation','solo','family'].forEach(function(k){pkgRev[k]=paidPays.filter(function(p){var a=apps.find(function(a){return a.id===p.appId;});return a&&a.pkg===k;}).reduce(function(s,p){return s+p.amount;},0);});
  setHTML('ad-rev-breakdown',Object.entries(pkgRev).map(function(e){
    return '<div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--border);font-size:13px;"><span>'+P_PKG_NAMES[e[0]]+'</span><span style="font-weight:800;font-family:\'Bricolage Grotesque\',sans-serif;">\u20AC'+e[1].toLocaleString()+'</span></div>';
  }).join(''));

  /* ═══ Revenue by Source ═══ */
  var srcRev={};REFERRAL_SOURCES.forEach(function(s){srcRev[s]=0;});
  paidPays.forEach(function(p){var src=p.referral_source||'organic';if(!srcRev[src])srcRev[src]=0;srcRev[src]+=p.amount;});
  var maxSrc=Math.max.apply(null,Object.values(srcRev).concat([1]));
  var srcHtml='';
  Object.entries(srcRev).forEach(function(e){
    if(e[1]===0)return;
    var pct=Math.round(e[1]/maxSrc*100);
    srcHtml+='<div class="roi-bar-row"><div class="roi-bar-label">'+e[0].charAt(0).toUpperCase()+e[0].slice(1)+'</div>'
      +'<div class="roi-bar-track"><div class="roi-bar-fill src-'+e[0]+'" style="width:'+pct+'%;">\u20AC'+e[1].toLocaleString()+'</div></div></div>';
  });
  setHTML('ad-rev-source',srcHtml||'<p style="color:var(--text3);font-size:13px;">No revenue data.</p>');

  /* Recent activity */
  var recent=pays.sort(function(a,b){return new Date(b.date)-new Date(a.date);}).slice(0,5);
  setHTML('ad-recent-activity',recent.map(function(p){
    var u=users.find(function(u){return u.id===p.userId;})||{first:'Unknown',last:''};
    return '<div class="p-feed-item"><div class="p-feed-dot green"></div><div><div class="p-feed-text"><strong>'+escHtml(u.first+' '+u.last)+'</strong> paid \u20AC'+p.amount.toLocaleString()+' — '+escHtml(p.desc)+'</div><div class="p-feed-time">'+fmtDate(p.date)+'</div></div></div>';
  }).join('')||'<p style="color:var(--text3);font-size:13px;">No recent transactions.</p>');
}
function pRenderAdUsers(){
  var users=pGetUsers().filter(function(u){return u.role==='customer';});
  var apps=pGetApps();var cms=pGetUsers().filter(function(u){return u.role==='case_manager';});
  setHTML('ad-users-tbody',users.map(function(u){
    var app=apps.find(function(a){return a.userId===u.id;});
    var cm=u.cmId?cms.find(function(c){return c.id===u.cmId;}):null;
    return '<tr><td style="font-weight:600;">'+escHtml(u.first+' '+u.last)+'</td>'
      +'<td><a href="mailto:'+escHtml(u.email)+'" style="color:var(--brand);">'+escHtml(u.email)+'</a></td>'
      +'<td>'+(app?P_PKG_NAMES[app.pkg]||app.pkg:'—')+'</td>'
      +'<td>'+(app?'<span class="p-badge bd-prog">'+P_STAGES[app.stage]+'</span>':'—')+'</td>'
      +'<td>'+(cm?escHtml(cm.first+' '+cm.last):'<span style="color:var(--text3);">Unassigned</span>')+'</td>'
      +'<td style="font-size:12px;color:var(--text3);">'+fmtDate(u.created)+'</td>'
      +'<td><div class="p-tbl-actions">'
      +'<button class="p-btn p-btn-ghost p-btn-sm" onclick="pOpenModal(\'editUser\',\''+u.id+'\')">Edit</button>'
      +'<button class="p-btn p-btn-danger p-btn-sm" onclick="pDeleteUser(\''+u.id+'\')">Del</button></div></td></tr>';
  }).join('')||'<tr><td colspan="7" style="text-align:center;color:var(--text3);padding:24px;">No customers yet.</td></tr>');
}
function pFilterUsers(q){
  var rows=document.querySelectorAll('#ad-users-tbody tr');
  rows.forEach(function(r){r.style.display=(!q||r.textContent.toLowerCase().includes(q.toLowerCase()))?'':'none';});
}
function pDeleteUser(id){
  if(!confirm('Delete this user? This cannot be undone.'))return;
  var users=pGetUsers().filter(function(u){return u.id!==id;});pSaveUsers(users);pRenderAdUsers();showToast('User deleted');
}
function pRenderAdCMs(){
  var cms=pGetUsers().filter(function(u){return u.role==='case_manager';});
  var apps=pGetApps();var allUsers=pGetUsers();

  /* Capacity overview cards */
  var capHtml='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;margin-bottom:20px;">';
  cms.forEach(function(cm){
    var active=apps.filter(function(a){return a.cmId===cm.id&&a.stage<5;}).length;
    var max=cm.maxCapacity||CM_MAX_CAPACITY;
    var pct=Math.round(active/max*100);
    var cls=pct<50?'low':pct<80?'mid':'high';
    capHtml+='<div class="cap-card">'
      +'<div class="cap-card-name">'+escHtml(cm.first+' '+cm.last)+'</div>'
      +'<div class="cap-card-meta">'+escHtml(cm.email)+' · '+active+' active / '+max+' max</div>'
      +pCapacityBar(active,max)
      +'</div>';
  });
  capHtml+='</div>';
  setHTML('ad-cms-capacity',capHtml);

  /* Table */
  setHTML('ad-cms-tbody',cms.map(function(cm){
    var assigned=allUsers.filter(function(u){return u.role==='customer'&&u.cmId===cm.id;}).length;
    var active=apps.filter(function(a){return a.cmId===cm.id&&a.stage<5;}).length;
    var max=cm.maxCapacity||CM_MAX_CAPACITY;
    return '<tr><td style="font-weight:600;">'+escHtml(cm.first+' '+cm.last)+'</td>'
      +'<td><a href="mailto:'+escHtml(cm.email)+'" style="color:var(--brand);">'+escHtml(cm.email)+'</a></td>'
      +'<td>'+assigned+'</td><td>'+active+'</td>'
      +'<td>'+pCapacityBar(active,max)+'</td>'
      +'<td style="font-size:12px;color:var(--text3);">'+fmtDate(cm.created)+'</td>'
      +'<td><div class="p-tbl-actions">'
      +'<button class="p-btn p-btn-ghost p-btn-sm" onclick="pOpenModal(\'editCM\',\''+cm.id+'\')">Edit</button>'
      +'<button class="p-btn p-btn-danger p-btn-sm" onclick="pDeleteCM(\''+cm.id+'\')">Del</button></div></td></tr>';
  }).join('')||'<tr><td colspan="7" style="text-align:center;color:var(--text3);padding:24px;">No case managers yet.</td></tr>');
}
function pDeleteCM(id){if(!confirm('Delete this case manager?'))return;var users=pGetUsers().filter(function(u){return u.id!==id;});pSaveUsers(users);pRenderAdCMs();showToast('Case manager deleted');}
function pRenderAdApps(filter,stageFilter){
  var apps=pGetApps();var users=pGetUsers();
  var cms=users.filter(function(u){return u.role==='case_manager';});
  if(filter)apps=apps.filter(function(a){var u=users.find(function(u){return u.id===a.userId;})||{};return (u.first+' '+u.last+' '+u.email).toLowerCase().includes(filter.toLowerCase());});
  if(stageFilter!==undefined&&stageFilter!=='')apps=apps.filter(function(a){return a.stage===parseInt(stageFilter);});
  setHTML('ad-apps-tbody',apps.map(function(a){
    var u=users.find(function(u){return u.id===a.userId;})||{first:'Unknown',last:''};
    /* CM assignment dropdown */
    var cmSelect='<select class="cm-assign-select" onchange="pAssignCM(\''+a.id+'\',this.value)">'
      +'<option value="">Unassigned</option>';
    cms.forEach(function(cm){cmSelect+='<option value="'+cm.id+'"'+(a.cmId===cm.id?' selected':'')+'>'+escHtml(cm.first+' '+cm.last)+'</option>';});
    cmSelect+='</select>';
    return '<tr><td style="font-weight:600;">'+escHtml(u.first+' '+u.last)+'</td>'
      +'<td>'+escHtml(P_PKG_NAMES[a.pkg]||a.pkg)+'</td>'
      +'<td><span class="p-badge '+(a.stage===5?'bd-done':'bd-prog')+'">'+P_STAGES[a.stage]+'</span></td>'
      +'<td>'+pDocProgressBar(a)+'</td>'
      +'<td>'+cmSelect+'</td>'
      +'<td>'+pUrgencyFlag(a.updated)+'</td>'
      +'<td style="font-size:12px;color:var(--text3);">'+fmtDate(a.updated)+'</td>'
      +'<td><div class="p-tbl-actions">'
      +'<button class="p-btn p-btn-ghost p-btn-sm" onclick="pOpenModal(\'editApp\',\''+a.id+'\')">Manage</button>'
      +'<button class="p-btn p-btn-danger p-btn-sm" onclick="pDeleteApp(\''+a.id+'\')">Del</button></div></td></tr>';
  }).join('')||'<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:24px;">No applications found.</td></tr>');
}
/* Admin: Assign CM to application */
function pAssignCM(appId,cmId){
  var apps=pGetApps();var users=pGetUsers();
  apps=apps.map(function(a){
    if(a.id===appId){
      a.cmId=cmId||null;a.updated=new Date().toISOString();
      if(!a.activityLog)a.activityLog=[];
      var cmUser=cmId?users.find(function(u){return u.id===cmId;}):null;
      a.activityLog.push({ts:new Date().toISOString(),icon:'👤',type:'action',text:'Case manager '+(cmUser?'assigned: '+cmUser.first+' '+cmUser.last:'unassigned')});
    }
    return a;
  });
  /* Also update the user's cmId */
  if(cmId){
    var app=apps.find(function(a){return a.id===appId;});
    if(app){
      users=users.map(function(u){if(u.id===app.userId){u.cmId=cmId;}return u;});
      pSaveUsers(users);
    }
  }
  pSaveApps(apps);showToast('\u2713 Case manager updated');
}
function pFilterApps(q){pRenderAdApps(q);}
function pFilterAppStage(s){pRenderAdApps('',s);}
function pDeleteApp(id){if(!confirm('Delete application?'))return;pSaveApps(pGetApps().filter(function(a){return a.id!==id;}));pRenderAdApps();showToast('Application deleted');}
function pRenderAdProducts(){
  var p=pGetPricing();
  if(document.getElementById('ad-price-consultation'))document.getElementById('ad-price-consultation').value=p.consultation;
  if(document.getElementById('ad-price-solo'))document.getElementById('ad-price-solo').value=p.solo;
  if(document.getElementById('ad-price-family'))document.getElementById('ad-price-family').value=p.family;
  if(document.getElementById('ad-price-dep'))document.getElementById('ad-price-dep').value=p.dep;
  var promos=pGetPromos();
  setHTML('ad-promos-list',promos.map(function(pr){
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);">'
      +'<div><div style="font-weight:700;font-size:13px;">'+escHtml(pr.code)+'</div>'
      +'<div style="font-size:12px;color:var(--text3);">'+(pr.type==='percent'?pr.discount+'% off':'\u20AC'+pr.discount+' off')+' \u00b7 '+pr.uses+'/'+pr.max+' uses</div></div>'
      +'<div style="display:flex;gap:6px;">'
      +'<span class="p-badge '+(pr.active?'bd-done':'bd-reject')+'">'+(pr.active?'Active':'Inactive')+'</span>'
      +'<button class="p-btn p-btn-danger p-btn-sm" onclick="pDeletePromo(\''+pr.id+'\')">Del</button></div></div>';
  }).join('')||'<p style="color:var(--text3);font-size:13px;">No promo codes.</p>');
}
function pSavePricing(){
  var p={consultation:parseFloat(document.getElementById('ad-price-consultation').value)||30,solo:parseFloat(document.getElementById('ad-price-solo').value)||2500,family:parseFloat(document.getElementById('ad-price-family').value)||3000,dep:parseFloat(document.getElementById('ad-price-dep').value)||500};
  pSavePricing2(p);showToast('\u2713 Pricing saved');
}
function pDeletePromo(id){pSavePromos(pGetPromos().filter(function(p){return p.id!==id;}));pRenderAdProducts();showToast('Promo deleted');}
function pRenderAdFinancials(){
  var pays=pGetPays();var users=pGetUsers();
  var paidPays=pays.filter(function(p){return p.status==='paid';});
  var rev=paidPays.reduce(function(s,p){return s+p.amount;},0);
  var pend=pays.filter(function(p){return p.status==='pending';}).reduce(function(s,p){return s+p.amount;},0);
  var refund=pays.filter(function(p){return p.status==='refunded';}).reduce(function(s,p){return s+p.amount;},0);
  var totalCouponSavings=paidPays.reduce(function(s,p){return s+(p.coupon_discount||0);},0);
  setText('ad-fin-rev','\u20AC'+rev.toLocaleString());setText('ad-fin-pend','\u20AC'+pend.toLocaleString());setText('ad-fin-refund','\u20AC'+refund.toLocaleString());setText('ad-fin-coupons','\u20AC'+totalCouponSavings.toLocaleString());

  /* Revenue by referral source (ROI chart) */
  var srcRev={};REFERRAL_SOURCES.forEach(function(s){srcRev[s]=0;});
  paidPays.forEach(function(p){var src=p.referral_source||'organic';if(!srcRev[src])srcRev[src]=0;srcRev[src]+=p.amount;});
  var maxSrc=Math.max.apply(null,Object.values(srcRev).concat([1]));
  var roiHtml='';
  Object.entries(srcRev).forEach(function(e){
    if(e[1]===0)return;
    var pct=Math.round(e[1]/maxSrc*100);
    roiHtml+='<div class="roi-bar-row"><div class="roi-bar-label">'+e[0].charAt(0).toUpperCase()+e[0].slice(1)+'</div>'
      +'<div class="roi-bar-track"><div class="roi-bar-fill src-'+e[0]+'" style="width:'+pct+'%;">\u20AC'+e[1].toLocaleString()+'</div></div></div>';
  });
  setHTML('ad-fin-roi',roiHtml||'<p style="color:var(--text3);font-size:13px;">No source data.</p>');

  /* Coupon performance */
  var couponMap={};
  paidPays.forEach(function(p){
    if(p.coupon_code){
      if(!couponMap[p.coupon_code])couponMap[p.coupon_code]={uses:0,discount:0,revenue:0};
      couponMap[p.coupon_code].uses++;
      couponMap[p.coupon_code].discount+=(p.coupon_discount||0);
      couponMap[p.coupon_code].revenue+=p.amount;
    }
  });
  var couponHtml=Object.entries(couponMap).map(function(e){
    return '<div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--border);font-size:13px;">'
      +'<div><span style="font-weight:700;">'+escHtml(e[0])+'</span> <span style="color:var(--text3);">('+e[1].uses+' uses)</span></div>'
      +'<div><span style="color:#dc2626;font-weight:600;">-\u20AC'+e[1].discount.toLocaleString()+'</span> / <span style="color:#16a34a;font-weight:600;">\u20AC'+e[1].revenue.toLocaleString()+' rev</span></div></div>';
  }).join('');
  setHTML('ad-fin-coupon-breakdown',couponHtml||'<p style="color:var(--text3);font-size:13px;">No coupons used.</p>');

  /* Transactions table */
  setHTML('ad-fin-tbody',pays.sort(function(a,b){return new Date(b.date)-new Date(a.date);}).map(function(p){
    var u=users.find(function(u){return u.id===p.userId;})||{first:'Unknown',last:''};
    return '<tr><td style="font-size:12px;color:var(--text3);">'+fmtDate(p.date)+'</td>'
      +'<td style="font-weight:600;">'+escHtml(u.first+' '+u.last)+'</td>'
      +'<td>'+escHtml(p.desc)+'</td>'
      +'<td><span style="font-size:11px;color:var(--text3);">'+(p.referral_source||'organic')+'</span></td>'
      +'<td>'+(p.coupon_code?'<span class="p-badge bd-new">'+escHtml(p.coupon_code)+'</span>':'<span style="color:var(--text3);">—</span>')+'</td>'
      +'<td style="font-family:\'Bricolage Grotesque\',sans-serif;font-weight:700;">\u20AC'+p.amount.toLocaleString()+'</td>'
      +'<td><span class="p-badge '+(p.status==='paid'?'bd-paid':p.status==='pending'?'bd-pending':'bd-reject')+'">'+p.status+'</span></td>'
      +'<td><div class="p-tbl-actions">'+(p.status==='paid'?'<button class="p-btn p-btn-warn p-btn-sm" onclick="pRefund(\''+p.id+'\')">Refund</button>':'')+'</div></td></tr>';
  }).join('')||'<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:24px;">No transactions.</td></tr>');
}
function pRefund(id){
  if(!confirm('Process refund for this payment?'))return;
  var pays=pGetPays();pays=pays.map(function(p){if(p.id===id)p.status='refunded';return p;});pSavePays(pays);pRenderAdFinancials();showToast('\u2713 Refund processed');
}
function pExportFinancials(){
  var pays=pGetPays();var users=pGetUsers();
  var csv='Date,Client,Description,Source,Coupon,Amount,Status\n'+pays.map(function(p){var u=users.find(function(u){return u.id===p.userId;})||{first:'',last:''};return [fmtDate(p.date),u.first+' '+u.last,p.desc,p.referral_source||'organic',p.coupon_code||'',p.amount,p.status].map(function(v){return '"'+String(v||'').replace(/"/g,'""')+'"';}).join(',');}).join('\n');
  var a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);a.download='nomadspain-financials.csv';a.click();
}
function pRenderAdSupport(){
  var users=pGetUsers().filter(function(u){return u.role==='customer';});
  var msgs=pGetMsgs();
  setHTML('ad-msg-list',users.map(function(u){
    var last=msgs.filter(function(m){return m.fromId===u.id||m.toId===u.id;}).sort(function(a,b){return new Date(b.ts)-new Date(a.ts);})[0];
    var unread=msgs.filter(function(m){return m.fromId===u.id&&!m.read;}).length;
    return '<div class="p-msg-thread" onclick="pOpenThread(\''+u.id+'\',\'admin\')">'
      +'<div style="display:flex;justify-content:space-between;align-items:center;">'
      +'<div class="p-msg-thread-name">'+escHtml(u.first+' '+u.last)+'</div>'
      +(unread?'<div style="background:var(--brand);color:#fff;border-radius:50%;width:18px;height:18px;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;">'+unread+'</div>':'')+'</div>'
      +'<div class="p-msg-thread-prev">'+(last?escHtml(last.body.substring(0,40)):'No messages')+'</div></div>';
  }).join('')||'<div style="padding:16px;font-size:13px;color:var(--text3);">No customers.</div>');
}
function pRenderAdCompliance(){
  var tpls=pGetTemplates();var apps=pGetApps();var users=pGetUsers();

  /* ═══ Expiry Dashboard ═══ */
  var expiries=pGetDocExpiries(apps,users);
  var expired=expiries.filter(function(e){return e.status==='expired';});
  var expiring=expiries.filter(function(e){return e.status==='expiring';});
  var valid=expiries.filter(function(e){return e.status==='valid';});
  setText('ad-comp-expired',expired.length);
  setText('ad-comp-expiring',expiring.length);
  setText('ad-comp-valid',valid.length);

  var alertsHtml='';
  expired.concat(expiring).slice(0,10).forEach(function(e){
    var isExpired=e.status==='expired';
    alertsHtml+='<div class="expiry-alert-card'+(isExpired?'':' warn')+'">'
      +'<div class="expiry-alert-icon">'+(isExpired?'\uD83D\uDEA8':'\u23F0')+'</div>'
      +'<div class="expiry-alert-body">'
      +'<div class="expiry-alert-title">'+escHtml(e.userName)+' — '+escHtml(e.docKey.replace(/_/g,' '))+'</div>'
      +'<div class="expiry-alert-sub">'+(isExpired?'Expired '+Math.abs(e.daysLeft)+' days ago':'Expires in '+e.daysLeft+' days — '+fmtDate(e.expiryDate))+'</div>'
      +'</div>'
      +'<span class="expiry-badge '+e.status+'">'+(isExpired?'Expired':'Expiring')+'</span>'
      +'</div>';
  });
  setHTML('ad-expiry-alerts',alertsHtml||'<p style="color:var(--text3);font-size:13px;">No expiry alerts.</p>');

  /* Templates list */
  setHTML('ad-compliance-list',tpls.map(function(t){
    return '<div class="p-card" style="margin-bottom:14px;">'
      +'<div class="p-card-hd"><div class="p-card-title">'+escHtml(t.visaType)+'</div>'
      +'<div class="p-tbl-actions">'
      +'<button class="p-btn p-btn-ghost p-btn-sm" onclick="pOpenModal(\'editTemplate\',\''+t.id+'\')">Edit</button>'
      +'<button class="p-btn p-btn-danger p-btn-sm" onclick="pDeleteTemplate(\''+t.id+'\')">Del</button></div></div>'
      +'<div class="p-table-wrap"><table class="p-table"><thead><tr><th>Document</th><th>Required</th><th>Description</th></tr></thead><tbody>'
      +t.docs.map(function(d){return '<tr><td style="font-weight:600;">'+escHtml(d.name)+'</td><td>'+(d.required?'<span class="p-badge bd-reject">Required</span>':'<span class="p-badge bd-pending">Optional</span>')+'</td><td style="font-size:12px;color:var(--text2);">'+escHtml(d.desc)+'</td></tr>';}).join('')
      +'</tbody></table></div></div>';
  }).join('')||'<p style="color:var(--text3);font-size:14px;">No templates yet. Click "+ Add Template" to create one.</p>');
}
function pDeleteTemplate(id){if(!confirm('Delete this template?'))return;pSaveTemplates(pGetTemplates().filter(function(t){return t.id!==id;}));pRenderAdCompliance();showToast('Template deleted');}

/* ══ ADMIN PROVINCES PANEL ══ */
function pRenderAdProvinces(){
  pRenderSystemStatusBanner('ad-system-status',true);
  pRenderProvinceHeatmap('ad-province-heatmap',true);
}

/* ══ CM PROVINCES PANEL ══ */
function pRenderCMProvinces(){
  pRenderSystemStatusBanner('cm-system-status',false);
  pRenderProvinceHeatmap('cm-province-heatmap',false);
}

/* ══ CASE MANAGER RENDERS ══ */
function pRenderCM(){pRenderCMWorklist();}
function pGetMyCMApps(){
  return pGetApps().filter(function(a){return a.cmId===pUser.id;});
}
function pRenderCMWorklist(){
  /* System status banner (Efficiency Risk warning) */
  var sysStatus=pGetSystemStatus();
  var isCritical=sysStatus.indexOf('Critical')!==-1||sysStatus.indexOf('High')!==-1;
  if(isCritical){
    setHTML('cm-worklist-status','<div class="system-status-banner status-critical">'
      +'<div class="system-status-icon">🔴</div>'
      +'<div class="system-status-body">'
      +'<div class="system-status-title">⚠ Efficiency Risk — '+escHtml(sysStatus)+'</div>'
      +'<div class="system-status-detail">All cases may experience extended processing times. Proactively manage client expectations and consider alternative provinces.</div>'
      +'</div></div>');
  } else if(sysStatus!=='Normal'){
    setHTML('cm-worklist-status','<div class="system-status-banner status-moderate">'
      +'<div class="system-status-icon">🟡</div>'
      +'<div class="system-status-body">'
      +'<div class="system-status-title">System Status: '+escHtml(sysStatus)+'</div>'
      +'<div class="system-status-detail">Some provinces experiencing delays. Check Province Tracker for details.</div>'
      +'</div></div>');
  } else {
    setHTML('cm-worklist-status','');
  }
  var myApps=pGetMyCMApps();var users=pGetUsers();var allApps=pGetApps();
  var msgs=pGetMsgs().filter(function(m){return !m.read&&m.toId===pUser.id;});
  var clients=users.filter(function(u){return u.cmId===pUser.id;});
  var activeCount=myApps.filter(function(a){return a.stage<5;}).length;
  var maxCap=pUser.maxCapacity||CM_MAX_CAPACITY;
  var capPct=Math.round(activeCount/maxCap*100);
  setText('cm-stat-clients',clients.length);
  setText('cm-stat-overdue',myApps.filter(function(a){return a.stage<2&&new Date()-new Date(a.created)>7*24*3600*1000;}).length);
  setText('cm-stat-msgs',msgs.length);
  setText('cm-stat-cap',capPct+'%');

  /* My capacity bar */
  setHTML('cm-my-capacity',pCapacityBar(activeCount,maxCap)
    +'<div style="font-size:12px;color:var(--text3);margin-top:6px;">'+activeCount+' active cases out of '+maxCap+' maximum capacity</div>');

  /* Peer availability */
  var otherCMs=users.filter(function(u){return u.role==='case_manager'&&u.id!==pUser.id;});
  var peerHtml='';
  if(otherCMs.length){
    otherCMs.forEach(function(cm){
      var cmActive=allApps.filter(function(a){return a.cmId===cm.id&&a.stage<5;}).length;
      var cmMax=cm.maxCapacity||CM_MAX_CAPACITY;
      peerHtml+='<div style="margin-bottom:10px;"><div style="font-size:13px;font-weight:600;margin-bottom:4px;">'+escHtml(cm.first+' '+cm.last)+'</div>'+pCapacityBar(cmActive,cmMax)+'</div>';
    });
  } else {
    peerHtml='<p style="color:var(--text3);font-size:13px;">No other case managers.</p>';
  }
  setHTML('cm-peer-capacity',peerHtml);

  /* Expiry alerts for assigned apps */
  var expiries=pGetDocExpiries(myApps,users);
  var urgentExpiries=expiries.filter(function(e){return e.status==='expired'||e.status==='expiring';}).slice(0,5);
  var expHtml='';
  if(urgentExpiries.length){
    urgentExpiries.forEach(function(e){
      var isExpired=e.status==='expired';
      expHtml+='<div class="expiry-alert-card'+(isExpired?'':' warn')+'">'
        +'<div class="expiry-alert-icon">'+(isExpired?'\uD83D\uDEA8':'\u23F0')+'</div>'
        +'<div class="expiry-alert-body">'
        +'<div class="expiry-alert-title">'+escHtml(e.userName)+' — '+escHtml(e.docKey.replace(/_/g,' '))+'</div>'
        +'<div class="expiry-alert-sub">'+(isExpired?'Expired '+Math.abs(e.daysLeft)+' days ago':'Expires in '+e.daysLeft+' days')+'</div>'
        +'</div>'
        +'<span class="expiry-badge '+e.status+'">'+(isExpired?'Expired':'Expiring')+'</span>'
        +'</div>';
    });
  } else {
    expHtml='<p style="color:var(--text3);font-size:13px;">No expiry alerts for your clients.</p>';
  }
  setHTML('cm-expiry-alerts',expHtml);

  /* Client table with tri-state bars, priority scores & urgency */
  setHTML('cm-clients-tbody',clients.map(function(u){
    var app=myApps.find(function(a){return a.userId===u.id;});
    var priScore=app?calculatePriorityScore(app):0;
    return '<tr><td style="font-weight:600;">'+escHtml(u.first+' '+u.last)+'</td>'
      +'<td>'+(app?escHtml(P_PKG_NAMES[app.pkg]||app.pkg):'—')+'</td>'
      +'<td>'+(app?'<span class="p-badge bd-prog">'+P_STAGES[app.stage]+'</span>':'—')+'</td>'
      +'<td>'+(app?pTriStateBar(app):'—')+'</td>'
      +'<td>'+(app?pPriorityBadge(priScore):'—')+'</td>'
      +'<td>'+(app?pUrgencyFlag(app.updated):'—')+'</td>'
      +'<td><div class="p-tbl-actions">'
      +'<button class="p-btn p-btn-ghost p-btn-sm" onclick="pOpenThread(\''+u.id+'\',\'cm\');pNav(\'cm\',\'support\',null)">Message</button>'
      +(app?'<button class="p-btn p-btn-primary p-btn-sm" onclick="pCMManageApp(\''+app.id+'\')">Manage</button>':'')
      +'</div></td></tr>';
  }).join('')||'<tr><td colspan="7" style="text-align:center;color:var(--text3);padding:24px;">No clients assigned.</td></tr>');
}
function pRenderCMApps(){
  var apps=pGetMyCMApps();var users=pGetUsers();
  /* Sort by priority score descending */
  apps.sort(function(a,b){return calculatePriorityScore(b)-calculatePriorityScore(a);});
  setHTML('cm-apps-tbody',apps.map(function(a){
    var u=users.find(function(u){return u.id===a.userId;})||{first:'Unknown',last:''};
    var priScore=calculatePriorityScore(a);
    return '<tr><td style="font-weight:600;">'+escHtml(u.first+' '+u.last)+'</td>'
      +'<td>'+escHtml(P_PKG_NAMES[a.pkg]||a.pkg)+'</td>'
      +'<td><span class="p-badge '+(a.stage===5?'bd-done':'bd-prog')+'">'+P_STAGES[a.stage]+'</span></td>'
      +'<td>'+pTriStateBar(a)+'</td>'
      +'<td>'+pPriorityBadge(priScore)+'</td>'
      +'<td>'+pUrgencyFlag(a.updated)+'</td>'
      +'<td><button class="p-btn p-btn-primary p-btn-sm" onclick="pCMManageApp(\''+a.id+'\')">Manage</button></td></tr>';
  }).join('')||'<tr><td colspan="7" style="text-align:center;color:var(--text3);padding:24px;">No applications.</td></tr>');
}
function pRenderCMSupport(){
  var clients=pGetUsers().filter(function(u){return u.cmId===pUser.id;});
  var msgs=pGetMsgs();
  setHTML('cm-msg-list',clients.map(function(u){
    var last=msgs.filter(function(m){return m.fromId===u.id||m.toId===u.id;}).sort(function(a,b){return new Date(b.ts)-new Date(a.ts);})[0];
    var unread=msgs.filter(function(m){return m.fromId===u.id&&m.toId===pUser.id&&!m.read;}).length;
    return '<div class="p-msg-thread" onclick="pOpenThread(\''+u.id+'\',\'cm\')">'
      +'<div style="display:flex;justify-content:space-between;align-items:center;">'
      +'<div class="p-msg-thread-name">'+escHtml(u.first+' '+u.last)+'</div>'
      +(unread?'<div style="background:var(--brand);color:#fff;border-radius:50%;width:18px;height:18px;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;">'+unread+'</div>':'')+'</div>'
      +'<div class="p-msg-thread-prev">'+(last?escHtml(last.body.substring(0,40)):'No messages')+'</div></div>';
  }).join('')||'<div style="padding:16px;font-size:13px;color:var(--text3);">No assigned clients.</div>');
}
function pLoadCMSettings(){var el=document.getElementById('cm-set-first');if(el)el.value=pUser.first;el=document.getElementById('cm-set-last');if(el)el.value=pUser.last;el=document.getElementById('cm-set-email');if(el)el.value=pUser.email;}
function pSaveCMSettings(){var first=(document.getElementById('cm-set-first')||{}).value||pUser.first;var last=(document.getElementById('cm-set-last')||{}).value||pUser.last;var pass=(document.getElementById('cm-set-pass')||{}).value||'';var users=pGetUsers();users=users.map(function(u){if(u.id===pUser.id){u.first=first;u.last=last;if(pass&&pass.length>=8)u.pass=pass;return u;}return u;});pSaveUsers(users);pUser=users.find(function(u){return u.id===pUser.id;});localStorage.setItem('ns_portal_session',JSON.stringify(pUser));setText('cm-name',pUser.first+' '+pUser.last);showToast('\u2713 Settings saved');}

/* ══ CM MANAGE APP — KANBAN VIEW ══ */
var cmManageAppId=null;
var cmManageTab='kanban';
var cmManageProfileIdx=0;

function pCMManageApp(appId){
  cmManageAppId=appId;cmManageTab='kanban';cmManageProfileIdx=0;
  // switch to the manage panel
  document.querySelectorAll('#pCM .p-panel').forEach(function(p){p.classList.remove('active');});
  var panel=document.getElementById('cm-manage-app');if(panel)panel.classList.add('active');
  document.querySelectorAll('#pCM .p-nav-item').forEach(function(n){n.classList.remove('active');});
  var titleEl=document.getElementById('cm-topbar-title');if(titleEl)titleEl.textContent='Manage Application';
  pRenderCMManage();
}

function pCMManageBack(){
  cmManageAppId=null;
  pNav('cm','applications',document.querySelector('#pCM .p-nav-item[onclick*="applications"]'));
}

function pCMManageTabSwitch(tab){
  cmManageTab=tab;pRenderCMManage();
}

function pRenderCMManage(){
  var app=pGetApps().find(function(a){return a.id===cmManageAppId;});
  if(!app){pCMManageBack();return;}
  var users=pGetUsers();
  var u=users.find(function(x){return x.id===app.userId;})||{first:'Unknown',last:''};
  var initials=((u.first||'')[0]||'')+((u.last||'')[0]||'');
  var el=document.getElementById('cm-manage-content');if(!el)return;

  var html='<button class="cm-manage-back" onclick="pCMManageBack()">← Back to Applications</button>';
  // Header
  html+='<div class="cm-manage-header">'
    +'<div class="cm-manage-client">'
    +'<div class="cm-manage-avatar">'+escHtml(initials.toUpperCase())+'</div>'
    +'<div><div class="cm-manage-name">'+escHtml(u.first+' '+u.last)+'</div>'
    +'<div class="cm-manage-meta">'+escHtml(P_PKG_NAMES[app.pkg]||app.pkg)+' · Created '+fmtDate(app.created)+'</div></div></div>'
    +'<div><span class="p-badge '+(app.stage===5?'bd-done':'bd-prog')+'" style="font-size:13px;padding:5px 14px;">'+P_STAGES[app.stage]+'</span></div>'
    +'</div>';

  /* Priority score & financial health in header */
  var priScore=calculatePriorityScore(app);
  var profile=pGetProfile(app.userId);
  html+='<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px;">'
    +pPriorityBadge(priScore)
    +'</div>';
  html+=pRenderFinancialHealth(app,profile);

  // Tabs
  html+='<div class="cm-manage-tabs">'
    +'<button class="cm-manage-tab'+(cmManageTab==='kanban'?' active':'')+'" onclick="pCMManageTabSwitch(\'kanban\')">Overview</button>'
    +'<button class="cm-manage-tab'+(cmManageTab==='documents'?' active':'')+'" onclick="pCMManageTabSwitch(\'documents\')">Documents</button>'
    +'<button class="cm-manage-tab'+(cmManageTab==='reviewer'?' active':'')+'" onclick="pCMManageTabSwitch(\'reviewer\')">Reviewer</button>'
    +'<button class="cm-manage-tab'+(cmManageTab==='appointments'?' active':'')+'" onclick="pCMManageTabSwitch(\'appointments\')">Appointments</button>'
    +'<button class="cm-manage-tab'+(cmManageTab==='ex17'?' active':'')+'" onclick="pCMManageTabSwitch(\'ex17\')">EX-17</button>'
    +'<button class="cm-manage-tab'+(cmManageTab==='timeline'?' active':'')+'" onclick="pCMManageTabSwitch(\'timeline\')">Timeline</button>'
    +'</div>';

  if(cmManageTab==='kanban') html+=pCMRenderKanban(app,u);
  else if(cmManageTab==='documents') html+=pCMRenderDocs(app);
  else if(cmManageTab==='reviewer') html+=pCMRenderReviewer(app);
  else if(cmManageTab==='appointments') html+=pCMRenderAppointments(app);
  else if(cmManageTab==='ex17') html+=pCMRenderEX17(app);
  else if(cmManageTab==='timeline') html+=pCMRenderTimeline(app,u);

  el.innerHTML=html;
}

/* ── Kanban tab ── */
function pCMRenderKanban(app,u){
  var html='<div class="cm-kanban">';
  P_STAGES.forEach(function(stage,i){
    var isActive=app.stage===i;
    html+='<div class="cm-kanban-col'+(isActive?' active-col':'')+'">';
    html+='<div class="cm-kanban-col-hd">'+stage+'<span class="cm-kanban-col-count">'+(isActive?'1':'0')+'</span></div>';
    if(isActive){
      var profCount=(app.profiles||[]).length;
      var submitted=app.docsSubmitted?'Yes':'No';
      html+='<div class="cm-kanban-card">'
        +'<div class="cm-kanban-card-stage">Current Stage</div>'
        +'<div style="font-size:13px;font-weight:700;margin-bottom:6px;">'+escHtml(u.first+' '+u.last)+'</div>'
        +'<div style="font-size:11px;color:var(--text3);margin-bottom:4px;">'+escHtml(P_PKG_NAMES[app.pkg]||app.pkg)+'</div>'
        +'<div style="font-size:11px;color:var(--text3);">Profiles: '+profCount+' · Docs submitted: '+submitted+'</div>'
        +'</div>';
    } else {
      html+='<div class="cm-kanban-empty">'+(i<app.stage?'✓ Completed':'Pending')+'</div>';
    }
    html+='</div>';
  });
  html+='</div>';

  // Stage move actions
  html+='<div class="p-card" style="margin-top:20px;">'
    +'<div class="p-card-title" style="margin-bottom:14px;">Stage Actions</div>'
    +'<div class="cm-stage-actions">';
  if(app.stage>0) html+='<button class="p-btn p-btn-ghost" onclick="pCMMoveStage(\''+app.id+'\',-1)">← Previous Stage</button>';
  if(app.stage<P_STAGES.length-1) html+='<button class="p-btn p-btn-primary" onclick="pCMMoveStage(\''+app.id+'\',1)">Next Stage →</button>';
  if(app.stage===P_STAGES.length-1) html+='<button class="p-btn p-btn-success" disabled style="opacity:0.7;">✓ Application Approved</button>';
  html+='</div></div>';

  // Quick actions
  html+='<div class="p-grid2" style="margin-top:14px;">';
  // Send request change
  html+='<div class="p-card"><div class="p-card-title" style="margin-bottom:10px;">Request Changes</div>'
    +'<textarea class="cm-note-area" id="cm-request-msg" rows="2" placeholder="Describe what needs to change…"></textarea>'
    +'<button class="p-btn p-btn-warn" style="margin-top:10px;width:100%;justify-content:center;" onclick="pCMRequestChange(\''+app.id+'\')">Send Request</button>'
    +'</div>';
  // Internal notes
  html+='<div class="p-card"><div class="p-card-title" style="margin-bottom:10px;">Internal Notes</div>'
    +'<textarea class="cm-note-area" id="cm-internal-note" rows="2" placeholder="Add a private note…">'+escHtml(app.notes||'')+'</textarea>'
    +'<button class="p-btn p-btn-ghost" style="margin-top:10px;width:100%;justify-content:center;" onclick="pCMSaveNote(\''+app.id+'\')">Save Note</button>'
    +'</div>';
  html+='</div>';

  return html;
}

/* ── Documents tab ── */
function pCMRenderDocs(app){
  var profiles=app.profiles||[];
  if(!profiles.length) return '<div class="p-card"><div style="text-align:center;padding:30px;color:var(--text3);">No profiles / documents submitted yet.</div></div>';

  var html='<div class="cm-profile-tabs">';
  profiles.forEach(function(prof,i){
    html+='<button class="cm-profile-tab'+(cmManageProfileIdx===i?' active':'')+'" onclick="cmManageProfileIdx='+i+';pRenderCMManage();">'
      +escHtml(prof.name)+' <span style="font-size:10px;opacity:0.7;">('+escHtml(PROFILE_TYPE_LABELS[prof.type]||prof.type)+')</span></button>';
  });
  html+='</div>';

  var prof=profiles[cmManageProfileIdx]||profiles[0];
  var checklist=PROFILE_CHECKLISTS[prof.type]||[];

  // Summary bar
  var total=0,verified=0,pending=0,rejected=0,missing=0;
  checklist.forEach(function(cat){cat.docs.forEach(function(d){
    total++;var s=prof.docs[d.key]||'missing';
    if(s==='verified')verified++;else if(s==='pending'||s==='uploaded')pending++;else if(s==='rejected')rejected++;else missing++;
  });});
  html+='<div class="p-card" style="margin-bottom:14px;"><div style="display:flex;gap:20px;flex-wrap:wrap;font-size:13px;">'
    +'<div><span style="font-weight:800;color:#065f46;">'+verified+'</span> Approved</div>'
    +'<div><span style="font-weight:800;color:#92400e;">'+pending+'</span> Pending</div>'
    +'<div><span style="font-weight:800;color:#dc2626;">'+rejected+'</span> Rejected</div>'
    +'<div><span style="font-weight:800;color:var(--text3);">'+missing+'</span> Missing</div>'
    +'</div></div>';

  // Bulk actions
  if(pending>0){
    html+='<div style="display:flex;gap:8px;margin-bottom:14px;">'
      +'<button class="p-btn p-btn-success p-btn-sm" onclick="pCMBulkReview(\''+app.id+'\',\''+prof.id+'\',\'verified\')">✓ Approve All Pending</button>'
      +'<button class="p-btn p-btn-danger p-btn-sm" onclick="pCMBulkReview(\''+app.id+'\',\''+prof.id+'\',\'rejected\')">✗ Reject All Pending</button>'
      +'</div>';
  }

  // Document rows grouped by category
  html+='<div class="cm-doc-review">';
  checklist.forEach(function(cat){
    html+='<div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--text3);padding:14px 0 6px;">'+escHtml(cat.cat)+'</div>';
    cat.docs.forEach(function(d){
      var s=prof.docs[d.key]||'missing';
      var badgeClass=s==='verified'?'verified':s==='pending'?'pending':s==='uploaded'?'uploaded':s==='rejected'?'rejected':'missing';
      var badgeLabel=s==='verified'?'Approved':s==='pending'?'Under Review':s==='uploaded'?'Uploaded':s==='rejected'?'Rejected':'Missing';
      var btns='';
      if(s==='pending'||s==='uploaded'){
        btns='<button class="cm-doc-btn approve" onclick="pCMDocAction(\''+app.id+'\',\''+prof.id+'\',\''+d.key+'\',\'verified\')">✓ Approve</button>'
          +'<button class="cm-doc-btn reject" onclick="pCMDocAction(\''+app.id+'\',\''+prof.id+'\',\''+d.key+'\',\'rejected\')">✗ Reject</button>';
      } else if(s==='rejected'){
        btns='<button class="cm-doc-btn request" onclick="pCMDocAction(\''+app.id+'\',\''+prof.id+'\',\''+d.key+'\',\'missing\')">Request Re-upload</button>';
      } else if(s==='verified'){
        btns='<button class="cm-doc-btn reject" onclick="pCMDocAction(\''+app.id+'\',\''+prof.id+'\',\''+d.key+'\',\'rejected\')">Revoke</button>';
      }
      html+='<div class="cm-doc-row">'
        +'<div class="cm-doc-info"><span class="cm-doc-icon">'+d.icon+'</span><div><div class="cm-doc-name">'+escHtml(d.name)+'</div><div class="cm-doc-sub">'+escHtml(d.sub)+'</div></div></div>'
        +'<div class="cm-doc-actions"><span class="cm-doc-badge '+badgeClass+'">'+badgeLabel+'</span>'+btns+'</div>'
        +'</div>';
    });
  });
  html+='</div>';
  return html;
}

/* ── Timeline tab ── */
function pCMRenderTimeline(app,u){
  var events=[];
  // App creation
  events.push({ts:app.created,icon:'📋',type:'stage',text:'Application created',detail:escHtml(P_PKG_NAMES[app.pkg]||app.pkg)+' package'});
  // Stage changes from stageDates
  if(app.stageDates){
    Object.keys(app.stageDates).forEach(function(idx){
      var si=parseInt(idx);
      if(si>0){
        events.push({ts:app.stageDates[idx],icon:'🔄',type:'stage',text:'Moved to '+P_STAGES[si],detail:null});
      }
    });
  }
  // Document actions from timeline
  if(app.activityLog){
    app.activityLog.forEach(function(entry){
      events.push({ts:entry.ts,icon:entry.icon||'📄',type:entry.type||'action',text:entry.text,detail:entry.detail||null});
    });
  }
  // Notes
  if(app.noteLog){
    app.noteLog.forEach(function(n){
      events.push({ts:n.ts,icon:'📝',type:'note',text:'Note added by '+escHtml(n.by),detail:escHtml(n.text)});
    });
  }
  // Docs submitted
  if(app.docsSubmitted){
    events.push({ts:app.docsSubmitted,icon:'🏁',type:'action',text:'All documents submitted by client',detail:null});
  }
  // Profile submissions
  if(app.profiles){
    app.profiles.forEach(function(prof){
      if(prof.submitted){
        events.push({ts:prof.submitted,icon:'✅',type:'doc',text:escHtml(prof.name)+' profile submitted',detail:null});
      }
    });
  }
  // Sort descending
  events.sort(function(a,b){return new Date(b.ts)-new Date(a.ts);});

  if(!events.length) return '<div class="p-card" style="text-align:center;padding:30px;color:var(--text3);">No activity yet.</div>';

  var html='<div class="cm-timeline">';
  events.forEach(function(ev){
    html+='<div class="cm-tl-item">'
      +'<div class="cm-tl-dot '+ev.type+'">'+ev.icon+'</div>'
      +'<div class="cm-tl-body">'
      +'<div class="cm-tl-text">'+ev.text+'</div>'
      +'<div class="cm-tl-time">'+fmtDate(ev.ts)+'</div>'
      +(ev.detail?'<div class="cm-tl-detail">'+ev.detail+'</div>':'')
      +'</div></div>';
  });
  html+='</div>';
  return html;
}

/* ── CM Actions ── */
function pCMMoveStage(appId,dir){
  var apps=pGetApps();var now=new Date().toISOString();
  apps=apps.map(function(a){
    if(a.id===appId){
      var newStage=Math.max(0,Math.min(P_STAGES.length-1,a.stage+dir));
      if(newStage!==a.stage){
        if(!a.activityLog)a.activityLog=[];
        a.activityLog.push({ts:now,icon:'🔄',type:'stage',text:'Stage changed: '+P_STAGES[a.stage]+' \u2192 '+P_STAGES[newStage],detail:null});
        if(!a.stageDates)a.stageDates={};
        a.stageDates[newStage]=now;
        /* Update statusHistory — mirrors SQL app_status enum */
        if(!a.statusHistory)a.statusHistory=[];
        var newStatus=newStage>=5?APP_STATUS_ENUM.APPROVED:newStage>=3?APP_STATUS_ENUM.SUBMITTED:newStage>=1?APP_STATUS_ENUM.DOCUMENT_PREP:APP_STATUS_ENUM.LEAD;
        a.app_status=newStatus;a.last_activity=now;
        a.statusHistory.push({status:newStatus,at:now});
        a.stage=newStage;a.updated=now;
      }
    }
    return a;
  });
  pSaveApps(apps);pRenderCMManage();
  showToast('\u2713 Stage updated');
}

function pCMDocAction(appId,profileId,docKey,action){
  var apps=pGetApps();var now=new Date().toISOString();
  apps=apps.map(function(a){
    if(a.id===appId&&a.profiles){
      a.profiles=a.profiles.map(function(p){
        if(p.id===profileId){p.docs[docKey]=action;}
        return p;
      });
      if(!a.activityLog)a.activityLog=[];
      var actionLabel=action==='verified'?'Approved':action==='rejected'?'Rejected':action==='missing'?'Re-upload requested':'Updated';
      var prof=(a.profiles||[]).find(function(p){return p.id===profileId;});
      a.activityLog.push({ts:now,icon:action==='verified'?'✅':action==='rejected'?'❌':'🔄',type:'doc',text:actionLabel+': '+docKey.replace(/_/g,' ')+' ('+escHtml((prof||{}).name||'')+')',detail:null});
      a.updated=now;
    }
    return a;
  });
  pSaveApps(apps);pRenderCMManage();
  showToast(action==='verified'?'✓ Document approved':action==='rejected'?'Document rejected':'Re-upload requested');
}

function pCMBulkReview(appId,profileId,action){
  var apps=pGetApps();var now=new Date().toISOString();
  apps=apps.map(function(a){
    if(a.id===appId&&a.profiles){
      a.profiles=a.profiles.map(function(p){
        if(p.id===profileId){
          var checklist=PROFILE_CHECKLISTS[p.type]||[];
          checklist.forEach(function(cat){cat.docs.forEach(function(d){
            var s=p.docs[d.key]||'missing';
            if(s==='pending'||s==='uploaded') p.docs[d.key]=action;
          });});
        }
        return p;
      });
      if(!a.activityLog)a.activityLog=[];
      var prof=(a.profiles||[]).find(function(p){return p.id===profileId;});
      a.activityLog.push({ts:now,icon:action==='verified'?'✅':'❌',type:'doc',text:'Bulk '+(action==='verified'?'approved':'rejected')+' all pending docs for '+escHtml((prof||{}).name||''),detail:null});
      a.updated=now;
    }
    return a;
  });
  pSaveApps(apps);pRenderCMManage();
  showToast(action==='verified'?'✓ All pending docs approved':'All pending docs rejected');
}

function pCMRequestChange(appId){
  var msg=((document.getElementById('cm-request-msg')||{}).value||'').trim();
  if(!msg){showToast('Enter a message');return;}
  var app=pGetApps().find(function(a){return a.id===appId;});if(!app)return;
  // Send as support message to client
  var msgs=pGetMsgs();
  msgs.push({id:'msg'+Date.now(),fromId:pUser.id,toId:app.userId,body:'📋 Change Request: '+msg,ts:new Date().toISOString(),read:false});
  pSaveMsgs(msgs);
  // Log activity
  var apps=pGetApps();var now=new Date().toISOString();
  apps=apps.map(function(a){
    if(a.id===appId){
      if(!a.activityLog)a.activityLog=[];
      a.activityLog.push({ts:now,icon:'📋',type:'action',text:'Change request sent to client',detail:escHtml(msg)});
      a.updated=now;
    }
    return a;
  });
  pSaveApps(apps);
  document.getElementById('cm-request-msg').value='';
  pRenderCMManage();
  showToast('✓ Change request sent');
}

function pCMSaveNote(appId){
  var note=((document.getElementById('cm-internal-note')||{}).value||'').trim();
  var apps=pGetApps();var now=new Date().toISOString();
  apps=apps.map(function(a){
    if(a.id===appId){
      a.notes=note;a.updated=now;
      if(!a.noteLog)a.noteLog=[];
      a.noteLog.push({ts:now,by:pUser.first+' '+pUser.last,text:note});
    }
    return a;
  });
  pSaveApps(apps);
  showToast('✓ Note saved');
  pRenderCMManage();
}

/* ══ MODAL SYSTEM ══ */
function pOpenModal(type,id){
  var overlay=document.getElementById('pModalOverlay');var body=document.getElementById('pModalBody');var title=document.getElementById('pModalTitle');
  if(!overlay||!body||!title)return;
  overlay.classList.add('open');
  if(type==='addUser'||type==='editUser'){
    var u=id?pGetUsers().find(function(x){return x.id===id;}):null;
    title.textContent=(u?'Edit':'Add')+' Customer';
    body.innerHTML='<div class="p-field-row"><div class="p-field"><label>First Name</label><input type="text" id="pm-first" value="'+(u?escHtml(u.first):'')+'" placeholder="First name"></div><div class="p-field"><label>Last Name</label><input type="text" id="pm-last" value="'+(u?escHtml(u.last):'')+'" placeholder="Last name"></div></div>'
      +'<div class="p-field"><label>Email</label><input type="email" id="pm-email" value="'+(u?escHtml(u.email):'')+'" placeholder="email@example.com"></div>'
      +'<div class="p-field"><label>Password</label><input type="password" id="pm-pass" placeholder="'+(u?'Leave blank to keep':'Min. 8 chars')+'"></div>'
      +'<div class="p-field"><label>Assign Case Manager</label><select id="pm-cm"><option value="">— Unassigned —</option>'
      +pGetUsers().filter(function(x){return x.role==='case_manager';}).map(function(cm){return '<option value="'+cm.id+'"'+(u&&u.cmId===cm.id?' selected':'')+'>'+escHtml(cm.first+' '+cm.last)+'</option>';}).join('')+'</select></div>'
      +'<button class="p-btn p-btn-primary" style="width:100%;justify-content:center;padding:12px;" onclick="pSaveUser(\''+( u?u.id:'')+'\')">Save</button>';
  } else if(type==='addCM'||type==='editCM'){
    var cm=id?pGetUsers().find(function(x){return x.id===id;}):null;
    title.textContent=(cm?'Edit':'Add')+' Case Manager';
    body.innerHTML='<div class="p-field-row"><div class="p-field"><label>First Name</label><input type="text" id="pm-first" value="'+(cm?escHtml(cm.first):'')+'" placeholder="First name"></div><div class="p-field"><label>Last Name</label><input type="text" id="pm-last" value="'+(cm?escHtml(cm.last):'')+'" placeholder="Last name"></div></div>'
      +'<div class="p-field"><label>Email</label><input type="email" id="pm-email" value="'+(cm?escHtml(cm.email):'')+'" placeholder="email@nomadspain.io"></div>'
      +'<div class="p-field"><label>Password</label><input type="password" id="pm-pass" placeholder="'+(cm?'Leave blank to keep':'Min. 8 chars')+'"></div>'
      +'<div class="p-field"><label>Max Capacity (cases)</label><input type="number" id="pm-max-cap" value="'+(cm&&cm.maxCapacity?cm.maxCapacity:CM_MAX_CAPACITY)+'" min="1" max="50"></div>'
      +'<button class="p-btn p-btn-primary" style="width:100%;justify-content:center;padding:12px;" onclick="pSaveCM(\''+( cm?cm.id:'')+'\')">Save</button>';
  } else if(type==='editApp'){
    var app=pGetApps().find(function(a){return a.id===id;});
    if(!app){pCloseModal();return;}
    var u=pGetUsers().find(function(x){return x.id===app.userId;})||{first:'Unknown',last:''};
    title.textContent='Manage Application — '+u.first+' '+u.last;
    var docReviewHtml='';
    if(app.docsSubmitted&&app.profiles&&app.profiles.length>0){
      app.profiles.forEach(function(prof){
        var checklist=PROFILE_CHECKLISTS[prof.type]||[];
        docReviewHtml+='<div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--brand);padding:10px 0 6px;">'+escHtml(prof.name)+'</div>';
        checklist.forEach(function(cat){
          cat.docs.forEach(function(d){
            var s=prof.docs[d.key]||'missing';
            var badge=s==='verified'?'<span style="color:#16a34a;font-weight:700;font-size:11px;">✓ Verified</span>'
              :s==='rejected'?'<span style="color:#dc2626;font-weight:700;font-size:11px;">✗ Rejected</span>'
              :s==='pending'?'<span style="color:#d97706;font-weight:700;font-size:11px;">⏳ Under Review</span>'
              :s==='uploaded'?'<span style="color:#2563eb;font-weight:700;font-size:11px;">⬆ Uploaded</span>'
              :'<span style="color:#9ca3af;font-size:11px;">— Missing</span>';
            var btns=(s==='pending'||s==='uploaded')?
              '<button style="background:#d1fae5;color:#065f46;border:none;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;" onclick="pCMReviewDoc(\''+app.id+'\',\''+prof.id+'\',\''+d.key+'\',\'verified\')">✓</button>'
              +'<button style="background:#fee2e2;color:#dc2626;border:none;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;margin-left:4px;" onclick="pCMReviewDoc(\''+app.id+'\',\''+prof.id+'\',\''+d.key+'\',\'rejected\')">✗</button>':'';
            docReviewHtml+='<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border);font-size:12px;">'
              +'<div style="font-weight:600;">'+d.icon+' '+escHtml(d.name)+'</div>'
              +'<div style="display:flex;align-items:center;gap:6px;">'+badge+btns+'</div></div>';
          });
        });
      });
    }
    /* App status info */
    var appStatusLabel=(app.app_status||'lead').replace(/_/g,' ');
    var famCount=app.family_members_count||0;
    var reqIncome=app.total_required_income||calcIncomeThreshold(famCount);
    body.innerHTML='<div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;">'
      +'<div style="flex:1;background:var(--bg2);border-radius:8px;padding:10px;text-align:center;"><div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);">Status</div><div style="font-size:13px;font-weight:700;color:#9b2c2c;text-transform:capitalize;">'+appStatusLabel+'</div></div>'
      +'<div style="flex:1;background:var(--bg2);border-radius:8px;padding:10px;text-align:center;"><div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);">Family</div><div style="font-size:13px;font-weight:700;">'+famCount+' dep(s)</div></div>'
      +'<div style="flex:1;background:var(--bg2);border-radius:8px;padding:10px;text-align:center;"><div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);">Min Income</div><div style="font-size:13px;font-weight:700;">\u20AC'+reqIncome.toFixed(2)+'</div></div>'
      +'</div>'
      +'<div class="p-field"><label>Stage</label><select id="pm-stage">'
      +P_STAGES.map(function(s,i){return '<option value="'+i+'"'+(app.stage===i?' selected':'')+'>'+s+'</option>';}).join('')+'</select></div>'
      +'<div class="p-field"><label>Assign Case Manager</label><select id="pm-cm"><option value="">— Unassigned —</option>'
      +pGetUsers().filter(function(x){return x.role==='case_manager';}).map(function(cm){
        var load=pGetApps().filter(function(a){return a.cmId===cm.id&&a.stage<5;}).length;
        return '<option value="'+cm.id+'"'+(app.cmId===cm.id?' selected':'')+'>'+escHtml(cm.first+' '+cm.last)+' ('+load+' active)</option>';
      }).join('')+'</select></div>'
      +(app.docsSubmitted?'<div class="p-field"><label>Document Review</label><div style="background:var(--bg2);border-radius:10px;padding:8px 12px;">'+docReviewHtml+'</div></div>':'')
      +'<div class="p-field"><label>Internal Notes</label><textarea id="pm-notes" rows="3">'+escHtml(app.notes||'')+'</textarea></div>'
      +'<button class="p-btn p-btn-primary" style="width:100%;justify-content:center;padding:12px;" onclick="pSaveApp(\''+app.id+'\')">Save Changes</button>';
  } else if(type==='addPromo'){
    title.textContent='Add Promo Code';
    body.innerHTML='<div class="p-field"><label>Code</label><input type="text" id="pm-code" placeholder="NOMAD10" style="text-transform:uppercase;"></div>'
      +'<div class="p-field-row"><div class="p-field"><label>Discount</label><input type="number" id="pm-discount" placeholder="10"></div>'
      +'<div class="p-field"><label>Type</label><select id="pm-type"><option value="percent">Percent (%)</option><option value="fixed">Fixed (€)</option></select></div></div>'
      +'<div class="p-field"><label>Max Uses</label><input type="number" id="pm-max" placeholder="100"></div>'
      +'<button class="p-btn p-btn-primary" style="width:100%;justify-content:center;padding:12px;" onclick="pSavePromo()">Add Promo</button>';
  } else if(type==='addDocTemplate'){
    title.textContent='Add Document Template';
    body.innerHTML='<div class="p-field"><label>Visa Type</label><input type="text" id="pm-visa" placeholder="e.g. Non-Lucrative Visa"></div>'
      +'<div class="p-field"><label>Documents (one per line, prefix * for required)</label><textarea id="pm-docs" rows="6" placeholder="*Passport&#10;*Proof of Funds&#10;Health Insurance"></textarea></div>'
      +'<button class="p-btn p-btn-primary" style="width:100%;justify-content:center;padding:12px;" onclick="pSaveDocTemplate()">Save Template</button>';
  } else if(type==='addApp'){
    title.textContent='New Application';
    body.innerHTML='<div class="p-field"><label>Customer</label><select id="pm-user-id"><option value="">Select customer</option>'
      +pGetUsers().filter(function(u){return u.role==='customer';}).map(function(u){return '<option value="'+u.id+'">'+escHtml(u.first+' '+u.last)+' ('+escHtml(u.email)+')</option>';}).join('')+'</select></div>'
      +'<div class="p-field"><label>Package</label><select id="pm-pkg"><option value="consultation">360\u00b0 Strategy Session \u2014 \u20AC30</option><option value="solo">Nomad Solo \u2014 \u20AC2,500</option><option value="family">Family \u2014 \u20AC3,000</option></select></div>'
      +'<div class="p-field"><label>Family Members (dependents)</label><input type="number" id="pm-family" value="0" min="0" max="10" onchange="pUpdateIncomeCalc()"><div id="pm-income-calc" style="font-size:12px;color:var(--text3);margin-top:4px;">Required income: \u20AC'+SMI_200.toFixed(2)+'/month</div></div>'
      +'<div class="p-field"><label>Case Manager</label><select id="pm-cm"><option value="">— Auto-assign (lowest load) —</option>'
      +pGetUsers().filter(function(x){return x.role==='case_manager';}).map(function(cm){
        var load=pGetApps().filter(function(a){return a.cmId===cm.id&&a.stage<5;}).length;
        return '<option value="'+cm.id+'">'+escHtml(cm.first+' '+cm.last)+' ('+load+' active)</option>';
      }).join('')+'</select></div>'
      +'<button class="p-btn p-btn-primary" style="width:100%;justify-content:center;padding:12px;" onclick="pSaveNewApp()">Create Application</button>';
  }
}
function pCloseModal(){document.getElementById('pModalOverlay').classList.remove('open');}
function pUpdateIncomeCalc(){
  var famEl=document.getElementById('pm-family');var calcEl=document.getElementById('pm-income-calc');
  if(!famEl||!calcEl)return;
  var fam=parseInt(famEl.value)||0;
  var required=calcIncomeThreshold(fam);
  var breakdown='Required income: \u20AC'+required.toFixed(2)+'/month';
  if(fam>0){
    breakdown+=' (Base \u20AC'+SMI_200.toFixed(2)+' + 1st dep \u20AC'+SMI_75.toFixed(2);
    if(fam>1) breakdown+=' + '+(fam-1)+'\u00D7\u20AC'+SMI_25.toFixed(2);
    breakdown+=')';
  }
  calcEl.textContent=breakdown;
}
function pSaveUser(id){
  var first=(document.getElementById('pm-first').value||'').trim();
  var last=(document.getElementById('pm-last').value||'').trim();
  var email=(document.getElementById('pm-email').value||'').trim().toLowerCase();
  var pass=(document.getElementById('pm-pass').value||'');
  var cmId=(document.getElementById('pm-cm').value||'')||null;
  if(!first||!last||!email){showToast('Fill in required fields');return;}
  var users=pGetUsers();
  if(id){users=users.map(function(u){if(u.id===id){u.first=first;u.last=last;u.email=email;u.cmId=cmId;if(pass&&pass.length>=8)u.pass=pass;}return u;});}
  else{if(users.find(function(u){return u.email===email;})){showToast('Email already exists');return;}users.push({id:'u'+Date.now(),email:email,pass:pass||'changeme',role:'customer',first:first,last:last,phone:'',cmId:cmId,created:new Date().toISOString()});}
  pSaveUsers(users);pCloseModal();pRenderAdUsers();showToast('\u2713 Customer saved');
}
function pSaveCM(id){
  var first=(document.getElementById('pm-first').value||'').trim();
  var last=(document.getElementById('pm-last').value||'').trim();
  var email=(document.getElementById('pm-email').value||'').trim().toLowerCase();
  var pass=(document.getElementById('pm-pass').value||'');
  var maxCap=parseInt((document.getElementById('pm-max-cap')||{}).value)||CM_MAX_CAPACITY;
  if(!first||!last||!email){showToast('Fill in required fields');return;}
  var users=pGetUsers();
  if(id){users=users.map(function(u){if(u.id===id){u.first=first;u.last=last;u.email=email;u.maxCapacity=maxCap;if(pass&&pass.length>=8)u.pass=pass;}return u;});}
  else{if(users.find(function(u){return u.email===email;})){showToast('Email already exists');return;}users.push({id:'u'+Date.now(),email:email,pass:pass||'changeme',role:'case_manager',first:first,last:last,phone:'',created:new Date().toISOString(),maxCapacity:maxCap});}
  pSaveUsers(users);pCloseModal();pRenderAdCMs();showToast('\u2713 Case manager saved');
}
function pSaveApp(id){
  var stage=parseInt((document.getElementById('pm-stage')||{}).value)||0;
  var cmId=((document.getElementById('pm-cm')||{}).value)||null;
  var notes=((document.getElementById('pm-notes')||{}).value)||'';
  var now=new Date().toISOString();
  var apps=pGetApps();apps=apps.map(function(a){
    if(a.id===id){
      var prevStage=a.stage;
      a.stage=stage;a.cmId=cmId||a.cmId;a.notes=notes;a.updated=now;a.last_activity=now;
      if(!a.stageDates) a.stageDates={};
      if(stage!==prevStage){
        a.stageDates[stage]=now;
        for(var si=prevStage;si<stage;si++){if(!a.stageDates[si]) a.stageDates[si]=now;}
        /* Update app_status based on stage */
        if(!a.statusHistory)a.statusHistory=[];
        var newAppStatus=stage>=5?APP_STATUS_ENUM.APPROVED:stage>=3?APP_STATUS_ENUM.SUBMITTED:stage>=1?APP_STATUS_ENUM.DOCUMENT_PREP:APP_STATUS_ENUM.LEAD;
        a.app_status=newAppStatus;
        a.statusHistory.push({status:newAppStatus,at:now});
      }
    }
    return a;
  });
  pSaveApps(apps);pCloseModal();pRenderAdApps();showToast('\u2713 Application updated');
}
function pCMReviewDoc(appId,profileId,docKey,action){
  var apps=pGetApps();
  apps=apps.map(function(a){
    if(a.id===appId&&a.profiles){
      a.profiles=a.profiles.map(function(p){
        if(p.id===profileId){p.docs[docKey]=action;}
        return p;
      });
      a.updated=new Date().toISOString();
    }
    return a;
  });
  pSaveApps(apps);
  pOpenModal('editApp',appId);
  showToast(action==='verified'?'✓ Document approved':'Document rejected');
}
function pSaveNewApp(){
  var userId=((document.getElementById('pm-user-id')||{}).value)||'';
  var pkg=((document.getElementById('pm-pkg')||{}).value)||'solo';
  var cmId=((document.getElementById('pm-cm')||{}).value)||null;
  var famCountEl=document.getElementById('pm-family');
  var famCount=famCountEl?parseInt(famCountEl.value)||0:0;
  if(!userId){showToast('Select a customer');return;}
  var apps=pGetApps();var newTs=new Date().toISOString();
  var requiredIncome=calcIncomeThreshold(famCount);
  var newApp={
    id:'app'+Date.now(),userId:userId,pkg:pkg,stage:0,status:'new',
    app_status:APP_STATUS_ENUM.LEAD,cmId:cmId,
    created:newTs,updated:newTs,last_activity:newTs,
    family_members_count:famCount,total_required_income:requiredIncome,
    docs:{passport:'missing',income:'missing',criminal:'missing',degree:'missing',insurance:'missing',other:'missing'},
    requiredDocs:['passport','income','criminal','degree','insurance','other'],
    docExpiries:{},notes:'',stageDates:{0:newTs},
    statusHistory:[{status:APP_STATUS_ENUM.LEAD,at:newTs}]
  };
  apps.push(newApp);pSaveApps(apps);
  /* Seed normalised docs */
  var docs=pGetDocuments();
  newApp.requiredDocs.forEach(function(docKey){
    docs.push({id:'doc'+Date.now()+'_'+docKey,application_id:newApp.id,name:docKey.replace(/_/g,' '),file_url:null,status:DOC_STATUS_ENUM.MISSING,expiry_date:null,internal_notes:''});
  });
  pSaveDocuments(docs);
  /* Update user cmId if assigned */
  if(cmId){var users=pGetUsers();users=users.map(function(u){if(u.id===userId){u.cmId=cmId;}return u;});pSaveUsers(users);}
  pCloseModal();pRenderAdApps();showToast('\u2713 Application created');
}
function pSavePromo(){
  var code=((document.getElementById('pm-code')||{}).value||'').trim().toUpperCase();
  var discount=parseFloat((document.getElementById('pm-discount')||{}).value)||0;
  var type=((document.getElementById('pm-type')||{}).value)||'percent';
  var max=parseInt((document.getElementById('pm-max')||{}).value)||100;
  if(!code||!discount){showToast('Fill in all fields');return;}
  var promos=pGetPromos();promos.push({id:'pr'+Date.now(),code:code,discount:discount,type:type,active:true,uses:0,max:max});
  pSavePromos(promos);pCloseModal();pRenderAdProducts();showToast('\u2713 Promo code added');
}
function pSaveDocTemplate(){
  var visa=((document.getElementById('pm-visa')||{}).value||'').trim();
  var raw=((document.getElementById('pm-docs')||{}).value||'').trim();
  if(!visa||!raw){showToast('Fill in all fields');return;}
  var docs=raw.split('\n').filter(Boolean).map(function(line){var req=line.startsWith('*');return {name:line.replace(/^\*/,'').trim(),required:req,desc:''};});
  var tpls=pGetTemplates();tpls.push({id:'tpl'+Date.now(),visaType:visa,docs:docs});
  pSaveTemplates(tpls);pCloseModal();pRenderAdCompliance();showToast('\u2713 Template created');
}

/* Keep legacy stubs for old references */
function switchAuthTab(t,el){pAuthTab(t,el);}
function doLogin(){pDoLogin();}
function doSignup(){pDoSignup();}
function portalLogout(){pLogout();}
function switchDash(t){pNav('cu',t,null);}
function simulateUpload(n){showToast('\u2713 '+n+' uploaded');}
function simulatePayment(){showToast('\u2713 Payment processed!');}
function renderFamilyList(){}
function addFamilyMember(){}
function delMember(){}

/* ADMIN */
var _adminToken = '';
function openAdminLogin(){document.getElementById('adminLoginModal').classList.add('open');}
function closeAdminLogin(){document.getElementById('adminLoginModal').classList.remove('open');}
function doAdminLogin(){
  var email=document.getElementById('adminEmail').value.trim();
  var pass=document.getElementById('adminPass').value;
  var err=document.getElementById('adminError');
  err.style.display='none';
  fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email,password:pass})})
    .then(function(r){return r.json();}).then(function(data){
      if(data.ok){_adminToken=data.token;closeAdminLogin();openAdminDashboard();}
      else{err.style.display='block';}
    }).catch(function(){err.style.display='block';});
}
function openAdminDashboard(){
  document.getElementById('adminDashboard').classList.add('open');
  renderAdminArticles(); renderAdminFaq(); renderAdminTesti(); renderEmailList(); renderLeads(); populateAdminFields();
  buildProcessAdmin(); buildCitiesAdmin(); buildCheckerAdmin();
}
function adminLogout(){
  if(_adminToken){fetch('/api/admin/logout',{method:'POST',headers:{'X-Admin-Token':_adminToken}}).catch(function(){});}
  _adminToken='';document.getElementById('adminDashboard').classList.remove('open');
}
function switchAdminTab(tab,el){
  document.querySelectorAll('.admin-tab').forEach(function(t){t.classList.remove('active');});
  if(el) el.classList.add('active');
  document.querySelectorAll('.admin-panel').forEach(function(p){p.classList.remove('active');});
  var panel=document.getElementById('ap-'+tab); if(panel) panel.classList.add('active');
  if(tab==='leads') renderLeads();
  if(tab==='emails') renderEmailList();
}
function populateAdminFields(){
  var d=getAdminData();
  var sv=function(id,val){var el=document.getElementById(id);if(el&&val!==undefined&&val!==null&&val!=='')el.value=val;};
  if(d.hero){sv('ad_heroBadge',d.hero.badge);sv('ad_heroH1',d.hero.h1);sv('ad_heroSub',d.hero.sub);sv('ad_heroStat1',d.hero.stat1);sv('ad_heroStat2',d.hero.stat2);sv('ad_heroStat3',d.hero.stat3);}
  if(d.why){sv('ad_whyTitle',d.why.title);sv('ad_whySub',d.why.sub);['wf1t','wf1d','wf2t','wf2d','wf3t','wf3d','wf4t','wf4d'].forEach(function(k){sv('ad_'+k,d.why[k]);});}
  if(d.services){['pkg1name','pkg1price','pkg1note','pkg2name','pkg2price','pkg2note','pkg3name','pkg3price','pkg3dep'].forEach(function(k){sv('ad_'+k,d.services[k]);});}
  if(d.pricing){sv('ad_pricingSub',d.pricing.sub);sv('ad_p1price',d.pricing.p1);sv('ad_p2price',d.pricing.p2);sv('ad_p3dep',d.pricing.p3dep);}
  if(d.contact){sv('ad_contactEmail',d.contact.email);sv('ad_contactWA',d.contact.wa);sv('ad_contactBook',d.contact.book);sv('ad_contactP',d.contact.p);}
  if(d.footer){sv('ad_footerAbout',d.footer.about);sv('ad_footerCopy',d.footer.copy);}
}
function buildProcessAdmin(){
  var d=getAdminData(); var cont=document.getElementById('processStepsAdmin'); if(!cont) return;
  var steps=(d.process&&d.process.steps)||[
    {n:'01',h:'Eligibility Check',p:'Quick assessment to confirm you qualify.'},
    {n:'02',h:'Onboarding Call',p:'Meet your case manager.'},
    {n:'03',h:'Document Prep',p:'Gather, translate & certify every document.'},
    {n:'04',h:'Embassy Filing',p:'We submit your complete application file.'},
    {n:'05',h:'Approval',p:'Receive your visa approval letter.'},
    {n:'06',h:'TIE Card',p:'Get your resident card.'}
  ];
  cont.innerHTML=steps.map(function(s,i){
    return '<div class="admin-field"><label>Step '+(i+1)+' Title</label><input type="text" id="proc_h_'+i+'" value="'+escHtml(s.h)+'"></div>'
      +'<div class="admin-field"><label>Step '+(i+1)+' Desc</label><input type="text" id="proc_p_'+i+'" value="'+escHtml(s.p)+'"></div>';
  }).join('');
}
function buildCitiesAdmin(){
  var d=getAdminData(); var cont=document.getElementById('citiesAdmin'); if(!cont) return;
  var cities=(d.cities&&d.cities.list)||[
    {name:'Barcelona',tagline:'Beach + tech scene'},{name:'Madrid',tagline:'Capital, culture, career'},
    {name:'Valencia',tagline:'Sun, sea, affordable'},{name:'Sevilla',tagline:'Culture, warmth, history'}
  ];
  cont.innerHTML=cities.map(function(c,i){
    return '<div class="admin-field"><label>City '+(i+1)+' Name</label><input type="text" id="city_name_'+i+'" value="'+escHtml(c.name)+'"></div>'
      +'<div class="admin-field"><label>City '+(i+1)+' Tagline</label><input type="text" id="city_tag_'+i+'" value="'+escHtml(c.tagline)+'"></div>';
  }).join('');
}
function buildCheckerAdmin(){
  var cont=document.getElementById('checkerItemsAdmin'); if(!cont) return;
  var items=[
    {h:'Remote income requirement',p:'Min \u20AC2,849/month, 80% from non-Spanish clients.'},
    {h:'Non-EU/EEA nationals welcome',p:'Open to all non-EU/EEA citizens.'},
    {h:'Education or experience',p:'Degree OR 3+ years relevant experience.'}
  ];
  cont.innerHTML=items.map(function(it,i){
    return '<div class="admin-2col"><div class="admin-field"><label>Req '+(i+1)+' Title</label><input type="text" id="chk_h_'+i+'" value="'+escHtml(it.h)+'"></div>'
      +'<div class="admin-field"><label>Req '+(i+1)+' Text</label><input type="text" id="chk_p_'+i+'" value="'+escHtml(it.p)+'"></div></div>';
  }).join('');
}
function saveSection(sec){
  var gv=function(id){var el=document.getElementById(id);return el?el.value:'';};
  if(sec==='hero'){setAdminData('hero',{badge:gv('ad_heroBadge'),h1:gv('ad_heroH1'),sub:gv('ad_heroSub'),stat1:gv('ad_heroStat1'),stat2:gv('ad_heroStat2'),stat3:gv('ad_heroStat3')});applyAdminDataToPage();}
  if(sec==='why'){var obj={title:gv('ad_whyTitle'),sub:gv('ad_whySub')};['wf1t','wf1d','wf2t','wf2d','wf3t','wf3d','wf4t','wf4d'].forEach(function(k){obj[k]=gv('ad_'+k);});setAdminData('why',obj);applyAdminDataToPage();}
  if(sec==='services'){var obj={};['pkg1name','pkg1price','pkg1note','pkg2name','pkg2price','pkg2note','pkg3name','pkg3price','pkg3dep'].forEach(function(k){obj[k]=gv('ad_'+k);});setAdminData('services',obj);}
  if(sec==='process'){var steps=[];for(var i=0;i<6;i++){steps.push({n:'0'+(i+1),h:gv('proc_h_'+i),p:gv('proc_p_'+i)});}setAdminData('process',{steps:steps});var pg=document.querySelector('#process-section .process-grid');if(pg){pg.innerHTML=steps.map(function(s){return '<div class="p-step"><div class="p-num">'+s.n+'</div><h4>'+escHtml(s.h)+'</h4><p>'+escHtml(s.p)+'</p></div>';}).join('');}}
  if(sec==='cities'){var list=[];for(var i=0;i<4;i++){list.push({name:gv('city_name_'+i),tagline:gv('city_tag_'+i)});}setAdminData('cities',{list:list});}
  if(sec==='checker'){setAdminData('checker',{title:gv('ad_checkerTitle'),sub:gv('ad_checkerSub')});}
  if(sec==='pricing'){setAdminData('pricing',{sub:gv('ad_pricingSub'),p1:gv('ad_p1price'),p2:gv('ad_p2price'),p3dep:gv('ad_p3dep')});}
  if(sec==='contact'){setAdminData('contact',{email:gv('ad_contactEmail'),wa:gv('ad_contactWA'),book:gv('ad_contactBook'),p:gv('ad_contactP')});applyAdminDataToPage();}
  if(sec==='footer'){setAdminData('footer',{about:gv('ad_footerAbout'),copy:gv('ad_footerCopy')});applyAdminDataToPage();}
  showToast('\u2713 Saved!');
}
function applyAdminDataToPage(){
  var d=getAdminData();
  var st=function(id,val){var el=document.getElementById(id);if(el&&val)el.textContent=val;};
  if(d.hero){
    if(d.hero.badge){var hb=document.getElementById('heroBadgeText');if(hb)hb.innerHTML='<span class="badge-dot"></span>'+escHtml(d.hero.badge);}
    if(d.hero.h1){var h1=document.querySelector('.hero h1');if(h1)h1.innerHTML=d.hero.h1.replace(/\|/g,'<br>');}
    if(d.hero.sub){var hs=document.querySelector('.hero-sub');if(hs)hs.textContent=d.hero.sub;}
    st('heroStat1',d.hero.stat1);st('heroStat2',d.hero.stat2);st('heroStat3',d.hero.stat3);
  }
  if(d.why){
    if(d.why.title){var wt=document.querySelector('#why-section .section-title');if(wt)wt.innerHTML=d.why.title.replace(/\|/g,'<br>');}
    if(d.why.sub){var ws=document.querySelector('#why-section .section-sub');if(ws)ws.textContent=d.why.sub;}
    ['wf1t','wf1d','wf2t','wf2d','wf3t','wf3d','wf4t','wf4d'].forEach(function(k){st(k,d.why[k]);});
  }
  if(d.contact){st('contactEmailDisplay',d.contact.email);st('contactWA',d.contact.wa);st('contactBook',d.contact.book);if(d.contact.p){var cp=document.getElementById('contactP');if(cp)cp.textContent=d.contact.p;}}
}

/* ADMIN ARTICLES */
function renderAdminArticles(){
  var articles=getArticles(), list=document.getElementById('adminArticleList'); if(!list) return;
  if(articles.length===0){list.innerHTML='<p style="font-size:14px;color:var(--text3);">No articles yet. Click "+ Write new article" to add your first.</p>';return;}
  list.innerHTML=articles.map(function(a){
    return '<div class="admin-article-item"><div><h4>'+escHtml(a.title)+'</h4><p>'+(TAG_LABELS[a.category]||a.category)+' \u00B7 '+fmtDate(a.date)+'</p></div>'
      +'<div class="admin-item-actions"><button class="admin-edit-btn" onclick="openArticleModal(\''+a.id+'\')">Edit</button>'
      +'<button class="admin-del-btn" onclick="deleteArticle(\''+a.id+'\')">Delete</button></div></div>';
  }).join('');
}
function deleteArticle(id){
  if(!confirm('Delete this article?')) return;
  saveArticles(getArticles().filter(function(a){return a.id!==id;}));
  renderAdminArticles(); renderKbtGrid(); showToast('Deleted');
}
function openArticleModal(id){
  var modal=document.getElementById('adminArticleModal');
  if(!modal){
    modal=document.createElement('div');modal.id='adminArticleModal';
    modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:600;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);';
    modal.innerHTML='<div style="background:var(--white);border-radius:20px;padding:36px 32px;max-width:680px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.13);position:relative;">'
      +'<button onclick="closeArticleModal()" style="position:absolute;top:16px;right:16px;background:var(--bg2);border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;color:var(--text2);">\u2715</button>'
      +'<h2 id="artModalTitle" style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:22px;font-weight:800;margin-bottom:24px;"></h2>'
      +'<div style="margin-bottom:16px;"><label style="display:block;font-size:12px;font-weight:700;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Title</label><input type="text" id="artTitle" style="width:100%;background:var(--bg2);border:1.5px solid var(--border);color:var(--text);border-radius:12px;padding:11px 14px;font-size:14px;outline:none;"></div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;">'
      +'<div><label style="display:block;font-size:12px;font-weight:700;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Category</label><select id="artCategory" style="width:100%;background:var(--bg2);border:1.5px solid var(--border);color:var(--text);border-radius:12px;padding:11px 14px;font-size:14px;outline:none;"><option value="visa">Visa Process</option><option value="tax">Tax & Finance</option><option value="lifestyle">Lifestyle & Cities</option><option value="legal">Legal & Docs</option><option value="housing">Housing</option><option value="community">Community</option></select></div>'
      +'<div><label style="display:block;font-size:12px;font-weight:700;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Read Time</label><input type="text" id="artReadTime" style="width:100%;background:var(--bg2);border:1.5px solid var(--border);color:var(--text);border-radius:12px;padding:11px 14px;font-size:14px;outline:none;" placeholder="5 min"></div>'
      +'</div>'
      +'<div style="margin-bottom:16px;"><label style="display:block;font-size:12px;font-weight:700;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Summary</label><input type="text" id="artSummary" style="width:100%;background:var(--bg2);border:1.5px solid var(--border);color:var(--text);border-radius:12px;padding:11px 14px;font-size:14px;outline:none;"></div>'
      +'<div style="margin-bottom:16px;"><label style="display:block;font-size:12px;font-weight:700;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Body (Markdown)</label><textarea id="artBody" style="width:100%;background:var(--bg2);border:1.5px solid var(--border);color:var(--text);border-radius:12px;padding:11px 14px;font-size:14px;outline:none;resize:vertical;min-height:160px;line-height:1.6;"></textarea></div>'
      +'<div style="margin-bottom:24px;"><label style="display:block;font-size:12px;font-weight:700;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Cover Image URL</label><input type="text" id="artImage" style="width:100%;background:var(--bg2);border:1.5px solid var(--border);color:var(--text);border-radius:12px;padding:11px 14px;font-size:14px;outline:none;" placeholder="https://..."></div>'
      +'<button onclick="saveArticle()" style="background:linear-gradient(135deg,#E8422A,#F5A623);color:#fff;border:none;padding:13px 28px;border-radius:50px;font-family:\'Bricolage Grotesque\',sans-serif;font-size:14px;font-weight:700;cursor:pointer;">Save Article</button>'
      +'<input type="hidden" id="artEditId"></div>';
    document.body.appendChild(modal);
  }
  var titleEl=document.getElementById('artModalTitle');
  if(id){
    var a=getArticles().find(function(x){return x.id===id;});
    if(a){
      if(titleEl)titleEl.textContent='Edit Article';
      document.getElementById('artEditId').value=a.id;
      document.getElementById('artTitle').value=a.title||'';
      document.getElementById('artCategory').value=a.category||'visa';
      document.getElementById('artSummary').value=a.summary||'';
      document.getElementById('artBody').value=a.body||'';
      document.getElementById('artImage').value=a.image||'';
      document.getElementById('artReadTime').value=a.readTime||'5 min';
    }
  } else {
    if(titleEl)titleEl.textContent='Write New Article';
    ['artTitle','artSummary','artBody','artImage'].forEach(function(i){var el=document.getElementById(i);if(el)el.value='';});
    document.getElementById('artReadTime').value='5 min';
    document.getElementById('artEditId').value='';
  }
  modal.style.display='flex';
}
function closeArticleModal(){var m=document.getElementById('adminArticleModal');if(m)m.style.display='none';}
function saveArticle(){
  var title=document.getElementById('artTitle').value.trim();
  var cat=document.getElementById('artCategory').value;
  var sum=document.getElementById('artSummary').value.trim();
  var body=document.getElementById('artBody').value.trim();
  var img=document.getElementById('artImage').value.trim();
  var rt=document.getElementById('artReadTime').value.trim();
  var editId=document.getElementById('artEditId').value;
  if(!title){showToast('Please enter a title');return;}
  var articles=getArticles();
  if(editId){var idx=articles.findIndex(function(a){return a.id===editId;});if(idx!==-1)articles[idx]={id:editId,title:title,category:cat,summary:sum,body:body,image:img,readTime:rt,date:articles[idx].date};}
  else{articles.unshift({id:'a'+Date.now(),title:title,category:cat,summary:sum,body:body,image:img,readTime:rt||'5 min',date:new Date().toISOString()});}
  saveArticles(articles); closeArticleModal(); renderAdminArticles(); renderKbtGrid(); showToast('\u2713 Article saved!');
}

/* ADMIN FAQ */
function renderAdminFaq(){
  var faqs=getFaqData(),list=document.getElementById('adminFaqList');if(!list)return;
  list.innerHTML=faqs.map(function(f){
    return '<div class="admin-faq-item"><div class="afi-body"><div class="afi-q">'+escHtml(f.q)+'</div><span class="afi-cat">'+f.cat+'</span></div>'
      +'<div class="admin-item-actions"><button class="admin-edit-btn" onclick="openFaqModal(\''+f.id+'\')">Edit</button>'
      +'<button class="admin-del-btn" onclick="delFaq(\''+f.id+'\')">Delete</button></div></div>';
  }).join('');
}
function delFaq(id){if(!confirm('Delete?'))return;saveFaqData(getFaqData().filter(function(f){return f.id!==id;}));renderAdminFaq();renderFaqGrid();showToast('Deleted');}
function openFaqModal(id){
  var modal=document.getElementById('adminFaqModal');
  if(!modal){
    modal=document.createElement('div');modal.id='adminFaqModal';
    modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:700;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);';
    modal.innerHTML='<div style="background:var(--white);border-radius:20px;padding:36px 32px;max-width:600px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.13);position:relative;">'
      +'<button onclick="closeFaqModal()" style="position:absolute;top:16px;right:16px;background:var(--bg2);border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;color:var(--text2);">\u2715</button>'
      +'<h2 id="faqMT" style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:20px;font-weight:800;margin-bottom:24px;">FAQ</h2>'
      +'<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:700;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Category</label>'
      +'<select id="faqCatSel" style="width:100%;background:var(--bg2);border:1.5px solid var(--border);color:var(--text);border-radius:12px;padding:11px 14px;font-size:14px;outline:none;">'
      +'<option value="general">General</option><option value="documents">Documents</option><option value="application">Application</option><option value="after">After Approval</option><option value="eligibility">Eligibility</option></select></div>'
      +'<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:700;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Question</label><input type="text" id="faqQIn" style="width:100%;background:var(--bg2);border:1.5px solid var(--border);color:var(--text);border-radius:12px;padding:11px 14px;font-size:14px;outline:none;"></div>'
      +'<div style="margin-bottom:24px;"><label style="display:block;font-size:12px;font-weight:700;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Answer</label><textarea id="faqAIn" style="width:100%;background:var(--bg2);border:1.5px solid var(--border);color:var(--text);border-radius:12px;padding:11px 14px;font-size:14px;outline:none;resize:vertical;min-height:100px;"></textarea></div>'
      +'<button onclick="saveFaqItem()" style="background:linear-gradient(135deg,#E8422A,#F5A623);color:#fff;border:none;padding:13px 28px;border-radius:50px;font-family:\'Bricolage Grotesque\',sans-serif;font-size:14px;font-weight:700;cursor:pointer;">Save FAQ</button>'
      +'<input type="hidden" id="faqEId"></div>';
    document.body.appendChild(modal);
  }
  if(id){var f=getFaqData().find(function(x){return x.id===id;});if(f){document.getElementById('faqMT').textContent='Edit FAQ';document.getElementById('faqEId').value=f.id;document.getElementById('faqCatSel').value=f.cat||'general';document.getElementById('faqQIn').value=f.q||'';document.getElementById('faqAIn').value=f.a||'';}}
  else{document.getElementById('faqMT').textContent='Add FAQ';document.getElementById('faqEId').value='';document.getElementById('faqQIn').value='';document.getElementById('faqAIn').value='';}
  modal.style.display='flex';
}
function closeFaqModal(){var m=document.getElementById('adminFaqModal');if(m)m.style.display='none';}
function saveFaqItem(){
  var cat=document.getElementById('faqCatSel').value,q=document.getElementById('faqQIn').value.trim(),a=document.getElementById('faqAIn').value.trim(),editId=document.getElementById('faqEId').value;
  if(!q||!a){showToast('Fill in question and answer');return;}
  var faqs=getFaqData();
  if(editId){var idx=faqs.findIndex(function(f){return f.id===editId;});if(idx!==-1)faqs[idx]={id:editId,cat:cat,q:q,a:a};}
  else{faqs.push({id:'f'+Date.now(),cat:cat,q:q,a:a});}
  saveFaqData(faqs);closeFaqModal();renderAdminFaq();renderFaqGrid();showToast('\u2713 FAQ saved!');
}

/* ADMIN TESTIMONIALS */
function renderAdminTesti(){
  var t=getTestimonials(),list=document.getElementById('adminTestiList');if(!list)return;
  list.innerHTML=t.map(function(x){
    return '<div class="admin-article-item"><div><h4>'+escHtml(x.name)+'</h4><p>'+escHtml(x.meta||'')+'</p></div>'
      +'<div class="admin-item-actions"><button class="admin-edit-btn" onclick="openTestiModal(\''+x.id+'\')">Edit</button>'
      +'<button class="admin-del-btn" onclick="delTesti(\''+x.id+'\')">Delete</button></div></div>';
  }).join('');
}
function delTesti(id){if(!confirm('Delete?'))return;saveTestimonials(getTestimonials().filter(function(t){return t.id!==id;}));renderAdminTesti();showToast('Deleted');}
function openTestiModal(id){
  var modal=document.getElementById('adminTestiModal');
  if(!modal){
    modal=document.createElement('div');modal.id='adminTestiModal';
    modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:700;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);';
    modal.innerHTML='<div style="background:var(--white);border-radius:20px;padding:36px 32px;max-width:560px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.13);position:relative;">'
      +'<button onclick="closeTestiModal()" style="position:absolute;top:16px;right:16px;background:var(--bg2);border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;color:var(--text2);">\u2715</button>'
      +'<h2 id="testiMT" style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:20px;font-weight:800;margin-bottom:24px;">Testimonial</h2>'
      +'<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:700;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Name</label><input type="text" id="testiNm" style="width:100%;background:var(--bg2);border:1.5px solid var(--border);color:var(--text);border-radius:12px;padding:11px 14px;font-size:14px;outline:none;"></div>'
      +'<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:700;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Role / Journey</label><input type="text" id="testiMt" style="width:100%;background:var(--bg2);border:1.5px solid var(--border);color:var(--text);border-radius:12px;padding:11px 14px;font-size:14px;outline:none;"></div>'
      +'<div style="margin-bottom:24px;"><label style="display:block;font-size:12px;font-weight:700;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Quote</label><textarea id="testiQt" style="width:100%;background:var(--bg2);border:1.5px solid var(--border);color:var(--text);border-radius:12px;padding:11px 14px;font-size:14px;outline:none;resize:vertical;min-height:90px;"></textarea></div>'
      +'<button onclick="saveTestiItem()" style="background:linear-gradient(135deg,#E8422A,#F5A623);color:#fff;border:none;padding:13px 28px;border-radius:50px;font-family:\'Bricolage Grotesque\',sans-serif;font-size:14px;font-weight:700;cursor:pointer;">Save</button>'
      +'<input type="hidden" id="testiEId"></div>';
    document.body.appendChild(modal);
  }
  if(id){var t=getTestimonials().find(function(x){return x.id===id;});if(t){document.getElementById('testiMT').textContent='Edit';document.getElementById('testiEId').value=t.id;document.getElementById('testiNm').value=t.name||'';document.getElementById('testiMt').value=t.meta||'';document.getElementById('testiQt').value=t.quote||'';}}
  else{document.getElementById('testiMT').textContent='Add';document.getElementById('testiEId').value='';['testiNm','testiMt','testiQt'].forEach(function(i){document.getElementById(i).value='';});}
  modal.style.display='flex';
}
function closeTestiModal(){var m=document.getElementById('adminTestiModal');if(m)m.style.display='none';}
function saveTestiItem(){
  var name=document.getElementById('testiNm').value.trim(),meta=document.getElementById('testiMt').value.trim(),quote=document.getElementById('testiQt').value.trim(),editId=document.getElementById('testiEId').value;
  if(!name||!quote){showToast('Fill in name and quote');return;}
  var t=getTestimonials();
  if(editId){var idx=t.findIndex(function(x){return x.id===editId;});if(idx!==-1)t[idx]={id:editId,name:name,meta:meta,quote:quote};}
  else{t.push({id:'t'+Date.now(),name:name,meta:meta,quote:quote});}
  saveTestimonials(t);closeTestiModal();renderAdminTesti();showToast('\u2713 Saved!');
}

/* FORM LEADS */
function renderLeads(){
  var wrap = document.getElementById('leadsTableWrap');
  var empty = document.getElementById('leadsEmpty');
  var counter = document.getElementById('leadsCount');
  if(!wrap) return;
  var leads = JSON.parse(localStorage.getItem('ns_leads')||'[]');
  var checkerCount = leads.filter(function(l){return l.source==='checker';}).length;
  var contactCount = leads.filter(function(l){return l.source==='contact';}).length;
  if(counter) counter.textContent = leads.length + ' submission' + (leads.length===1?'':'s') +
    (leads.length ? ' (\uD83E\uDDEE ' + checkerCount + ' checker \u00B7 \u2709\uFE0F ' + contactCount + ' contact form)' : '');
  if(!leads.length){wrap.style.display='none';if(empty)empty.style.display='block';return;}
  wrap.style.display='';if(empty)empty.style.display='none';
  var STATUS_OPTS = ['new','contacted','converted','archived'];
  var sourceBadge = {
    'checker': 'background:#EDE9FE;color:#5B21B6',
    'contact': 'background:#DBEAFE;color:#1E40AF'
  };
  var rows = leads.map(function(l){
    var opts = STATUS_OPTS.map(function(s){return '<option value="'+s+'"'+(l.status===s?' selected':'')+'>'+s.charAt(0).toUpperCase()+s.slice(1)+'</option>';}).join('');
    var statusBadge = {'new':'background:#FEF3C7;color:#92400E','contacted':'background:#DBEAFE;color:#1E40AF','converted':'background:#D1FAE5;color:#065F46','archived':'background:#F3F4F6;color:#6B7280'}[l.status]||'';
    var src = l.source || 'contact';
    var srcStyle = sourceBadge[src] || 'background:#F3F4F6;color:#6B7280';
    var srcLabel = src === 'checker' ? '\uD83E\uDDEE Checker' : '\u2709\uFE0F Contact';
    var nameCell = (l.first||l.last) ? escHtml(l.first+' '+l.last).trim() : '<span style="color:var(--text3);font-style:italic;">—</span>';
    return '<tr>'+
      '<td style="font-size:12px;color:var(--text3);white-space:nowrap;">'+fmtDate(l.date)+'</td>'+
      '<td><span style="font-size:11px;font-weight:700;padding:3px 9px;border-radius:20px;'+srcStyle+'">'+srcLabel+'</span></td>'+
      '<td style="font-weight:600;">'+nameCell+'</td>'+
      '<td><a href="mailto:'+escHtml(l.email)+'" style="color:var(--brand);">'+escHtml(l.email)+'</a></td>'+
      '<td style="font-size:13px;color:var(--text2);">'+escHtml(l.nationality||'—')+'</td>'+
      '<td style="max-width:220px;font-size:12px;color:var(--text2);">'+escHtml((l.message||'').substring(0,100))+(l.message&&l.message.length>100?'…':'')+'</td>'+
      '<td><span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;'+statusBadge+'">'+escHtml(l.status)+'</span></td>'+
      '<td><select onchange="updateLeadStatus('+l.id+',this.value)" style="font-size:12px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;cursor:pointer;">'+opts+'</select></td>'+
      '<td><button onclick="deleteLead('+l.id+')" style="background:none;border:none;cursor:pointer;color:#EF4444;font-size:16px;" title="Delete">\uD83D\uDDD1</button></td>'+
    '</tr>';
  }).join('');
  document.getElementById('leadsTableBody').innerHTML = rows;
}
function updateLeadStatus(id,status){
  var leads = JSON.parse(localStorage.getItem('ns_leads')||'[]');
  leads = leads.map(function(l){return l.id===id?Object.assign({},l,{status:status}):l;});
  localStorage.setItem('ns_leads',JSON.stringify(leads));
  renderLeads();
}
function deleteLead(id){
  var leads = JSON.parse(localStorage.getItem('ns_leads')||'[]');
  localStorage.setItem('ns_leads',JSON.stringify(leads.filter(function(l){return l.id!==id;})));
  renderLeads();
}
function clearLeads(){
  if(!confirm('Delete ALL form submissions? This cannot be undone.')) return;
  localStorage.removeItem('ns_leads');
  renderLeads();
}
function exportLeads(){
  var leads = JSON.parse(localStorage.getItem('ns_leads')||'[]');
  if(!leads.length){showToast('No submissions to export.');return;}
  var csv = 'Date,First,Last,Email,Nationality,Message,Status\n'+leads.map(function(l){
    return [fmtDate(l.date),l.first,l.last,l.email,l.nationality,(l.message||'').replace(/"/g,'""'),l.status].map(function(v){return '"'+(v||'')+'"';}).join(',');
  }).join('\n');
  var a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);
  a.download='nomadspain-leads-'+new Date().toISOString().slice(0,10)+'.csv';a.click();
}

/* EMAIL SUBSCRIBERS */
function renderEmailList(){
  var tbody=document.getElementById('emailListBody'),empty=document.getElementById('emailListEmpty');
  if(!tbody) return;
  if(!_adminToken){return;}
  fetch('/api/admin/subscribers',{headers:{'X-Admin-Token':_adminToken}})
    .then(function(r){return r.json();}).then(function(rows){
      if(!rows.length){tbody.innerHTML='';if(empty)empty.style.display='block';return;}
      if(empty)empty.style.display='none';
      tbody.innerHTML=rows.map(function(e,i){return '<tr><td>'+(i+1)+'</td><td>'+escHtml(e.email)+'</td><td>'+fmtDate(e.created_at)+'</td></tr>';}).join('');
    }).catch(function(){
      var local=getNewsletterEmails();
      if(!local.length){if(empty)empty.style.display='block';return;}
      if(empty)empty.style.display='none';
      tbody.innerHTML=local.map(function(e,i){return '<tr><td>'+(i+1)+'</td><td>'+escHtml(e.email)+'</td><td>'+fmtDate(e.date)+'</td></tr>';}).join('');
    });
}
function exportEmails(){
  if(_adminToken){
    fetch('/api/admin/subscribers',{headers:{'X-Admin-Token':_adminToken}})
      .then(function(r){return r.json();}).then(function(rows){
        if(!rows.length){showToast('No emails to export');return;}
        var csv='Email,Source,Date\n'+rows.map(function(e){return e.email+','+e.source+','+e.created_at;}).join('\n');
        var a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);a.download='subscribers.csv';a.click();
      });
    return;
  }
  var emails=getNewsletterEmails();
  if(!emails.length){showToast('No emails to export');return;}
  var csv='Email,Date\n'+emails.map(function(e){return e.email+','+e.date;}).join('\n');
  var a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);a.download='subscribers.csv';a.click();
}

/* INIT */
/* ══ HERO GRID MOUSE REVEAL ══ */
(function(){
  var hero=document.getElementById('hero-section');
  var reveal=document.getElementById('heroGridReveal');
  if(!hero||!reveal)return;
  hero.addEventListener('mousemove',function(e){
    var r=hero.getBoundingClientRect();
    var x=e.clientX-r.left;
    var y=e.clientY-r.top;
    reveal.style.maskImage='radial-gradient(320px circle at '+x+'px '+y+'px, black, transparent)';
    reveal.style.webkitMaskImage='radial-gradient(320px circle at '+x+'px '+y+'px, black, transparent)';
  });
  hero.addEventListener('mouseleave',function(){
    reveal.style.maskImage='none';reveal.style.webkitMaskImage='none';
  });
})();

window.addEventListener('DOMContentLoaded', function() {
  seedDefaultArticles();
  initCarousel();
  applyAdminDataToPage();
  initTesti();
  renderKbtGrid();
  if(document.getElementById('knowledge-page').classList.contains('active')){renderKbGrid();renderFaqGrid();}
  setTimeout(initFadeUps, 100);
});
