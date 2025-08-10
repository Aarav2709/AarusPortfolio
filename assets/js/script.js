if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded, using fallback animations');
    window.gsap = {
        set: (el, props) => {
            const elements = typeof el === 'string' ? document.querySelectorAll(el) : [el];
            elements.forEach(element => {
                if (element) {
                    Object.keys(props).forEach(prop => {
                        if (prop === 'x') element.style.transform = `translateX(${props[prop]}px)`;
                        else if (prop === 'y') element.style.transform = `translateY(${props[prop]}px)`;
                        else element.style[prop] = props[prop];
                    });
                }
            });
        },
        to: (el, props) => {
            gsap.set(el, props);
        },
        from: () => {},
        timeline: () => ({ from: () => {}, to: () => {} })
    };
} else {
    gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin);
}
gsap.defaults({ overwrite: 'auto' });
let isSmoothScrolling = false;
const smoothScrollConfig = {
    duration: 1.2,
    ease: "power3.inOut"
};
function initSmoothScroll() {
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.WebkitOverflowScrolling = 'touch';
    let scrollTimeout;
    window.addEventListener('wheel', (e) => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            gsap.to(window, {
                duration: 0.2,
                ease: "power2.out"
            });
        }, 100);
    }, { passive: true });
}
initSmoothScroll();

const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let curX = mouseX, curY = mouseY;
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

if (cursor && cursorDot) {
    gsap.set(cursor, { x: mouseX - 10, y: mouseY - 10 });
    gsap.set(cursorDot, { x: mouseX - 2, y: mouseY - 2 });
    gsap.ticker.add(() => {
        curX += (mouseX - curX) * 0.1;
        curY += (mouseY - curY) * 0.1;

    gsap.set(cursor, { x: curX - 10, y: curY - 10, force3D: true });
    gsap.set(cursorDot, { x: curX - 2, y: curY - 2, force3D: true });
    });

    document.querySelectorAll('a, .project, .misc-item, .achievement, .nav-link, .demo-button, .submit-button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 1.5, borderColor: '#999', duration: 0.15, ease: 'power2.out' });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, borderColor: '', duration: 0.15, ease: 'power2.out' });
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const criticalElements = [
        '.header', '.section', '.navigation', '.project', '.achievement',
        '.dark-mode-toggle', '.back-to-top', '.cursor', '.cursor-dot', '.misc-item', '.skill-item'
    ];

    criticalElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el) {
                el.style.opacity = '1';
                el.style.visibility = 'visible';
            }
        });
    });

    if (cursor && cursorDot) {
        cursor.style.display = 'block';
        cursor.style.visibility = 'visible';
        cursor.style.opacity = '0.8';
        cursorDot.style.display = 'block';
        cursorDot.style.visibility = 'visible';
        cursorDot.style.opacity = '1';

        gsap.set(cursor, {
            x: window.innerWidth / 2 - 10,
            y: window.innerHeight / 2 - 10,
            force3D: true
        });
        gsap.set(cursorDot, {
            x: window.innerWidth / 2 - 2,
            y: window.innerHeight / 2 - 2,
            force3D: true
        });
        mouseX = window.innerWidth / 2;
        mouseY = window.innerHeight / 2;
        curX = mouseX;
        curY = mouseY;
    }
});

window.addEventListener('load', () => {
    gsap.set('.header, .section, .navigation, .project, .achievement, .contact, .contact a, .misc-item, .skill-item, .header .name, .header .title', {
        opacity: 1,
        visibility: 'visible',
        clearProps: 'transform'
    });

    const tl = gsap.timeline({ delay: 0.1 });

    tl.from('.header', {
        duration: 1.2,
        y: 30,
        opacity: 0,
        ease: "power3.out"
    })
    .from('.header .name', {
        duration: 0.8,
        y: 20,
        opacity: 0,
        ease: "power2.out"
    }, "-=0.8")
    .from('.header .title', {
        duration: 0.8,
        y: 15,
        opacity: 0,
        ease: "power2.out"
    }, "-=0.6")
    .from('.header .contact a', {
        duration: 0.6,
        y: 10,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=0.4");

    gsap.from('.navigation', {
        duration: 0.6,
        y: -8,
        opacity: 0,
        ease: "power2.out",
        delay: 0.2
    });

    gsap.to('.typing-indicator', {
        opacity: 0,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
    });
});

gsap.utils.toArray('.section').forEach((section, index) => {
    gsap.from(section.querySelector('.section-title'), {
        duration: 0.8,
        y: 30,
        opacity: 0,
    immediateRender: false,
        ease: "power2.out",
        scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none none",
            once: true
        }
    });

    const contentNodes = Array.from(section.querySelectorAll('p, .about'))
        .filter(el => !el.closest('.project, .achievement, .misc-item, .contact-form'));
    if (contentNodes.length) {
        gsap.from(contentNodes, {
            duration: 0.6,
            y: 20,
            opacity: 0,
            stagger: 0.1,
            immediateRender: false,
            ease: "power2.out",
            scrollTrigger: {
                trigger: section,
                start: "top 70%",
                toggleActions: "play none none none",
                once: true
            }
        });
    }
});

gsap.from('.contact-form .form-group', {
    duration: 0.6,
    y: 20,
    opacity: 0,
    stagger: 0.1,
    immediateRender: false,
    ease: "power2.out",
    scrollTrigger: {
        trigger: '.contact-form',
        start: "top 85%",
    toggleActions: "play none none none",
    once: true
    }
});

document.querySelectorAll('.project').forEach(project => {
    project.addEventListener('mouseenter', () => {
        gsap.to(project, {
            duration: 0.3,
            y: -5,
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
            ease: "power2.out"
        });
    });

    project.addEventListener('mouseleave', () => {
        gsap.to(project, {
            duration: 0.3,
            y: 0,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            ease: "power2.out"
        });
    });

    project.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') return;

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
            pointer-events: none;
            z-index: 1;
        `;

        project.style.position = 'relative';
        project.appendChild(ripple);

        gsap.fromTo(ripple,
            { scale: 0, opacity: 1 },
            {
                scale: 2,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => ripple.remove()
            }
        );
    });
});

document.querySelectorAll('.achievement').forEach(achievement => {
    achievement.addEventListener('mouseenter', () => {
        gsap.to(achievement, {
            duration: 0.3,
            scale: 1.02,
            ease: "power2.out"
        });
    });

    achievement.addEventListener('mouseleave', () => {
        gsap.to(achievement, {
            duration: 0.3,
            scale: 1,
            ease: "power2.out"
        });
    });
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, {
            duration: 0.2,
            color: '#666',
            ease: "power2.out"
        });
    });
    link.addEventListener('mouseleave', () => {
        gsap.to(link, {
            duration: 0.2,
            color: '',
            ease: "power2.out"
        });
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        if (isSmoothScrolling) return;

        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (this.classList.contains('nav-link')) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        }

        if (target) {
            isSmoothScrolling = true;

            const targetRect = target.getBoundingClientRect();
            const currentScroll = window.pageYOffset;
            const targetScroll = currentScroll + targetRect.top - 80;

            gsap.to(window, {
                duration: smoothScrollConfig.duration,
                scrollTo: {
                    y: targetScroll,
                    autoKill: false
                },
                ease: smoothScrollConfig.ease,
                onComplete: () => {
                    isSmoothScrolling = false;
                    if (targetId !== '#') {
                        history.pushState(null, null, targetId);
                    }
                }
            });

            gsap.to(target, {
                duration: smoothScrollConfig.duration * 0.8,
                y: -5,
                ease: "power2.out",
                yoyo: true,
                repeat: 1
            });
        }
    });
});

const progressBar = document.querySelector('.reading-progress');
if (progressBar) {
    gsap.set(progressBar, { scaleX: 0, transformOrigin: "left center" });

    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            onUpdate: self => {
                gsap.set(progressBar, { scaleX: self.progress });
            }
        });
    } else {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollTop / scrollHeight;
            gsap.set(progressBar, { scaleX: progress });
        });
    }
}

function initAdvancedScrollEffects() {
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.utils.toArray('.section').forEach((section, index) => {
        });
    gsap.utils.toArray('.project, .achievement, .misc-item').forEach((item) => {
            gsap.from(item, {
                y: 24,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                clearProps: 'all',
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none none",
                    once: true
                }
            });
        });
        let lastScrollTop = 0;
        ScrollTrigger.create({
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            onUpdate: self => {
                const nav = document.querySelector('.navigation');
                if (nav) {
                    const currentScrollTop = self.scroll();
                    if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
                        gsap.to(nav, {
                            y: -100,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    } else {
                        gsap.to(nav, {
                            y: 0,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    }
                    lastScrollTop = currentScrollTop;
                }
            }
        });
    }
}

initAdvancedScrollEffects();
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const body = document.body;
const toggleTextEl = document.querySelector('.dark-mode-toggle .toggle-text');

function applyDarkModeState(isDark) {
    body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('darkMode', isDark);
    if (toggleTextEl) toggleTextEl.textContent = isDark ? 'light' : 'dark';
}

function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    applyDarkModeState(isDark);

    gsap.to(body, {
        duration: 0.3,
        ease: "power2.inOut"
    });
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
}
const initialDark = localStorage.getItem('darkMode') === 'true';
applyDarkModeState(initialDark);

const backToTopButton = document.querySelector('.back-to-top');

if (backToTopButton) {
    gsap.set(backToTopButton, { opacity: 0, y: 10 });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            gsap.to(backToTopButton, {
                duration: 0.3,
                opacity: 1,
                y: 0,
                ease: "power2.out"
            });
        } else {
            gsap.to(backToTopButton, {
                duration: 0.3,
                opacity: 0,
                y: 10,
                ease: "power2.in"
            });
        }
    });

    backToTopButton.addEventListener('click', () => {
    gsap.to(window, {
            duration: 1,
            scrollTo: { y: 0 },
            ease: "power2.inOut"
        });
    if (window.smoothScrollControl) window.smoothScrollControl.set(0);
    });
}

const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const currentSection = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { root: null, rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });

sections.forEach(section => {
    observer.observe(section);
});

function updateFavicon() {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
        favicon.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👨‍💻</text></svg>";
    }
}

updateFavicon();

document.querySelectorAll('.project').forEach(project => {
    project.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') return;

        const demoButton = this.querySelector('.demo-button');
        const githubButton = this.querySelector('a[href*="github"]');

        if (demoButton) {
            window.open(demoButton.href, '_blank');
        } else if (githubButton) {
            window.open(githubButton.href, '_blank');
        }

        gsap.to(this, {
            duration: 0.1,
            scale: 0.98,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    });
});

console.log('%c👨‍💻 Aarav Gupta - Portfolio', 'color: #4a90e2; font-size: 24px; font-weight: bold;');
console.log('%cWelcome to my portfolio! 🚀', 'color: #666; font-size: 16px;');
console.log('%cFeel free to explore the code and reach out if you have any questions!', 'color: #666; font-size: 14px;');
console.log('%c📧 Email: tribejustice35@gmail.com', 'color: #4a90e2; font-size: 14px;');
console.log('%c🔗 GitHub: https://github.com/Aarav2709', 'color: #4a90e2; font-size: 14px;');
console.log('%c💼 LinkedIn: https://linkedin.com/in/aarav2709', 'color: #4a90e2; font-size: 14px;');

const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            triggerEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function triggerEasterEgg() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];

    document.querySelectorAll('.skill-item, .project, .achievement').forEach((el, index) => {
        gsap.to(el, {
            duration: 0.5,
            backgroundColor: colors[index % colors.length],
            scale: 1.1,
            delay: index * 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.set(el, { clearProps: "backgroundColor,scale" });
            }
        });
    });

    showNotification('🎉 Konami Code activated! Easter egg found!', 'success');
}

if (typeof emailjs !== 'undefined') {
    emailjs.init("your_emailjs_user_id");
}

function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        gsap.to(existingNotification, {
            duration: 0.3,
            x: '100%',
            ease: "power2.in",
            onComplete: () => existingNotification.remove()
        });
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        font-family: 'Metropolis', sans-serif;
        font-size: 14px;
        line-height: 1.4;
        transform: translateX(100%);
    `;

    document.body.appendChild(notification);

    gsap.to(notification, {
        duration: 0.5,
        x: 0,
        ease: "back.out(1.7)"
    });

    setTimeout(() => {
        if (notification.parentNode) {
            gsap.to(notification, {
                duration: 0.3,
                x: '100%',
                ease: "power2.in",
                onComplete: () => notification.remove()
            });
        }
    }, 4000);
}

const contactForm = document.getElementById('contactForm');
const submitButton = contactForm?.querySelector('.submit-button');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        const formData = new FormData(this);
        const templateParams = {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            message: formData.get('message'),
            to_name: 'Aarav Gupta'
        };

        if (typeof emailjs !== 'undefined') {
            emailjs.send('autoreply_service', 'portfolio_contact', {
                from_name: templateParams.from_name,
                from_email: templateParams.from_email,
                message: templateParams.message,
                to_name: templateParams.to_name,
                reply_to: templateParams.from_email
            }).then(function(response) {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();

                emailjs.send('autoreply_service', 'autoreply_template', {
                    to_name: templateParams.from_name,
                    to_email: templateParams.from_email,
                    from_name: 'Aarav Gupta'
                });

            }, function(error) {
                console.error('EmailJS error:', error);
                showNotification('Failed to send message. Please try again or contact me directly.', 'error');
            }).finally(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                }
            });
        } else {
            showNotification('EmailJS not loaded. Please contact me directly.', 'error');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        }
    });
}

const skillsGrid = document.querySelector('.skills-grid');
const skillBars = document.querySelectorAll('.skill-progress');
let skillBarsAnimated = false;
skillBars.forEach(bar => {
    const percent = parseInt(bar.getAttribute('data-progress') || '0', 10) || 0;
    bar.style.width = percent + '%';
    gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });
});

if (skillsGrid && skillBars.length) {
    ScrollTrigger.create({
        trigger: skillsGrid,
        start: 'top 80%',
        onEnter: (self) => {
            if (skillBarsAnimated) { self.kill(); return; }
            gsap.to(skillBars, {
                scaleX: 1,
                duration: 1.2,
                ease: 'power2.out',
                stagger: 0.05
            });
            skillBarsAnimated = true;
            self.kill();
        }
    });
}
(() => {
    let isScrolling = false;
    let targetY = window.scrollY;
    let currentY = window.scrollY;
    const maxDelta = 100;
    const lerp = 0.08;

    function onWheel(e) {
        e.preventDefault();
        const delta = Math.max(-maxDelta, Math.min(maxDelta, e.deltaY));
        targetY = Math.max(0, Math.min(document.body.scrollHeight - window.innerHeight, targetY + delta * 1.5));
        if (!isScrolling) animateScroll();
    }

    function animateScroll() {
        isScrolling = true;

        function updateScroll() {
            currentY += (targetY - currentY) * lerp;

            if (Math.abs(targetY - currentY) > 0.5) {
                window.scrollTo(0, currentY);
                requestAnimationFrame(updateScroll);
            } else {
                window.scrollTo(0, targetY);
                currentY = targetY;
                isScrolling = false;
            }
        }

        updateScroll();
    }
    function onKeyDown(e) {
        const scrollAmount = window.innerHeight * 0.8;

        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                targetY = Math.min(document.body.scrollHeight - window.innerHeight, targetY + scrollAmount);
                if (!isScrolling) animateScroll();
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                targetY = Math.max(0, targetY - scrollAmount);
                if (!isScrolling) animateScroll();
                break;
            case 'Home':
                e.preventDefault();
                targetY = 0;
                if (!isScrolling) animateScroll();
                break;
            case 'End':
                e.preventDefault();
                targetY = document.body.scrollHeight - window.innerHeight;
                if (!isScrolling) animateScroll();
                break;
        }
    }
    function updateCurrentY() {
        currentY = window.scrollY;
        targetY = window.scrollY;
    }
    window.smoothScrollControl = {
        set(y) {
            targetY = y;
            currentY = y;
        },
        syncToWindow() {
            targetY = window.scrollY;
            currentY = window.scrollY;
        }
    };
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) {
        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('load', updateCurrentY);
        window.addEventListener('resize', updateCurrentY);
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                targetY = window.scrollY;
                currentY = window.scrollY;
            }
        }, { passive: true });
    }
})();
function initMomentumScrolling() {
    let velocity = 0;
    let isTouch = false;
    let lastY = 0;

    window.addEventListener('touchstart', (e) => {
        isTouch = true;
        lastY = e.touches[0].clientY;
        velocity = 0;
    });

    window.addEventListener('touchmove', (e) => {
        if (!isTouch) return;
        const currentY = e.touches[0].clientY;
        velocity = currentY - lastY;
        lastY = currentY;
    });

    window.addEventListener('touchend', () => {
        if (!isTouch) return;
        isTouch = false;

        if (Math.abs(velocity) > 5) {
            gsap.to(window, {
                scrollTo: `+=${velocity * 3}`,
                duration: 0.8,
                ease: "power2.out"
            });
        }
    });
}

initMomentumScrolling();
