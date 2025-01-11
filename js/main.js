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
    document.getElementById('startExperience').addEventListener('click', () => {
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

  startExperience() {
    this.audioManager.startAudio();
    this.experienceManager.start();
  }

  showSaveNotification(version) {
    const notification = document.getElementById('saveNotification');
    notification.textContent = `Version saved: ${version.changes.join(', ')}`;
    notification.style.opacity = '1';
    setTimeout(() => {
      notification.style.opacity = '0';
    }, 3000);
  }

  showVersionHistory() {
    const modal = document.getElementById('versionModal');
    const versionList = document.getElementById('versionList');
    versionList.innerHTML = '';

    this.versionControl.getVersions().forEach((version, index) => {
      const versionElement = document.createElement('div');
      versionElement.className = 'version-item';
      versionElement.innerHTML = `
        <div class="version-info">
          <span class="version-title">Version ${index + 1}</span>
          <span class="version-date">${new Date(version.timestamp).toLocaleString()}</span>
          <div class="version-changes">${version.changes.join(', ')}</div>
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
    document.getElementById('versionModal').style.display = 'none';
  }
}

window.app = new App();