export class BotController {
  constructor(app) {
    this.app = app;
    this.cursor = this.createCursor();
    this.actions = [
      { name: 'Save Version', element: '#saveVersion' },
      { name: 'Show Versions', element: '#showVersions' },
      { name: 'Test Old Version', handler: this.testOldVersion.bind(this) },
      { name: 'Add Star', handler: this.addStarToScene.bind(this) }
    ];
    this.currentAction = 0;
    this.isActive = false;
    document.body.appendChild(this.cursor);
  }

  createCursor() {
    const cursor = document.createElement('div');
    cursor.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" style="transform: rotate(-45deg)">
        <path d="M5,2 L19,16 L12,16 L9,22 L7,20 L10,14 L5,14 Z" 
              fill="rgba(52, 152, 219, 0.8)" 
              stroke="white" 
              stroke-width="1"/>
      </svg>
    `;
    cursor.style.cssText = `
      position: fixed;
      width: 24px;
      height: 24px;
      pointer-events: none;
      z-index: 9999;
      transition: all 0.5s ease;
      opacity: 0;
    `;
    return cursor;
  }

  start() {
    this.isActive = true;
    this.cursor.style.opacity = '1';
    this.performNextAction();
  }

  stop() {
    this.isActive = false;
    this.cursor.style.opacity = '0';
  }

  async moveTo(element) {
    return new Promise(resolve => {
      const rect = element.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2 - 12;
      const targetY = rect.top + rect.height / 2 - 12;
      
      this.cursor.style.transform = `translate(${targetX}px, ${targetY}px)`;
      
      setTimeout(resolve, 1000);
    });
  }

  async click(element) {
    await new Promise(resolve => {
      this.cursor.style.transform += ' scale(0.8)';
      setTimeout(() => {
        this.cursor.style.transform = this.cursor.style.transform.replace(' scale(0.8)', '');
        element.click();
        resolve();
      }, 200);
    });
  }

  async testOldVersion() {
    const versions = this.app.versionControl.getVersions();
    if (versions.length > 1) {
      const randomIndex = Math.floor(Math.random() * (versions.length - 1));
      const versionItem = document.querySelectorAll('.version-item')[randomIndex];
      if (versionItem) {
        const loadButton = versionItem.querySelector('button');
        if (loadButton) {
          await this.moveTo(loadButton);
          await this.click(loadButton);
        }
      }
    }
  }

  async addStarToScene() {
    const scene = document.getElementById('spaceScene');
    if (scene) {
      const randomX = Math.random() * 1000;
      const randomY = Math.random() * 600;
      await this.moveTo(scene);
      this.app.experienceManager.sceneManager.addInteractiveStar(randomX, randomY);
    }
  }

  async performNextAction() {
    if (!this.isActive) return;

    const action = this.actions[this.currentAction];
    
    if (action.element) {
      const element = document.querySelector(action.element);
      if (element) {
        await this.moveTo(element);
        await this.click(element);
      }
    } else if (action.handler) {
      await action.handler();
    }

    this.currentAction = (this.currentAction + 1) % this.actions.length;
    
    setTimeout(() => this.performNextAction(), 3000);
  }
}