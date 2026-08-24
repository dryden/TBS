/* ========================================
   TBS Website - JavaScript
   ======================================== */

// ---- GA4 Helper ----
function gaEvent(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }
}

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

  // ---- GA4 Button Click Tracking ----

  // Hero CTA：「了解購買方式」
  document.querySelector('a[href="#purchase"].btn-primary')
    ?.addEventListener('click', () => {
      gaEvent('click_cta_hero', { button_label: '了解購買方式' });
    });

  // 購買區「前往訂購」
  document.querySelector('a[href*="famistore"]')
    ?.addEventListener('click', () => {
      gaEvent('click_purchase', { button_label: '前往訂購', destination: 'famistore' });
    });

  // 「加入 FB 社團」按鈕
  document.querySelector('a[href*="facebook.com/groups"]')
    ?.addEventListener('click', () => {
      gaEvent('click_join_fb', { button_label: '加入 FB 社團' });
    });

  // 「部落格」連結（nav + footer）
  document.querySelectorAll('a[href*="4514.app/blog"]').forEach(el => {
    el.addEventListener('click', () => {
      const location = el.closest('footer') ? 'footer' : 'nav';
      gaEvent('click_blog', { button_label: '部落格', location });
    });
  });

  // ---- GA4 Section View Tracking ----
  const sectionLabels = {
    hero:       '首頁 Hero',
    intro:      '系統介紹',
    comparison: '為什麼選雙桶',
    materials:  '所需材料',
    purchase:   '購買方式',
    community:  '加入社團',
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        gaEvent('section_view', {
          section_id:    id,
          section_label: sectionLabels[id] || id,
        });
        sectionObserver.unobserve(entry.target); // 每個 section 只記錄一次
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
  });

  // ---- Floating Share Bar ----
  const shareBar = document.getElementById('shareBar');
  const shareToggle = document.getElementById('shareToggle');
  const shareToast = document.getElementById('shareToast');
  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);
  const shareText = encodeURIComponent('雙桶系統 — 災時如廁的最佳方案，簡單、低成本、永續！');

  if (shareToggle && shareBar) {
    // Toggle share bar open/close
    shareToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      shareBar.classList.toggle('is-open');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!shareBar.contains(e.target)) {
        shareBar.classList.remove('is-open');
      }
    });

    // Set share URLs
    const shareFb = document.getElementById('shareFb');
    const shareThreads = document.getElementById('shareThreads');
    const shareLine = document.getElementById('shareLine');
    const shareIg = document.getElementById('shareIg');

    if (shareFb) {
      shareFb.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
      shareFb.addEventListener('click', () => {
        gaEvent('click_share', { platform: 'facebook' });
      });
    }

    if (shareThreads) {
      shareThreads.href = `https://www.threads.net/intent/post?text=${shareText}%20${pageUrl}`;
      shareThreads.addEventListener('click', () => {
        gaEvent('click_share', { platform: 'threads' });
      });
    }

    if (shareLine) {
      shareLine.href = `https://social-plugins.line.me/lineit/share?url=${pageUrl}`;
      shareLine.addEventListener('click', () => {
        gaEvent('click_share', { platform: 'line' });
      });
    }

    // Instagram: copy link to clipboard
    if (shareIg) {
      shareIg.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          if (shareToast) {
            shareToast.classList.add('is-visible');
            setTimeout(() => {
              shareToast.classList.remove('is-visible');
            }, 2500);
          }
          gaEvent('click_share', { platform: 'instagram_copy' });
        });
      });
    }
  }
});
