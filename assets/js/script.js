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
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');
document.addEventListener('mousemove', (e) => {
    if (cursor) {
        cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
    }
    if (cursorDot) {
        cursorDot.style.transform = `translate(${e.clientX - 2}px, ${e.clientY - 2}px)`;
    }
});
document.querySelectorAll('a, .project, .misc-item, .achievement, .nav-link, .demo-button, .submit-button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursor) {
            cursor.style.transform += ' scale(1.5)';
            cursor.style.borderColor = '#999';
        }
    });
    el.addEventListener('mouseleave', () => {
        if (cursor) {
            const mouseX = event.clientX || 0;
            const mouseY = event.clientY || 0;
            cursor.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px) scale(1)`;
            cursor.style.borderColor = '';
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const criticalElements = [
        '.header', '.section', '.navigation', '.project', '.achievement',
        '.dark-mode-toggle', '.back-to-top', '.cursor', '.cursor-dot'
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
        gsap.set(cursor, {
            x: window.innerWidth / 2 - 10,
            y: window.innerHeight / 2 - 10,
            scale: 1
        });
        gsap.set(cursorDot, {
            x: window.innerWidth / 2 - 2,
            y: window.innerHeight / 2 - 2
        });
    }
    console.log('Portfolio initialized successfully');
});
window.addEventListener('load', () => {
    
    gsap.set('.header, .section, .navigation, .project, .achievement, .contact, .contact a', {
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
        duration: 1,
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
        duration: 1,
        y: -10,
        opacity: 0,
        ease: "power2.out",
        delay: 0.3
    });
    
    gsap.from('.dark-mode-toggle', {
        duration: 0.8,
        scale: 0.8,
        opacity: 0,
        ease: "back.out(1.7)",
        delay: 0.6
    });
    
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        gsap.to(typingIndicator, {
            duration: 1,
            opacity: 0,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });
        
        gsap.to(typingIndicator, {
            duration: 0.5,
            opacity: 0,
            ease: "power2.out",
            delay: 3,
            onComplete: () => {
                if (typingIndicator) typingIndicator.remove();
            }
        });
    }
});
gsap.utils.toArray('.section').forEach((section, index) => {
    
    gsap.set(section, { opacity: 1, visibility: 'visible' });
    gsap.from(section, {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: "power2.out",
        scrollTrigger: {
            trigger: section,
            start: "top 90%",
            end: "bottom 20%",
            toggleActions: "play none none none"
        }
    });
    
    const title = section.querySelector('.section-title');
    if (title) {
        gsap.from(title, {
            duration: 0.8,
            x: -30,
            opacity: 0,
            ease: "power2.out",
            scrollTrigger: {
                trigger: title,
                start: "top 95%",
                toggleActions: "play none none none"
            }
        });
    }
});
const projectsGrid = document.querySelector('.projects-grid');
if (projectsGrid) {
    gsap.from('.project', {
        duration: 0.8,
        y: 40,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: projectsGrid,
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });
}
const achievementsGrid = document.querySelector('.achievements-grid');
if (achievementsGrid) {
    gsap.from('.achievement', {
        duration: 0.7,
        y: 30,
        opacity: 0,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
            trigger: achievementsGrid,
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });
}
gsap.from('.skill-category', {
    duration: 1,
    x: -60,
    opacity: 0,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
        trigger: '.skills-container',
        start: "top 80%",
        toggleActions: "play none none reverse"
    }
});
gsap.from('.setup-item', {
    duration: 0.8,
    scale: 0.8,
    opacity: 0,
    stagger: 0.1,
    ease: "back.out(1.7)",
    scrollTrigger: {
        trigger: '.setup-grid',
        start: "top 80%",
        toggleActions: "play none none reverse"
    }
});
gsap.from('.contact-form .form-group', {
    duration: 0.8,
    y: 30,
    opacity: 0,
    stagger: 0.1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: '.contact-form',
        start: "top 80%",
        toggleActions: "play none none reverse"
    }
});
document.querySelectorAll('.project').forEach(project => {
    project.addEventListener('mouseenter', () => {
        gsap.to(project, {
            duration: 0.4,
            y: -8,
            scale: 1.02,
            rotationY: 2,
            ease: "power2.out"
        });
        const nameLink = project.querySelector('.project-name a');
        if (nameLink) {
            gsap.to(nameLink, {
                duration: 0.3,
                color: '#666',
                ease: "power2.out"
            });
        }
    });
    project.addEventListener('mouseleave', () => {
        gsap.to(project, {
            duration: 0.4,
            y: 0,
            scale: 1,
            rotationY: 0,
            ease: "power2.out"
        });
        const nameLink = project.querySelector('.project-name a');
        if (nameLink) {
            gsap.to(nameLink, {
                duration: 0.3,
                color: '',
                ease: "power2.out"
            });
        }
    });
});
document.querySelectorAll('.achievement').forEach(achievement => {
    achievement.addEventListener('mouseenter', () => {
        gsap.to(achievement, {
            duration: 0.5,
            scale: 1.05,
            rotationY: 8,
            z: 50,
            ease: "power2.out"
        });
    });
    achievement.addEventListener('mouseleave', () => {
        gsap.to(achievement, {
            duration: 0.5,
            scale: 1,
            rotationY: 0,
            z: 0,
            ease: "power2.out"
        });
    });
});
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, {
            duration: 0.3,
            y: -3,
            ease: "power2.out"
        });
    });
    link.addEventListener('mouseleave', () => {
        gsap.to(link, {
            duration: 0.3,
            y: 0,
            ease: "power2.out"
        });
    });
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: {
                    y: target,
                    offsetY: 100
                },
                ease: "power3.inOut"
            });
        }
    });
});
const progressBar = document.querySelector('.reading-progress');
if (progressBar) {
    gsap.set(progressBar, { scaleX: 0, transformOrigin: "left center" });
    ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: self => {
            gsap.to(progressBar, {
                duration: 0.3,
                scaleX: self.progress,
                ease: "power2.out"
            });
        }
    });
}
const darkModeToggle = document.getElementById('darkModeToggle');
const toggleText = darkModeToggle?.querySelector('.toggle-text');
darkModeToggle?.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark);
    if (toggleText) toggleText.textContent = isDark ? 'light' : 'dark';
    updateFavicon();
    
    gsap.to(darkModeToggle, {
        duration: 0.3,
        scale: 0.9,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
    });
});
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    if (toggleText) toggleText.textContent = 'light';
}
const backToTopButton = document.getElementById('backToTop');
function toggleBackToTopButton() {
    if (window.scrollY > 300) {
        gsap.to(backToTopButton, {
            duration: 0.3,
            scale: 1,
            opacity: 1,
            ease: "power2.out"
        });
    } else {
        gsap.to(backToTopButton, {
            duration: 0.3,
            scale: 0,
            opacity: 0,
            ease: "power2.out"
        });
    }
}
window.addEventListener('scroll', toggleBackToTopButton);
backToTopButton?.addEventListener('click', () => {
    gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: 0 },
        ease: "power3.inOut"
    });
});
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150;
    const navLinks = document.querySelectorAll('.nav-link');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}
window.addEventListener('scroll', updateActiveNavLink);
function updateFavicon() {
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
        const emoji = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
        favicon.href = `data:image/svg+xml,<svg xmlns='http:
    }
}
updateFavicon();
document.querySelectorAll('.project').forEach(project => {
    project.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') {
            const link = project.querySelector('.project-name a');
            if (link) {
                
                const ripple = document.createElement('div');
                const rect = project.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                ripple.style.cssText = \`
                    position: absolute;
                    width: \${size}px;
                    height: \${size}px;
                    left: \${x}px;
                    top: \${y}px;
                    background: rgba(26, 26, 26, 0.05);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1;
                \`;
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
                
                setTimeout(() => {
                    window.open(link.href, '_blank');
                }, 300);
            }
        }
    });
});
if (window.console) {
    const styles = [
        'color: #000000',
        'background: #f5f5f5',
        'font-size: 12px',
        'padding: 4px 8px',
        'border-radius: 3px',
        'font-family: "Metropolis"'
    ].join(';');
    console.log('%c👋 Hey there fellow developer!', styles);
    console.log('%cNice to see someone checking the source. Built with GSAP for silky smooth animations!', styles);
}
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    if (konamiCode.toString() === konamiSequence.toString()) {
        
        const rainbowTl = gsap.timeline();
        rainbowTl.to(document.body, {
            duration: 0.5,
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3)',
            backgroundSize: '400% 400%',
            ease: "power2.out"
        })
        .to(document.body, {
            duration: 3,
            backgroundPosition: '100% 50%',
            ease: "none",
            repeat: 1,
            yoyo: true
        })
        .to(document.body, {
            duration: 0.5,
            background: '',
            ease: "power2.out"
        });
        konamiCode = [];
    }
});
(function() {
    emailjs.init('kEXE9SEqYai171h5J');
})();
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm?.querySelector('.submit-button');
    const buttonText = submitButton?.querySelector('.button-text');
    contactForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = {
            name: document.getElementById('name')?.value,
            email: document.getElementById('email')?.value,
            message: document.getElementById('message')?.value
        };
        
        gsap.to(submitButton, {
            duration: 0.3,
            scale: 0.95,
            ease: "power2.out"
        });
        if (buttonText) buttonText.textContent = 'sending...';
        submitButton.disabled = true;
        
        emailjs.send('autoreply_service', 'portfolio_contact', {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            to_email: 'tribejustice35@gmail.com'
        })
        .then(function(response) {
            
            gsap.to(submitButton, {
                duration: 0.3,
                backgroundColor: '#4caf50',
                scale: 1,
                ease: "power2.out"
            });
            if (buttonText) buttonText.textContent = 'message sent!';
            contactForm.reset();
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            setTimeout(() => {
                gsap.to(submitButton, {
                    duration: 0.3,
                    backgroundColor: '',
                    ease: "power2.out"
                });
                if (buttonText) buttonText.textContent = 'send message';
                submitButton.disabled = false;
            }, 3000);
        })
        .catch(function(error) {
            
            gsap.to(submitButton, {
                duration: 0.3,
                backgroundColor: '#f44336',
                scale: 1,
                ease: "power2.out"
            });
            if (buttonText) buttonText.textContent = 'failed to send';
            showNotification('Failed to send message. Please try again or contact me directly.', 'error');
            
            setTimeout(() => {
                gsap.to(submitButton, {
                    duration: 0.3,
                    backgroundColor: '',
                    ease: "power2.out"
                });
                if (buttonText) buttonText.textContent = 'send message';
                submitButton.disabled = false;
            }, 3000);
        });
    });
});
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
    notification.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        background: \${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
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
    \`;
    document.body.appendChild(notification);
    
    gsap.to(notification, {
        duration: 0.5,
        x: 0,
        ease: "back.out(1.7)"
    });
    
    setTimeout(() => {
        gsap.to(notification, {
            duration: 0.3,
            x: '100%',
            ease: "power2.in",
            onComplete: () => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }
        });
    }, 5000);
}
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    gsap.globalTimeline.timeScale(1.5); 
}
const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}
document.querySelectorAll('.demo-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const demoUrl = button.getAttribute('data-demo');
        if (demoUrl) {
            gsap.to(button, {
                duration: 0.15,
                scale: 0.95,
                ease: "power2.out",
                yoyo: true,
                repeat: 1,
                onComplete: () => window.open(demoUrl, '_blank')
            });
        }
    });
});
document.querySelectorAll('.skill-progress').forEach(bar => {
    const progress = bar.getAttribute('data-progress');
    gsap.set(bar, { width: 0 });
    gsap.to(bar, {
        width: progress + '%',
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
            trigger: bar,
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });
});
