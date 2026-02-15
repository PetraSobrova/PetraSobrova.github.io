// ============ ADVANCED 3D GLOBE WITH WORLD MAP & CITY CONNECTIONS ============

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
      { name: 'Mexico City', lat: 19.4326, lon: -99.1332, color: 0x4ecdc4 },
      { name: 'New York', lat: 40.7128, lon: -74.0060, color: 0x45b7d1 },
      { name: 'London', lat: 51.5074, lon: -0.1278, color: 0x96ceb4 },
      { name: 'Paris', lat: 48.8566, lon: 2.3522, color: 0xffeaa7 },
      { name: 'Dubai', lat: 25.2048, lon: 55.2708, color: 0xdfe6e9 },
      { name: 'Singapore', lat: 1.3521, lon: 103.8198, color: 0x74b9ff },
      { name: 'Tokyo', lat: 35.6762, lon: 139.6503, color: 0xa29bfe }
    ];
    
    this.init();
  }
  
  init() {
    this.createContainer();
    this.setupScene();
    this.createGlobeWithMap();
    this.createCityDots();
    this.createArcConnections();
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
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(5, 3, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    
    // Accent lighting
    const pointLight = new THREE.PointLight(0x0a84ff, 0.4);
    pointLight.position.set(-5, 0, 5);
    this.scene.add(pointLight);
  }
  
  createGlobeWithMap() {
    // Create canvas texture for world map
    const canvas = this.createWorldMapTexture();
    const texture = new THREE.CanvasTexture(canvas);
    
    // Create globe geometry
    const geometry = new THREE.IcosahedronGeometry(1.2, 64);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 50,
      emissiveMap: texture,
      emissiveIntensity: 0.2
    });
    
    this.globe = new THREE.Mesh(geometry, material);
    this.globe.castShadow = true;
    this.globe.receiveShadow = true;
    this.scene.add(this.globe);
    
    // Wireframe overlay
    const wireframeGeometry = new THREE.IcosahedronGeometry(1.21, 64);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: this.isDarkMode ? 0x333333 : 0xe0e0e0,
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    this.globe.add(wireframe);
    
    // Glow effect
    const glowGeometry = new THREE.IcosahedronGeometry(1.25, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: this.isDarkMode ? 0x0a84ff : 0x0071e3,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.globe.add(glow);
  }
  
  createWorldMapTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = this.isDarkMode ? '#0a0a0a' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Land color
    ctx.fillStyle = this.isDarkMode ? '#1a1a1a' : '#f0f0f0';
    
    // Simple world map pattern (continents)
    this.drawContinents(ctx, canvas.width, canvas.height);
    
    // Ocean/water lines
    ctx.strokeStyle = this.isDarkMode ? '#333333' : '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Latitude/Longitude grid
    for (let lat = -80; lat <= 80; lat += 20) {
      const y = (90 - lat) / 180 * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    for (let lon = -180; lon <= 180; lon += 20) {
      const x = (lon + 180) / 360 * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    return canvas;
  }
  
  drawContinents(ctx, width, height) {
    // Simplified continent shapes
    const continents = [
      // North America
      { x: 0.2, y: 0.35, w: 0.15, h: 0.25 },
      // South America
      { x: 0.25, y: 0.6, w: 0.08, h: 0.2 },
      // Europe
      { x: 0.45, y: 0.3, w: 0.08, h: 0.15 },
      // Africa
      { x: 0.45, y: 0.5, w: 0.1, h: 0.25 },
      // Asia
      { x: 0.55, y: 0.25, w: 0.25, h: 0.35 },
      // Australia
      { x: 0.75, y: 0.65, w: 0.08, h: 0.1 }
    ];
    
    continents.forEach(cont => {
      ctx.fillRect(
        cont.x * width,
        cont.y * height,
        cont.w * width,
        cont.h * height
      );
    });
  }
  
  createCityDots() {
    this.cities.forEach((city, index) => {
      const phi = (90 - city.lat) * Math.PI / 180;
      const theta = (city.lon + 180) * Math.PI / 180;
      
      const x = 1.2 * Math.sin(phi) * Math.cos(theta);
      const y = 1.2 * Math.cos(phi);
      const z = 1.2 * Math.sin(phi) * Math.sin(theta);
      
      // Main dot
      const dotGeometry = new THREE.SphereGeometry(0.05, 32, 32);
      const dotMaterial = new THREE.MeshPhongMaterial({
        color: city.color,
        emissive: city.color,
        emissiveIntensity: 0.8,
        shininess: 100
      });
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      dot.position.set(x, y, z);
      dot.castShadow = true;
      dot.userData = { cityName: city.name, color: city.color, index: index };
      
      this.scene.add(dot);
      this.cityDots.push(dot);
      
      // Glow ring
      const ringGeometry = new THREE.TorusGeometry(0.08, 0.01, 16, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: city.color,
        transparent: true,
        opacity: 0.6
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(dot.position);
      ring.lookAt(this.scene.position);
      this.scene.add(ring);
      
      dot.userData.ring = ring;
    });
  }
  
  createArcConnections() {
    // Connect cities in order with animated arcs
    for (let i = 0; i < this.cities.length - 1; i++) {
      this.createArcBetweenCities(this.cities[i], this.cities[i + 1], i);
    }
    
    // Connect last city to first (loop)
    this.createArcBetweenCities(this.cities[this.cities.length - 1], this.cities[0], this.cities.length - 1);
  }
  
  createArcBetweenCities(city1, city2, index) {
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
    
    // Create arc curve
    const curve = new THREE.CatmullRomCurve3([p1, p1.clone().multiplyScalar(1.5), p2.clone().multiplyScalar(1.5), p2]);
    const points = curve.getPoints(100);
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x0a84ff,
      linewidth: 2,
      transparent: true,
      opacity: 0.6
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
        dot.userData.ring.material.opacity = 0.6;
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
    
    // Smooth globe rotation
    if (this.globe) {
      this.globe.rotation.x += 0.00005;
      this.globe.rotation.y += 0.0002;
    }
    
    // Animate city dots
    this.cityDots.forEach((dot, index) => {
      dot.rotation.x += 0.01;
      dot.rotation.y += 0.015;
      dot.position.y += Math.sin(Date.now() * 0.0003 + index * 0.5) * 0.0005;
      
      // Pulse glow ring
      if (dot.userData.ring) {
        dot.userData.ring.rotation.z += 0.02;
        dot.userData.ring.scale.set(
          1 + Math.sin(Date.now() * 0.003 + index) * 0.2,
          1 + Math.sin(Date.now() * 0.003 + index) * 0.2,
          1
        );
      }
    });
    
    // Animate arc lines
    this.arcLines.forEach(arcData => {
      arcData.progress += 0.01;
      if (arcData.progress > 1) {
        arcData.progress = 0;
      }
      arcData.line.material.opacity = 0.3 + Math.sin(arcData.progress * Math.PI) * 0.3;
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
