// assets/js/main.js
// App wiring AFTER partials are injected. Defensive guards; no crashes.
// Works with index.html load order: boot-includes -> chat -> main.  (see index.html)
(function () {
  // ---------- State ----------
  window.state = { auth:false, dark:false, vh:false, support:false, tts:false, lang:'en' };

  // Canonical tracks used by Explore Paths
  const TRACKS = [
    {k:'fullstack', name:'Software Development (Full-stack)', blurb:'Front-end & back-end foundations with project practice.'},
    {k:'data',      name:'Data Analytics',                    blurb:'Spreadsheets → SQL → dashboards for real insights.'},
    {k:'uiux',      name:'UI/UX Design',                      blurb:'Design thinking, wireframes, prototypes, usability.'},
    {k:'marketing', name:'Digital Marketing',                 blurb:'SEO, content, ads, analytics for growth.'},
    {k:'support',   name:'Customer Support (Remote)',         blurb:'Ticketing, empathy, SLAs, tooling.'},
    {k:'va',        name:'Virtual Assistance / Operations',   blurb:'Scheduling, docs, communication, tooling.'},
    {k:'cloud',     name:'Cloud & DevOps (Intro)',            blurb:'Cloud basics, CI/CD, containers overview.'},
  ];

  // ---------- Utils ----------
  const $ = (id) => document.getElementById(id);
  const save = (k,v)=>{ try{ localStorage.setItem(k,String(v)); }catch{} };

  function updateDashboardVisual(){
    $('dashBtn')?.classList.toggle('guest', !state.auth);
    $('m_dashBtn')?.classList.toggle('guest', !state.auth);
  }

  function initState(){
    try {
      state.dark = localStorage.getItem('pmerit_dark') === 'true';
      state.auth = localStorage.getItem('pmerit_auth') === 'true';
      state.tts  = localStorage.getItem('pmerit_tts')  === 'true';
      state.lang = localStorage.getItem('pmerit_lang') || 'en';
    } catch {}
    document.body.classList.toggle('dark', state.dark);
    const lang = $('lang'); if (lang) lang.value = state.lang;
    if (state.dark) $('darkToggle')?.classList.add('active');
    if (state.tts)  $('ttsToggle')?.classList.add('active');
    updateDashboardVisual();
  }

  // ---------- Feature toggles ----------
  function setDark(on){ $('darkToggle')?.classList.toggle('active', on); state.dark=on; document.body.classList.toggle('dark', on); save('pmerit_dark', on); }
  function setTTS(on){ $('ttsToggle')?.classList.toggle('active', on); state.tts=on; save('pmerit_tts', on); if (!on && 'speechSynthesis' in window) speechSynthesis.cancel(); }
  function setSupport(on){
    $('supportToggle')?.classList.toggle('active', on);
    $('m_supportToggle')?.classList.toggle('active', on);
    state.support=on;
    const b=$('supportBadge'); if (b) b.style.display=on?'inline-flex':'none';
    const w=$('welcomeCopy'); if (w) {
      w.textContent = on
        ? "Welcome to PMERIT Support. I can help with accounts, enrollment, and technical issues. How can I assist you today?"
        : "Welcome to PMERIT! I'm here to guide your learning journey. Our mission is to provide accessible, high-quality education that opens doors to endless opportunities. How can I help you discover your potential today?";
    }
  }
  function setVH(on){
    $('vhToggle')?.classList.toggle('active', on);
    $('m_vhToggle')?.classList.toggle('active', on);
    state.vh=on;
    const textChat=$('textChat'), stage=$('vhStage'), ava=$('vhAvatar'), badge=$('vhBadge');
    if (on){ if(textChat) textChat.style.display='none'; if(stage) stage.style.display='flex'; ava?.classList.add('active'); if(badge) badge.style.display='inline-flex'; $('captions')?.textContent="Virtual Human is ready."; }
    else   { if(stage) stage.style.display='none'; if(textChat) textChat.style.display='flex'; ava?.classList.remove('active'); if(badge) badge.style.display='none'; }
  }

  // ---------- Modal helpers ----------
  function openDialog(id){ $(id)?.showModal?.(); }
  function closeDialog(id){ $(id)?.close?.(); }

  function goDashboard(){ if (state.auth) location.href='dashboard.html'; else openDialog('signUpModal'); }
  function openAssessment(){ openDialog('assessmentModal'); }

  // ---------- Tracks render ----------
  function renderTracks(){
    const list=$('tracksList'); const detail=$('trackDetail'); if (!list || !detail) return;
    list.innerHTML=''; detail.style.display='none'; detail.innerHTML='';
    TRACKS.forEach(t=>{
      const card=document.createElement('div');
      card.className='track-card';
      card.innerHTML=`<h4>${t.name}</h4><p>${t.blurb}</p>`;
      card.addEventListener('click', ()=>{
        detail.style.display='block';
        detail.innerHTML=`
          <h4 style="margin:.25rem 0">${t.name}</h4>
          <p style="color:var(--text-secondary);margin:.5rem 0">${t.blurb}</p>
          <button class="nav-btn primary" type="button" id="trackCta">See sample plan</button>`;
        $('trackCta')?.addEventListener('click', ()=>{ closeDialog('tracksModal'); openAssessment(); });
      });
      list.appendChild(card);
    });
  }

  // ---------- Wiring ----------
  function wireHeader(){
    $('pricingBtn')?.addEventListener('click', ()=> alert('Pricing page placeholder'));
    $('signInBtn')?.addEventListener('click', ()=> openDialog('signInModal'));
    $('startBtn') ?.addEventListener('click', ()=> openDialog('signUpModal'));
    $('lang')?.addEventListener('change', (e)=>{ state.lang=e.target.value; save('pmerit_lang', state.lang); });
  }

  function wireSidebarAndMobile(){
    // Toggles
    $('darkToggle')?.addEventListener('click', ()=>setDark(!state.dark));
    $('ttsToggle') ?.addEventListener('click', ()=>setTTS(!state.tts));
    $('supportToggle')?.addEventListener('click', ()=>setSupport(!state.support));
    $('supportShort') ?.addEventListener('click', ()=>setSupport(true));
    $('vhToggle') ?.addEventListener('click', ()=>setVH(!state.vh));
    $('vhQuick')  ?.addEventListener('click', ()=>setVH(true));
    $('vhShort')  ?.addEventListener('click', ()=>setVH(true));

    // Mobile quick actions
    $('m_vhToggle')     ?.addEventListener('click', ()=>setVH(!state.vh));
    $('m_supportToggle')?.addEventListener('click', ()=>setSupport(!state.support));
    $('m_settings')     ?.addEventListener('click', ()=>alert(`Settings\n- Dark Mode: ${state.dark?'On':'Off'}\n- TTS: ${state.tts?'On':'Off'}`));

    // Settings collapsible
    const box=$('settingsBox'), head=box?.querySelector('.head'), body=box?.querySelector('.body');
    head?.addEventListener('click', ()=>{
      const open = body?.style.display==='block';
      if (body) body.style.display = open ? 'none' : 'block';
      head.querySelector?.('.fa-chevron-down')?.classList.toggle('rot', !open);
    });

    // Career Tracks (desktop + mobile)
    const openTracks = () => { openDialog('tracksModal'); renderTracks(); };
    $('careerPaths')  ?.addEventListener('click', openTracks);
    $('m_careerPaths')?.addEventListener('click', openTracks);

    // Dashboard (desktop + mobile)
    $('dashBtn') ?.addEventListener('click', goDashboard);
    $('m_dashBtn')?.addEventListener('click', goDashboard);

    // Voices / TTS preview
    $('voicesBtn') ?.addEventListener('click', ()=> openDialog('voicesModal'));
    $('browserTts')?.addEventListener('click', ()=>{
      const txt = $('voiceText')?.value?.trim(); if (!txt) return;
      if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(txt); speechSynthesis.speak(u); }
      else alert('Speech Synthesis is not available in this browser.');
    });

    // Assessment
    $('assessmentBtn') ?.addEventListener('click', openAssessment);
    $('assessmentStart')?.addEventListener('click', ()=>{ alert('Assessment started (placeholder)'); closeDialog('assessmentModal'); });
    $('assessmentCancel')?.addEventListener('click', ()=> closeDialog('assessmentModal'));

    // Modal close buttons
    $('tracksClose') ?.addEventListener('click', ()=> closeDialog('tracksModal'));
    $('voicesClose') ?.addEventListener('click', ()=> closeDialog('voicesModal'));
    $('signUpCancel')?.addEventListener('click', ()=> closeDialog('signUpModal'));
    $('signInCancel')?.addEventListener('click', ()=> closeDialog('signInModal'));
  }

  function wireChat(){
    // Char counter
    const input = $('chatInput'), count=$('count');
    if (input && count){
      input.addEventListener('input', ()=>{ count.textContent = `${input.value.length}/1000`; });
    }
    // Send button
    $('sendBtn')?.addEventListener('click', ()=> window.PMERIT_CHAT?.sendMessage?.());
  }

  function PMERIT_INIT(){
    // Called after partials are injected (from boot-includes or via event)
    initState();
    wireHeader();
    wireSidebarAndMobile();
    wireChat();
  }
  window.PMERIT_INIT = PMERIT_INIT; // optional direct call from boot-includes

  // ---------- Boot sequencing ----------
  function startAfterPartials(){
    try { PMERIT_INIT(); } catch(e){ console.error(e); }
  }

  // If partials already loaded, go immediately (fast path)
  if (document.documentElement.getAttribute('data-partials-ready') === '1') {
    startAfterPartials();
  } else {
    // Otherwise wait for the signal from boot-includes.js
    document.addEventListener('partials:ready', startAfterPartials, { once: true });
  }
})();
