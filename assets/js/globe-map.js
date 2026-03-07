// ============ LIGHT BLUE 3D GLOBE WITH CITY DOTS ============

class GlobeMap {
  constructor() {
    this.container = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.globe = null;
    this.cityDots = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.animationFrameId = null;
    
    this.cities = [
      { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, color: 0x4a8f8f },
      { name: 'Mexico City', lat: 19.4326, lon: -99.1332, color: 0x4a8f8f },
      { name: 'New York', lat: 40.7128, lon: -74.0060, color: 0x4a8f8f },
      { name: 'London', lat: 51.5074, lon: -0.1278, color: 0x4a8f8f },
      { name: 'Paris', lat: 48.8566, lon: 2.3522, color: 0x4a8f8f },
      { name: 'Dubai', lat: 25.2048, lon: 55.2708, color: 0x4a8f8f },
      { name: 'Singapore', lat: 1.3521, lon: 103.8198, color: 0x4a8f8f },
      { name: 'Tokyo', lat: 35.6762, lon: 139.6503, color: 0x4a8f8f }
    ];
    
    this.init();
  }
  
  init() {
    this.createContainer();
    this.setupScene();
    this.createLightBlueGlobe();
    this.createCityDots();
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
    this.scene.background = new THREE.Color(this.isDarkMode ? 0x0d1117 : 0xffffff);
    this.scene.fog = new THREE.Fog(this.isDarkMode ? 0x0d1117 : 0xffffff, 15, 50);
    
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 3, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    
    // Subtle blue accent light
    const blueLight = new THREE.PointLight(0x6bb6ff, 0.4);
    blueLight.position.set(-5, 0, 5);
    this.scene.add(blueLight);
  }
  
  createLightBlueGlobe() {
    // Main light blue globe
    const geometry = new THREE.IcosahedronGeometry(1.2, 64);
    const material = new THREE.MeshPhongMaterial({
      color: 0x6bb6ff,
      emissive: 0x4a8f8f,
      emissiveIntensity: 0.3,
      shininess: 50,
      wireframe: false
    });
    
    this.globe = new THREE.Mesh(geometry, material);
    this.globe.castShadow = true;
    this.globe.receiveShadow = true;
    this.scene.add(this.globe);
    
    // Subtle wireframe overlay
    const wireframeGeometry = new THREE.IcosahedronGeometry(1.21, 64);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x4a8f8f,
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    this.globe.add(wireframe);
    
    // Subtle glow effect
    const glowGeometry = new THREE.IcosahedronGeometry(1.25, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x6bb6ff,
      transparent: true,
      opacity: 0.08,
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
      
      // Main teal/green dot
      const dotGeometry = new THREE.SphereGeometry(0.05, 32, 32);
      const dotMaterial = new THREE.MeshPhongMaterial({
        color: 0x4a8f8f,
        emissive: 0x4a8f8f,
        emissiveIntensity: 0.7,
        shininess: 100
      });
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      dot.position.set(x, y, z);
      dot.castShadow = true;
      dot.userData = { cityName: city.name, color: 0x4a8f8f, index: index };
      
      this.scene.add(dot);
      this.cityDots.push(dot);
      
      // Pulsing ring
      const ringGeometry = new THREE.TorusGeometry(0.08, 0.01, 16, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x4a8f8f,
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
      dot.material.emissiveIntensity = 0.7;
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
    
    // Slow rotation
    if (this.globe) {
      this.globe.rotation.x += 0.00005;
      this.globe.rotation.y += 0.0002; // Slow rotation
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
