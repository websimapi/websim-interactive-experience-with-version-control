import { AudioManager } from './audioManager.js';
import { VersionControl } from './versionControl.js';
import { ExperienceManager } from './experienceManager.js';

class App {
  constructor() {
    this.audioManager = new AudioManager();
    this.versionControl = new VersionControl();
    this.experienceManager = new ExperienceManager();
    this.initializeEventListeners();
    this.loadLastVersion();
  }

  initializeEventListeners() {
    // Ensure the start button is clearly visible and prominent
    const startButton = document.getElementById('startExperience');
    startButton.addEventListener('click', () => {
      this.startExperience();
    });

    document.getElementById('saveVersion').addEventListener('click', () => {
      const version = this.versionControl.saveVersion(this.experienceManager.getCurrentState());
      this.showSaveNotification(version);
    });

    document.getElementById('showVersions').addEventListener('click', () => {
      this.showVersionHistory();
    });

    document.getElementById('closeModal').addEventListener('click', () => {
      this.hideVersionHistory();
    });

    document.getElementById('clearVersions').addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all versions?')) {
        this.versionControl.clearVersions();
        this.hideVersionHistory();
      }
    });
  }

  async startExperience() {
    this.experienceManager.start();
    await this.audioManager.startAudio();
  }

  async retryAudio() {
    await this.audioManager.startAudio();
  }

  loadLastVersion() {
    const versions = this.versionControl.getVersions();
    if (versions.length > 0) {
      const lastState = versions[versions.length - 1].state;
      this.experienceManager.loadState(lastState);
      if (lastState.started) {
        this.audioManager.startAudio();
      }
    }
  }

  showSaveNotification(version) {
    if (!version) return;
    
    const notification = document.getElementById('saveNotification');
    if (!notification) return;
    
    notification.textContent = `Version saved: ${version.changes?.join(', ') || 'Update saved'}`;
    notification.style.opacity = '1';
    setTimeout(() => {
      notification.style.opacity = '0';
    }, 3000);
  }

  showVersionHistory() {
    const modal = document.getElementById('versionModal');
    const versionList = document.getElementById('versionList');
    if (!modal || !versionList) return;

    versionList.innerHTML = '';
    const versions = this.versionControl.getVersions();

    if (!versions || versions.length === 0) {
      versionList.innerHTML = '<div class="version-item">No versions saved yet</div>';
      modal.style.display = 'block';
      return;
    }

    versions.forEach((version, index) => {
      if (!version) return;
      
      const versionElement = document.createElement('div');
      versionElement.className = 'version-item';
      
      const changes = version.changes || ['No changes recorded'];
      const timestamp = version.timestamp ? new Date(version.timestamp).toLocaleString() : 'Unknown date';
      
      versionElement.innerHTML = `
        <div class="version-info">
          <span class="version-title">Version ${index + 1}</span>
          <span class="version-date">${timestamp}</span>
          <div class="version-changes">${changes.join(', ')}</div>
        </div>
        <button class="secondary-button" onclick="window.app.loadVersion(${index})">Load</button>
      `;
      versionList.appendChild(versionElement);
    });

    modal.style.display = 'block';
  }

  loadVersion(index) {
    const state = this.versionControl.loadVersion(index);
    if (state) {
      this.experienceManager.loadState(state);
      if (state.started) {
        this.audioManager.startAudio();
      } else {
        this.audioManager.stop();
      }
      this.hideVersionHistory();
    }
  }

  hideVersionHistory() {
    const modal = document.getElementById('versionModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
}

// Ensure the app is initialized after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});