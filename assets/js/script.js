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
    if (!cursor || !cursorDot) return;
    
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
if (cursor && cursorDot) {
    animate();
}

document.querySelectorAll('a, .project, .misc-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursor) {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#999';
        }
    });

    el.addEventListener('mouseleave', () => {
        if (cursor) {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '';
        }
    });
});

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

setTimeout(() => {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.opacity = '0';
        setTimeout(() => typingIndicator.remove(), 500);
    }
}, 3000);

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

const darkModeToggle = document.getElementById('darkModeToggle');
const toggleText = darkModeToggle.querySelector('.toggle-text');

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    toggleText.textContent = isDark ? 'light' : 'dark';
    updateFavicon();
});

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    if (toggleText) toggleText.textContent = 'light';
}

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    const readingProgress = document.querySelector('.reading-progress');
    if (readingProgress) readingProgress.style.width = `${progress}%`;
});

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

const favicon = document.querySelector("link[rel='icon']");
const updateFavicon = () => {
    if (favicon) {
        const emoji = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
        favicon.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${emoji}</text></svg>`;
    }
};

updateFavicon();

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

const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

document.querySelectorAll('.demo-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const demoUrl = button.getAttribute('data-demo');
        
        if (demoUrl) {
            button.style.transform = 'translateY(0) scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
                window.open(demoUrl, '_blank');
            }, 150);
        }
    });

    button.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursor.style.borderColor = '#999';
        cursor.style.background = 'rgba(0, 0, 0, 0.1)';
    });

    button.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.borderColor = '';
        cursor.style.background = 'transparent';
    });
});

document.querySelectorAll('a, .project, .misc-item, .demo-button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (!el.classList.contains('demo-button')) {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#999';
        }
    });

    el.addEventListener('mouseleave', () => {
        if (!el.classList.contains('demo-button')) {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offset = 100;
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                navLinks.forEach(nl => nl.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

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

    const skillBars = document.querySelectorAll('.skill-progress');
    const animateSkillBars = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const progress = skillBar.getAttribute('data-progress');
                setTimeout(() => {
                    skillBar.style.width = progress + '%';
                    skillBar.classList.add('animate');
                }, 200);
                observer.unobserve(skillBar);
            }
        });
    };

    const skillObserver = new IntersectionObserver(animateSkillBars, {
        threshold: 0.5
    });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // Initialize EmailJS
    emailjs.init({
        publicKey: "YOUR_PUBLIC_KEY", // Replace with your EmailJS public key
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('.submit-button');
            const originalText = submitButton.querySelector('.button-text').textContent;
            
            // Show sending state
            submitButton.querySelector('.button-text').textContent = 'sending...';
            submitButton.disabled = true;
            submitButton.style.opacity = '0.7';
            
            // Get form data
            const templateParams = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                to_email: 'tribejustice35@gmail.com'
            };
            
            // Send email using EmailJS
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    submitButton.querySelector('.button-text').textContent = 'message sent!';
                    submitButton.style.background = '#4ade80';
                    contactForm.reset();
                    
                    // Reset button after 2 seconds
                    setTimeout(() => {
                        submitButton.querySelector('.button-text').textContent = originalText;
                        submitButton.disabled = false;
                        submitButton.style.opacity = '1';
                        submitButton.style.background = '';
                    }, 2000);
                })
                .catch(function(error) {
                    console.error('FAILED...', error);
                    submitButton.querySelector('.button-text').textContent = 'failed to send';
                    submitButton.style.background = '#ef4444';
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitButton.querySelector('.button-text').textContent = originalText;
                        submitButton.disabled = false;
                        submitButton.style.opacity = '1';
                        submitButton.style.background = '';
                    }, 3000);
                });
        });
    }

    const enhancedElements = document.querySelectorAll('.nav-link, .contact-link, .submit-button, .skill-item');
    enhancedElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.borderColor = '#999';
            }
        });

        el.addEventListener('mouseleave', () => {
            if (cursor) {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = '';
            }
        });
    });

    function parallaxEffect() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.section');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed / 10);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(parallaxEffect);
            ticking = true;
        }
    }

    window.addEventListener('scroll', () => {
        requestTick();
        ticking = false;
    });

    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const nameText = nameElement.textContent;
        const typingIndicator = nameElement.querySelector('.typing-indicator');
        
        if (typingIndicator) {
            setInterval(() => {
                typingIndicator.style.opacity = typingIndicator.style.opacity === '0' ? '1' : '0';
            }, 1000);
        }
    }

    const projects = document.querySelectorAll('.project');
    projects.forEach(project => {
        project.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        project.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
});

if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    document.documentElement.style.setProperty('--animation-duration', '0.6s');
}

let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.toString() === konamiSequence.toString()) {
        document.body.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3)';
        document.body.style.backgroundSize = '400% 400%';
        document.body.style.animation = 'rainbow 3s ease infinite';
        
        if (!document.querySelector('#rainbow-style')) {
            const style = document.createElement('style');
            style.id = 'rainbow-style';
            style.textContent = `
                @keyframes rainbow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            document.body.style.background = '';
            document.body.style.animation = '';
        }, 5000);
        
        konamiCode = [];
    }
});

const backToTopButton = document.getElementById('backToTop');

function toggleBackToTopButton() {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
}

window.addEventListener('scroll', toggleBackToTopButton);

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
