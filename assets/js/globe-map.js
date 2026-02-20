// ============ ADVANCED 3D GLOBE WITH BLACK SPHERE & RED SURFACE LINES ============

class GlobeMap {
  constructor() {
    this.container = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.globe = null;
    this.cityDots = [];
    this.arcLines = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.animationFrameId = null;
    
    this.cities = [
      { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, color: 0xff6b6b },
      { name: 'Mexico City', lat: 19.4326, lon: -99.1332, color: 0xff6b6b },
      { name: 'New York', lat: 40.7128, lon: -74.0060, color: 0xff6b6b },
      { name: 'London', lat: 51.5074, lon: -0.1278, color: 0xff6b6b },
      { name: 'Paris', lat: 48.8566, lon: 2.3522, color: 0xff6b6b },
      { name: 'Dubai', lat: 25.2048, lon: 55.2708, color: 0xff6b6b },
      { name: 'Singapore', lat: 1.3521, lon: 103.8198, color: 0xff6b6b },
      { name: 'Tokyo', lat: 35.6762, lon: 139.6503, color: 0xff6b6b }
    ];
    
    this.init();
  }
  
  init() {
    this.createContainer();
    this.setupScene();
    this.createBlackGlobe();
    this.createCityDots();
    this.createSurfaceArcLines();
    this.attachEventListeners();
    this.animate();
  }
  
  createContainer() {
    this.container = document.createElement('div');
    this.container.id = 'globe-map-container';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
    `;
    
    document.body.insertBefore(this.container, document.body.firstChild);
  }
  
  setupScene() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.isDarkMode ? 0x0a0a0a : 0xffffff);
    this.scene.fog = new THREE.Fog(this.isDarkMode ? 0x0a0a0a : 0xffffff, 15, 50);
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.z = 2.8;
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);
    
    // Lighting - minimal to emphasize black globe
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 3, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    
    // Subtle red accent light
    const redLight = new THREE.PointLight(0xff6b6b, 0.3);
    redLight.position.set(-5, 0, 5);
    this.scene.add(redLight);
  }
  
  createBlackGlobe() {
    // Main black globe
    const geometry = new THREE.IcosahedronGeometry(1.2, 64);
    const material = new THREE.MeshPhongMaterial({
      color: 0x000000,
      emissive: 0x000000,
      shininess: 30,
      wireframe: false
    });
    
    this.globe = new THREE.Mesh(geometry, material);
    this.globe.castShadow = true;
    this.globe.receiveShadow = true;
    this.scene.add(this.globe);
    
    // Subtle wireframe overlay
    const wireframeGeometry = new THREE.IcosahedronGeometry(1.21, 64);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x333333,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    this.globe.add(wireframe);
    
    // Subtle red glow effect
    const glowGeometry = new THREE.IcosahedronGeometry(1.25, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6b6b,
      transparent: true,
      opacity: 0.05,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.globe.add(glow);
  }
  
  createCityDots() {
    this.cities.forEach((city, index) => {
      const phi = (90 - city.lat) * Math.PI / 180;
      const theta = (city.lon + 180) * Math.PI / 180;
      
      const x = 1.2 * Math.sin(phi) * Math.cos(theta);
      const y = 1.2 * Math.cos(phi);
      const z = 1.2 * Math.sin(phi) * Math.sin(theta);
      
      // Main red dot
      const dotGeometry = new THREE.SphereGeometry(0.05, 32, 32);
      const dotMaterial = new THREE.MeshPhongMaterial({
        color: 0xff6b6b,
        emissive: 0xff6b6b,
        emissiveIntensity: 0.8,
        shininess: 100
      });
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      dot.position.set(x, y, z);
      dot.castShadow = true;
      dot.userData = { cityName: city.name, color: 0xff6b6b, index: index };
      
      this.scene.add(dot);
      this.cityDots.push(dot);
      
      // Red pulsing ring
      const ringGeometry = new THREE.TorusGeometry(0.08, 0.01, 16, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(dot.position);
      ring.lookAt(this.scene.position);
      this.scene.add(ring);
      
      dot.userData.ring = ring;
    });
  }
  
  createSurfaceArcLines() {
    // Connect cities in order with surface-level red arcs
    for (let i = 0; i < this.cities.length - 1; i++) {
      this.createSurfaceArcBetweenCities(this.cities[i], this.cities[i + 1], i);
    }
    
    // Connect last city to first (loop)
    this.createSurfaceArcBetweenCities(this.cities[this.cities.length - 1], this.cities[0], this.cities.length - 1);
  }
  
  createSurfaceArcBetweenCities(city1, city2, index) {
    const phi1 = (90 - city1.lat) * Math.PI / 180;
    const theta1 = (city1.lon + 180) * Math.PI / 180;
    const p1 = new THREE.Vector3(
      1.2 * Math.sin(phi1) * Math.cos(theta1),
      1.2 * Math.cos(phi1),
      1.2 * Math.sin(phi1) * Math.sin(theta1)
    );
    
    const phi2 = (90 - city2.lat) * Math.PI / 180;
    const theta2 = (city2.lon + 180) * Math.PI / 180;
    const p2 = new THREE.Vector3(
      1.2 * Math.sin(phi2) * Math.cos(theta2),
      1.2 * Math.cos(phi2),
      1.2 * Math.sin(phi2) * Math.sin(theta2)
    );
    
    // Create surface-level arc (stays on globe surface)
    const curve = new THREE.CatmullRomCurve3([p1, p1.clone().normalize().multiplyScalar(1.22), p2.clone().normalize().multiplyScalar(1.22), p2]);
    const points = curve.getPoints(80);
    
    // Normalize points to stay on surface
    const normalizedPoints = points.map(p => p.normalize().multiplyScalar(1.21));
    
    const geometry = new THREE.BufferGeometry().setFromPoints(normalizedPoints);
    const material = new THREE.LineBasicMaterial({
      color: 0xff6b6b,
      linewidth: 3,
      transparent: true,
      opacity: 0.8
    });
    
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
    
    this.arcLines.push({
      line: line,
      progress: index * 0.15,
      duration: 3
    });
  }
  
  attachEventListeners() {
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('resize', () => this.onWindowResize());
  }
  
  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.cityDots);
    
    // Reset all
    this.cityDots.forEach(dot => {
      dot.scale.set(1, 1, 1);
      dot.material.emissiveIntensity = 0.8;
      if (dot.userData.ring) {
        dot.userData.ring.material.opacity = 0.7;
      }
    });
    
    // Highlight hovered
    if (intersects.length > 0) {
      const hovered = intersects[0].object;
      hovered.scale.set(1.5, 1.5, 1.5);
      hovered.material.emissiveIntensity = 1;
      if (hovered.userData.ring) {
        hovered.userData.ring.material.opacity = 1;
      }
    }
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    
    // Slow clockwise rotation (negative y-axis for clockwise)
    if (this.globe) {
      this.globe.rotation.x += 0.00002;
      this.globe.rotation.y -= 0.0001; // Clockwise rotation
    }
    
    // Animate city dots
    this.cityDots.forEach((dot, index) => {
      dot.rotation.x += 0.008;
      dot.rotation.y += 0.012;
      dot.position.y += Math.sin(Date.now() * 0.0003 + index * 0.5) * 0.0003;
      
      // Pulse glow ring
      if (dot.userData.ring) {
        dot.userData.ring.rotation.z += 0.02;
        dot.userData.ring.scale.set(
          1 + Math.sin(Date.now() * 0.003 + index) * 0.15,
          1 + Math.sin(Date.now() * 0.003 + index) * 0.15,
          1
        );
      }
    });
    
    // Animate arc lines with pulsing effect
    this.arcLines.forEach(arcData => {
      arcData.progress += 0.01;
      if (arcData.progress > 1) {
        arcData.progress = 0;
      }
      arcData.line.material.opacity = 0.4 + Math.sin(arcData.progress * Math.PI) * 0.4;
    });
    
    this.renderer.render(this.scene, this.camera);
  }
  
  dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.renderer.dispose();
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE !== 'undefined') {
    window.globeMap = new GlobeMap();
  } else {
    console.warn('Three.js not loaded. Retrying...');
    setTimeout(() => {
      if (typeof THREE !== 'undefined') {
        window.globeMap = new GlobeMap();
      }
    }, 1500);
  }
});
