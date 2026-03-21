// ============ REFINED LIQUID GLASS WATER FLOWING BACKGROUND ============

class LiquidGlassBackground {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.time = 0;
    this.animationFrameId = null;
    
    this.init();
  }
  
  init() {
    this.createCanvas();
    this.setupParticles();
    this.animate();
  }
  
  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'liquid-glass-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
      opacity: 0.8;
    `;
    
    document.body.insertBefore(this.canvas, document.body.firstChild);
    
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => this.onWindowResize());
  }
  
  setupParticles() {
    const particleCount = 60;
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 1,
        opacity: Math.random() * 0.2 + 0.1,
        phase: Math.random() * Math.PI * 2
      });
    }
  }
  
  drawWaterFlow() {
    const waveHeight = 35;
    const waveFrequency = 0.008;
    const waveSpeed = 0.006; // Slow flowing waves
    
    // Draw flowing water waves - Light Blue Shade
    this.ctx.fillStyle = `rgba(107, 182, 255, 0.15)`;
    
    for (let i = 0; i < 6; i++) {
      const yOffset = (this.canvas.height / 6) * i;
      
      this.ctx.beginPath();
      this.ctx.moveTo(0, yOffset);
      
      for (let x = 0; x <= this.canvas.width; x += 12) {
        const y = yOffset + Math.sin((x * waveFrequency) + (this.time * waveSpeed) + i) * waveHeight;
        this.ctx.lineTo(x, y);
      }
      
      this.ctx.lineTo(this.canvas.width, this.canvas.height);
      this.ctx.lineTo(0, this.canvas.height);
      this.ctx.closePath();
      this.ctx.fill();
    }
    
    // Draw flowing gradient lines - Light Blue Accent
    this.ctx.strokeStyle = `rgba(107, 182, 255, 0.25)`;
    this.ctx.lineWidth = 1.5;
    
    for (let i = 0; i < 4; i++) {
      const yOffset = (this.canvas.height / 4) * i + Math.sin(this.time * 0.012 + i) * 15;
      
      this.beginPath();
      this.ctx.moveTo(0, yOffset);
      
      for (let x = 0; x <= this.canvas.width; x += 20) {
        const y = yOffset + Math.sin((x * waveFrequency * 0.6) + (this.time * waveSpeed * 1.8) + i) * (waveHeight * 0.6);
        this.ctx.lineTo(x, y);
      }
      
      this.ctx.stroke();
    }
  }
  
  drawParticles() {
    this.particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Add wave motion
      particle.y += Math.sin(this.time * 0.025 + particle.phase) * 0.25;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Draw particle with subtle glow
      const gradient = this.ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius * 1.5);
      gradient.addColorStop(0, `rgba(107, 182, 255, ${particle.opacity})`);
      gradient.addColorStop(1, `rgba(107, 182, 255, 0)`);
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius * 1.5, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
  
  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw effects
    this.drawWaterFlow();
    this.drawParticles();
    
    this.time++;
  }
  
  onWindowResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  window.liquidGlassBg = new LiquidGlassBackground();
});
