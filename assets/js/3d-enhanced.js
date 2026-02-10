// ============ ENHANCED 3D INTERACTIVE SCENE ============

class Enhanced3DScene {
  constructor() {
    this.container = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.globe = null;
    this.cityMarkers = [];
    this.experienceNodes = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.animationFrameId = null;
    
    this.init();
  }
  
  init() {
    this.createContainer();
    this.setupScene();
    this.createGlobe();
    this.createCityMarkers();
    this.createExperienceNodes();
    this.createAmbientParticles();
    this.attachEventListeners();
    this.animate();
    
    // Update on dark mode toggle
    document.addEventListener('darkModeToggled', () => {
      this.isDarkMode = localStorage.getItem('darkMode') === 'true';
      this.updateTheme();
    });
  }
  
  createContainer() {
    this.container = document.createElement('div');
    this.container.id = '3d-scene-enhanced';
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
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.isDarkMode ? 0x0a0a0a : 0xffffff);
    this.scene.fog = new THREE.Fog(this.isDarkMode ? 0x0a0a0a : 0xffffff, 10, 50);
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.z = 2.5;
    
    // Renderer with optimizations
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    this.container.appendChild(this.renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 3, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    this.scene.add(directionalLight);
    
    // Point light for accent
    const pointLight = new THREE.PointLight(0x0a84ff, 0.5);
    pointLight.position.set(-5, 0, 5);
    this.scene.add(pointLight);
  }
  
  createGlobe() {
    // Main globe
    const geometry = new THREE.IcosahedronGeometry(1.2, 48);
    const material = new THREE.MeshPhongMaterial({
      color: this.isDarkMode ? 0x1a1a1a : 0xf0f0f0,
      emissive: this.isDarkMode ? 0x222222 : 0xfafafa,
      shininess: 80,
      wireframe: false
    });
    
    this.globe = new THREE.Mesh(geometry, material);
    this.globe.castShadow = true;
    this.globe.receiveShadow = true;
    this.scene.add(this.globe);
    
    // Wireframe overlay
    const wireframeGeometry = new THREE.IcosahedronGeometry(1.21, 48);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: this.isDarkMode ? 0x333333 : 0xe0e0e0,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    this.globe.add(wireframe);
    
    // Glow effect
    const glowGeometry = new THREE.IcosahedronGeometry(1.25, 48);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: this.isDarkMode ? 0x0a84ff : 0x0071e3,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.globe.add(glow);
  }
  
  createCityMarkers() {
    const cities = [
      { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, color: 0xff6b6b },
      { name: 'Mexico City', lat: 19.4326, lon: -99.1332, color: 0x4ecdc4 },
      { name: 'New York', lat: 40.7128, lon: -74.0060, color: 0x45b7d1 },
      { name: 'London', lat: 51.5074, lon: -0.1278, color: 0x96ceb4 },
      { name: 'Paris', lat: 48.8566, lon: 2.3522, color: 0xffeaa7 },
      { name: 'Dubai', lat: 25.2048, lon: 55.2708, color: 0xdfe6e9 },
      { name: 'Singapore', lat: 1.3521, lon: 103.8198, color: 0x74b9ff },
      { name: 'Tokyo', lat: 35.6762, lon: 139.6503, color: 0xa29bfe }
    ];
    
    cities.forEach((city, index) => {
      const phi = (90 - city.lat) * Math.PI / 180;
      const theta = (city.lon + 180) * Math.PI / 180;
      
      const x = 1.2 * Math.sin(phi) * Math.cos(theta);
      const y = 1.2 * Math.cos(phi);
      const z = 1.2 * Math.sin(phi) * Math.sin(theta);
      
      // Create marker
      const markerGeometry = new THREE.SphereGeometry(0.06, 32, 32);
      const markerMaterial = new THREE.MeshPhongMaterial({
        color: city.color,
        emissive: city.color,
        emissiveIntensity: 0.6,
        shininess: 100
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, y, z);
      marker.castShadow = true;
      marker.receiveShadow = true;
      marker.userData = { 
        cityName: city.name, 
        color: city.color,
        index: index
      };
      
      this.scene.add(marker);
      this.cityMarkers.push(marker);
    });
  }
  
  createExperienceNodes() {
    const experiences = [
      { title: 'SUNDISK', position: { x: -1.8, y: 1.5, z: 0.3 }, color: 0xff6b6b },
      { title: 'Bohemia Inn', position: { x: -0.3, y: -1.2, z: 1.5 }, color: 0x4ecdc4 },
      { title: 'Sychrov Castle', position: { x: 1.0, y: 1.3, z: -0.8 }, color: 0x45b7d1 },
      { title: 'HOŠKA TOUR', position: { x: 1.5, y: -1.3, z: 0.5 }, color: 0x96ceb4 }
    ];
    
    experiences.forEach((exp, index) => {
      const geometry = new THREE.OctahedronGeometry(0.2, 2);
      const material = new THREE.MeshPhongMaterial({
        color: exp.color,
        emissive: exp.color,
        emissiveIntensity: 0.4,
        shininess: 100
      });
      const node = new THREE.Mesh(geometry, material);
      node.position.set(exp.position.x, exp.position.y, exp.position.z);
      node.castShadow = true;
      node.receiveShadow = true;
      node.userData = { 
        title: exp.title, 
        color: exp.color,
        index: index
      };
      
      this.scene.add(node);
      this.experienceNodes.push(node);
    });
  }
  
  createAmbientParticles() {
    const particleCount = 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 6;
      positions[i + 1] = (Math.random() - 0.5) * 6;
      positions[i + 2] = (Math.random() - 0.5) * 6;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: this.isDarkMode ? 0xffffff : 0x1a1a1a,
      size: 0.03,
      transparent: true,
      opacity: 0.25,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);
    this.particles = particles;
  }
  
  attachEventListeners() {
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('resize', () => this.onWindowResize());
  }
  
  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Check intersections
    const cityIntersects = this.raycaster.intersectObjects(this.cityMarkers);
    const expIntersects = this.raycaster.intersectObjects(this.experienceNodes);
    
    // Reset all
    this.cityMarkers.forEach(marker => {
      marker.scale.set(1, 1, 1);
      marker.material.emissiveIntensity = 0.6;
    });
    
    this.experienceNodes.forEach(node => {
      node.scale.set(1, 1, 1);
      node.material.emissiveIntensity = 0.4;
    });
    
    // Highlight hovered
    if (cityIntersects.length > 0) {
      const hovered = cityIntersects[0].object;
      hovered.scale.set(1.6, 1.6, 1.6);
      hovered.material.emissiveIntensity = 1;
    }
    
    if (expIntersects.length > 0) {
      const hovered = expIntersects[0].object;
      hovered.scale.set(1.4, 1.4, 1.4);
      hovered.material.emissiveIntensity = 0.9;
    }
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  updateTheme() {
    this.scene.background = new THREE.Color(this.isDarkMode ? 0x0a0a0a : 0xffffff);
    this.scene.fog.color = new THREE.Color(this.isDarkMode ? 0x0a0a0a : 0xffffff);
  }
  
  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    
    // Rotate globe
    if (this.globe) {
      this.globe.rotation.x += 0.00008;
      this.globe.rotation.y += 0.00015;
    }
    
    // Animate city markers
    this.cityMarkers.forEach((marker, index) => {
      marker.rotation.x += 0.008;
      marker.rotation.y += 0.012;
      marker.position.y += Math.sin(Date.now() * 0.0002 + index * 0.5) * 0.0008;
    });
    
    // Animate experience nodes
    this.experienceNodes.forEach((node, index) => {
      node.rotation.x += 0.004;
      node.rotation.y += 0.006;
      node.rotation.z += 0.003;
      node.position.y += Math.cos(Date.now() * 0.0001 + index) * 0.001;
    });
    
    // Animate particles
    if (this.particles) {
      this.particles.rotation.x += 0.00005;
      this.particles.rotation.y += 0.0001;
    }
    
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
    window.scene3D = new Enhanced3DScene();
  } else {
    console.warn('Three.js not loaded. Retrying...');
    setTimeout(() => {
      if (typeof THREE !== 'undefined') {
        window.scene3D = new Enhanced3DScene();
      }
    }, 1500);
  }
});
