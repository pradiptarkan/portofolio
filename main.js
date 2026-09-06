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

    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close the menu when a link is chosen (mobile)
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
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
    initYear();
  });
})();
