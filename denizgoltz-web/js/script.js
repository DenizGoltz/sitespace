/**
 * ============================================================
 * WEBDESIGNER PORTFOLIO — script.js
 * Version: 1.0
 * ============================================================
 */

/* -------------------------------------------------------
   1. PAGE LOADER
------------------------------------------------------- */
(function initLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;

  // Simulate loading and fade out after 1.4s
  window.addEventListener('load', function () {
    setTimeout(function () {
      loader.classList.add('loaded');
    }, 1400);
  });
})();

/* -------------------------------------------------------
   2. CUSTOM CURSOR
------------------------------------------------------- */
(function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  let animFrame;

  // Update dot position immediately
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Lag ring slightly behind for smooth feel
  function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    animFrame = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  var interactiveEls = document.querySelectorAll('a, button, .btn, .ref-card, .filter-tab, .service-card, .client-logo-card');
  interactiveEls.forEach(function (el) {
    el.addEventListener('mouseenter', function () { ring.classList.add('hovered'); });
    el.addEventListener('mouseleave', function () { ring.classList.remove('hovered'); });
  });

  // Hide on mouseleave
  document.addEventListener('mouseleave', function () {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

/* -------------------------------------------------------
   3. SCROLL PROGRESS BAR
------------------------------------------------------- */
(function initScrollProgress() {
  var bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', function () {
    var scrollTop  = window.scrollY;
    var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    var progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
})();

/* -------------------------------------------------------
   4. HEADER SCROLL BEHAVIOR
------------------------------------------------------- */
(function initHeader() {
  var header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
})();

/* -------------------------------------------------------
   5. BURGER / MOBILE NAV
------------------------------------------------------- */
(function initMobileNav() {
  var burger    = document.querySelector('.burger');
  var mobileNav = document.querySelector('.mobile-nav');
  if (!burger || !mobileNav) return;

  burger.addEventListener('click', function () {
    var isOpen = burger.classList.toggle('active');
    mobileNav.classList.toggle('open', isOpen);
    // Prevent body scroll when nav is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when a link is clicked
  var mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link');
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      burger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      burger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

/* -------------------------------------------------------
   6. ACTIVE NAV LINK
------------------------------------------------------- */
(function initActiveNav() {
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  var navLinks = document.querySelectorAll('.nav__link, .mobile-nav__link');
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href === currentPath) {
      link.classList.add('active');
    }
  });
})();

/* -------------------------------------------------------
   7. CANVAS — STAR FIELD + BLACKHOLE EFFECT
------------------------------------------------------- */
(function initCanvas() {
  var canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var stars  = [];
  var particles = []; // swirling particles near center
  var mouseX = 0, mouseY = 0;
  var W, H, cx, cy;

  // Config
  var STAR_COUNT       = 280;
  var PARTICLE_COUNT   = 60;
  var BH_RADIUS        = 80;       // blackhole event horizon radius
  var BH_PULL_RADIUS   = 280;      // how far the pull is felt

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cx = W / 2;
    cy = H / 2;
    initStars();
    initParticles();
  }

  // Star object
  function createStar() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      opacity: Math.random() * 0.6 + 0.1,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
      speedX: (Math.random() - 0.5) * 0.08,
      speedY: (Math.random() - 0.5) * 0.08,
    };
  }

  function initStars() {
    stars = [];
    for (var i = 0; i < STAR_COUNT; i++) {
      stars.push(createStar());
    }
  }

  // Swirling particle for blackhole
  function createParticle() {
    var angle  = Math.random() * Math.PI * 2;
    var dist   = BH_RADIUS + Math.random() * (BH_PULL_RADIUS - BH_RADIUS);
    return {
      angle: angle,
      dist: dist,
      speed: (0.005 + Math.random() * 0.015) * (Math.random() < 0.5 ? 1 : -1),
      r: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() < 0.5 ? '56, 190, 255' : '168, 85, 247',
    };
  }

  function initParticles() {
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  var frame = 0;
  function draw() {
    frame++;
    ctx.clearRect(0, 0, W, H);

    // Deep background fill
    var bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.8);
    bgGrad.addColorStop(0, 'rgba(8, 4, 22, 1)');
    bgGrad.addColorStop(0.4, 'rgba(3, 3, 10, 1)');
    bgGrad.addColorStop(1, 'rgba(2, 2, 8, 1)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle mouse parallax shift
    var shiftX = (mouseX - cx) * 0.01;
    var shiftY = (mouseY - cy) * 0.01;

    // --- Draw Stars ---
    stars.forEach(function (s) {
      s.twinklePhase += s.twinkleSpeed;
      var twinkle = 0.5 + 0.5 * Math.sin(s.twinklePhase);
      var opacity = s.opacity * twinkle;

      s.x += s.speedX + shiftX * 0.05;
      s.y += s.speedY + shiftY * 0.05;

      // Wrap around
      if (s.x < 0) s.x = W;
      if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H;
      if (s.y > H) s.y = 0;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200, 210, 255, ' + opacity + ')';
      ctx.fill();
    });

    // --- Blackhole glow rings ---
    var bhX = cx + shiftX * 2;
    var bhY = cy + shiftY * 2;

    // Outer glow
    var outerGlow = ctx.createRadialGradient(bhX, bhY, BH_RADIUS * 0.5, bhX, bhY, BH_PULL_RADIUS);
    outerGlow.addColorStop(0, 'rgba(168, 85, 247, 0.04)');
    outerGlow.addColorStop(0.3, 'rgba(56, 190, 255, 0.05)');
    outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(bhX, bhY, BH_PULL_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Accretion disk rings
    var ringCount = 5;
    for (var r = 0; r < ringCount; r++) {
      var rRatio = r / ringCount;
      var ringR  = BH_RADIUS + rRatio * (BH_PULL_RADIUS * 0.55);
      var ringOpacity = (1 - rRatio) * 0.18;
      var hue = r % 2 === 0 ? '56, 190, 255' : '168, 85, 247';

      ctx.beginPath();
      ctx.ellipse(bhX, bhY, ringR, ringR * 0.28, frame * 0.002, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(' + hue + ', ' + ringOpacity + ')';
      ctx.lineWidth = 1.5 - rRatio;
      ctx.stroke();
    }

    // Core — black center
    var coreGrad = ctx.createRadialGradient(bhX, bhY, 0, bhX, bhY, BH_RADIUS);
    coreGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    coreGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.95)');
    coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(bhX, bhY, BH_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Inner neon rim
    var rimGrad = ctx.createRadialGradient(bhX, bhY, BH_RADIUS * 0.7, bhX, bhY, BH_RADIUS * 1.1);
    rimGrad.addColorStop(0, 'rgba(56, 190, 255, 0.0)');
    rimGrad.addColorStop(0.6, 'rgba(56, 190, 255, 0.18)');
    rimGrad.addColorStop(1, 'rgba(168, 85, 247, 0.0)');
    ctx.strokeStyle = rimGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bhX, bhY, BH_RADIUS, 0, Math.PI * 2);
    ctx.stroke();

    // --- Swirling particles ---
    particles.forEach(function (p) {
      p.angle += p.speed;
      // Particles slowly spiral inward
      p.dist -= 0.03;
      if (p.dist < BH_RADIUS * 0.8) {
        // Reset particle from outer edge
        p.dist = BH_PULL_RADIUS * (0.7 + Math.random() * 0.3);
      }

      var px = bhX + Math.cos(p.angle) * p.dist;
      var py = bhY + Math.sin(p.angle) * p.dist * 0.4;

      // Fade near center
      var distRatio = (p.dist - BH_RADIUS) / (BH_PULL_RADIUS - BH_RADIUS);
      var alpha = p.opacity * Math.min(distRatio * 2, 1);

      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.hue + ', ' + alpha + ')';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  resize();
  draw();
})();

/* -------------------------------------------------------
   8. SCROLL REVEAL
------------------------------------------------------- */
(function initScrollReveal() {
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  // Use IntersectionObserver for performance
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  reveals.forEach(function (el) {
    observer.observe(el);
  });
})();

/* -------------------------------------------------------
   9. PARALLAX SCROLL (subtle)
------------------------------------------------------- */
(function initParallax() {
  var parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  function onScroll() {
    var scrollY = window.scrollY;
    parallaxEls.forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
      el.style.transform = 'translateY(' + scrollY * speed + 'px)';
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* -------------------------------------------------------
   10. REFERENCE CARD FILTER TABS
------------------------------------------------------- */
(function initFilterTabs() {
  var tabs = document.querySelectorAll('.filter-tab');
  var cards = document.querySelectorAll('.ref-card[data-category]');
  if (!tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      // Update active tab
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      var filter = tab.getAttribute('data-filter');

      cards.forEach(function (card) {
        var category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          // Trigger re-reveal
          setTimeout(function () {
            card.classList.add('revealed');
          }, 50);
        } else {
          card.style.display = 'none';
          card.classList.remove('revealed');
        }
      });
    });
  });
})();

/* -------------------------------------------------------
   11. FLOATING ELEMENTS MOUSE INTERACTION
------------------------------------------------------- */
(function initMouseFloat() {
  var floats = document.querySelectorAll('.hero__float-badge');
  if (!floats.length) return;

  document.addEventListener('mousemove', function (e) {
    var x = (e.clientX / window.innerWidth  - 0.5) * 12;
    var y = (e.clientY / window.innerHeight - 0.5) * 12;

    floats.forEach(function (el, i) {
      var factor = (i + 1) * 0.5;
      el.style.transform = 'translate(' + x * factor + 'px, ' + y * factor + 'px)';
    });
  });
})();

/* -------------------------------------------------------
   12. SMOOTH ANCHOR SCROLLING
------------------------------------------------------- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* -------------------------------------------------------
   13. MARQUEE DUPLICATE (for seamless loop)
------------------------------------------------------- */
(function initMarquee() {
  var track = document.querySelector('.marquee-track');
  if (!track) return;

  // Duplicate content for seamless loop
  var clone = track.cloneNode(true);
  track.parentElement.appendChild(clone);
})();

/* -------------------------------------------------------
   14. NEWSLETTER FORM (simple feedback)
------------------------------------------------------- */
(function initNewsletter() {
  var btn = document.querySelector('.footer__newsletter-btn');
  var input = document.querySelector('.footer__newsletter-input');
  if (!btn || !input) return;

  btn.addEventListener('click', function () {
    var val = input.value.trim();
    if (!val || !val.includes('@')) {
      input.style.borderColor = '#ef4444';
      input.placeholder = 'Bitte gültige E-Mail eingeben';
      setTimeout(function () {
        input.style.borderColor = '';
        input.placeholder = 'Deine E-Mail Adresse';
      }, 2000);
      return;
    }
    // Success state
    btn.textContent = '✓ Angemeldet!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    input.value = '';
    setTimeout(function () {
      btn.textContent = 'Abonnieren';
      btn.style.background = '';
    }, 3000);
  });
})();
