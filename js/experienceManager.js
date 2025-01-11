import { SceneManager } from './sceneManager.js';

export class ExperienceManager {
  constructor() {
    this.container = document.getElementById('experienceContainer');
    this.sceneManager = new SceneManager();
    this.state = {
      started: false,
      timestamp: null,
      audioFailed: false
    };

    document.addEventListener('audio-failed', () => {
      this.state.audioFailed = true;
      this.updateDisplay();
    });
  }

  start() {
    this.state.started = true;
    this.state.timestamp = Date.now();
    this.state.audioFailed = false;
    this.updateDisplay();
    this.sceneManager.initialize(this.container);
  }

  updateDisplay() {
    if (!this.state.started) {
      this.container.innerHTML = '<p>Click "Start Experience" to begin</p>';
      return;
    }

    if (this.state.audioFailed) {
      const audioWarning = document.createElement('div');
      audioWarning.className = 'audio-warning';
      audioWarning.innerHTML = `
        <p>⚠️ Audio playback failed. Please ensure you're using a supported browser and have allowed audio playback.</p>
        <button class="secondary-button" onclick="window.app.retryAudio()">Retry Audio</button>
      `;
      this.container.appendChild(audioWarning);
    }
  }

  getCurrentState() {
    return { ...this.state };
  }

  loadState(state) {
    this.state = { ...state };
    if (this.state.started) {
      this.sceneManager.initialize(this.container);
    }
    this.updateDisplay();
  }
}