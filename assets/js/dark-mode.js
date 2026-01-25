// ============ SLEEK DARK MODE TOGGLE ============

class DarkModeToggle {
  constructor() {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.createToggle();
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
