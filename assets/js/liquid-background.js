// ============ ATMOSPHERIC LIQUID BACKGROUND WITH SCATTER EFFECT ============

class LiquidBackground {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'liquid-canvas';
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0, active: false };
    this.coordinates = { x: 0, y: 0, visible: false };
    
    this.setupCanvas();
    this.createParticles();
    this.attachEventListeners();
    this.animate();
  }
  
  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
      background: linear-gradient(135deg, #f5f5f7 0%, #fafafa 100%);
    `;
    document.body.insertBefore(this.canvas, document.body.firstChild);
    
    // Adjust z-index of main content
    const w = document.querySelector('.w');
    if (w) {
      w.parentElement.style.position = 'relative';
      w.parentElement.style.zIndex = '2';
    }
  }
  
  createParticles() {
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3,  // Slow motion
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 60 + 40,
        opacity: Math.random() * 0.12 + 0.05,
        color: this.randomColor(),
        targetVx: 0,
        targetVy: 0,
        scatterTimer: 0
      });
    }
  }
  
  randomColor() {
    const colors = [
      'rgba(0, 113, 227, ',  // Apple blue
      'rgba(100, 200, 255, ', // Light blue
      'rgba(200, 220, 255, ', // Very light blue
      'rgba(150, 180, 255, '  // Soft blue
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  attachEventListeners() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
      this.coordinates.x = e.clientX;
      this.coordinates.y = e.clientY;
      this.coordinates.visible = true;
    });
    
    document.addEventListener('mouseleave', () => {
      this.mouse.active = false;
      this.coordinates.visible = false;
    });
    
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }
  
  updateParticles() {
    this.particles.forEach(particle => {
      if (this.mouse.active) {
        // Calculate distance to mouse
        const dx = particle.x - this.mouse.x;
        const dy = particle.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const scatterDistance = 200;
        
        if (distance < scatterDistance) {
          // Particle is near cursor - scatter away
          particle.scatterTimer = 30;
          const angle = Math.atan2(dy, dx);
          particle.targetVx = Math.cos(angle) * 2.5;
          particle.targetVy = Math.sin(angle) * 2.5;
        }
      }
      
      // Apply scatter velocity if active
      if (particle.scatterTimer > 0) {
        particle.vx = particle.targetVx;
        particle.vy = particle.targetVy;
        particle.scatterTimer--;
      } else {
        // Slow drift back to normal
        particle.vx += (particle.targetVx - particle.vx) * 0.02;
        particle.vy += (particle.targetVy - particle.vy) * 0.02;
        
        // Very slow random drift
        particle.vx += (Math.random() - 0.5) * 0.05;
        particle.vy += (Math.random() - 0.5) * 0.05;
      }
      
      // Move particle
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Wrap around screen
      if (particle.x - particle.radius < 0) {
        particle.x = this.canvas.width + particle.radius;
      }
      if (particle.x + particle.radius > this.canvas.width) {
        particle.x = -particle.radius;
      }
      if (particle.y - particle.radius < 0) {
        particle.y = this.canvas.height + particle.radius;
      }
      if (particle.y + particle.radius > this.canvas.height) {
        particle.y = -particle.radius;
      }
      
      // Damping
      particle.vx *= 0.98;
      particle.vy *= 0.98;
    });
  }
  
  drawParticles() {
    this.particles.forEach(particle => {
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius
      );
      
      gradient.addColorStop(0, particle.color + '0.3)');
      gradient.addColorStop(0.5, particle.color + '0.15)');
      gradient.addColorStop(1, particle.color + '0)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(
        particle.x - particle.radius,
        particle.y - particle.radius,
        particle.radius * 2,
        particle.radius * 2
      );
    });
  }
  
  drawCoordinates() {
    if (!this.coordinates.visible) return;
    
    const text = `${Math.round(this.coordinates.x)}, ${Math.round(this.coordinates.y)}`;
    const padding = 12;
    const fontSize = 12;
    
    this.ctx.font = `${fontSize}px 'Inter', sans-serif`;
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    
    const metrics = this.ctx.measureText(text);
    const width = metrics.width + padding * 2;
    const height = fontSize + padding * 2;
    
    const x = this.coordinates.x + 15;
    const y = this.coordinates.y + 15;
    
    // Background
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.lineWidth = 1;
    
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, width, height, 8);
    this.ctx.fill();
    this.ctx.stroke();
    
    // Text
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(text, x + padding, y + padding - 2);
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, '#f5f5f7');
    gradient.addColorStop(1, '#fafafa');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.updateParticles();
    this.drawParticles();
    this.drawCoordinates();
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new LiquidBackground();
});
