// ============ CRAZY X-FACTOR EFFECTS ============

document.addEventListener('DOMContentLoaded', function() {
  
  // ============ MOUSE-FOLLOWING GLOW ============
  const mouseGlow = document.createElement('div');
  mouseGlow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 39, 119, 0.2) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
    border-radius: 50%;
    display: none;
  `;
  document.body.appendChild(mouseGlow);
  
  document.addEventListener('mousemove', (e) => {
    mouseGlow.style.left = (e.clientX - 150) + 'px';
    mouseGlow.style.top = (e.clientY - 150) + 'px';
    mouseGlow.style.display = 'block';
  });
  
  // ============ GLITCH TEXT EFFECT ON HEADER ============
  const h1 = document.querySelector('header h1');
  if (h1) {
    const originalText = h1.textContent;
    h1.setAttribute('data-text', originalText);
    
    // Random glitch effect every 5-8 seconds
    setInterval(() => {
      h1.style.animation = 'none';
      setTimeout(() => {
        h1.style.animation = 'glitchIn 0.6s ease-out';
      }, 10);
    }, Math.random() * 3000 + 5000);
  }
  
  // ============ SCROLL REVEAL WITH STAGGER ============
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const items = document.querySelectorAll('.experience-item');
  items.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(40px)';
    item.style.transition = `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.15}s`;
    observer.observe(item);
  });

  // ============ PARALLAX EFFECT ============
  const images = document.querySelectorAll('.experience-img');
  
  window.addEventListener('scroll', function() {
    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      
      if (scrollPercent > 0 && scrollPercent < 1) {
        img.style.transform = `translateY(${scrollPercent * 30}px)`;
      }
    });
  });

  // ============ NEON GLOW PULSE ON HOVER ============
  const experienceItems = document.querySelectorAll('.experience-item');
  
  experienceItems.forEach(item => {
    const img = item.querySelector('.experience-img');
    
    item.addEventListener('mouseenter', function() {
      img.style.animation = 'neonFlicker 0.5s ease-in-out';
    });
    
    item.addEventListener('mousemove', function(e) {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      img.style.setProperty('--mouse-x', x + 'px');
      img.style.setProperty('--mouse-y', y + 'px');
    });
  });

  // ============ RANDOM GLITCH EFFECT ON ELEMENTS ============
  const glitchElements = document.querySelectorAll('h2, h3, .company');
  
  glitchElements.forEach(el => {
    el.addEventListener('mouseenter', function() {
      this.style.animation = 'glitch 0.3s ease-in-out';
    });
    
    el.addEventListener('mouseleave', function() {
      this.style.animation = 'none';
    });
  });

  // ============ SCANLINE EFFECT ON IMAGES ============
  images.forEach(img => {
    img.addEventListener('mouseenter', function() {
      this.style.animation = 'scanlines 8s linear infinite';
    });
  });
});
