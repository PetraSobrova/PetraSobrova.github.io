// ============ GLOBAL CONNECTIVITY CITY TRACKER ============

class GlobalCities {
  constructor() {
    this.cities = [
      { name: 'Tokyo', lat: 35.6762, lon: 139.6503, offset: 9 },
      { name: 'Singapore', lat: 1.3521, lon: 103.8198, offset: 8 },
      { name: 'Dubai', lat: 25.2048, lon: 55.2708, offset: 4 },
      { name: 'Istanbul', lat: 41.0082, lon: 28.9784, offset: 3 },
      { name: 'London', lat: 51.5074, lon: -0.1278, offset: 0 },
      { name: 'Paris', lat: 48.8566, lon: 2.3522, offset: 1 },
      { name: 'Berlin', lat: 52.5200, lon: 13.4050, offset: 1 },
      { name: 'New York', lat: 40.7128, lon: -74.0060, offset: -5 },
      { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, offset: -8 },
      { name: 'Mexico City', lat: 19.4326, lon: -99.1332, offset: -6 },
      { name: 'São Paulo', lat: -23.5505, lon: -46.6333, offset: -3 },
      { name: 'Sydney', lat: -33.8688, lon: 151.2093, offset: 11 }
    ];
    
    this.createGlobalLine();
    this.updateClocks();
    setInterval(() => this.updateClocks(), 1000);
  }
  
  createGlobalLine() {
    const container = document.createElement('div');
    container.id = 'global-cities-container';
    container.style.cssText = `
      position: relative;
      z-index: 2;
      margin: 5rem 0;
      padding: 4rem 0;
    `;
    
    // Main timeline line
    const timeline = document.createElement('div');
    timeline.style.cssText = `
      position: relative;
      height: 2px;
      background: linear-gradient(90deg, rgba(0, 113, 227, 0.2) 0%, rgba(0, 113, 227, 0.5) 50%, rgba(0, 113, 227, 0.2) 100%);
      margin: 3rem 0;
      box-shadow: 0 0 20px rgba(0, 113, 227, 0.2);
    `;
    
    // Cities container
    const citiesContainer = document.createElement('div');
    citiesContainer.style.cssText = `
      position: relative;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
    `;
    
    // Create city nodes
    this.cities.forEach((city, index) => {
      const cityNode = document.createElement('div');
      cityNode.className = 'city-node';
      cityNode.style.cssText = `
        position: absolute;
        left: ${(index / (this.cities.length - 1)) * 100}%;
        transform: translateX(-50%);
        text-align: center;
        cursor: pointer;
        transition: all 0.4s ease;
      `;
      
      // City dot
      const dot = document.createElement('div');
      dot.style.cssText = `
        width: 12px;
        height: 12px;
        background: linear-gradient(135deg, rgba(0, 113, 227, 0.8), rgba(0, 113, 227, 0.4));
        border-radius: 50%;
        margin: 0 auto 0.8rem;
        box-shadow: 0 0 15px rgba(0, 113, 227, 0.4);
        transition: all 0.3s ease;
      `;
      
      // City name
      const name = document.createElement('div');
      name.textContent = city.name;
      name.style.cssText = `
        font-size: 0.85rem;
        font-weight: 600;
        color: #1d1d1f;
        margin-bottom: 0.4rem;
        letter-spacing: -0.3px;
      `;
      
      // City time (hidden by default)
      const timeDisplay = document.createElement('div');
      timeDisplay.className = 'city-time';
      timeDisplay.style.cssText = `
        font-size: 0.75rem;
        color: #86868b;
        font-weight: 500;
        opacity: 0;
        transition: opacity 0.3s ease;
        margin-top: 0.3rem;
      `;
      
      // Coordinates (hidden by default)
      const coords = document.createElement('div');
      coords.className = 'city-coords';
      coords.style.cssText = `
        font-size: 0.7rem;
        color: #0071e3;
        font-weight: 600;
        opacity: 0;
        transition: opacity 0.3s ease;
        margin-top: 0.2rem;
        letter-spacing: -0.2px;
      `;
      coords.textContent = `${city.lat.toFixed(2)}°, ${city.lon.toFixed(2)}°`;
      
      // Hover effects
      cityNode.addEventListener('mouseenter', () => {
        dot.style.transform = 'scale(1.8)';
        dot.style.boxShadow = '0 0 30px rgba(0, 113, 227, 0.8)';
        timeDisplay.style.opacity = '1';
        coords.style.opacity = '1';
        name.style.color = '#0071e3';
      });
      
      cityNode.addEventListener('mouseleave', () => {
        dot.style.transform = 'scale(1)';
        dot.style.boxShadow = '0 0 15px rgba(0, 113, 227, 0.4)';
        timeDisplay.style.opacity = '0';
        coords.style.opacity = '0';
        name.style.color = '#1d1d1f';
      });
      
      cityNode.appendChild(dot);
      cityNode.appendChild(name);
      cityNode.appendChild(timeDisplay);
      cityNode.appendChild(coords);
      
      citiesContainer.appendChild(cityNode);
    });
    
    timeline.appendChild(citiesContainer);
    container.appendChild(timeline);
    
    // Insert after header
    const header = document.querySelector('header');
    if (header) {
      header.parentElement.insertBefore(container, header.nextSibling);
    }
  }
  
  updateClocks() {
    const cityNodes = document.querySelectorAll('.city-node');
    
    this.cities.forEach((city, index) => {
      const node = cityNodes[index];
      if (!node) return;
      
      const timeDisplay = node.querySelector('.city-time');
      const now = new Date();
      
      // Calculate time in city's timezone
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const cityTime = new Date(utcTime + (3600000 * city.offset));
      
      const hours = String(cityTime.getHours()).padStart(2, '0');
      const minutes = String(cityTime.getMinutes()).padStart(2, '0');
      const seconds = String(cityTime.getSeconds()).padStart(2, '0');
      
      timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new GlobalCities();
});
