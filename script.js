/* ═══════════════════════════════════════
   The Holistic Student — SEL Website
   script.js
═══════════════════════════════════════ */

// ── Active nav link on scroll ─────────────────
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
  root: null,
  rootMargin: '-40% 0px -40% 0px',
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}, observerOptions);

sections.forEach(s => sectionObserver.observe(s));


// ── Smooth scroll on nav click ────────────────
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // close mobile menu
      document.getElementById('nav-links').classList.remove('open');
    }
  });
});


// ── Mobile hamburger ──────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  const open = navMenu.classList.contains('open');
  hamburger.setAttribute('aria-expanded', open);
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove('open');
  }
});


// ── Timeline scroll animation ─────────────────
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger the animation slightly
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 100);
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

timelineItems.forEach(item => timelineObserver.observe(item));


// ── Trend cards stagger on scroll ─────────────
const trendCards = document.querySelectorAll('.trend-card');

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 120);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

trendCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  cardObserver.observe(card);
});


// ── SWOT cards stagger ────────────────────────
const swotCards = document.querySelectorAll('.swot-card');

const swotObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'scale(1)';
      }, i * 100);
      swotObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

swotCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'scale(0.96)';
  card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  swotObserver.observe(card);
});


// ── Roadmap steps stagger ─────────────────────
const roadmapSteps = document.querySelectorAll('.roadmap-step');

const roadmapObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
      }, i * 120);
      roadmapObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

roadmapSteps.forEach(step => {
  step.style.opacity = '0';
  step.style.transform = 'translateX(-20px)';
  step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  roadmapObserver.observe(step);
});


// ── Stat counter animation ────────────────────
function animateValue(el, start, end, duration, suffix) {
  let startTs = null;
  const step = (ts) => {
    if (!startTs) startTs = ts;
    const progress = Math.min((ts - startTs) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(eased * (end - start) + start);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statCards = document.querySelectorAll('.stat-card');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numEl = entry.target.querySelector('.stat-num');
      const text = numEl.textContent.trim();
      // Only animate pure numbers with suffixes like $4B, $21B, 40M+
      if (text === '$4B')   { numEl.textContent = '$0B'; animateValue(numEl, 0, 4,  1200, 'B'); }
      if (text === '$21B')  { numEl.textContent = '$0B'; animateValue(numEl, 0, 21, 1400, 'B'); }
      if (text === '40M+')  { numEl.textContent = '0M+'; animateValue(numEl, 0, 40, 1600, 'M+'); }
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statCards.forEach(c => statObserver.observe(c));


// ── Navbar scroll shadow ──────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 20
    ? '0 4px 32px rgba(0,0,0,0.25)'
    : '0 2px 20px rgba(0,0,0,0.15)';
}, { passive: true });


// ── Home shape parallax ───────────────────────
const shapes = document.querySelectorAll('.shape');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  shapes.forEach((shape, i) => {
    const speed = (i + 1) * 0.15;
    shape.style.transform = `translateY(${scrollY * speed}px)`;
  });
}, { passive: true });
