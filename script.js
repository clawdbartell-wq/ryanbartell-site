// ==========================================
// RYAN BARTELL — Personal Site v2
// Smooth interactions + fade-in + mobile nav
// ==========================================

(function() {
    'use strict';

    // Mobile nav toggle
    const navToggle = document.getElementById('navMobileToggle');
    const navLinks = document.getElementById('primaryNavLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            const isActive = navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', String(isActive));
        });

        // Close nav when clicking a link
        navLinks.addEventListener('click', function(e) {
            if (e.target.matches('a')) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close on escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Nav scroll state
    const nav = document.getElementById('mainNav');
    let lastScroll = 0;

    function handleScroll() {
        const currentScroll = window.scrollY;
        if (currentScroll > 40) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }

    let scrollTicking = false;
    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // Fade-in on scroll (IntersectionObserver)
    if ('IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.fade-in').forEach(function(el) {
            fadeObserver.observe(el);
        });
    } else {
        // Fallback: show all immediately
        document.querySelectorAll('.fade-in').forEach(function(el) {
            el.classList.add('visible');
        });
    }

    // Add fade-in to cards and section content
    document.querySelectorAll('.work-card, .build-card, .company-card, .section-header, .hero-content, .bounty-inner, .connect-content').forEach(function(el) {
        el.classList.add('fade-in');
    });

    // Trigger once on load (so hero is visible immediately)
    window.requestAnimationFrame(function() {
        document.querySelectorAll('.hero-content').forEach(function(el) {
            el.classList.add('visible');
        });
    });

    // Smooth-scroll polyfill (already in CSS, but ensure anchors work)
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length <= 1) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Console signature
    if (window.console && console.log) {
        console.log(
            '%cRyan Bartell — Operator & Builder',
            'color: #00ff88; font-family: monospace; font-size: 14px; font-weight: bold;'
        );
        console.log(
            '%cAvailable for projects. Reach out: ryanbartell@trilliumhiring.com',
            'color: #b8b8b8; font-family: monospace; font-size: 11px;'
        );
    }
})();