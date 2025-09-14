// main.js — blueprint script consolidated (no feature changes). :contentReference[oaicite:5]{index=5}
(function(){
  // Global state (per blueprint)
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

  // DOM refs resolved on init
  let body, darkToggle, vhToggle, supportToggle, ttsToggle, vhAvatar, vhBadge, vhStage, textChat,
      supportBadge, chatInput, count, sendBtn, chatBody, welcomeCopy, settingsBox, settingsHead,
      settingsBody, dashBtn, signInBtn, startBtn, pricingBtn, careerPaths, beginBtn,
      vhQuick, vhShort, supportShort, signInModal, signUpModal, assessmentModal, tracksModal, voicesModal,
      insights, m_insights;

  function save(k,v){ try{ localStorage.setItem(k,String(v)); }catch(e){} }
  function updateDashboardVisual(){
    dashBtn.classList.toggle('guest', !state.auth);
    const mDashBtn = document.getElementById('m_dashBtn');
    if (mDashBtn) mDashBtn.classList.toggle('guest', !state.auth);
  }
  function setDark(on){
    darkToggle.classList.toggle('active', on);
    state.dark = on; document.body.classList.toggle('dark', on); save('pmerit_dark', on);
  }
  function setTTS(on){
    ttsToggle.classList.toggle('active', on);
    state.tts = on; save('pmerit_tts', on);
    if (!on && 'speechSynthesis' in window) speechSynthesis.cancel();
  }
  function setSupport(on){
    supportToggle.classList.toggle('active', on);
    const mSupportToggle = document.getElementById('m_supportToggle');
    if (mSupportToggle) mSupportToggle.classList.toggle('active', on);
    state.support = on; supportBadge.style.display = on ? 'inline-flex' : 'none';
    if (welcomeCopy){
      welcomeCopy.textContent = on
        ? "Welcome to PMERIT Support. I can help with accounts, enrollment, and technical issues. How can I assist you today?"
        : "Welcome to PMERIT! I'm here to guide your learning journey. Our mission is to provide accessible, high-quality education that opens doors to endless opportunities. How can I help you discover your potential today?";
    }
  }
  function setVH(on){
    vhToggle.classList.toggle('active', on);
    const mVhToggle = document.getElementById('m_vhToggle');
    if (mVhToggle) mVhToggle.classList.toggle('active', on);
    state.vh = on;
    if (on){
      textChat.style.display = 'none';
      vhStage.style.display = 'flex';
      vhAvatar.classList.add('active');
      vhBadge.style.display = 'inline-flex';
      const cap = document.getElementById('captions'); if (cap) cap.textContent = "Virtual Human is ready.";
    }else{
      vhStage.style.display = 'none';
      textChat.style.display = 'flex';
      vhAvatar.classList.remove('active');
      vhBadge.style.display = 'none';
    }
  }
  function goDashboard(){
    if (state.auth){ window.location.href = 'dashboard.html'; }
    else if (typeof signUpModal.showModal === 'function'){ signUpModal.showModal(); }
  }
  function openAssessment(){ if (typeof assessmentModal.showModal === 'function') assessmentModal.showModal(); }
  function renderTracks(){
    const tracksList = document.getElementById('tracksList');
    const trackDetail = document.getElementById('trackDetail');
    tracksList.innerHTML = '';
    TRACKS.forEach(t=>{
      const card = document.createElement('div');
      card.className='track-card';
      card.innerHTML=`<h4>${t.name}</h4><p>${t.blurb}</p>`;
      card.addEventListener('click', ()=>{
        trackDetail.style.display='block';
        trackDetail.innerHTML = `
          <h4 style="margin:.25rem 0">${t.name}</h4>
          <p style="color:var(--text-secondary);margin:.5rem 0">${t.blurb}</p>
          <button class="nav-btn primary" type="button" id="trackCta">See sample plan</button>
        `;
        document.getElementById('trackCta').addEventListener('click', ()=>{
          tracksModal.close(); assessmentModal.showModal();
        });
      });
      tracksList.appendChild(card);
    });
  }
  const tips = [
    "Pro tip: Keep notes in your own words for better recall.",
    "Short, frequent study sessions are more effective than long cramming sessions.",
    "Relate new concepts to things you already understand for better retention.",
    "Teach what you've learned to someone else to solidify your understanding.",
    "Take breaks during study sessions to improve focus and retention."
  ];
  function rotateInsights(el){
    if (!el) return; let i=0; el.textContent=tips[0];
    setInterval(()=>{ i=(i+1)%tips.length; el.textContent=tips[i]; }, 5000);
  }
  function initState(){
    try{
      state.dark  = localStorage.getItem('pmerit_dark') === 'true';
      state.auth  = localStorage.getItem('pmerit_auth') === 'true';
      state.tts   = localStorage.getItem('pmerit_tts')  === 'true';
      state.lang  = localStorage.getItem('pmerit_lang') || 'en';
    }catch(e){}
    document.body.classList.toggle('dark', state.dark);
    if (state.dark) darkToggle.classList.add('active');
    if (state.tts)  ttsToggle.classList.add('active');
    document.getElementById('lang').value = state.lang;
    updateDashboardVisual();
  }

  function init(){
    // Resolve elements
    body=document.body;
    darkToggle=document.getElementById('darkToggle');
    vhToggle=document.getElementById('vhToggle');
    supportToggle=document.getElementById('supportToggle');
    ttsToggle=document.getElementById('ttsToggle');
    vhAvatar=document.getElementById('vhAvatar');
    vhBadge=document.getElementById('vhBadge');
    vhStage=document.getElementById('vhStage');
    textChat=document.getElementById('textChat');
    supportBadge=document.getElementById('supportBadge');
    chatInput=document.getElementById('chatInput');
    count=document.getElementById('count');
    sendBtn=document.getElementById('sendBtn');
    chatBody=document.getElementById('chatBody');
    welcomeCopy=document.getElementById('welcomeCopy');
    settingsBox=document.getElementById('settingsBox');
    settingsHead=settingsBox.querySelector('.head');
    settingsBody=settingsBox.querySelector('.body');
    dashBtn=document.getElementById('dashBtn');
    signInBtn=document.getElementById('signInBtn');
    startBtn=document.getElementById('startBtn');
    pricingBtn=document.getElementById('pricingBtn');
    careerPaths=document.getElementById('careerPaths');
    beginBtn=document.getElementById('beginAssessment');
    vhQuick=document.getElementById('vhQuick');
    vhShort=document.getElementById('vhShort');
    supportShort=document.getElementById('supportShort');
    signInModal=document.getElementById('signInModal');
    signUpModal=document.getElementById('signUpModal');
    assessmentModal=document.getElementById('assessmentModal');
    tracksModal=document.getElementById('tracksModal');
    voicesModal=document.getElementById('voicesModal');
    insights=document.getElementById('insights');
    m_insights=document.getElementById('m_insights');

    // initial state
    initState();

    // listeners (unchanged from blueprint)
    darkToggle.addEventListener('click', ()=>setDark(!state.dark));
    ttsToggle.addEventListener('click', ()=>setTTS(!state.tts));
    supportToggle.addEventListener('click', ()=>setSupport(!state.support));
    supportShort.addEventListener('click', ()=>setSupport(true));
    vhToggle.addEventListener('click', ()=>setVH(!state.vh));
    vhQuick.addEventListener('click', ()=>setVH(true));
    vhShort.addEventListener('click', ()=>setVH(true));

    const mVhToggle=document.getElementById('m_vhToggle');
    const mSupportToggle=document.getElementById('m_supportToggle');
    const mSettings=document.getElementById('m_settings');
    if (mVhToggle) mVhToggle.addEventListener('click', ()=>setVH(!state.vh));
    if (mSupportToggle) mSupportToggle.addEventListener('click', ()=>setSupport(!state.support));
    if (mSettings) mSettings.addEventListener('click', ()=>{
      alert(`Settings: Dark Mode: ${state.dark?'On':'Off'}, TTS: ${state.tts?'On':'Off'}`);
    });

    settingsHead.addEventListener('click', ()=>{
      const isOpen = settingsBody.style.display==='block';
      settingsBody.style.display = isOpen ? 'none' : 'block';
      settingsHead.querySelector('i.fas').className = isOpen ? 'fas fa-sliders-h' : 'fas fa-chevron-down';
    });

    dashBtn.addEventListener('click', goDashboard);
    const mDashBtn=document.getElementById('m_dashBtn');
    if (mDashBtn) mDashBtn.addEventListener('click', goDashboard);

    signInBtn.addEventListener('click', ()=>{ if (typeof signInModal.showModal==='function') signInModal.showModal(); });
    document.getElementById('signInCancel').addEventListener('click', ()=>signInModal.close());
    document.getElementById('signInGo').addEventListener('click', ()=>{
      const email=document.getElementById('si_email').value.trim();
      const pwd=document.getElementById('si_pwd').value.trim();
      if (!email || !pwd){ alert('Please enter your email and password.'); return; }
      state.auth=true; save('pmerit_auth',true); updateDashboardVisual(); signInModal.close();
      window.PMERIT_CHAT.addMessage('PMERIT AI','Welcome back! Your account has been successfully signed in. You now have access to your personal dashboard and can track your learning progress.');
    });

    document.getElementById('signUpCancel').addEventListener('click', ()=>signUpModal.close());
    document.getElementById('signUpCreate').addEventListener('click', ()=>{
      const name=document.getElementById('su_name').value.trim();
      const email=document.getElementById('su_email').value.trim();
      const pwd=document.getElementById('su_pwd').value.trim();
      if (!name || !email || !pwd){ alert('Please complete all fields.'); return; }
      state.auth=true; save('pmerit_auth',true); updateDashboardVisual(); signUpModal.close();
      window.PMERIT_CHAT.addMessage('PMERIT AI',`Welcome to PMERIT, ${name}! Your account has been created successfully. You now have access to personalized learning paths and can track your progress.`);
    });

    startBtn.addEventListener('click', openAssessment);
    beginBtn.addEventListener('click', openAssessment);
    const mBegin=document.getElementById('m_beginAssessment');
    if (mBegin) mBegin.addEventListener('click', openAssessment);
    document.getElementById('assessmentCancel').addEventListener('click', ()=>assessmentModal.close());
    document.getElementById('assessmentStart').addEventListener('click', ()=>{
      assessmentModal.close();
      const results=[
        "Excellent! Based on your assessment, you have a strong analytical mindset and prefer visual learning. I recommend the Data Analytics track - it combines problem-solving with visual insights through dashboards and reports.",
        "Great results! Your assessment shows you're creative and detail-oriented with strong communication skills. The UI/UX Design track would be perfect for combining creativity with user-centered problem solving.",
        "Wonderful! Your assessment indicates you're people-focused with strong organizational skills. I'd recommend either Customer Support or Digital Marketing - both offer excellent remote opportunities and match your interpersonal strengths."
      ];
      const result = results[Math.floor(Math.random()*results.length)];
      window.PMERIT_CHAT.addMessage('PMERIT AI', result);
    });

    chatInput.addEventListener('input', ()=>{ count.textContent = `${chatInput.value.length}/1000`; });
    sendBtn.addEventListener('click', window.PMERIT_CHAT.sendMessage);
    chatInput.addEventListener('keydown', (e)=>{
      if (e.key==='Enter' && !e.shiftKey){ e.preventDefault(); window.PMERIT_CHAT.sendMessage(); }
    });

    careerPaths.addEventListener('click', ()=>{ renderTracks(); tracksModal.showModal(); });
    const mCareer=document.getElementById('m_careerPaths');
    if (mCareer) mCareer.addEventListener('click', ()=>{ renderTracks(); tracksModal.showModal(); });
    document.getElementById('tracksClose').addEventListener('click', ()=>tracksModal.close());

    document.getElementById('voicesBtn').addEventListener('click', ()=>voicesModal.showModal());
    document.getElementById('voicesClose').addEventListener('click', ()=>voicesModal.close());
    document.getElementById('browserTts').addEventListener('click', ()=>{
      const txt=document.getElementById('voiceText').value.trim(); if (!txt) return;
      if (!('speechSynthesis' in window)){ alert('Browser TTS not supported.'); return; }
      speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(txt));
    });

    document.getElementById('privacyBtn').addEventListener('click', ()=>{
      window.PMERIT_CHAT.addMessage('PMERIT AI','Our Privacy & Terms page provides detailed information about how we protect your data and our terms of service. We prioritize your privacy and transparency in all our educational services.');
    });
    document.getElementById('contactBtn').addEventListener('click', ()=>{
      window.PMERIT_CHAT.addMessage('PMERIT AI','You can contact our support team through this chat interface, or reach out via email at support@pmerit.com. We typically respond within 24 hours during business days.');
    });
    document.getElementById('partnershipsBtn').addEventListener('click', ()=>{
      window.PMERIT_CHAT.addMessage('PMERIT AI','PMERIT partners with leading educational institutions and industry organizations to provide comprehensive learning opportunities. Contact us to learn about partnership opportunities.');
    });
    document.getElementById('supportBtn').addEventListener('click', ()=>{
      setSupport(true);
      window.PMERIT_CHAT.addMessage('PMERIT AI',"Support mode activated! I'm now ready to help you with any technical issues, account questions, or general platform inquiries. How can I assist you?");
    });

    rotateInsights(document.getElementById('insights'));
    rotateInsights(document.getElementById('m_insights'));

    document.getElementById('lang').addEventListener('change', function(){
      state.lang=this.value; save('pmerit_lang',state.lang);
      window.PMERIT_CHAT.addMessage('PMERIT AI',`Language changed to ${this.options[this.selectedIndex].text}. In a full implementation, the entire interface would be translated to your selected language.`);
    });
    document.getElementById('pricingBtn').addEventListener('click', ()=>{
      window.PMERIT_CHAT.addMessage('PMERIT AI','PMERIT offers flexible pricing plans to make education accessible to everyone. We have free courses available, as well as premium plans with additional features and personalized support. Would you like to learn more about our pricing options?');
    });
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
