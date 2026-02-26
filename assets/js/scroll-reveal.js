// Scroll Reveal Animation for Experience Items
document.addEventListener('DOMContentLoaded', function() {
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

  // Observe all experience items
  const items = document.querySelectorAll('.experience-item');
  items.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(40px)';
    item.style.transition = `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.15}s`;
    observer.observe(item);
  });

  // Add parallax effect to images on scroll
  const images = document.querySelectorAll('.experience-img');
  
  window.addEventListener('scroll', function() {
    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      
      if (scrollPercent > 0 && scrollPercent < 1) {
        img.style.transform = `translateY(${scrollPercent * 20}px)`;
      }
    });
  });

  // Add mouse tracking glow effect
  const experienceItems = document.querySelectorAll('.experience-item');
  
  experienceItems.forEach(item => {
    const img = item.querySelector('.experience-img');
    
    item.addEventListener('mousemove', function(e) {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      img.style.setProperty('--mouse-x', x + 'px');
      img.style.setProperty('--mouse-y', y + 'px');
    });
  });
});
