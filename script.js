/* ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
   Quantum Tweak Website — JavaScript
   Scroll animations, interactive elements, cursor effects
   ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */

// ── Navbar Scroll Effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile Menu Toggle ──
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');

mobileToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const spans = mobileToggle.querySelectorAll('span');
    if (mobileMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    }
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    });
});

// ── Cursor Glow Effect ──
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateGlow() {
    glowX += (mouseX - glowX) * 1.5;
    glowY += (mouseY - glowY) * 1.5;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
}
animateGlow();

// ── Feature Card Mouse Tracking ──
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
    });
});

// ── Scroll Reveal Animations ──
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ── FAQ Accordion ──
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item.open').forEach(openItem => {
            openItem.classList.remove('open');
        });

        // Toggle clicked
        if (!isOpen) {
            item.classList.add('open');
        }
    });
});

// ── Stats Counter Animation ──
function animateCounter(el, target, duration = 1800) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (target - start) * eased);

        el.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

// Trigger counter when hero stats become visible
const statElements = document.querySelectorAll('.stat-value[data-count]');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-count'));
            animateCounter(entry.target, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statElements.forEach(el => statsObserver.observe(el));

// ── Smooth Scroll for Anchor Links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80; // navbar height
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ── Parallax on Hero Orbs ──
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const orbs = document.querySelectorAll('.hero-orb');
    orbs.forEach((orb, i) => {
        const speed = 0.15 + i * 0.05;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
});

// ── Staggered reveal for grid items ──
document.querySelectorAll('.features-grid .feature-card, .pricing-grid .price-card, .showcase-grid .showcase-card, .products-grid .product-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
});

// ═══ DYNAMIC STATUS & ACTIVE USERS FROM SERVER ═══
//(async function loadDynamicSettings() {
//    try {
//        const resp = await fetch('/.netlify/functions/admin-settings');
//        if (!resp.ok) return;
//        const data = await resp.json();
//
//        // Update badge with current month/year
//        const badge = document.getElementById('heroBadge');
//        const dot = document.getElementById('badgeDot');
//        const text = document.getElementById('badgeText');
//        if (badge && dot && text) {
//            const now = new Date();
//            const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
//            const dateStr = monthNames[now.getMonth()] + ' ' + now.getFullYear();
//            text.textContent = 'Updated ' + dateStr;
//            // keep dot accent color
//            dot.style.background = '#84c4fc';
//            dot.style.boxShadow = '0 0 8px #84c4fc';
//        }
//        // Active users count
//        if (data.activeUsers) {
//            const el = document.getElementById('activeUsersValue');
//            if (el) el.setAttribute('data-count', data.activeUsers);
//        }
//
//        // Keep all Discord links synced with admin settings.
//        if (data.discord) {
//            document.querySelectorAll('a[href*="discord.gg"]').forEach(link => {
//                link.href = data.discord;
//            });
//        }
//    } catch (e) {
//        console.warn('Failed to load settings:', e);
//    }
//})();

