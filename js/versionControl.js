export class VersionControl {
  constructor() {
    this.versions = [];
    this.currentVersionIndex = -1;
    this.loadVersionsFromStorage();
  }

  loadVersionsFromStorage() {
    try {
      const savedVersions = localStorage.getItem('experience-versions');
      if (savedVersions) {
        this.versions = JSON.parse(savedVersions);
        this.currentVersionIndex = this.versions.length - 1;
      }
    } catch (error) {
      console.error('Error loading versions from storage:', error);
      this.versions = [];
      this.currentVersionIndex = -1;
    }
  }

  saveVersion(state) {
    if (!state) return null;
    
    const version = {
      state,
      timestamp: Date.now(),
      description: `Version ${this.versions.length + 1}`,
      changes: this.detectChanges(state)
    };
    
    this.versions.push(version);
    this.currentVersionIndex = this.versions.length - 1;
    
    try {
      localStorage.setItem('experience-versions', JSON.stringify(this.versions));
    } catch (error) {
      console.error('Error saving version to storage:', error);
    }
    
    return version;
  }

  detectChanges(newState) {
    if (!newState || this.currentVersionIndex < 0) {
      return ['Initial version'];
    }

    const previousState = this.versions[this.currentVersionIndex]?.state;
    if (!previousState) return ['New version'];

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
      return this.versions[index]?.state || null;
    }
    return null;
  }

  getVersions() {
    return this.versions || [];
  }

  clearVersions() {
    this.versions = [];
    this.currentVersionIndex = -1;
    try {
      localStorage.removeItem('experience-versions');
    } catch (error) {
      console.error('Error clearing versions from storage:', error);
    }
  }
}