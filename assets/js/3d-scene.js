// ============ FULLY INTERACTIVE 3D SCENE WITH THREE.JS ============

class Interactive3DScene {
  constructor() {
    this.container = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.globe = null;
    this.particles = [];
    this.cityMarkers = [];
    this.experienceNodes = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    this.init();
  }
  
  init() {
    this.createContainer();
    this.setupScene();
    this.createGlobe();
    this.createCityMarkers();
    this.createExperienceNodes();
    this.createParticles();
    this.attachEventListeners();
    this.animate();
  }
  
  createContainer() {
    this.container = document.createElement('div');
    this.container.id = '3d-scene-container';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      z-index: 0;
      background: linear-gradient(135deg, #ffffff 0%, #f5f5f7 100%);
      pointer-events: none;
    `;
    
    document.body.insertBefore(this.container, document.body.firstChild);
  }
  
  setupScene() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.isDarkMode ? 0x0a0a0a : 0xffffff);
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.z = 3;
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    this.container.appendChild(this.renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
    
    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }
  
  createGlobe() {
    const geometry = new THREE.IcosahedronGeometry(1.5, 64);
    const material = new THREE.MeshPhongMaterial({
      color: this.isDarkMode ? 0x1a1a1a : 0xf0f0f0,
      emissive: this.isDarkMode ? 0x333333 : 0xfafafa,
      shininess: 100,
      wireframe: false
    });
    
    this.globe = new THREE.Mesh(geometry, material);
    this.globe.castShadow = true;
    this.globe.receiveShadow = true;
    this.scene.add(this.globe);
    
    // Add globe outline
    const outlineGeometry = new THREE.IcosahedronGeometry(1.52, 64);
    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: this.isDarkMode ? 0x333333 : 0xe0e0e0,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
    this.globe.add(outline);
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
    
    cities.forEach(city => {
      const phi = (90 - city.lat) * Math.PI / 180;
      const theta = (city.lon + 180) * Math.PI / 180;
      
      const x = 1.5 * Math.sin(phi) * Math.cos(theta);
      const y = 1.5 * Math.cos(phi);
      const z = 1.5 * Math.sin(phi) * Math.sin(theta);
      
      // Create marker
      const markerGeometry = new THREE.SphereGeometry(0.08, 32, 32);
      const markerMaterial = new THREE.MeshPhongMaterial({
        color: city.color,
        emissive: city.color,
        emissiveIntensity: 0.5
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, y, z);
      marker.castShadow = true;
      marker.receiveShadow = true;
      marker.userData = { cityName: city.name, color: city.color };
      
      this.scene.add(marker);
      this.cityMarkers.push(marker);
    });
  }
  
  createExperienceNodes() {
    const experiences = [
      { title: 'SUNDISK', position: { x: -1.5, y: 1.2, z: 0.5 }, color: 0xff6b6b },
      { title: 'Bohemia Inn', position: { x: -0.5, y: -0.8, z: 1.2 }, color: 0x4ecdc4 },
      { title: 'Sychrov Castle', position: { x: 0.8, y: 1.0, z: -0.5 }, color: 0x45b7d1 },
      { title: 'HOŠKA TOUR', position: { x: 1.2, y: -1.0, z: 0.8 }, color: 0x96ceb4 }
    ];
    
    experiences.forEach(exp => {
      const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
      const material = new THREE.MeshPhongMaterial({
        color: exp.color,
        emissive: exp.color,
        emissiveIntensity: 0.3
      });
      const node = new THREE.Mesh(geometry, material);
      node.position.set(exp.position.x, exp.position.y, exp.position.z);
      node.castShadow = true;
      node.receiveShadow = true;
      node.userData = { title: exp.title, color: exp.color };
      
      this.scene.add(node);
      this.experienceNodes.push(node);
    });
  }
  
  createParticles() {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = (Math.random() - 0.5) * 8;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: this.isDarkMode ? 0xffffff : 0x1a1a1a,
      size: 0.05,
      transparent: true,
      opacity: 0.3
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
    
    // Check intersections with city markers
    const cityIntersects = this.raycaster.intersectObjects(this.cityMarkers);
    const expIntersects = this.raycaster.intersectObjects(this.experienceNodes);
    
    // Reset all markers
    this.cityMarkers.forEach(marker => {
      marker.scale.set(1, 1, 1);
      marker.material.emissiveIntensity = 0.5;
    });
    
    this.experienceNodes.forEach(node => {
      node.scale.set(1, 1, 1);
      node.material.emissiveIntensity = 0.3;
    });
    
    // Highlight hovered markers
    if (cityIntersects.length > 0) {
      cityIntersects[0].object.scale.set(1.5, 1.5, 1.5);
      cityIntersects[0].object.material.emissiveIntensity = 1;
    }
    
    if (expIntersects.length > 0) {
      expIntersects[0].object.scale.set(1.3, 1.3, 1.3);
      expIntersects[0].object.material.emissiveIntensity = 0.8;
    }
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Rotate globe
    if (this.globe) {
      this.globe.rotation.x += 0.0001;
      this.globe.rotation.y += 0.0003;
    }
    
    // Rotate city markers around globe
    this.cityMarkers.forEach((marker, index) => {
      marker.rotation.x += 0.01;
      marker.rotation.y += 0.01;
    });
    
    // Rotate experience nodes
    this.experienceNodes.forEach((node, index) => {
      node.rotation.x += 0.005;
      node.rotation.y += 0.008;
      node.position.y += Math.sin(Date.now() * 0.0001 + index) * 0.001;
    });
    
    // Animate particles
    if (this.particles) {
      this.particles.rotation.x += 0.0001;
      this.particles.rotation.y += 0.0002;
    }
    
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check if Three.js is loaded
  if (typeof THREE !== 'undefined') {
    new Interactive3DScene();
  } else {
    console.warn('Three.js not loaded yet. Retrying...');
    setTimeout(() => {
      if (typeof THREE !== 'undefined') {
        new Interactive3DScene();
      }
    }, 1000);
  }
});
