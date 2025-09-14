// assets/js/main.js — initialize AFTER partials are injected
// (Faithful to the blueprint; only guarded and exposed init.)  :contentReference[oaicite:1]{index=1}
(function () {
  // Global state as in the blueprint
  window.state = { auth:false, dark:false, vh:false, support:false, tts:false, lang:'en' };

  const TRACKS = [
    {k:'fullstack', name:'Software Development (Full-stack)', blurb:'Front-end + back-end foundations with project practice.'},
    {k:'data', name:'Data Analytics', blurb:'Spreadsheets → SQL → dashboards for real insights.'},
    {k:'uiux', name:'UI/UX Design', blurb:'Design thinking, wireframes, prototypes, usability.'},
    {k:'marketing', name:'Digital Marketing', blurb:'SEO, content, ads, analytics for growth.'},
    {k:'support', name:'Customer Support (Remote)', blurb:'Ticketing, empathy, SLAs, tooling.'},
    {k:'va', name:'Virtual Assistance / Operations', blurb:'Scheduling, docs, communication, tooling.'},
    {k:'cloud', name:'Cloud & DevOps (Intro)', blurb:'Cloud basics, CI/CD, containers overview.'},
  ];

  // Utility
  function save(k,v){ try{ localStorage.setItem(k,String(v)); }catch(e){} }
  function qs(id){ return document.getElementById(id); }

  function updateDashboardVisual(){
    const dashBtn = qs('dashBtn');
    if (!dashBtn) return;
    dashBtn.classList.toggle('guest', !state.auth);
    const mDashBtn = qs('m_dashBtn');
    if (mDashBtn) mDashBtn.classList.toggle('guest', !state.auth);
  }

  function initState(){
    try{
      state.dark = localStorage.getItem('pmerit_dark') === 'true';
      state.auth = localStorage.getItem('pmerit_auth') === 'true';
      state.tts  = localStorage.getItem('pmerit_tts')  === 'true';
      state.lang = localStorage.getItem('pmerit_lang') || 'en';
    }catch(e){}
    document.body.classList.toggle('dark', state.dark);
    const darkToggle = qs('darkToggle'); if (darkToggle && state.dark) darkToggle.classList.add('active');
    const ttsToggle  = qs('ttsToggle');  if (ttsToggle  && state.tts ) ttsToggle.classList.add('active');
    const lang = qs('lang'); if (lang) lang.value = state.lang;
    updateDashboardVisual();
  }

  function setDark(on){
    const darkToggle = qs('darkToggle');
    if (darkToggle) darkToggle.classList.toggle('active', on);
    state.dark = on; document.body.classList.toggle('dark', on); save('pmerit_dark', on);
  }
  function setTTS(on){
    const ttsToggle = qs('ttsToggle');
    if (ttsToggle) ttsToggle.classList.toggle('active', on);
    state.tts = on; save('pmerit_tts', on);
    if (!on && 'speechSynthesis' in window) speechSynthesis.cancel();
  }
  function setSupport(on){
    const supportToggle = qs('supportToggle');
    const supportBadge  = qs('supportBadge');
    if (supportToggle) supportToggle.classList.toggle('active', on);
    const mSupportToggle = qs('m_supportToggle');
    if (mSupportToggle) mSupportToggle.classList.toggle('active', on);
    state.support = on;
    if (supportBadge) supportBadge.style.display = on ? 'inline-flex' : 'none';

    const wc = qs('welcomeCopy');
    if (wc){
      wc.textContent = on
        ? "Welcome to PMERIT Support. I can help with accounts, enrollment, and technical issues. How can I assist you today?"
        : "Welcome to PMERIT! I'm here to guide your learning journey. Our mission is to provide accessible, high-quality education that opens doors to endless opportunities. How can I help you discover your potential today?";
    }
  }
  function setVH(on){
    const vhToggle = qs('vhToggle');
    if (vhToggle) vhToggle.classList.toggle('active', on);
    const mVhToggle = qs('m_vhToggle'); if (mVhToggle) mVhToggle.classList.toggle('active', on);
    state.vh = on;

    const textChat = qs('textChat');
    const vhStage  = qs('vhStage');
    const vhAvatar = qs('vhAvatar');
    const vhBadge  = qs('vhBadge');

    if (on){
      if (textChat) textChat.style.display = 'none';
      if (vhStage)  vhStage.style.display  = 'flex';
      if (vhAvatar) vhAvatar.classList.add('active');
      if (vhBadge)  vhBadge.style.display  = 'inline-flex';
      const cap = qs('captions'); if (cap) cap.textContent = "Virtual Human is ready.";
    }else{
      if (vhStage)  vhStage.style.display  = 'none';
      if (textChat) textChat.style.display = 'flex';
      if (vhAvatar) vhAvatar.classList.remove('active');
      if (vhBadge)  vhBadge.style.display  = 'none';
    }
  }
  function goDashboard(){
    if (state.auth){ window.location.href = 'dashboard.html'; }
    else { const su = qs('signUpModal'); if (su && su.showModal) su.showModal(); }
  }
  function openAssessment(){ const d = qs('assessmentModal'); if (d && d.showModal) d.showModal(); }

  function addMessage(sender, text, isUser){
    const chatBody = qs('chatBody'); if (!chatBody) return;
    const welcomeMsg = qs('welcomeMsg'); if (welcomeMsg) welcomeMsg.remove();
    const el = document.createElement('article');
    el.className = 'bubble';
    el.innerHTML = `
      <div class="ava" style="${isUser ? 'background:#4f46e5' : ''}">
        <i class="fas ${isUser ? 'fa-user' : 'fa-user-circle'}"></i>
      </div>
      <div><h3>${sender}</h3><p>${text}</p></div>`;
    chatBody.appendChild(el);
    chatBody.scrollTop = chatBody.scrollHeight;

    if (state.tts && !isUser && 'speechSynthesis' in window){
      speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
    if (state.vh && !isUser){
      const cap = qs('captions'); if (cap) cap.textContent = text;
    }
  }
  function sendMessage(){
    const chatInput = qs('chatInput'); const count = qs('count');
    if (!chatInput || !count) return;
    const text = chatInput.value.trim(); if (!text) return;
    addMessage('You', text, true);
    chatInput.value = ''; count.textContent = '0/1000';
    setTimeout(()=>{
      const reply = state.support
        ? "Thanks for reaching out! I'm here to help with any questions about PMERIT - accounts, courses, technical issues, or platform features. What do you need assistance with?"
        : "Based on your interests, I'd recommend starting with our assessment to find the perfect learning path. We have tracks in Software Development, Data Analytics, UI/UX Design, and more. Would you like to begin the assessment?";
      addMessage('PMERIT AI', reply);
    }, 1000);
  }

  function renderTracks(){
    const list = qs('tracksList'); const detail = qs('trackDetail'); if (!list || !detail) return;
    list.innerHTML = '';
    TRACKS.forEach(t=>{
      const card = document.createElement('div');
      card.className='track-card';
      card.innerHTML=`<h4>${t.name}</h4><p>${t.blurb}</p>`;
      card.addEventListener('click', ()=>{
        detail.style.display='block';
        detail.innerHTML = `
          <h4 style="margin:.25rem 0">${t.name}</h4>
          <p style="color:var(--text-secondary);margin:.5rem 0">${t.blurb}</p>
          <button class="nav-btn primary" type="button" id="trackCta">See sample plan</button>`;
        const cta = qs('trackCta'); if (cta) cta.addEventListener('click', ()=>{ qs('tracksModal').close(); openAssessment(); });
      });
      list.appendChild(card);
    });
  }

  function wireUI(){
    // Guard: ensure body partial exists
    if (!qs('body-container') || !qs('settingsBox')) return false;

    // Toggles
    const darkToggle    = qs('darkToggle');
    const ttsToggle     = qs('ttsToggle');
    const supportToggle = qs('supportToggle');
    const vhToggle      = qs('vhToggle');
    const vhQuick       = qs('vhQuick');
    const vhShort       = qs('vhShort');
    const supportShort  = qs('supportShort');

    if (darkToggle)    darkToggle.addEventListener('click', ()=>setDark(!state.dark));
    if (ttsToggle)     ttsToggle.addEventListener('click',  ()=>setTTS(!state.tts));
    if (supportToggle) supportToggle.addEventListener('click',()=>setSupport(!state.support));
    if (supportShort)  supportShort.addEventListener('click',()=>setSupport(true));
    if (vhToggle)      vhToggle.addEventListener('click',   ()=>setVH(!state.vh));
    if (vhQuick)       vhQuick.addEventListener('click',    ()=>setVH(true));
    if (vhShort)       vhShort.addEventListener('click',    ()=>setVH(true));

    // Mobile toggles
    const mVhToggle = qs('m_vhToggle');
    const mSupportToggle = qs('m_supportToggle');
    const mSettings = qs('m_settings');
    if (mVhToggle) mVhToggle.addEventListener('click', ()=>setVH(!state.vh));
    if (mSupportToggle) mSupportToggle.addEventListener('click', ()=>setSupport(!state.support));
    if (mSettings) mSettings.addEventListener('click', ()=>{
      alert(`Settings: Dark Mode: ${state.dark?'On':'Off'}, TTS: ${state.tts?'On':'Off'}`);
    });

    // Collapsible
    const settingsBox = qs('settingsBox');
    const settingsHead = settingsBox ? settingsBox.querySelector('.head') : null;
    const settingsBody = settingsBox ? settingsBox.querySelector('.body') : null;
    if (settingsHead && settingsBody){
      settingsHead.addEventListener('click', ()=>{
        const open = settingsBody.style.display==='block';
        settingsBody.style.display = open?'none':'block';
        const ico = settingsHead.querySelector('i.fas');
        if (ico) ico.className = open ? 'fas fa-sliders-h' : 'fas fa-chevron-down';
      });
    }

    // Buttons / modals
    const dashBtn = qs('dashBtn'); if (dashBtn) dashBtn.addEventListener('click', goDashboard);
    const mDashBtn = qs('m_dashBtn'); if (mDashBtn) mDashBtn.addEventListener('click', goDashboard);

    const signInBtn = qs('signInBtn'); if (signInBtn) signInBtn.addEventListener('click', ()=>{ const d=qs('signInModal'); if (d && d.showModal) d.showModal(); });
    const signInCancel = qs('signInCancel'); if (signInCancel) signInCancel.addEventListener('click', ()=>qs('signInModal').close());
    const signInGo = qs('signInGo'); if (signInGo) signInGo.addEventListener('click', ()=>{
      const email=qs('si_email').value.trim(), pwd=qs('si_pwd').value.trim();
      if (!email||!pwd) { alert('Please enter your email and password.'); return; }
      state.auth=true; save('pmerit_auth',true); updateDashboardVisual(); qs('signInModal').close();
      addMessage('PMERIT AI','Welcome back! Your account has been successfully signed in. You now have access to your personal dashboard and can track your learning progress.');
    });

    const signUpCancel = qs('signUpCancel'); if (signUpCancel) signUpCancel.addEventListener('click', ()=>qs('signUpModal').close());
    const signUpCreate = qs('signUpCreate'); if (signUpCreate) signUpCreate.addEventListener('click', ()=>{
      const name=qs('su_name').value.trim(), email=qs('su_email').value.trim(), pwd=qs('su_pwd').value.trim();
      if (!name||!email||!pwd){ alert('Please complete all fields.'); return; }
      state.auth=true; save('pmerit_auth',true); updateDashboardVisual(); qs('signUpModal').close();
      addMessage('PMERIT AI',`Welcome to PMERIT, ${name}! Your account has been created successfully. You now have access to personalized learning paths and can track your progress.`);
    });

    const startBtn = qs('startBtn'); if (startBtn) startBtn.addEventListener('click', openAssessment);
    const beginAssessment = qs('beginAssessment'); if (beginAssessment) beginAssessment.addEventListener('click', openAssessment);
    const mBegin = qs('m_beginAssessment'); if (mBegin) mBegin.addEventListener('click', openAssessment);
    const assessCancel = qs('assessmentCancel'); if (assessCancel) assessCancel.addEventListener('click', ()=>qs('assessmentModal').close());
    const assessStart  = qs('assessmentStart'); if (assessStart) assessStart.addEventListener('click', ()=>{
      qs('assessmentModal').close();
      const results = [
        "Excellent! Based on your assessment, you have a strong analytical mindset and prefer visual learning. I recommend the Data Analytics track - it combines problem-solving with visual insights through dashboards and reports.",
        "Great results! Your assessment shows you're creative and detail-oriented with strong communication skills. The UI/UX Design track would be perfect for combining creativity with user-centered problem solving.",
        "Wonderful! Your assessment indicates you're people-focused with strong organizational skills. I'd recommend either Customer Support or Digital Marketing - both offer excellent remote opportunities and match your interpersonal strengths."
      ];
      addMessage('PMERIT AI', results[Math.floor(Math.random()*results.length)]);
    });

    const chatInput = qs('chatInput'); const count = qs('count'); const sendBtn = qs('sendBtn');
    if (chatInput && count){
      chatInput.addEventListener('input', ()=>{ count.textContent = `${chatInput.value.length}/1000`; });
      chatInput.addEventListener('keydown', (e)=>{ if (e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendMessage(); }});
    }
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);

    const careerPaths = qs('careerPaths'); if (careerPaths) careerPaths.addEventListener('click', ()=>{ renderTracks(); qs('tracksModal').showModal(); });
    const mCareer = qs('m_careerPaths'); if (mCareer) mCareer.addEventListener('click', ()=>{ renderTracks(); qs('tracksModal').showModal(); });
    const tracksClose = qs('tracksClose'); if (tracksClose) tracksClose.addEventListener('click', ()=>qs('tracksModal').close());

    const voicesBtn = qs('voicesBtn'); if (voicesBtn) voicesBtn.addEventListener('click', ()=>qs('voicesModal').showModal());
    const voicesClose = qs('voicesClose'); if (voicesClose) voicesClose.addEventListener('click', ()=>qs('voicesModal').close());
    const browserTts = qs('browserTts'); if (browserTts) browserTts.addEventListener('click', ()=>{
      const txt = qs('voiceText').value.trim(); if (!txt) return;
      if (!('speechSynthesis' in window)) { alert('Browser TTS not supported.'); return; }
      speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(txt));
    });

    const privacyBtn = qs('privacyBtn'); if (privacyBtn) privacyBtn.addEventListener('click', ()=>addMessage('PMERIT AI','Our Privacy & Terms page provides detailed information about how we protect your data and our terms of service. We prioritize your privacy and transparency in all our educational services.'));
    const contactBtn = qs('contactBtn'); if (contactBtn) contactBtn.addEventListener('click', ()=>addMessage('PMERIT AI','You can contact our support team through this chat interface, or reach out via email at support@pmerit.com. We typically respond within 24 hours during business days.'));
    const partnershipsBtn = qs('partnershipsBtn'); if (partnershipsBtn) partnershipsBtn.addEventListener('click', ()=>addMessage('PMERIT AI','PMERIT partners with leading educational institutions and industry organizations to provide comprehensive learning opportunities. Contact us to learn about partnership opportunities.'));
    const supportBtn = qs('supportBtn'); if (supportBtn) supportBtn.addEventListener('click', ()=>{ setSupport(true); addMessage('PMERIT AI',"Support mode activated! I'm now ready to help you with any technical issues, account questions, or general platform inquiries. How can I assist you?"); });

    // Insights rotator
    const insights = qs('insights'); const m_insights = qs('m_insights');
    const tips = [
      "Pro tip: Keep notes in your own words for better recall.",
      "Short, frequent study sessions are more effective than long cramming sessions.",
      "Relate new concepts to things you already understand for better retention.",
      "Teach what you've learned to someone else to solidify your understanding.",
      "Take breaks during study sessions to improve focus and retention."
    ];
    function rotate(el){ if(!el) return; let i=0; el.textContent=tips[0]; setInterval(()=>{ i=(i+1)%tips.length; el.textContent=tips[i]; },5000); }
    rotate(insights); rotate(m_insights);

    // Language + Pricing
    const lang = qs('lang'); if (lang) lang.addEventListener('change', function(){ state.lang=this.value; save('pmerit_lang', state.lang); addMessage('PMERIT AI',`Language changed to ${this.options[this.selectedIndex].text}. In a full implementation, the entire interface would be translated to your selected language.`); });
    const pricingBtn = qs('pricingBtn'); if (pricingBtn) pricingBtn.addEventListener('click', ()=>addMessage('PMERIT AI','PMERIT offers flexible pricing plans to make education accessible to everyone. We have free courses available, as well as premium plans with additional features and personalized support. Would you like to learn more about our pricing options?'));

    return true;
  }

  function init(){
    initState();
    // If partials not yet injected, wait for the signal from boot-includes
    if (!wireUI()){
      document.addEventListener('partials:loaded', ()=>{ initState(); wireUI(); }, { once:true });
    }
  }

  // Expose init so boot-includes can trigger it
  window.PMERIT_INIT = init;

  // If someone opens the blueprint HTML directly (without boot-includes),
  // still initialize when DOM is ready.
  if (document.readyState === 'complete') init();
  else document.addEventListener('DOMContentLoaded', ()=>setTimeout(init,0));
})();
