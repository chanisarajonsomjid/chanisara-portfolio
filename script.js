/* ============================================================
   Portfolio JavaScript — Chanisara Jonsomjid
   ============================================================ */

(function () {
  'use strict';

  /* ── NAV SCROLL EFFECT ── */
  const navbar = document.getElementById('navbar');

  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightNavLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── ACTIVE NAV LINK HIGHLIGHT ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function highlightNavLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'var(--ink)';
      }
    });
  }

  /* ── MOBILE MENU ── */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobLinks = document.querySelectorAll('.mob-link');
  let menuOpen = false;

  burger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    // Animate burger
    const spans = burger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      const spans = burger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  /* ── SMOOTH SCROLL (fallback for older browsers) ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── REVEAL ON SCROLL (IntersectionObserver) ── */
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 100);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));

  /* ── HERO PHOTO LOAD CHECK ── */
  const heroPhoto = document.getElementById('heroPhoto');
  const photoPlaceholder = document.getElementById('photoPlaceholder');

  if (heroPhoto) {
    heroPhoto.addEventListener('load', () => {
      if (heroPhoto.naturalWidth > 0) {
        photoPlaceholder && photoPlaceholder.classList.add('hidden');
        heroPhoto.style.display = 'block';
      }
    });

    heroPhoto.addEventListener('error', () => {
      heroPhoto.style.display = 'none';
      photoPlaceholder && photoPlaceholder.classList.remove('hidden');
    });

    // If already loaded (cached)
    if (heroPhoto.complete && heroPhoto.naturalWidth > 0) {
      photoPlaceholder && photoPlaceholder.classList.add('hidden');
    } else if (heroPhoto.complete) {
      heroPhoto.style.display = 'none';
    }
  }

  /* ── HERO ENTRANCE ANIMATION ── */
  const heroEls = [
    document.querySelector('.hero-hello'),
    document.querySelector('.hero-name'),
    document.querySelector('.hero-sub'),
    document.querySelector('.hero-tags'),
    document.querySelector('.btn-primary'),
    document.querySelector('.hero-photo-wrap'),
  ];

  heroEls.forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200 + i * 120);
  });

  /* ── SECTION LABEL ANIMATION ── */
  document.querySelectorAll('.section-label').forEach(label => {
    const labelObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.letterSpacing = '0.14em';
          labelObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    label.style.opacity = '0';
    label.style.transition = 'opacity 0.5s ease, letter-spacing 0.5s ease';
    labelObserver.observe(label);
  });

  /* ── CONTACT ITEM RIPPLE ── */
  document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transition = 'background 0.2s ease';
    });
  });

  /* ── STAT NUMBER COUNT-UP ── */
  function countUp(el, target, isDecimal, suffix) {
    const duration = 1400;
    const step = 16;
    const steps = duration / step;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = isDecimal
        ? current.toFixed(2)
        : (suffix ? suffix + Math.ceil(current) : Math.ceil(current));
    }, step);
  }

  const statNums = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        if (text === '35+') countUp(el, 35, false, '');
        else if (text === '3.82') countUp(el, 3.82, true);
        statObserver.unobserve(el);
        // Reset display for non-countup
        if (text === 'Top 20') return;
      }
    });
  }, { threshold: 0.6 });

  statNums.forEach(el => {
    if (el.textContent.trim() !== 'Top 20') {
      statObserver.observe(el);
    }
  });

  /* ── FOOTER YEAR ── */
  // Already hardcoded, nothing needed


})();

