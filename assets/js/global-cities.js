// ============ GLOBAL CONNECTIVITY WITH ANIMATED AIRPLANE & DYNAMIC FLAG COLORS ============

class GlobalCities {
  constructor() {
    // Cities ordered West to East with country flag colors
    this.cities = [
      { name: 'Los Angeles', country: 'USA', lat: 34.0522, lon: -118.2437, offset: -8, flagColor: '#B22234' }, // Red from US flag
      { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lon: -99.1332, offset: -6, flagColor: '#CE1126' }, // Red from Mexican flag
      { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060, offset: -5, flagColor: '#B22234' }, // Red from US flag
      { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278, offset: 0, flagColor: '#012169' }, // Blue from UK flag
      { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, offset: 1, flagColor: '#002395' }, // Blue from French flag
      { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708, offset: 4, flagColor: '#CE1126' }, // Red from UAE flag
      { name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198, offset: 8, flagColor: '#FF0000' }, // Red from Singapore flag
      { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, offset: 9, flagColor: '#BC002D' } // Red from Japanese flag
    ];
    
    this.createGlobalLine();
    this.createAirplane();
    this.updateClocks();
    this.animateAirplane();
    setInterval(() => this.updateClocks(), 1000);
  }
  
  createGlobalLine() {
    const container = document.createElement('div');
    container.id = 'global-cities-container';
    container.style.cssText = `
      position: relative;
      z-index: 2;
      margin: 3rem 0;
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
    citiesContainer.id = 'cities-container';
    citiesContainer.style.cssText = `
      position: relative;
      height: 140px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
    `;
    
    // Create city nodes
    this.cities.forEach((city, index) => {
      const cityNode = document.createElement('div');
      cityNode.className = 'city-node';
      cityNode.dataset.index = index;
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
      dot.className = 'city-dot';
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
  
  createAirplane() {
    const airplane = document.createElement('div');
    airplane.id = 'airplane';
    airplane.style.cssText = `
      position: fixed;
      width: 30px;
      height: 30px;
      pointer-events: none;
      z-index: 3;
      font-size: 24px;
      line-height: 30px;
      text-align: center;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
      transition: color 0.5s ease;
    `;
    airplane.textContent = '✈';
    document.body.appendChild(airplane);
    this.airplane = airplane;
  }
  
  highlightCity(index) {
    const citiesContainer = document.getElementById('cities-container');
    if (!citiesContainer) return;
    
    const cityNodes = citiesContainer.querySelectorAll('.city-node');
    
    // Remove previous highlights
    cityNodes.forEach(node => {
      const dot = node.querySelector('.city-dot');
      const timeDisplay = node.querySelector('.city-time');
      const coords = node.querySelector('.city-coords');
      const name = node.querySelector('div:nth-child(2)');
      
      dot.style.boxShadow = '0 0 15px rgba(0, 113, 227, 0.4)';
      timeDisplay.style.opacity = '0';
      coords.style.opacity = '0';
      name.style.color = '#1d1d1f';
    });
    
    // Highlight current city
    const currentNode = cityNodes[index];
    if (currentNode) {
      const dot = currentNode.querySelector('.city-dot');
      const timeDisplay = currentNode.querySelector('.city-time');
      const coords = currentNode.querySelector('.city-coords');
      const name = currentNode.querySelector('div:nth-child(2)');
      
      dot.style.boxShadow = '0 0 40px rgba(0, 113, 227, 0.9)';
      timeDisplay.style.opacity = '1';
      coords.style.opacity = '1';
      name.style.color = '#0071e3';
    }
  }
  
  animateAirplane() {
    let startTime = Date.now();
    const segmentDuration = 1500; // 1.5 seconds per segment (faster)
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      // Determine current segment
      const totalSegments = this.cities.length - 1;
      const segmentIndex = Math.floor((elapsed / segmentDuration) % totalSegments);
      const progress = ((elapsed / segmentDuration) % 1);
      
      // Highlight the current city being traveled to
      this.highlightCity(segmentIndex + 1);
      
      // Update airplane color based on destination country flag
      const destinationCity = this.cities[segmentIndex + 1];
      if (destinationCity) {
        // Smooth color interpolation
        const startColor = this.cities[segmentIndex].flagColor;
        const endColor = destinationCity.flagColor;
        const interpolatedColor = this.interpolateColor(startColor, endColor, progress);
        this.airplane.style.color = interpolatedColor;
      }
      
      const citiesContainer = document.getElementById('cities-container');
      if (!citiesContainer) {
        requestAnimationFrame(animate);
        return;
      }
      
      const cityNodes = citiesContainer.querySelectorAll('.city-node');
      if (cityNodes.length < 2) {
        requestAnimationFrame(animate);
        return;
      }
      
      const currentNode = cityNodes[segmentIndex];
      const nextNode = cityNodes[segmentIndex + 1];
      
      const currentRect = currentNode.getBoundingClientRect();
      const nextRect = nextNode.getBoundingClientRect();
      
      // Calculate parabolic arc with alternating heights
      const startX = currentRect.left + currentRect.width / 2;
      const startY = currentRect.top;
      const endX = nextRect.left + nextRect.width / 2;
      const endY = nextRect.top;
      
      // Alternating parabola: upper for even segments, lower for odd
      const isUpperArc = segmentIndex % 2 === 0;
      const maxHeight = isUpperArc ? -100 : 100;
      
      // Quadratic easing for parabola
      const x = startX + (endX - startX) * progress;
      const y = startY + (endY - startY) * progress + Math.sin(progress * Math.PI) * maxHeight;
      
      // Rotation based on direction
      const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
      
      this.airplane.style.left = (x - 15) + 'px';
      this.airplane.style.top = (y - 15) + 'px';
      this.airplane.style.transform = `rotate(${angle}deg)`;
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  // Helper function to interpolate between two hex colors
  interpolateColor(color1, color2, factor) {
    const c1 = this.hexToRgb(color1);
    const c2 = this.hexToRgb(color2);
    
    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);
    
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  // Helper function to convert hex to RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 113, b: 227 };
  }
  
  updateClocks() {
    const citiesContainer = document.getElementById('cities-container');
    if (!citiesContainer) return;
    
    const cityNodes = citiesContainer.querySelectorAll('.city-node');
    
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
