// --- Idempotent PMERIT_INIT boot after partials ---
(function(){
  function safeInit(){
    try {
      if (typeof window.PMERIT_INIT === 'function') window.PMERIT_INIT();
    } catch(e) {
      console.error("[main.js] Error running PMERIT_INIT:", e);
    }
  }
  if (document.documentElement.dataset.partialsReady === '1') {
    safeInit();
  } else {
    document.addEventListener('partials:ready', safeInit, { once: true });
  }
})();

(function () {
  window.state = { auth:false, dark:false, vh:false, support:false, tts:false, lang:'en' };

  const $ = (id) => {
    try { return document.getElementById(id) || null; } catch { return null; }
  };

  const TRACKS = [
    {k:'fullstack', name:'Software Development (Full-stack)', blurb:'Front-end + back-end foundations with project practice.'},
    {k:'data',      name:'Data Analytics',                   blurb:'Spreadsheets → SQL → dashboards for real insights.'},
    {k:'uiux',      name:'UI/UX Design',                     blurb:'Design thinking, wireframes, prototypes, usability.'},
    {k:'marketing', name:'Digital Marketing',                blurb:'SEO, content, ads, analytics for growth.'},
    {k:'support',   name:'Customer Support (Remote)',        blurb:'Ticketing, empathy, SLAs, tooling.'},
    {k:'va',        name:'Virtual Assistance / Operations',  blurb:'Scheduling, docs, communication, tooling.'},
    {k:'cloud',     name:'Cloud & DevOps (Intro)',           blurb:'Cloud basics, CI/CD, containers overview.'},
  ];

  const save = (k,v)=>{ try{ localStorage.setItem(k,String(v)); }catch{} };

  function updateDashboardVisual(){
    const d = $('dashBtn'); if (d) d.classList.toggle('guest', !state.auth);
    const md = $('m_dashBtn'); if (md) md.classList.toggle('guest', !state.auth);
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

  function setDark(on){
    const darkToggle = $('darkToggle');
    if (darkToggle) darkToggle.classList.toggle('active', on);
    state.dark = on;
    document.body.classList.toggle('dark', on);
    save('pmerit_dark', on);
  }
  function setTTS(on){
    const ttsToggle = $('ttsToggle');
    if (ttsToggle) ttsToggle.classList.toggle('active', on);
    state.tts = on;
    save('pmerit_tts', on);
    if (!on && 'speechSynthesis' in window) speechSynthesis.cancel();
  }
  function setSupport(on){
    const supportToggle = $('supportToggle');
    if (supportToggle) supportToggle.classList.toggle('active', on);
    const mSupportToggle = $('m_supportToggle');
    if (mSupportToggle) mSupportToggle.classList.toggle('active', on);
    state.support = on;
    const b = $('supportBadge');
    if (b) b.style.display = on ? 'inline-flex' : 'none';
    const w = $('welcomeCopy');
    if (w) w.textContent = on
      ? "Welcome to PMERIT Support. I can help with accounts, enrollment, and technical issues. How can I assist you today?"
      : "Welcome to PMERIT! I'm here to guide your learning journey. Our mission is to provide accessible, high-quality education that opens doors to endless opportunities. How can I help you discover new skills or career paths?";
  }
  function setVH(on){
    const vhToggle = $('vhToggle');
    if (vhToggle) vhToggle.classList.toggle('active', on);
    const mVhToggle = $('m_vhToggle');
    if (mVhToggle) mVhToggle.classList.toggle('active', on);
    state.vh = on;
    const textChat = $('textChat'),
      stage = $('vhStage'),
      ava = $('vhAvatar'),
      badge = $('vhBadge');
    if (on){
      if (textChat) textChat.style.display = 'none';
      if (stage) stage.style.display = 'flex';
      if (ava) ava.classList.add('active');
      if (badge) badge.style.display = 'inline-flex';
      const captions = $('captions');
      if (captions) captions.textContent = "Virtual Human is speaking…";
    } else {
      if (stage) stage.style.display = 'none';
      if (textChat) textChat.style.display = 'flex';
      if (ava) ava.classList.remove('active');
      if (badge) badge.style.display = 'none';
    }
  }
  function goDashboard(){
    if (state.auth) location.href = 'dashboard.html';
    else $('signUpModal')?.showModal?.();
  }
  function openAssessment(){ $('assessmentModal')?.showModal?.(); }

  function renderTracks(){
    const list = $('tracksList');
    const detail = $('trackDetail');
    if (!list || !detail) return;
    list.innerHTML = '';
    detail.style.display = "none";
    TRACKS.forEach(t=>{
      const card = document.createElement('div');
      card.className = 'track-card';
      card.innerHTML = `<h4>${t.name}</h4><p>${t.blurb}</p>`;
      card.addEventListener('click', ()=>{
        detail.style.display = 'block';
        detail.innerHTML = `
          <h4 style="margin:.25rem 0">${t.name}</h4>
          <p style="color:var(--text-secondary);margin:.5rem 0">${t.blurb}</p>
          <button class="nav-btn primary" type="button" id="trackCta">See sample plan</button>`;
        const trackCta = $('trackCta');
        if (trackCta) {
          trackCta.addEventListener('click', ()=>{
            $('tracksModal')?.close?.();
            openAssessment();
          });
        }
      });
      list.appendChild(card);
    });
  }

  function wireEvents(){
    // --- Left panel toggles ---
    $('vhToggle')?.addEventListener('click', ()=>setVH(!$('vhToggle').classList.contains('active')));
    $('careerPaths')?.addEventListener('click', ()=>{
      renderTracks();
      $('tracksModal')?.showModal?.();
    });
    $('supportToggle')?.addEventListener('click', ()=>setSupport(!$('supportToggle').classList.contains('active')));

    // Settings collapsible (show/hide settings body, toggle icon)
    const box = $('settingsBox');
    const head = box?.querySelector('.head'), body = box?.querySelector('.body');
    if (head && body) {
      // Always start hidden
      body.style.display = "none";
      head.addEventListener('click', ()=>{
        const open = body.style.display === 'block';
        body.style.display = open ? 'none' : 'block';
        const ico = head.querySelector('i.fas');
        if (ico) ico.className = open ? 'fas fa-sliders-h' : 'fas fa-chevron-down';
      });
    }

    // --- Other toggles and actions ---
    $('darkToggle')?.addEventListener('click', ()=>setDark(!state.dark));
    $('ttsToggle')?.addEventListener('click', ()=>setTTS(!state.tts));
    $('supportShort')?.addEventListener('click', ()=>setSupport(true));
    $('vhQuick')?.addEventListener('click', ()=>setVH(true));
    $('vhShort')?.addEventListener('click', ()=>setVH(true));

    // Mobile quick actions
    $('m_vhToggle')?.addEventListener('click', ()=>setVH(!state.vh));
    $('m_supportToggle')?.addEventListener('click', ()=>setSupport(!state.support));
    $('m_settings')?.addEventListener('click', ()=>alert(`Settings: Dark Mode: ${state.dark?'On':'Off'}, TTS: ${state.tts?'On':'Off'}`));

    // Auth / dashboard
    $('dashBtn')?.addEventListener('click', goDashboard);
    $('m_dashBtn')?.addEventListener('click', goDashboard);
    $('signInBtn')?.addEventListener('click', ()=>$('signInModal')?.showModal?.());
    $('signInCancel')?.addEventListener('click', ()=>$('signInModal')?.close?.());
    $('signInGo')?.addEventListener('click', ()=>{
      const email = $('si_email')?.value.trim();
      const pwd = $('si_pwd')?.value.trim();
      if(!email||!pwd){ alert('Please enter your email and password.'); return; }
      state.auth = true;
      save('pmerit_auth',true);
      updateDashboardVisual();
      $('signInModal')?.close?.();
      window.PMERIT_CHAT?.addMessage('PMERIT AI','Welcome back! Your account has been successfully signed in. You now have access to your personal dashboard and can track your learning progress.');
    });
    $('signUpCancel')?.addEventListener('click', ()=>$('signUpModal')?.close?.());
    $('signUpCreate')?.addEventListener('click', ()=>{
      const name = $('su_name')?.value.trim();
      const email = $('su_email')?.value.trim();
      const pwd = $('su_pwd')?.value.trim();
      if(!name||!email||!pwd){ alert('Please complete all fields.'); return; }
      state.auth = true;
      save('pmerit_auth',true);
      updateDashboardVisual();
      $('signUpModal')?.close?.();
      window.PMERIT_CHAT?.addMessage('PMERIT AI',`Welcome to PMERIT, ${name}! Your account has been created successfully. You now have access to personalized learning paths and can track your progress.`);
    });

    // Assessment
    $('startBtn')?.addEventListener('click', openAssessment);
    $('beginAssessment')?.addEventListener('click', openAssessment);
    $('m_beginAssessment')?.addEventListener('click', openAssessment);
    
    // New mobile assessment buttons
    $('m_startAssessment')?.addEventListener('click', openAssessment);
    $('m_skillEvaluation')?.addEventListener('click', ()=>window.PMERIT_CHAT?.addMessage('PMERIT AI','Skill evaluation helps identify your current strengths and areas for improvement. This assessment adapts to your responses to create a personalized learning plan.'));
    $('m_learningPath')?.addEventListener('click', ()=>window.PMERIT_CHAT?.addMessage('PMERIT AI','Your personalized learning path will be created based on your assessment results. This includes recommended courses, projects, and milestones to achieve your goals.'));
    $('m_progress')?.addEventListener('click', ()=>window.PMERIT_CHAT?.addMessage('PMERIT AI','Track your learning progress with detailed analytics. Monitor completion rates, skill development, and achievements as you advance through your chosen path.'));
    
    $('assessmentCancel')?.addEventListener('click', ()=>$('assessmentModal')?.close?.());
    $('assessmentStart')?.addEventListener('click', ()=>{
      $('assessmentModal')?.close?.();
      const results=[
        "Excellent! Based on your assessment, you have a strong analytical mindset and prefer visual learning. I recommend the Data Analytics track - it combines problem-solving with visual insights to prepare you for in-demand analytics roles.",
        "Great results! Your assessment shows you're creative and detail-oriented with strong communication skills. The UI/UX Design track would be perfect for combining creativity with user-centered design thinking.",
        "Wonderful! Your assessment indicates you're people-focused with strong organizational skills. I'd recommend either Customer Support or Digital Marketing - both offer excellent remote opportunities."
      ];
      window.PMERIT_CHAT?.addMessage('PMERIT AI', results[Math.floor(Math.random()*results.length)]);
    });

    // Chat
    $('chatInput')?.addEventListener('input', ()=>{ const c=$('count'); if (c) c.textContent = `${$('chatInput').value.length}/1000`; });
    $('sendBtn')?.addEventListener('click', ()=>window.PMERIT_CHAT?.sendMessage());
    $('chatInput')?.addEventListener('keydown', (e)=>{
      if(e.key==='Enter' && !e.shiftKey){
        e.preventDefault();
        window.PMERIT_CHAT?.sendMessage();
      }
    });

    // Mobile career paths
    $('m_careerPaths')?.addEventListener('click', ()=>{
      renderTracks();
      $('tracksModal')?.showModal?.();
    });

    $('tracksClose')?.addEventListener('click', ()=>$('tracksModal')?.close?.());

    // Voices + footer
    $('voicesBtn')?.addEventListener('click', ()=>$('voicesModal')?.showModal?.());
    $('voicesClose')?.addEventListener('click', ()=>$('voicesModal')?.close?.());
    $('browserTts')?.addEventListener('click', ()=>{
      const txt = $('voiceText')?.value.trim();
      if(!txt) return;
      if(!('speechSynthesis' in window)) { alert('Browser TTS not supported.'); return; }
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(txt));
    });

    $('privacyBtn')?.addEventListener('click', ()=>window.PMERIT_CHAT?.addMessage('PMERIT AI','Our Privacy & Terms page provides detailed information about how we protect your data and our terms of service. If you have any specific concerns, I can answer them here.'));
    $('contactBtn')?.addEventListener('click', ()=>window.PMERIT_CHAT?.addMessage('PMERIT AI','You can contact our support team through this chat interface, or reach out via email at support@pmerit.co.'));
    $('partnershipsBtn')?.addEventListener('click', ()=>window.PMERIT_CHAT?.addMessage('PMERIT AI','PMERIT partners with leading educational institutions and industry organizations to provide comprehensive learning experiences. Interested? Let us know!'));
    $('supportBtn')?.addEventListener('click', ()=>{ setSupport(true); window.PMERIT_CHAT?.addMessage('PMERIT AI',"Support mode activated! I'm now ready to help you with any technical issues, account questions, or course recommendations.") });

    const tips=[
      "Pro tip: Keep notes in your own words for better recall.",
      "Short, frequent study sessions are more effective than long cramming sessions.",
      "Relate new concepts to things you already understand for better retention.",
      "Teach what you've learned to someone else to solidify your understanding.",
      "Take breaks during study sessions to improve focus and retention."
    ];
    const rotate=(el)=>{ if(!el) return; let i=0; el.textContent=tips[0]; setInterval(()=>{ i=(i+1)%tips.length; el.textContent=tips[i]; },5000); };
    rotate($('insights')); rotate($('m_insights'));

    $('lang')?.addEventListener('change', function(){
      state.lang = this.value;
      save('pmerit_lang',state.lang);
      window.PMERIT_CHAT?.addMessage('PMERIT AI',`Language changed to ${this.options[this.selectedIndex].text}`);
    });
    $('pricingBtn')?.addEventListener('click', ()=>window.PMERIT_CHAT?.addMessage('PMERIT AI','PMERIT offers flexible pricing plans to make education accessible to everyone. We have free courses available as well as premium subscriptions for advanced content.'));
  }

  function init(){
    if (!$('body-container')) return;
    initState();
    wireEvents();
  }

  window.PMERIT_INIT = init;
  document.addEventListener('partials:loaded', init, { once:true });

  if (document.readyState === 'complete') init();
  else document.addEventListener('DOMContentLoaded', ()=>setTimeout(init,0));
})();
