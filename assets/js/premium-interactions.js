// ============ PREMIUM SLEEK INTERACTIONS ============

document.addEventListener('DOMContentLoaded', function() {
  
  // ============ SMOOTH SCROLL REVEAL ============
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
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

  const items = document.querySelectorAll('.experience-item, .education-column, .skills-column');
  items.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(50px)';
    item.style.transition = `all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s`;
    observer.observe(item);
  });

  // ============ SUBTLE PARALLAX ON SCROLL ============
  const images = document.querySelectorAll('.experience-img');
  
  window.addEventListener('scroll', function() {
    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      
      if (scrollPercent > 0 && scrollPercent < 1) {
        img.style.transform = `translateY(${scrollPercent * 20}px) scale(${1 + scrollPercent * 0.01})`;
      }
    });
  });

  // ============ REFINED HOVER INTERACTIONS ============
  const experienceItems = document.querySelectorAll('.experience-item');
  
  experienceItems.forEach(item => {
    const img = item.querySelector('.experience-img');
    const details = item.querySelector('.experience-details');
    
    item.addEventListener('mouseenter', function() {
      img.style.filter = 'brightness(1.08)';
      details.style.transform = 'translateY(-6px)';
    });
    
    item.addEventListener('mouseleave', function() {
      img.style.filter = 'brightness(1)';
      details.style.transform = 'translateY(0)';
    });
  });

  // ============ EDUCATION/SKILLS CARD HOVER ============
  const educationItems = document.querySelectorAll('.education-list li, .skills-list li');
  
  educationItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-6px)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // ============ SMOOTH PAGE FADE-IN ============
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.9s ease-out';
    document.body.style.opacity = '1';
  }, 100);
});
