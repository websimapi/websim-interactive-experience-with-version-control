export class ExperienceManager {
  constructor() {
    this.container = document.getElementById('experienceContainer');
    this.state = {
      started: false,
      timestamp: null
    };
  }

  start() {
    this.state.started = true;
    this.state.timestamp = Date.now();
    this.updateDisplay();
  }

  updateDisplay() {
    if (this.state.started) {
      this.container.innerHTML = `
        <h2>Experience Started</h2>
        <p>Started at: ${new Date(this.state.timestamp).toLocaleString()}</p>
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