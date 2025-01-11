export class VersionControl {
  constructor() {
    this.versions = [];
    this.currentVersionIndex = -1;
    this.loadVersionsFromStorage();
  }

  loadVersionsFromStorage() {
    const savedVersions = localStorage.getItem('experience-versions');
    if (savedVersions) {
      this.versions = JSON.parse(savedVersions);
      this.currentVersionIndex = this.versions.length - 1;
    }
  }

  saveVersion(state) {
    const version = {
      state,
      timestamp: Date.now(),
      description: `Version ${this.versions.length + 1}`,
      changes: this.detectChanges(state)
    };
    this.versions.push(version);
    this.currentVersionIndex = this.versions.length - 1;
    localStorage.setItem('experience-versions', JSON.stringify(this.versions));
    return version;
  }

  detectChanges(newState) {
    if (this.currentVersionIndex < 0) {
      return ['Initial version'];
    }

    const previousState = this.versions[this.currentVersionIndex].state;
    const changes = [];

    if (previousState.started !== newState.started) {
      changes.push(newState.started ? 'Experience started' : 'Experience reset');
    }
    if (previousState.timestamp !== newState.timestamp) {
      changes.push('Timestamp updated');
    }

    return changes.length ? changes : ['No significant changes'];
  }

  loadVersion(index) {
    if (index >= 0 && index < this.versions.length) {
      this.currentVersionIndex = index;
      return this.versions[index].state;
    }
    return null;
  }

  getVersions() {
    return this.versions;
  }

  clearVersions() {
    this.versions = [];
    this.currentVersionIndex = -1;
    localStorage.removeItem('experience-versions');
  }
}