// Ultra-lightweight native Web Speech API integration (0 KB added bundle size)
// Uses browser-native SpeechRecognition / webkitSpeechRecognition for real-time dictation

export const isSpeechRecognitionSupported = () => {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

export class SpeechDictationSession {
  constructor({ onTranscript, onError, onStart, onEnd }) {
    this.onTranscript = onTranscript;
    this.onError = onError;
    this.onStart = onStart;
    this.onEnd = onEnd;
    this.recognition = null;
    this.isListening = false;

    if (isSpeechRecognitionSupported()) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.onStart) this.onStart();
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (this.onTranscript) {
          this.onTranscript({ final: finalTranscript, interim: interimTranscript });
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (this.onError) this.onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.onEnd) this.onEnd();
      };
    }
  }

  start() {
    if (!this.recognition) return false;
    try {
      this.recognition.start();
      return true;
    } catch (e) {
      console.warn('Recognition already started or error:', e);
      return false;
    }
  }

  stop() {
    if (!this.recognition) return;
    try {
      this.recognition.stop();
      this.isListening = false;
    } catch (e) {
      console.warn('Error stopping recognition:', e);
    }
  }
}
