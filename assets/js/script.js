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
    if (typeof CustomEase !== 'undefined' && typeof CustomEase.create === 'function') {
        try { CustomEase.create('main', '0.65, 0.01, 0.05, 0.99'); } catch(e) {}
    }
}
gsap.defaults({ overwrite: 'auto' });
let isSmoothScrolling = false;
const smoothScrollConfig = {
    duration: 0.8,
    ease: "power2.out"
};
function initSmoothScroll() {
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.WebkitOverflowScrolling = 'touch';
    let scrollTimeout;
    window.addEventListener('wheel', (e) => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            gsap.to(window, {
                duration: 0.1,
                ease: "power1.out"
            });
        }, 16);
    }, { passive: true });
}
initSmoothScroll();
// Preloader removed: no init call
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let curX = mouseX;
let curY = mouseY;
if (cursor && cursorDot) {
    gsap.set(cursor, { x: mouseX - 10, y: mouseY - 10 });
    gsap.set(cursorDot, { x: mouseX - 2, y: mouseY - 2 });
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.set(cursorDot, { x: mouseX - 2, y: mouseY - 2, force3D: true });
    });
    const updateCursor = () => {
        curX += (mouseX - curX) * 0.15;
        curY += (mouseY - curY) * 0.15;
        gsap.set(cursor, { x: curX - 10, y: curY - 10, force3D: true });
        requestAnimationFrame(updateCursor);
    };
    updateCursor();
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
    gsap.set('.header, .section, .project, .achievement, .contact, .contact a, .misc-item, .skill-item, .header .name, .header .title', {
        opacity: 1,
        visibility: 'visible',
        clearProps: 'transform'
    });
    gsap.to('.typing-indicator', {
        opacity: 0,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
    });
    initTextRevealAnimations();
    initProjectAnimations();
    initScrollAnimations();
    initAchievementsAnimations();
    initSkillsAnimations();
    initHeroStrips();
    initScrollContrast();
    initAboutLineReveal();
    initProjectWordReveal();
    // Ensure every .project has a .project-number element (create at runtime if missing)
    ensureProjectNumbers();
    // ensure sorting indicator exists and show it while background fetches are pending
    ensureSortingIndicator();
    showSortingIndicator();
    // render star badges (immediate cached results), then initial reorder; background fetches will update and re-sort incrementally
    renderGitHubStars().then((starMap) => {
        try { sortProjectsByStars(starMap); } catch(e) { /* noop */ }
    }).catch(() => {/* ignore errors */});
    // hide indicator when background fetching completes
    window.addEventListener('stars:allDone', () => { hideSortingIndicator(); });
});

// Create .project-number elements for projects that don't have them.
function ensureProjectNumbers() {
    const projects = document.querySelectorAll('.projects-grid .project');
    projects.forEach((proj, i) => {
        let numEl = proj.querySelector('.project-number');
        if (!numEl) {
            numEl = document.createElement('div');
            numEl.className = 'project-number';
            // insert as first child of project (before project-content)
            const content = proj.querySelector('.project-content');
            if (content && content.parentNode) content.parentNode.insertBefore(numEl, content);
            else proj.insertBefore(numEl, proj.firstChild);
        }
        // initialize with a placeholder (will be updated after sorting)
        numEl.textContent = String(i + 1).padStart(2, '0');
    });
}

// Sorting indicator helpers
function ensureSortingIndicator() {
    if (document.getElementById('sorting-indicator')) return;
    const el = document.createElement('div');
    el.id = 'sorting-indicator';
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = `position: fixed; right: 18px; bottom: 18px; z-index: 9000; background: rgba(0,0,0,0.6); color: #fff; padding: 8px 12px; border-radius: 999px; font-size: 13px; display: none; align-items: center; gap: 8px;`;
    el.innerHTML = `<span class="dot" style="width:8px;height:8px;background:#fff;border-radius:50%;display:inline-block;animation: pulse 1s infinite;"></span><span style="opacity:0.95">sorting…</span>`;
    document.body.appendChild(el);
    // small keyframes for pulse
    const style = document.createElement('style');
    style.id = 'sorting-indicator-style';
    style.textContent = `@keyframes pulse {0%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:0.6}100%{transform:scale(1);opacity:1}}`;
    document.head.appendChild(style);
}

function showSortingIndicator() {
    const el = document.getElementById('sorting-indicator');
    if (!el) return;
    el.style.display = 'flex';
}

function hideSortingIndicator() {
    const el = document.getElementById('sorting-indicator');
    if (!el) return;
    el.style.display = 'none';
}

// Render GitHub star badges next to project GitHub links.
function renderGitHubStars() {
    // Improved behavior:
    // - Immediately apply cached star counts and resolve with that map so initial sort is fast
    // - Fetch uncached repos in background and update badges + dataset as results arrive
    // - Debounced incremental re-sorts happen after each batch of arrivals
    // - Dispatches a 'stars:allDone' event when all background fetches finish

    return new Promise((resolve) => {
        const projectContainers = Array.from(document.querySelectorAll('.project .project-links'));
        if (!projectContainers.length) return resolve({});

        const cacheKey = 'gh_star_cache_v1';
        const cacheTTL = 1000 * 60 * 60; // 1 hour
        let cache = {};
        try { cache = JSON.parse(localStorage.getItem(cacheKey) || '{}'); } catch(e) { cache = {}; }

        const starMap = {};
        const fetchPromises = [];
        let pendingFetchCount = 0;
        let resortTimer = null;

        const scheduleResort = () => {
            if (resortTimer) clearTimeout(resortTimer);
            resortTimer = setTimeout(() => {
                try { sortProjectsByStars(starMap); } catch(e) {}
            }, 120);
        };

        projectContainers.forEach(container => {
            const link = container.querySelector('a[href*="github.com/"]');
            if (!link) return;
            const linkCount = container.querySelectorAll('a').length;
            if (linkCount === 1) container.classList.add('single-link');

            try {
                const url = new URL(link.href);
                const parts = url.pathname.split('/').filter(Boolean);
                if (parts.length < 2) return;
                const owner = parts[0];
                const repo = parts[1];
                const repoKey = `${owner}/${repo}`;

                const badge = document.createElement('span');
                badge.className = 'star-badge loading';
                badge.setAttribute('aria-hidden', 'true');
                badge.innerHTML = `
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.556L19.335 24 12 19.897 4.665 24l1.634-8.694L.6 9.75l7.732-1.732z"></path></svg>
                    <span class="star-count">—</span>`;

                container.appendChild(badge);

                const updateBadge = (count) => {
                    badge.classList.remove('loading');
                    badge.querySelector('.star-count').textContent = count != null ? String(count) : '—';
                };
                const setError = () => { badge.classList.remove('loading'); badge.classList.add('error'); badge.querySelector('.star-count').textContent = '—'; };

                const projectEl = container.closest('.project');

                const cached = cache[repoKey];
                const now = Date.now();
                if (cached && (now - cached.ts) < cacheTTL) {
                    const stars = cached.stars ?? 0;
                    updateBadge(stars);
                    starMap[repoKey] = stars;
                    if (projectEl) projectEl.dataset.stars = String(stars);
                    return;
                }

                // not cached -> fetch in background
                pendingFetchCount++;
                const p = fetch(`https://api.github.com/repos/${owner}/${repo}`)
                    .then(res => {
                        if (!res.ok) throw new Error('GitHub API error');
                        return res.json();
                    })
                    .then(data => {
                        const stars = Number(data.stargazers_count ?? 0) || 0;
                        updateBadge(stars);
                        starMap[repoKey] = stars;
                        if (projectEl) projectEl.dataset.stars = String(stars);
                        cache[repoKey] = { stars, ts: Date.now() };
                        scheduleResort();
                    })
                    .catch(() => {
                        setError();
                        starMap[repoKey] = 0;
                        if (projectEl) projectEl.dataset.stars = '0';
                        scheduleResort();
                    })
                    .finally(() => {
                        pendingFetchCount--;
                    });

                fetchPromises.push(p);
            } catch(e) {
                // ignore malformed links
            }
        });

        // persist cache as fetches arrive (when all done)
        Promise.all(fetchPromises).finally(() => {
            try { localStorage.setItem(cacheKey, JSON.stringify(cache)); } catch(e) {}
            // dispatch event to signal all background fetches finished
            try { window.dispatchEvent(new CustomEvent('stars:allDone')); } catch(e) {}
        });

        // resolve immediately with the starMap based on cached values so caller can do an initial sort
        resolve(starMap);
    });
}

// Sorts .projects-grid children in-place by star count (descending). Projects without
// stars are treated as 0 and placed after projects with stars.
function sortProjectsByStars(starMap = {}) {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return;
    const projects = Array.from(grid.querySelectorAll('.project'));
    // capture original index to keep stable sort for ties
    const withMeta = projects.map((el, idx) => {
        // try to deduce repoKey from the github link
        const link = el.querySelector('.project-links a[href*="github.com/"]');
        let key = null;
        if (link) {
            try {
                const url = new URL(link.href);
                const parts = url.pathname.split('/').filter(Boolean);
                if (parts.length >= 2) key = `${parts[0]}/${parts[1]}`;
            } catch(e) { key = null; }
        }
        const viaMap = key && (starMap[key] != null);
        const stars = viaMap ? Number(starMap[key] || 0) : Number(el.dataset.stars || 0) || 0;
        return { el, stars, idx };
    });

    withMeta.sort((a, b) => {
        if (b.stars !== a.stars) return b.stars - a.stars;
        return a.idx - b.idx;
    });

    // re-append in sorted order
    withMeta.forEach(item => grid.appendChild(item.el));
    // After reordering, update displayed project numbers (01, 02, ...)
    const pad = (n) => String(n).padStart(2, '0');
    const reordered = Array.from(grid.querySelectorAll('.project'));
    reordered.forEach((proj, i) => {
        const numEl = proj.querySelector('.project-number');
        if (numEl) numEl.textContent = pad(i + 1);
    });
}
function initTextRevealAnimations() {
    gsap.utils.toArray('.section-title').forEach((title) => {
        const chars = title.querySelectorAll('.section-title-char');
        gsap.set(chars, {
            y: '120%',
            opacity: 0,
            scale: 0.8
        });
        ScrollTrigger.create({
            trigger: title,
            start: "top 95%",
            onEnter: () => {
                gsap.to(chars, {
                    duration: 0.8,
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    ease: "back.out(1.3)",
                    stagger: {
                        amount: 0.4,
                        from: "start"
                    }
                });
            },
            once: true
        });
    });
    gsap.utils.toArray('.about, .about-large').forEach((text, index) => {
        gsap.set(text, {
            y: 80,
            opacity: 0,
            filter: 'blur(8px)'
        });
        gsap.to(text, {
            duration: 1,
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            ease: "expo.out",
            scrollTrigger: {
                trigger: text,
                start: "top 95%",
                toggleActions: "play none none none",
                once: true
            },
            delay: index * 0.15
        });
    });
}
function initAboutLineReveal() {
    const p = document.querySelector('#about .text p');
    if (!p) return;
    const words = p.textContent.trim().split(/\s+/);
    p.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');
    const wordEls = Array.from(p.querySelectorAll('.word'));
    wordEls.forEach(w => { w.style.display = 'inline-block'; w.style.whiteSpace = 'nowrap'; });
    const lines = [];
    let currentTop = null;
    let line = [];
    wordEls.forEach((w, i) => {
        const top = w.offsetTop;
        if (currentTop === null) currentTop = top;
        if (Math.abs(top - currentTop) <= 2) {
            line.push(w);
        } else {
            lines.push(line);
            line = [w];
            currentTop = top;
        }
    });
    if (line.length) lines.push(line);
    lines.forEach(group => {
        const wrapper = document.createElement('span');
        wrapper.className = 'line';
        group[0].parentNode.insertBefore(wrapper, group[0]);
        group.forEach((w, idx) => {
            wrapper.appendChild(w);
            if (idx < group.length - 1) wrapper.appendChild(document.createTextNode(' '));
        });
    });
    const lineEls = p.querySelectorAll('.line');
    if (typeof ScrollTrigger === 'undefined') {
        lineEls.forEach(el => el.style.backgroundPositionX = '0%');
        return;
    }
    lineEls.forEach((target) => {
        gsap.to(target, {
            backgroundPositionX: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: target,
                scrub: 1,
                start: 'top 90%',
                end: 'bottom 40%'
            }
        });
    });
}
function initProjectWordReveal() {
    const descriptions = Array.from(document.querySelectorAll('#projects .project-description'));
    if (!descriptions.length) return;
    descriptions.forEach(desc => {
        const raw = desc.textContent.trim().replace(/\s+/g, ' ');
        const words = raw.split(' ');
        desc.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');
        const wordEls = desc.querySelectorAll('.word');
        if (typeof ScrollTrigger === 'undefined') {
            wordEls.forEach(w => w.classList.add('reveal'));
            return;
        }
        ScrollTrigger.create({
            trigger: desc,
            start: 'top 95%',
            end: 'bottom 65%',
            onUpdate: self => {
                const p = self.progress;
                const count = Math.floor(p * wordEls.length);
                wordEls.forEach((el, i) => {
                    if (i < count) el.classList.add('reveal');
                    else el.classList.remove('reveal');
                });
            },
            once: false
        });
    });
}
function initProjectAnimations() {
    gsap.utils.toArray('.project').forEach((project, index) => {
        const content = project.querySelector('.project-content');
        const number = project.querySelector('.project-number');
        const visual = project.querySelector('.project-visual');
        const info = project.querySelector('.project-info');
        gsap.set([content, number], { opacity: 0 });
        gsap.set(info, { x: -60 });
        gsap.set(visual, { x: 60, scale: 0.8 });
        gsap.set(number, { x: 100 });
        ScrollTrigger.create({
            trigger: project,
            start: "top 70%",
            onEnter: () => {
                const tl = gsap.timeline();
                tl.to([content, number], {
                    duration: 0.8,
                    opacity: 1,
                    ease: "power3.out"
                })
                .to(info, {
                    duration: 1,
                    x: 0,
                    ease: "power3.out"
                }, 0.2)
                .to(visual, {
                    duration: 1,
                    x: 0,
                    scale: 1,
                    ease: "power3.out"
                }, 0.2)
                .to(number, {
                    duration: 1.2,
                    x: 0,
                    ease: "power4.out"
                }, 0.4);
            },
            once: true
        });
        project.addEventListener('mouseenter', () => {
            gsap.to(visual, {
                duration: 0.6,
                scale: 1.05,
                ease: "power2.out"
            });
            gsap.to(number, {
                duration: 0.6,
                x: -20,
                ease: "power2.out"
            });
        });
        project.addEventListener('mouseleave', () => {
            gsap.to(visual, {
                duration: 0.6,
                scale: 1,
                ease: "power2.out"
            });
            gsap.to(number, {
                duration: 0.6,
                x: 0,
                ease: "power2.out"
            });
        });
    });
}
function initScrollAnimations() {
    gsap.utils.toArray('.section').forEach((section, index) => {
        ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onEnter: () => {
                gsap.to(section, {
                    duration: 0.8,
                    backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.01)' : 'transparent',
                    ease: "power2.out"
                });
            },
            onLeave: () => {
                gsap.to(section, {
                    duration: 0.8,
                    backgroundColor: 'transparent',
                    ease: "power2.out"
                });
            },
            onEnterBack: () => {
                gsap.to(section, {
                    duration: 0.8,
                    backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.01)' : 'transparent',
                    ease: "power2.out"
                });
            },
            onLeaveBack: () => {
                gsap.to(section, {
                    duration: 0.8,
                    backgroundColor: 'transparent',
                    ease: "power2.out"
                });
            }
        });
    });
    ScrollTrigger.create({
        trigger: ".header",
        start: "bottom top",
        onUpdate: self => {
            gsap.to('.header .name', {
                duration: 0.3,
                y: -self.progress * 100,
                ease: "none"
            });
        }
    });
}
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
if (typeof IntersectionObserver !== 'undefined') {
    const sectionInViewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target.id === 'about') {
                entry.target.classList.toggle('in-view', entry.isIntersecting);
            }
        });
    }, { root: null, rootMargin: '-30% 0px -40% 0px', threshold: 0.01 });
    const aboutSection = document.getElementById('about');
    if (aboutSection) sectionInViewObserver.observe(aboutSection);
}
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
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        if (isSmoothScrolling) return;
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            isSmoothScrolling = true;
            const targetRect = target.getBoundingClientRect();
            const currentScroll = window.pageYOffset;
            const targetScroll = currentScroll + targetRect.top;
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
    }
}
initAdvancedScrollEffects();
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const body = document.body;
const toggleTextEl = document.querySelector('.dark-mode-toggle .toggle-text');
let toggleTextTimeline = null;
let isTogglingDark = false;
function animateToggleLabel(next) {
    if (!toggleTextEl) return;
    if (gsap && typeof gsap.fromTo === 'function') {
        if (toggleTextTimeline) toggleTextTimeline.kill();
        toggleTextTimeline = gsap.timeline();
        toggleTextTimeline
            .fromTo(toggleTextEl, { yPercent: 0 }, { yPercent: -100, duration: 0.25, ease: 'power2.in' })
            .add(() => { toggleTextEl.textContent = next; })
            .fromTo(toggleTextEl, { yPercent: 100 }, { yPercent: 0, duration: 0.3, ease: 'power2.out' });
    } else {
        toggleTextEl.textContent = next;
    }
}
function applyDarkModeState(isDark) {
    body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('darkMode', isDark);
    if (toggleTextEl) toggleTextEl.textContent = isDark ? 'light' : 'dark';
}
function toggleDarkMode() {
    if (isTogglingDark) return;
    isTogglingDark = true;
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    applyDarkModeState(isDark);
    gsap.to(body, {
        duration: 0.3,
        ease: "power2.inOut"
    });
    animateToggleLabel(isDark ? 'light' : 'dark');
    setTimeout(() => { isTogglingDark = false; }, 400);
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
console.log('%cAarav Gupta - Portfolio', 'color: #4a90e2; font-size: 24px; font-weight: bold;');
console.log('%cWelcome to my portfolio!', 'color: #666; font-size: 16px;');
console.log('%cFeel free to explore the code and reach out if you have any questions!', 'color: #666; font-size: 14px;');
console.log('%cEmail: tribejustice35@gmail.com', 'color: #4a90e2; font-size: 14px;');
console.log('%cGitHub: https://github.com/Aarav2709', 'color: #4a90e2; font-size: 14px;');
console.log('%cLinkedIn: https://linkedin.com/in/Aarav2709', 'color: #4a90e2; font-size: 14px;');
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
    emailjs.init("tribejustice35@gmail.com");
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
function initAchievementsAnimations() {
    const achievements = gsap.utils.toArray('.achievement');
    achievements.forEach((achievement, index) => {
        gsap.from(achievement, {
            duration: 0.8,
            y: 60,
            opacity: 0,
            ease: "power3.out",
            scrollTrigger: {
                trigger: achievement,
                start: "top 80%",
                toggleActions: "play none none none",
                once: true
            }
        });
        achievement.addEventListener('mouseenter', () => {
            gsap.to(achievement, {
                scale: 1.02,
                duration: 0.4,
                ease: "power2.out"
            });
            gsap.to(achievement.querySelector('.achievement-number'), {
                scale: 1.1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        achievement.addEventListener('mouseleave', () => {
            gsap.to(achievement, {
                scale: 1,
                duration: 0.4,
                ease: "power2.out"
            });
            gsap.to(achievement.querySelector('.achievement-number'), {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}
function initSkillsAnimations() {
    const skillBars = gsap.utils.toArray('.skill-progress');
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        gsap.set(bar, { width: '0%' });
        ScrollTrigger.create({
            trigger: bar,
            start: "top 80%",
            onEnter: () => {
                gsap.to(bar, {
                    width: `${progress}%`,
                    duration: 1.5,
                    ease: "power3.out",
                    delay: 0.2
                });
            },
            once: true
        });
    });
    const skillItems = gsap.utils.toArray('.skill-item');
    skillItems.forEach((item, index) => {
        gsap.from(item, {
            duration: 0.6,
            y: 30,
            opacity: 0,
            ease: "power2.out",
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none none",
                once: true
            },
            delay: index * 0.1
        });
    });
    const miscItems = gsap.utils.toArray('.misc-item');
    miscItems.forEach((item, index) => {
        gsap.from(item, {
            duration: 0.8,
            y: 50,
            opacity: 0,
            ease: "power3.out",
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none none",
                once: true
            },
            delay: index * 0.15
        });
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.02,
                duration: 0.4,
                ease: "power2.out"
            });
            const miscNumber = item.querySelector('.misc-number');
            if (miscNumber) {
                gsap.to(miscNumber, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                duration: 0.4,
                ease: "power2.out"
            });
            const miscNumber = item.querySelector('.misc-number');
            if (miscNumber) {
                gsap.to(miscNumber, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });
}
function initHeroStrips() {
    const strips = document.querySelectorAll('.hero-strips .strip-text');
    if (!strips.length) return;
    strips.forEach((el, i) => {
        const dir = el.closest('.strip')?.classList.contains('reverse') ? -1 : 1;
        gsap.to(el, {
            xPercent: dir * -50,
            duration: 30 + i * 5,
            ease: 'none',
            repeat: -1
        });
    });
}
function initScrollContrast() {
    document.querySelectorAll('#about .about, #projects .project-description, #achievements .achievement-content p, #setup .misc-content, #contact .contact-info p').forEach(p => {
        p.classList.add('contrast-text');
    });
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('in-contrast', entry.isIntersecting);
        });
    }, { root: null, rootMargin: '-45% 0px -45% 0px', threshold: 0.01 });
    document.querySelectorAll('.contrast-text').forEach(el => io.observe(el));
}
function alignSkillsNumber() {
    const header = document.querySelector('#skills .section-header');
    if (!header) return;
    const title = header.querySelector('.section-title');
    const number = header.querySelector('.section-number');
    if (!title || !number) return;
    const headerTop = header.getBoundingClientRect().top + window.scrollY;
    const titleRect = title.getBoundingClientRect();
    const titleCenterInHeader = (titleRect.top + window.scrollY) - headerTop + (titleRect.height / 2);
    number.style.top = `${titleCenterInHeader}px`;
    number.style.transform = 'translateY(-50%)';
}
window.addEventListener('load', () => {
    alignSkillsNumber();
    setTimeout(alignSkillsNumber, 300);
});
window.addEventListener('resize', alignSkillsNumber);
if ('ResizeObserver' in window) {
    const skillsHeader = document.querySelector('#skills .section-header');
    if (skillsHeader) {
        const ro = new ResizeObserver(() => alignSkillsNumber());
        ro.observe(skillsHeader);
        const title = skillsHeader.querySelector('.section-title');
        if (title) ro.observe(title);
    }
}
// Menu removed: initOsmoMenu implementation deleted to remove sidebar menu feature
