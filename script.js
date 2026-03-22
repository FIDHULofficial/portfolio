/* ================================================================
   FIDHUL KRISHNA — script.js  (v3 — Unified)
   All behavior wired to: sound.js (SE), GitHub API, YouTube link.
   Section order: hero → about → timeline → skills → projects →
                  achievements → ventures → github → content →
                  social → contact
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Social & API constants ──────────────────────────────────── */
    const GH_USER = 'FIDHULoffcial';
    const GH_API_USER = `https://api.github.com/users/${GH_USER}`;
    const GH_API_REPOS = `https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=30`;
    const GH_CACHE_KEY = 'fk_gh_repos_v1';
    const GH_PROF_KEY = 'fk_gh_profile_v1';
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

    /* ── Language → GitHub official colour ──────────────────────── */
    const LANG_COLORS = {
        Python: '#3572A5', 'C++': '#f34b7d', C: '#555555',
        JavaScript: '#f1e05a', HTML: '#e34c26', CSS: '#563d7c',
        Shell: '#89e051', Makefile: '#427819', TypeScript: '#2b7489',
    };

    /* ================================================================
       0. AUDIO UNLOCK
          Browser won't allow AudioContext before a user gesture.
          We show a "TAP ANYWHERE FOR AUDIO" hint on the intro,
          and start the BGM on the first touch/click.
       ================================================================ */
    let audioUnlocked = false;
    const introTap = document.getElementById('introTap');

    function unlockAudio() {
        if (audioUnlocked) return;
        SE.unlock();
        SE.introBGM();       // cinematic score starts on first touch
        audioUnlocked = true;
        if (introTap) introTap.classList.add('tapped');
    }

    ['pointerdown', 'touchstart', 'keydown'].forEach(evt =>
        document.addEventListener(evt, unlockAudio, { once: false, passive: true })
    );

    /* ================================================================
       1. CINEMATIC INTRO  (visuals only at t=0, audio on first tap)
       ================================================================ */
    const intro = document.getElementById('intro');
    const introFirst = document.getElementById('introFirst');
    const introLast = document.getElementById('introLast');
    const introRule = document.getElementById('introRule');
    const introSub = document.getElementById('introSub');
    const introDots = document.getElementById('introDots');

    function runIntro() {
        // Step 1 (0s)    — FIDHUL rises slowly from below (1.6s CSS transition)
        setTimeout(() => introFirst.classList.add('show'), 0);

        // Step 2 (1.0s)  — KRISHNA rises
        setTimeout(() => introLast.classList.add('show'), 1000);

        // Step 3 (2.5s)  — HR rule draws left-to-right
        setTimeout(() => introRule.classList.add('show'), 2500);

        // Step 4 (3.1s)  — Subtitle rises
        setTimeout(() => introSub.classList.add('show'), 3100);

        // Step 5         — Name holds on screen (dramatic pause)

        // Step 6 (4.5s)  — Gold squares pulse in
        setTimeout(() => introDots.classList.add('show'), 4500);

        // Step 7 (5.0s)  — Fade out intro, reveal page
        setTimeout(() => {
            intro.classList.add('fade-out');
            setTimeout(() => {
                intro.classList.add('gone');
                document.body.classList.add('ready');
                // Kick off all IntersectionObservers
                revealEls.forEach(el => revealObserver.observe(el));
                statNumbers.forEach(el => counterObs.observe(el));
            }, 1000);
        }, 5000);
    }

    runIntro();

    /* ================================================================
       2. REVEAL OBSERVER  (fade-up on scroll)
       ================================================================ */
    const revealEls = document.querySelectorAll('.reveal');
    let revealObserver;

    // Stagger delay classes for grid children
    [
        '.about-grid', '.skills-groups', '.projects-grid',
        '.achievements-grid', '.contact-grid', '.timeline-list',
        '.gh-grid', '.yt-topic-grid', '.social-grid',
    ].forEach(sel => {
        const grid = document.querySelector(sel);
        if (!grid) return;
        [...grid.children].forEach((child, i) => {
            if (child.classList.contains('reveal'))
                child.classList.add(`reveal-d${(i % 4) + 1}`);
        });
    });

    let revealSoundThrottle = 0;

    revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
            const now = Date.now();
            if (now - revealSoundThrottle > 400) {
                SE.revealPing();
                revealSoundThrottle = now;
            }
        });
    }, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });

    // Observers started after intro (step 7 above)

    /* ================================================================
       3. COUNTER ANIMATION
       ================================================================ */
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    const counterObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            let current = 0;
            const step = Math.max(1, Math.ceil(target / 40));
            const timer = setInterval(() => {
                current = Math.min(current + step, target);
                el.textContent = current + (current >= target ? '+' : '');
                if (current >= target) clearInterval(timer);
            }, 28);
            counterObs.unobserve(el);
        });
    }, { threshold: 0.5 });

    /* ================================================================
       4. PROJECT FILTER
       ================================================================ */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            projectCards.forEach(card => {
                card.classList.toggle(
                    'hidden',
                    filter !== 'all' && card.getAttribute('data-category') !== filter
                );
            });
            SE.filterActivate();
        });
    });

    /* ================================================================
       5. NAVBAR — scroll shadow + active link highlight
       ================================================================ */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], .hero[id]');

    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 140) current = s.id;
        });
        navLinks.forEach(link =>
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`)
        );
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ================================================================
       6. HAMBURGER + MOBILE OVERLAY
       ================================================================ */
    const hamburger = document.getElementById('navHamburger');
    const overlay = document.getElementById('navOverlay');
    const overlayClose = document.getElementById('navOverlayClose');
    const overlayLinks = document.querySelectorAll('.nav-overlay-link');

    function openMenu() {
        overlay.classList.add('open');
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        SE.btnClick();
    }
    function closeMenu() {
        overlay.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        SE.navClick();
    }

    hamburger.addEventListener('click', () => overlay.classList.contains('open') ? closeMenu() : openMenu());
    overlayClose.addEventListener('click', closeMenu);
    overlayLinks.forEach(l => l.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

    /* ================================================================
       7. SMOOTH SCROLL
       ================================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });

    /* ================================================================
       8. SOUND WIRING
       ================================================================ */
    navLinks.forEach(l => l.addEventListener('click', () => SE.navClick()));
    document.querySelectorAll('.btn').forEach(b => b.addEventListener('click', () => SE.btnClick()));
    document.querySelectorAll('.contact-card').forEach(c => c.addEventListener('click', () => SE.btnClick()));
    document.querySelectorAll('.social-platform-card').forEach(c => c.addEventListener('click', () => SE.navClick()));

    let hoverThrottle = 0;
    function onHover() {
        const now = Date.now();
        if (now - hoverThrottle > 120) { SE.hoverBlip(); hoverThrottle = now; }
    }
    document.querySelectorAll('.glass-card, .chip, .hero-pill').forEach(el =>
        el.addEventListener('mouseenter', onHover)
    );

    // Mute button
    const muteBtn = document.getElementById('navSound');
    const muteIcon = document.getElementById('soundIcon');
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            unlockAudio();
            const isMuted = SE.toggle();
            muteIcon.className = isMuted ? 'fas fa-volume-xmark' : 'fas fa-volume-up';
            muteBtn.setAttribute('aria-label', isMuted ? 'Unmute sound' : 'Mute sound');
            muteBtn.classList.toggle('muted', isMuted);
        });
    }

    /* ================================================================
       9. GITHUB PROFILE FETCH
          Fetches user profile → populates:
            - sys.info avatar (#sysAvatar)
            - sys.info repo count (#sysRepos)
            - about stats followers (#ghFollowersStat)
            - social card (#ghRepoCount, #ghFollowerCount)
       ================================================================ */
    async function fetchGitHubProfile() {
        let profile = null;

        // Try cache first
        try {
            const cached = localStorage.getItem(GH_PROF_KEY);
            if (cached) {
                const { timestamp, data } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_TTL) profile = data;
            }
        } catch (_) { }

        // Fetch from API if no cache
        if (!profile) {
            try {
                const res = await fetch(GH_API_USER, {
                    headers: { Accept: 'application/vnd.github+json' },
                });
                if (res.ok) {
                    profile = await res.json();
                    localStorage.setItem(GH_PROF_KEY, JSON.stringify({ timestamp: Date.now(), data: profile }));
                }
            } catch (_) { }
        }

        if (!profile) return;

        // ── Populate sys.info avatar ────────────────────────────────
        const avatarWrap = document.getElementById('sysAvatar');
        if (avatarWrap && profile.avatar_url) {
            avatarWrap.innerHTML = `
        <img class="sys-avatar"
             src="${profile.avatar_url}"
             alt="Fidhul Krishna — GitHub avatar"
             loading="lazy">`;
        }

        // ── Repo count in sys.info ──────────────────────────────────
        const sysRepos = document.getElementById('sysRepos');
        if (sysRepos) sysRepos.textContent = profile.public_repos || '—';

        // ── Followers in about stats ────────────────────────────────
        const followersStat = document.getElementById('ghFollowersStat');
        if (followersStat) {
            followersStat.textContent = profile.followers || '—';
            followersStat.removeAttribute('data-count'); // prevent counter override
        }

        // ── Social card stats ───────────────────────────────────────
        const ghRepoCount = document.getElementById('ghRepoCount');
        const ghFollowerCount = document.getElementById('ghFollowerCount');
        if (ghRepoCount) ghRepoCount.textContent = profile.public_repos || '—';
        if (ghFollowerCount) ghFollowerCount.textContent = profile.followers || '—';
    }

    fetchGitHubProfile();

    /* ================================================================
       10. GITHUB REPOS FETCH
           Fetches public repos → renders cards in #ghGrid.
           24h localStorage cache. Auto-refreshes on next visit.
       ================================================================ */
    const ghGrid = document.getElementById('ghGrid');
    const ghStatus = document.getElementById('ghStatusText');
    const ghCacheTime = document.getElementById('ghCacheTime');
    const ghDot = document.getElementById('ghDot');

    function relTime(dateStr) {
        const days = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
        if (days === 0) return 'today';
        if (days === 1) return '1d ago';
        if (days < 30) return `${days}d ago`;
        if (days < 365) return `${Math.floor(days / 30)}mo ago`;
        return `${Math.floor(days / 365)}y ago`;
    }

    function buildRepoCard(repo) {
        const color = LANG_COLORS[repo.language] || 'rgba(244,240,232,0.25)';
        const card = document.createElement('a');
        card.className = 'glass-card gh-card reveal';
        card.href = repo.html_url;
        card.target = '_blank';
        card.rel = 'noopener';
        card.setAttribute('aria-label', `Repo: ${repo.name}`);
        card.innerHTML = `
      <div class="gh-card-top">
        <i class="fab fa-github gh-card-icon" aria-hidden="true"></i>
        <span class="gh-repo-name">${repo.name}</span>
      </div>
      <p class="gh-repo-desc">${repo.description || 'No description provided.'}</p>
      <div class="gh-card-footer">
        ${repo.language ? `<span class="gh-lang"><span class="gh-lang-dot" style="background:${color}"></span>${repo.language}</span>` : ''}
        <span class="gh-stars"><i class="fas fa-star"></i>${repo.stargazers_count}</span>
        <span class="gh-updated">${relTime(repo.updated_at)}</span>
      </div>`;
        card.addEventListener('mouseenter', onHover);
        card.addEventListener('click', () => SE.navClick());
        return card;
    }

    function renderRepos(repos) {
        ghGrid.innerHTML = '';
        const list = repos.filter(r => !r.fork).slice(0, 12);
        if (!list.length) {
            ghGrid.innerHTML = '<p class="gh-empty">No public repositories found.</p>';
            return;
        }
        list.forEach((repo, i) => {
            const card = buildRepoCard(repo);
            card.classList.add(`reveal-d${(i % 4) + 1}`);
            ghGrid.appendChild(card);
            revealObserver.observe(card);
        });
        if (ghStatus) ghStatus.textContent = `${list.length} REPOSITORIES`;
        if (ghDot) ghDot.classList.remove('error');
    }

    async function fetchRepos() {
        // Try cache
        try {
            const cached = localStorage.getItem(GH_CACHE_KEY);
            if (cached) {
                const { timestamp, data } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_TTL) {
                    renderRepos(data);
                    const age = Math.round((Date.now() - timestamp) / 60000);
                    if (ghCacheTime) ghCacheTime.textContent = `CACHED ${age}MIN AGO`;
                    return;
                }
            }
        } catch (_) { }

        // Live fetch
        try {
            if (ghStatus) ghStatus.textContent = 'CONNECTING TO GITHUB…';
            const res = await fetch(GH_API_REPOS, {
                headers: { Accept: 'application/vnd.github+json' },
            });
            if (!res.ok) throw new Error(res.status);
            const data = await res.json();
            localStorage.setItem(GH_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
            renderRepos(data);
            if (ghCacheTime) ghCacheTime.textContent = 'LIVE — REFRESHES DAILY';
        } catch (err) {
            console.warn('[GH repos]', err);
            if (ghStatus) ghStatus.textContent = 'GITHUB UNAVAILABLE';
            if (ghDot) ghDot.classList.add('error');
            if (ghGrid) ghGrid.innerHTML = '<p class="gh-empty">Repositories will appear when network is available.</p>';
        }
    }

    fetchRepos();

});
