/* ═══════════════════════════════════════
   Shared script — runs on every page
═══════════════════════════════════════ */

// ── Mark active nav link based on current page ──
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === path) link.classList.add('active');
  });
})();

// ── Mobile hamburger ──────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-links');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('open');
    }
  });
}

// ── Navbar scroll shadow ──────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 20
      ? '0 4px 32px rgba(0,0,0,0.28)'
      : '0 2px 20px rgba(0,0,0,0.15)';
  }, { passive: true });
}

// ── Scroll fade-in for .fade-in elements ─────
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
fadeEls.forEach(el => fadeObserver.observe(el));

// ── Timeline items ────────────────────────────
document.querySelectorAll('.timeline-item').forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = 'translateX(-20px)';
  item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, i * 80);
      obs.unobserve(item);
    }
  }, { threshold: 0.15 });
  obs.observe(item);
});

// ── Stagger children inside .stagger-parent ───
document.querySelectorAll('.stagger-parent').forEach(parent => {
  Array.from(parent.children).forEach((child, i) => {
    child.style.opacity = '0';
    child.style.transform = 'translateY(20px)';
    child.style.transition = `opacity 0.45s ease ${i * 100}ms, transform 0.45s ease ${i * 100}ms`;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
        obs.unobserve(child);
      }
    }, { threshold: 0.1 });
    obs.observe(child);
  });
});
