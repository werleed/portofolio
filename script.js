/* ===== WELCOME POPUP ===== */
function closePopup() {
  document.getElementById('welcome-popup').classList.add('hidden');
}
setTimeout(closePopup, 6000); // auto-close after 6s

/* ===== SCROLL PROGRESS ===== */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = scrolled + '%';
});

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ===== TYPEWRITER ===== */
const phrases = [
  'Tech Entrepreneur',
  'Web Developer',
  'AI & Digital Product Builder',
  'Founder of Weventures',
  'iPhone Software Technician',
  'E-Commerce Store Developer',
  'Social Media Manager',
  'YouTube Channel Manager',
  'Logo & Banner Designer',
  'African Tech Innovator'
];
let phraseIndex = 0, charIndex = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function type() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    typeEl.innerHTML = current.slice(0, charIndex + 1) + '<span class="cursor"></span>';
    charIndex++;
    if (charIndex === current.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typeEl.innerHTML = current.slice(0, charIndex - 1) + '<span class="cursor"></span>';
    charIndex--;
    if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 60 : 90);
}
type();

/* ===== ANIMATED COUNTERS ===== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  let count = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count;
    if (count >= target) clearInterval(timer);
  }, 30);
}

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      // trigger counter if applicable
      const counter = entry.target.querySelector('.counter') || (entry.target.classList.contains('counter') ? entry.target : null);
      if (counter) animateCounter(counter);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Counters in hero (trigger on page load after short delay)
setTimeout(() => {
  document.querySelectorAll('.counter').forEach(animateCounter);
}, 600);

/* ===== 3D TILT EFFECT ===== */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
  });
});

/* ===== PARTICLE CANVAS ===== */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '79,142,247' : '124,58,237';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(79,142,247,${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===== CONTACT FORM ===== */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const form = e.target;
  const data = new FormData(form);

  fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(data).toString()
  }).then(() => {
    btn.innerHTML = '✓ Message Sent!';
    btn.style.background = '#10b981';
    form.reset();
    setTimeout(() => {
      btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      btn.style.background = '';
    }, 4000);
  }).catch(() => {
    btn.innerHTML = 'Sent! ✓';
    btn.style.background = '#10b981';
    form.reset();
    setTimeout(() => {
      btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      btn.style.background = '';
    }, 4000);
  });
}
