// ============ HIGH-SPEED TRAIN ============

class Train {
  constructor() {
    this.createTrain();
    this.animateTrain();
  }
  
  createTrain() {
    const train = document.createElement('div');
    train.id = 'train';
    train.style.cssText = `
      position: fixed;
      width: 40px;
      height: 30px;
      pointer-events: none;
      z-index: 3;
      font-size: 28px;
      line-height: 30px;
      text-align: center;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
      transition: color 0.5s ease;
    `;
    train.textContent = '🚂';
    document.body.appendChild(train);
    this.train = train;
  }
  
  animateTrain() {
    let startTime = Date.now();
    const segmentDuration = 1500; // Same speed as airplane
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      
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
      
      // Determine current segment
      const totalSegments = cityNodes.length - 1;
      const segmentIndex = Math.floor((elapsed / segmentDuration) % totalSegments);
      const progress = ((elapsed / segmentDuration) % 1);
      
      const currentNode = cityNodes[segmentIndex];
      const nextNode = cityNodes[segmentIndex + 1];
      
      const currentRect = currentNode.getBoundingClientRect();
      const nextRect = nextNode.getBoundingClientRect();
      
      // Train moves along the timeline horizontally (slightly below)
      const startX = currentRect.left + currentRect.width / 2;
      const startY = currentRect.top + 40; // Below the timeline
      const endX = nextRect.left + nextRect.width / 2;
      const endY = nextRect.top + 40;
      
      // Linear motion for train
      const x = startX + (endX - startX) * progress;
      const y = startY + (endY - startY) * progress;
      
      this.train.style.left = (x - 20) + 'px';
      this.train.style.top = (y - 15) + 'px';
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new Train();
});
