/* ================================================
   FIDHUL KRISHNA — PORTFOLIO JS
   Particles, Scroll FX, Parallax & Interactivity
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== TYPEWRITER =====
    const greetEl = document.getElementById('heroGreeting');
    const greetText = "Hello, I'm";
    let charIndex = 0;
    function typeWriter() {
        if (charIndex < greetText.length) {
            greetEl.textContent += greetText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 80);
        }
    }
    setTimeout(typeWriter, 600);

    // ===== MOUSE TRACKING (for particles) =====
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // ===== CHATBOT =====
    const chatbotWidget = document.getElementById('chatbot');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotPanel = document.getElementById('chatbotPanel');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');

    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', () => chatbotWidget.classList.add('open'));
        chatbotClose.addEventListener('click', () => chatbotWidget.classList.remove('open'));

        function addMessage(text, sender) {
            const msg = document.createElement('div');
            msg.className = `chat-msg ${sender}`;
            msg.innerHTML = `<div class="chat-bubble">${text}</div>`;
            chatbotMessages.appendChild(msg);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        function showTyping() {
            const typing = document.createElement('div');
            typing.className = 'chat-msg bot';
            typing.id = 'typing-indicator';
            typing.innerHTML = '<div class="chat-bubble" style="opacity:0.5">Typing...</div>';
            chatbotMessages.appendChild(typing);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        function removeTyping() {
            const t = document.getElementById('typing-indicator');
            if (t) t.remove();
        }

        function getBotResponse(msg) {
            const q = msg.toLowerCase();
            if (q.includes('project') || q.includes('built') || q.includes('work'))
                return "Fidhul has built amazing things! 🔥 His key projects include an Automated Pharmacy Robot, a Mobile Phone Home Lab, Iron Man Hand Gesture Control using Python + OpenCV, a Mini Desktop Robot, a Smart Farming System, and a Landslide & Earthquake Predictor. Check the Projects section for details!";
            if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('know'))
                return "Fidhul's tech arsenal includes ESP32 & IoT, Python, Arduino & Hardware, Device Engineering, Vibe Coding, and Video Editing & Music production. He builds everything from scratch! 🛠️";
            if (q.includes('contact') || q.includes('reach') || q.includes('email') || q.includes('mail'))
                return "You can reach Fidhul at: 📧 fidhul1krishna@gmail.com, or connect on GitHub, Instagram, LinkedIn, and YouTube. Check the Contact section below!";
            if (q.includes('github'))
                return "Find Fidhul on GitHub: <a href='https://github.com/FIDHULoffcial' target='_blank' style='color:#e8912c'>github.com/FIDHULoffcial</a> 🚀";
            if (q.includes('instagram') || q.includes('insta'))
                return "Follow Fidhul on Instagram: <a href='https://www.instagram.com/FIDHUL_KRISHNA/' target='_blank' style='color:#e8912c'>@FIDHUL_KRISHNA</a> 📸";
            if (q.includes('youtube') || q.includes('channel') || q.includes('video'))
                return "Check out Fidhul's YouTube channel: <a href='https://youtube.com/@fidhul_offcial' target='_blank' style='color:#e8912c'>Fidhul Official</a> 🎬 — Tech, gaming, and innovation content!";
            if (q.includes('esp32') || q.includes('iot') || q.includes('arduino'))
                return "ESP32 is Fidhul's weapon of choice! He uses it for IoT projects, sensor networks, and smart systems. Combined with Arduino for circuit design and motor control. 🤖";
            if (q.includes('iron man') || q.includes('gesture') || q.includes('hand'))
                return "The Iron Man Hand Gesture Control system uses Python, OpenCV, and MediaPipe to turn your bare hand into a mouse — just like Tony Stark! 🦾";
            if (q.includes('zorift') || q.includes('startup') || q.includes('venture') || q.includes('company'))
                return "Fidhul founded Zorift — a tech startup building tools for creators, students, and indie developers. It's currently in the active building phase! 🚀";
            if (q.includes('sparkathon') || q.includes('achievement') || q.includes('prize') || q.includes('award'))
                return "Fidhul won 1st Prize at Sparkathon! 🏆 He's also participated in science fairs and tech exhibitions, impressing everyone with his innovative projects.";
            if (q.includes('hello') || q.includes('hi') || q.includes('hey'))
                return "Hey there! 👋 What would you like to know about Fidhul? I can tell you about his projects, skills, or how to get in touch!";
            if (q.includes('who') || q.includes('about') || q.includes('fidhul'))
                return "Fidhul Krishna is an IoT Developer, Device Engineer, Vibe Coder, and Founder of Zorift. He builds the future with ESP32, one project at a time. He's also a content creator on YouTube! ⚡";
            if (q.includes('thank'))
                return "You're welcome! 😊 Feel free to explore the portfolio and reach out anytime!";
            return "Interesting! 🤔 Try asking about Fidhul's projects, skills, social links, Zorift, or achievements — I know all about them!";
        }

        function handleSend() {
            const text = chatbotInput.value.trim();
            if (!text) return;
            addMessage(text, 'user');
            chatbotInput.value = '';
            showTyping();
            setTimeout(() => {
                removeTyping();
                addMessage(getBotResponse(text), 'bot');
            }, 600 + Math.random() * 400);
        }

        chatbotSend.addEventListener('click', handleSend);
        chatbotInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });
    }

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar bg
        navbar.classList.toggle('scrolled', scrollY > 60);

        // Active section highlight
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (scrollY >= top) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ===== MOBILE NAV TOGGLE =====
    const navToggle = document.getElementById('navToggle');
    const navLinksEl = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksEl.classList.toggle('open');
    });

    navLinksEl.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksEl.classList.remove('open');
        });
    });

    // ===== SCROLL REVEAL =====
    const revealElements = document.querySelectorAll(
        '.glass-card, .section-header, .project-filters, .scroll-indicator, .hero-content, .stat-item'
    );
    revealElements.forEach((el, i) => {
        el.classList.add('reveal');
        const delayClass = `reveal-delay-${(i % 4) + 1}`;
        el.classList.add(delayClass);
    });
    // Hero content should be visible immediately
    document.querySelector('.hero-content')?.classList.add('visible');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ===== STAT COUNTER ANIMATION =====
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                let current = 0;
                const duration = 1500;
                const step = Math.max(1, Math.floor(target / (duration / 30)));
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = current + '+';
                }, 30);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(num => counterObserver.observe(num));

    // ===== SKILL BAR ANIMATION =====
    const skillFills = document.querySelectorAll('.skill-fill');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.getAttribute('data-level');
                entry.target.style.width = level + '%';
            }
        });
    }, { threshold: 0.5 });
    skillFills.forEach(fill => skillObserver.observe(fill));

    // ===== PROJECT FILTER =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            projectCards.forEach((card, i) => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = `fadeInUp 0.5s ${i * 0.08}s ease both`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ===== HERO PARALLAX =====
    const heroBg = document.querySelector('.hero-bg-image');
    const heroOverlay = document.querySelector('.hero-overlay');
    if (heroBg) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            heroBg.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
            if (heroOverlay) {
                heroOverlay.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
            }
        });
    }

    // ===== MAGNETIC BUTTONS =====
    document.querySelectorAll('.btn-primary, .btn-glass').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // ===== PARTICLE SYSTEM =====
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let hueShift = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 1;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.25;
            this.baseHue = Math.random() > 0.6 ? 25 : (Math.random() > 0.5 ? 12 : 35); // amber, orange-red, gold
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.x += dx * force * 0.02;
                this.y += dy * force * 0.02;
            }

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            const hue = (this.baseHue + hueShift * 0.3) % 360;
            ctx.save();
            ctx.shadowBlur = 8;
            ctx.shadowColor = `hsla(${hue}, 90%, 55%, ${this.opacity * 0.6})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 90%, 60%, ${this.opacity})`;
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize particles
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const opacity = (1 - dist / 120) * 0.18;
                    const hue = (25 + hueShift * 0.3) % 360;
                    ctx.strokeStyle = `hsla(${hue}, 80%, 50%, ${opacity})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hueShift = (hueShift + 0.05) % 360; // Very slow color drift
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        animationId = requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ===== TILT EFFECT ON CARDS =====
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -4;
            const rotateY = (x - centerX) / centerX * 4;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ===== FADE-IN-UP ANIMATION KEYFRAMES =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // ===== SMOOTH SECTION SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
