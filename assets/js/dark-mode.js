// ============ SLEEK DARK MODE TOGGLE WITH FULL SUPPORT ============

class DarkModeToggle {
  constructor() {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.createToggle();
    this.injectDarkModeStyles();
    this.applyTheme();
    this.attachEventListeners();
  }
  
  createToggle() {
    const toggle = document.createElement('button');
    toggle.id = 'dark-mode-toggle';
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    toggle.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      cursor: pointer;
      z-index: 1001;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    `;
    
    toggle.textContent = this.isDarkMode ? '☀️' : '🌙';
    toggle.addEventListener('mouseenter', () => {
      toggle.style.transform = 'scale(1.1)';
      toggle.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
    });
    toggle.addEventListener('mouseleave', () => {
      toggle.style.transform = 'scale(1)';
      toggle.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
    });
    
    document.body.appendChild(toggle);
    this.toggle = toggle;
  }
  
  injectDarkModeStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Dark Mode Styles */
      html[data-theme='dark'] {
        --bg-color: #0a0a0a;
        --outer-bg-color: #1a1a1a;
        --fg-color: #f5f5f7;
        --link-color: #0a84ff;
        --accent-light: #1a1a1a;
        --accent-glass: rgba(30, 30, 30, 0.7);
        --glass-border: rgba(255, 255, 255, 0.1);
        --shadow-light: rgba(0, 0, 0, 0.3);
        --shadow-medium: rgba(0, 0, 0, 0.5);
      }
      
      html[data-theme='dark'] body {
        background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%) !important;
        color: #f5f5f7 !important;
      }
      
      html[data-theme='dark'] h1,
      html[data-theme='dark'] h2,
      html[data-theme='dark'] h3,
      html[data-theme='dark'] h4,
      html[data-theme='dark'] h5,
      html[data-theme='dark'] h6 {
        color: #f5f5f7 !important;
      }
      
      html[data-theme='dark'] p,
      html[data-theme='dark'] span,
      html[data-theme='dark'] li {
        color: #e0e0e0 !important;
      }
      
      html[data-theme='dark'] a {
        color: #0a84ff !important;
      }
      
      html[data-theme='dark'] .timeline-header,
      html[data-theme='dark'] .timeline-image,
      html[data-theme='dark'] .timeline-details,
      html[data-theme='dark'] .education-list li,
      html[data-theme='dark'] .skills-list li {
        background: rgba(30, 30, 30, 0.6) !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
        color: #e0e0e0 !important;
      }
      
      html[data-theme='dark'] .timeline-header:hover,
      html[data-theme='dark'] .timeline-details:hover,
      html[data-theme='dark'] .education-list li:hover,
      html[data-theme='dark'] .skills-list li:hover {
        background: rgba(40, 40, 40, 0.8) !important;
        border-color: rgba(255, 255, 255, 0.2) !important;
      }
      
      html[data-theme='dark'] .timeline-header h3,
      html[data-theme='dark'] .timeline-header .company,
      html[data-theme='dark'] .education-list strong,
      html[data-theme='dark'] .skills-list strong {
        color: #f5f5f7 !important;
      }
      
      html[data-theme='dark'] .timeline-details p.location,
      html[data-theme='dark'] .timeline-details p.date,
      html[data-theme='dark'] .education-list span,
      html[data-theme='dark'] .skills-list span {
        color: #a0a0a0 !important;
      }
      
      html[data-theme='dark'] .city-node {
        color: #f5f5f7 !important;
      }
      
      html[data-theme='dark'] .city-node > div:nth-child(2) {
        color: #f5f5f7 !important;
      }
      
      html[data-theme='dark'] .city-time,
      html[data-theme='dark'] .city-coords {
        color: #a0a0a0 !important;
      }
      
      html[data-theme='dark'] #fun-fact-popup {
        background: rgba(30, 30, 30, 0.95) !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }
      
      html[data-theme='dark'] #fun-fact-popup h4 {
        color: #f5f5f7 !important;
      }
      
      html[data-theme='dark'] #fun-fact-popup p {
        color: #e0e0e0 !important;
      }
      
      html[data-theme='dark'] #dark-mode-toggle {
        background: rgba(30, 30, 30, 0.7) !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
      }
      
      html[data-theme='dark'] hr {
        border-top-color: rgba(255, 255, 255, 0.1) !important;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent) !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  attachEventListeners() {
    this.toggle.addEventListener('click', () => {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('darkMode', this.isDarkMode);
      this.applyTheme();
      this.toggle.textContent = this.isDarkMode ? '☀️' : '🌙';
    });
  }
  
  applyTheme() {
    const root = document.documentElement;
    if (this.isDarkMode) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new DarkModeToggle();
});
