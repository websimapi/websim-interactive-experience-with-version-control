export class ExperienceManager {
  constructor() {
    this.container = document.getElementById('experienceContainer');
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
  }

  updateDisplay() {
    if (this.state.started) {
      this.container.innerHTML = `
        <h2>Experience Started</h2>
        <p>Started at: ${new Date(this.state.timestamp).toLocaleString()}</p>
        ${this.state.audioFailed ? `
          <div class="audio-warning">
            <p>⚠️ Audio playback failed. Please ensure you're using a supported browser and have allowed audio playback.</p>
            <button class="secondary-button" onclick="window.app.retryAudio()">Retry Audio</button>
          </div>
        ` : ''}
      `;
    }
  }

  getCurrentState() {
    return { ...this.state };
  }

  loadState(state) {
    this.state = { ...state };
    this.updateDisplay();
  }
}