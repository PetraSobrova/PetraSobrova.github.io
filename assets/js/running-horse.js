// ============ RUNNING HORSE ON EVENT TIMELINE ============

class RunningHorse {
  constructor() {
    this.createHorse();
    this.animateHorse();
  }
  
  createHorse() {
    const horse = document.createElement('div');
    horse.id = 'running-horse';
    horse.style.cssText = `
      position: fixed;
      width: 40px;
      height: 40px;
      pointer-events: none;
      z-index: 2;
      font-size: 32px;
      line-height: 40px;
      text-align: center;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15));
      transition: transform 0.3s ease;
    `;
    horse.textContent = '🐴';
    document.body.appendChild(horse);
    this.horse = horse;
  }
  
  animateHorse() {
    let startTime = Date.now();
    const cycleDuration = 8000; // Full cycle through all timeline items
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      // Get all timeline items
      const timelineItems = document.querySelectorAll('.timeline-item');
      if (timelineItems.length === 0) {
        requestAnimationFrame(animate);
        return;
      }
      
      // Calculate progress through the timeline
      const totalProgress = (elapsed % cycleDuration) / cycleDuration;
      
      // Get the timeline container bounds
      const firstItem = timelineItems[0];
      const lastItem = timelineItems[timelineItems.length - 1];
      
      const firstRect = firstItem.getBoundingClientRect();
      const lastRect = lastItem.getBoundingClientRect();
      
      // Calculate horse position along the timeline
      const startY = firstRect.top + firstRect.height / 2;
      const endY = lastRect.top + lastRect.height / 2;
      
      // Get the timeline marker position (left side of timeline)
      const timelineMarker = firstItem.querySelector('.timeline-marker');
      const markerRect = timelineMarker.getBoundingClientRect();
      const horseX = markerRect.left - 20; // Slightly to the left of the timeline
      
      // Smooth easing for horse movement
      const easeProgress = this.easeInOutCubic(totalProgress);
      const horseY = startY + (endY - startY) * easeProgress;
      
      // Add a subtle galloping animation
      const gallop = Math.sin(elapsed / 100) * 3;
      
      this.horse.style.left = horseX + 'px';
      this.horse.style.top = (horseY - 20 + gallop) + 'px';
      
      // Flip horse direction based on movement
      if (easeProgress < 0.5) {
        this.horse.style.transform = 'scaleX(1)';
      } else {
        this.horse.style.transform = 'scaleX(-1)';
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  // Easing function for smooth motion
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new RunningHorse();
});
