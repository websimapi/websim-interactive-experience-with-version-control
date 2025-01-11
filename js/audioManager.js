export class AudioManager {
  constructor() {
    this.audio = new Audio('/lostbanger.wav');
    this.audio.loop = true;
    this.fadeInterval = null;
    this.currentVolume = 0;
    this.audio.volume = this.currentVolume;
  }

  startAudio() {
    this.audio.play();
    this.fadeIn();
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