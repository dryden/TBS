/* ========================================
   TBS Website - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Mobile Navigation Toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ---- Scroll Animation (Intersection Observer) ----
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // ---- Active Nav Link Highlight ----
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  function highlightNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      navItems.forEach(item => {
        if (item.getAttribute('href') === '#' + id) {
          if (scrollPos >= top && scrollPos < bottom) {
            item.style.background = 'var(--tertiary)';
            item.style.borderColor = 'var(--fg)';
          } else {
            item.style.background = '';
            item.style.borderColor = '';
          }
        }
      });
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---- Generate decorative confetti ----
  function createConfetti(container, count = 8) {
    const colors = ['#8B5CF6', '#F472B6', '#FBBF24', '#34D399'];
    const shapes = ['confetti-circle', 'confetti-triangle', 'confetti-square'];

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = `confetti ${shapes[Math.floor(Math.random() * shapes.length)]}`;
      const color = colors[Math.floor(Math.random() * colors.length)];

      el.style.cssText = `
        position: absolute;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        opacity: ${0.12 + Math.random() * 0.18};
        transform: rotate(${Math.random() * 360}deg);
      `;

      if (el.classList.contains('confetti-circle')) {
        el.style.background = color;
      } else if (el.classList.contains('confetti-triangle')) {
        el.style.borderBottomColor = color;
      } else {
        el.style.background = color;
      }

      container.appendChild(el);
    }
  }

  // Add confetti to decorated sections
  document.querySelectorAll('.hero, .comparison, .purchase').forEach(section => {
    createConfetti(section, 10);
  });
});
