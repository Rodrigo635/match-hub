const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = canvas.offsetWidth;
let height = canvas.height = canvas.offsetHeight;

const particleCount = 100;
const particles = [];
const maxVelocity = 0.5;
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

window.addEventListener('resize', () => {
  width = canvas.width = canvas.offsetWidth;
  height = canvas.height = canvas.offsetHeight;
});

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * maxVelocity;
    this.vy = (Math.random() - 0.5) * maxVelocity;
    this.radius = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x <= 0 || this.x >= width) this.vx *= -1;
    if (this.y <= 0 || this.y >= height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#c4c4c4';
    ctx.fill();
  }
}

function initParticles() {
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  particles.forEach((p) => {
    if (mouse.x !== null) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(136, 136, 136, ${(1 - dist / mouse.radius)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animate);
}

initParticles();
animate();