// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let dotX = 0, dotY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animate() {
    // Smooth cursor following
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;

    dotX += (mouseX - dotX) * 0.8;
    dotY += (mouseY - dotY) * 0.8;

    cursor.style.left = cursorX - 10 + 'px';
    cursor.style.top = cursorY - 10 + 'px';

    cursorDot.style.left = dotX - 2 + 'px';
    cursorDot.style.top = dotY - 2 + 'px';

    requestAnimationFrame(animate);
}
animate();

// Cursor hover effects
document.querySelectorAll('a, .project, .misc-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursor.style.borderColor = '#999';
    });

    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.borderColor = 'var(--primary-text)';
    });
});

// Enhanced fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
});

// Project click handling with enhanced animation
document.querySelectorAll('.project').forEach(project => {
    project.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') {
            const link = project.querySelector('.project-name a');
            if (link) {
                // Create ripple effect
                const ripple = document.createElement('div');
                const rect = project.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(26, 26, 26, 0.05);
                    border-radius: 50%;
                    transform: scale(0);
                    pointer-events: none;
                    z-index: 1;
                `;

                project.style.position = 'relative';
                project.appendChild(ripple);

                // Animate ripple
                ripple.animate([
                    { transform: 'scale(0)', opacity: 1 },
                    { transform: 'scale(2)', opacity: 0 }
                ], {
                    duration: 600,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                });

                setTimeout(() => {
                    ripple.remove();
                    window.open(link.href, '_blank');
                }, 300);
            }
        }
    });
});

// Parallax effect for floating elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const floating = document.querySelectorAll('.floating');

    floating.forEach((el, index) => {
        const speed = 0.02 + (index * 0.01);
        const yPos = -(scrolled * speed);
        el.style.transform += ` translateY(${yPos}px)`;
    });
});

// Remove typing indicator after animation
setTimeout(() => {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.opacity = '0';
        setTimeout(() => typingIndicator.remove(), 500);
    }
}, 3000);

// Smooth reveal for contact links
document.addEventListener('DOMContentLoaded', () => {
    const contactLinks = document.querySelectorAll('.contact a');
    contactLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';

        setTimeout(() => {
            link.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 1000 + (index * 150));
    });
});

// Hide cursor on mobile
if (window.innerWidth <= 768) {
    if (cursor) cursor.style.display = 'none';
    if (cursorDot) cursorDot.style.display = 'none';
    document.body.style.cursor = 'auto';
    document.querySelectorAll('*').forEach(el => {
        el.style.cursor = 'auto';
    });
}

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const toggleText = darkModeToggle.querySelector('.toggle-text');

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    toggleText.textContent = isDark ? 'light' : 'dark';
    updateFavicon();
});

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    if (toggleText) toggleText.textContent = 'light';
}

// Reading progress indicator
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    const readingProgress = document.querySelector('.reading-progress');
    if (readingProgress) readingProgress.style.width = `${progress}%`;
});

// Link previews
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
            const preview = document.createElement('div');
            preview.className = 'link-preview';
            preview.textContent = new URL(link.href).hostname.replace('www.', '');
            document.body.appendChild(preview);

            const updatePosition = (e) => {
                preview.style.left = `${e.clientX + 15}px`;
                preview.style.top = `${e.clientY + 15}px`;
            };

            link.addEventListener('mousemove', updatePosition);
            link.addEventListener('mouseleave', () => {
                preview.remove();
                link.removeEventListener('mousemove', updatePosition);
            });
        }
    });
});

// Dynamic favicon
const favicon = document.querySelector("link[rel='icon']");
const updateFavicon = () => {
    if (favicon) {
        const emoji = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
        favicon.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${emoji}</text></svg>`;
    }
};

// Update favicon initially and when dark mode changes
updateFavicon();

// Console greeting
if (window.console) {
    const styles = [
        'color: #000000',
        'background: #f5f5f5',
        'font-size: 12px',
        'padding: 4px 8px',
        'border-radius: 3px',
        'font-family: "IBM Plex Mono"'
    ].join(';');

    console.log('%c👋 Hey there fellow developer!', styles);
    console.log('%cLooking for something interesting? The source is right here!', styles);
}

// Dynamic year
const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}
