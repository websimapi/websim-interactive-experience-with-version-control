export class AudioManager {
  constructor() {
    this.audio = new Audio('/lostbanger.wav');
    this.audio.loop = true;
    this.fadeInterval = null;
    this.currentVolume = 0;
    this.audio.volume = this.currentVolume;
    this.initialized = false;
  }

  async startAudio() {
    try {
      if (!this.initialized) {
        await this.audio.play();
        this.initialized = true;
      } else {
        this.audio.play();
      }
      this.fadeIn();
    } catch (error) {
      console.warn('Audio playback failed:', error);
      // Add a visual indicator that audio failed to play
      document.dispatchEvent(new CustomEvent('audio-failed'));
    }
  }

  fadeIn() {
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    
    this.fadeInterval = setInterval(() => {
      if (this.currentVolume < 1) {
        this.currentVolume = Math.min(1, this.currentVolume + 0.05);
        this.audio.volume = this.currentVolume;
      } else {
        clearInterval(this.fadeInterval);
      }
    }, 100);
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.currentVolume = 0;
    this.audio.volume = 0;
    if (this.fadeInterval) clearInterval(this.fadeInterval);
  }
}