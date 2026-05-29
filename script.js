// Nav scroll effect
const nav = document.getElementById('mainNav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Mobile nav toggle
const navMobileToggle = document.getElementById('navMobileToggle');
const navLinks = document.querySelector('.nav-links');

if (navMobileToggle) {
    navMobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navMobileToggle.classList.toggle('active');
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.work-card, .company-card, .build-card, .bounty-inner').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// Add visible class styles
const style = document.createElement('style');
style.textContent = `
    .work-card.visible,
    .company-card.visible,
    .build-card.visible,
    .bounty-inner.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Stagger animation for grid items
document.querySelectorAll('.work-grid, .build-grid').forEach(grid => {
    const items = grid.querySelectorAll('.work-card, .build-card');
    items.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
});

// Console easter egg
console.log('%c⚡ Ryan Bartell — Operator & Builder', 'color: #00ff88; font-size: 16px; font-weight: bold;');
console.log('%cIf you\'re reading this, you\'re my kind of person.', 'color: #888; font-size: 12px;');
console.log('%chttps://github.com/BTizzy', 'color: #555; font-size: 10px;');
