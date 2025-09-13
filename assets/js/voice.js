/**
 * PMERIT AI PLATFORM: VOICE.JS
 * Handles text-to-speech functionality
 */

const Voice = {
  isAvailable: 'speechSynthesis' in window,
  voices: [],
  
  init: function() {
    if (!this.isAvailable) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }
    
    // Load available voices
    speechSynthesis.onvoiceschanged = () => {
      this.voices = speechSynthesis.getVoices();
    };
  },
  
  speak: function(text) {
    if (!this.isAvailable) return;
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a suitable voice
    const preferredVoice = this.voices.find(voice => 
      voice.lang.includes('en') || voice.lang.includes('US')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Speak the text
    speechSynthesis.speak(utterance);
  },
  
  stop: function() {
    if (!this.isAvailable) return;
    speechSynthesis.cancel();
  }
};

// Initialize voice when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  Voice.init();
  
  // Connect to TTS toggle
  const ttsToggle = document.getElementById('ttsToggle');
  if (ttsToggle) {
    ttsToggle.addEventListener('click', function() {
      const isActive = this.classList.contains('active');
      if (isActive) {
        Voice.stop();
      }
    });
  }
});
