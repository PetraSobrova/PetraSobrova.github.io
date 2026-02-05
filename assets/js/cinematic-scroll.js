// ============ CINEMATIC SCROLL REVEAL ANIMATIONS ============

class CinematicScroll {
  constructor() {
    this.elements = [];
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          this.observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);
    
    this.init();
  }
  
  init() {
    // Add reveal class to all elements that should animate
    const selectors = [
      'h2',
      'h3',
      'p',
      '.timeline-item',
      '.education-list li',
      '.skills-list li',
      '.timeline-image'
    ];
    
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        element.classList.add('reveal-on-scroll');
        this.observer.observe(element);
      });
    });
    
    this.addRevealStyles();
  }
  
  addRevealStyles() {
    if (document.querySelector('style[data-cinematic]')) return;
    
    const style = document.createElement('style');
    style.setAttribute('data-cinematic', 'true');
    style.textContent = `
      .reveal-on-scroll {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), 
                    transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      
      .reveal-on-scroll.reveal {
        opacity: 1;
        transform: translateY(0);
      }
      
      .timeline-item.reveal-on-scroll {
        transition-delay: 0.1s;
      }
      
      .timeline-item:nth-child(2).reveal-on-scroll {
        transition-delay: 0.2s;
      }
      
      .timeline-item:nth-child(3).reveal-on-scroll {
        transition-delay: 0.3s;
      }
      
      .timeline-item:nth-child(4).reveal-on-scroll {
        transition-delay: 0.4s;
      }
    `;
    
    document.head.appendChild(style);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new CinematicScroll();
});
