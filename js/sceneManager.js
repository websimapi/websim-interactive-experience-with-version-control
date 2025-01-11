export class SceneManager {
  constructor() {
    this.stars = [];
    this.planets = [];
    this.animationFrame = null;
  }

  initialize(container) {
    this.container = container;
    this.createScene();
    this.animate();
  }

  createScene() {
    const scene = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    scene.setAttribute("viewBox", "0 0 1000 600");
    scene.style.width = "100%";
    scene.style.height = "100%";
    scene.style.background = "linear-gradient(to bottom, #0a0f2c, #1a1b3c)";
    scene.id = "spaceScene";

    // Create stars
    for (let i = 0; i < 100; i++) {
      const star = this.createStar();
      scene.appendChild(star);
      this.stars.push(star);
    }

    // Create planets
    const planets = [
      { cx: 300, cy: 300, r: 40, fill: "#ff6b6b", rings: true },
      { cx: 700, cy: 200, r: 25, fill: "#4ecdc4" },
      { cx: 500, cy: 400, r: 15, fill: "#ffe66d" }
    ];

    planets.forEach(config => {
      const planet = this.createPlanet(config);
      scene.appendChild(planet);
      this.planets.push(planet);
    });

    // Add some floating asteroids
    for (let i = 0; i < 5; i++) {
      const asteroid = this.createAsteroid();
      scene.appendChild(asteroid);
    }

    this.container.innerHTML = '';
    this.container.appendChild(scene);
  }

  createStar() {
    const star = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    star.setAttribute("cx", Math.random() * 1000);
    star.setAttribute("cy", Math.random() * 600);
    star.setAttribute("r", Math.random() * 2);
    star.setAttribute("fill", "#fff");
    star.setAttribute("class", "star");
    return star;
  }

  createPlanet({ cx, cy, r, fill, rings }) {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    const planet = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    planet.setAttribute("cx", cx);
    planet.setAttribute("cy", cy);
    planet.setAttribute("r", r);
    planet.setAttribute("fill", fill);
    planet.setAttribute("class", "planet");
    
    group.appendChild(planet);

    if (rings) {
      const ring = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
      ring.setAttribute("cx", cx);
      ring.setAttribute("cy", cy);
      ring.setAttribute("rx", r * 1.8);
      ring.setAttribute("ry", r * 0.3);
      ring.setAttribute("fill", "none");
      ring.setAttribute("stroke", "#ffd700");
      ring.setAttribute("stroke-width", "2");
      ring.setAttribute("class", "ring");
      group.appendChild(ring);
    }

    return group;
  }

  createAsteroid() {
    const asteroid = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    asteroid.setAttribute("cx", Math.random() * 1000);
    asteroid.setAttribute("cy", Math.random() * 600);
    asteroid.setAttribute("r", 3);
    asteroid.setAttribute("fill", "#8c8c8c");
    asteroid.setAttribute("class", "asteroid");
    return asteroid;
  }

  animate() {
    // Add subtle animations to stars
    this.stars.forEach(star => {
      const currentOpacity = parseFloat(star.style.opacity) || 1;
      star.style.opacity = currentOpacity <= 0.5 ? 1 : currentOpacity - 0.01;
    });

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  addInteractiveStar(x, y) {
    const star = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    star.setAttribute("cx", x);
    star.setAttribute("cy", y);
    star.setAttribute("r", 3);
    star.setAttribute("fill", "#fff");
    star.setAttribute("class", "star interactive");
    
    // Add a pulsing animation
    const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    animate.setAttribute("attributeName", "r");
    animate.setAttribute("values", "3;5;3");
    animate.setAttribute("dur", "2s");
    animate.setAttribute("repeatCount", "indefinite");
    
    star.appendChild(animate);
    document.getElementById('spaceScene').appendChild(star);
    this.stars.push(star);
  }

  movePlanet(planetGroup, newX, newY) {
    const planet = planetGroup.querySelector('circle');
    const ring = planetGroup.querySelector('ellipse');
    
    // Create animation
    const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    animate.setAttribute("attributeName", "cx");
    animate.setAttribute("from", planet.getAttribute("cx"));
    animate.setAttribute("to", newX);
    animate.setAttribute("dur", "1s");
    animate.setAttribute("fill", "freeze");
    
    const animateY = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    animateY.setAttribute("attributeName", "cy");
    animateY.setAttribute("from", planet.getAttribute("cy"));
    animateY.setAttribute("to", newY);
    animateY.setAttribute("dur", "1s");
    animateY.setAttribute("fill", "freeze");
    
    planet.appendChild(animate);
    planet.appendChild(animateY);
    
    if (ring) {
      const ringAnimateX = animate.cloneNode(true);
      const ringAnimateY = animateY.cloneNode(true);
      ring.appendChild(ringAnimateX);
      ring.appendChild(ringAnimateY);
    }
    
    // Update attributes after animation
    setTimeout(() => {
      planet.setAttribute("cx", newX);
      planet.setAttribute("cy", newY);
      if (ring) {
        ring.setAttribute("cx", newX);
        ring.setAttribute("cy", newY);
      }
    }, 1000);
  }

  randomizeColors() {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94',
      '#dcedc1', '#a8e6cf', '#ffd3b6', '#ffaaa5', '#ff8b94'
    ];
    
    this.planets.forEach(planetGroup => {
      const planet = planetGroup.querySelector('circle');
      const currentColor = planet.getAttribute('fill');
      let newColor;
      do {
        newColor = colors[Math.floor(Math.random() * colors.length)];
      } while (newColor === currentColor);
      
      const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
      animate.setAttribute("attributeName", "fill");
      animate.setAttribute("from", currentColor);
      animate.setAttribute("to", newColor);
      animate.setAttribute("dur", "0.5s");
      animate.setAttribute("fill", "freeze");
      
      planet.appendChild(animate);
      setTimeout(() => planet.setAttribute("fill", newColor), 500);
    });
  }

  cleanup() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}