export class BotController {
  constructor(app) {
    this.app = app;
    this.cursor = this.createCursor();
    this.actions = [
      { name: 'Save Version', element: '#saveVersion' },
      { name: 'Show Versions', element: '#showVersions' },
      { name: 'Test Old Version', handler: this.testOldVersion.bind(this) },
      { name: 'Add Star', handler: this.addStarToScene.bind(this) },
      { name: 'Move Planet', handler: this.movePlanet.bind(this) },
      { name: 'Change Colors', handler: this.changeSceneColors.bind(this) }
    ];
    this.currentAction = 0;
    this.isActive = false;
    document.body.appendChild(this.cursor);
  }

  createCursor() {
    const cursor = document.createElement('div');
    cursor.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 32 32">
        <path d="M8,4 L24,20 L16,20 L12,28 L10,26 L14,18 L8,18 Z" 
              fill="rgba(52, 152, 219, 0.8)" 
              stroke="white" 
              stroke-width="2"/>
        <circle cx="16" cy="16" r="14" 
                stroke="rgba(52, 152, 219, 0.3)" 
                stroke-width="2" 
                fill="none"
                class="cursor-pulse"/>
      </svg>
    `;
    cursor.style.cssText = `
      position: fixed;
      width: 32px;
      height: 32px;
      pointer-events: none;
      z-index: 9999;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0;
      transform-origin: center;
    `;
    
    // Add pulse animation style
    const style = document.createElement('style');
    style.textContent = `
      @keyframes cursorPulse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.5); opacity: 0.4; }
        100% { transform: scale(1); opacity: 0.8; }
      }
      .cursor-pulse {
        animation: cursorPulse 2s infinite;
      }
    `;
    document.head.appendChild(style);
    
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
      const targetX = rect.left + rect.width / 2 - 16;
      const targetY = rect.top + rect.height / 2 - 16;
      
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

  async movePlanet() {
    const scene = document.getElementById('spaceScene');
    if (scene) {
      const planet = scene.querySelector('.planet');
      if (planet) {
        const newX = 300 + Math.random() * 400;
        const newY = 200 + Math.random() * 200;
        await this.moveTo(planet);
        this.app.experienceManager.sceneManager.movePlanet(planet, newX, newY);
      }
    }
  }

  async changeSceneColors() {
    const scene = document.getElementById('spaceScene');
    if (scene) {
      await this.moveTo(scene);
      this.app.experienceManager.sceneManager.randomizeColors();
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