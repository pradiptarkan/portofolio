/* ==========================================================================
   PORTFOLIO — SHARED BEHAVIOR
   Handles: mobile nav, active link state, scroll-reveal animations.
   Loaded on every page.
   ========================================================================== */

(function () {
  'use strict';

  // ── Mobile navigation toggle ────────────────────────────────────────────
  function initNav() {
    var toggle = document.getElementById('nav-toggle');
    var links = document.getElementById('nav-links');
    if (!toggle || !links) return;

    function closeMenu() {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close the menu when a link is chosen (mobile)
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav')) closeMenu();
    });

    // Close on Escape and return focus to the toggle button
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  // ── Active nav link ─────────────────────────────────────────────────────
  function initActiveLink() {
    var currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var navLinks = document.querySelectorAll('.nav-links a[href]');
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href').toLowerCase();
      if (href === currentPage) link.classList.add('active');
    });
  }

  // ── Scroll-reveal animations ────────────────────────────────────────────
  function initReveal() {
    var elements = document.querySelectorAll('.fade-up');
    if (!elements.length) return;

    // If reduced motion is preferred, show everything immediately.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(function (el) { observer.observe(el); });
  }

  // ── Marquee (index only) ────────────────────────────────────────────────
  function initMarquee() {
    var strip = document.querySelector('.marquee-strip');
    var inner = document.querySelector('.marquee-inner');
    if (!strip || !inner) return;

    function fitMarquee() {
      // Parse the label set ONCE, then clone nodes — much cheaper than
      // repeatedly parsing new innerHTML strings.
      var template = document.createElement('template');
      template.innerHTML = inner.innerHTML.trim();
      var guard = 0;
      // Keep enlarging so one content half is never narrower than the strip,
      // which would otherwise expose a gap at the -50% loop point.
      while (inner.scrollWidth < strip.clientWidth * 2 && guard < 24) {
        if (template.content && template.content.cloneNode) {
          inner.appendChild(template.content.cloneNode(true));
        } else {
          inner.innerHTML += template.innerHTML; // legacy fallback
        }
        guard++;
      }
    }

    fitMarquee();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitMarquee);
    }
  }

  // ── Footer year ─────────────────────────────────────────────────────────
  function initYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  // ── Init ────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initActiveLink();
    initReveal();
    initMarquee();
    initYear();
  });
})();
