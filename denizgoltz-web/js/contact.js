/* -------------------------------------------------------
   contact.js — All interactivity for the contact page
------------------------------------------------------- */

// -------------------------------------------------------
// 1. PAGE LOADER
// -------------------------------------------------------
(function initLoader() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('pageLoader');
      if (loader) loader.classList.add('loaded');
    }, 1600);
  });
})();

// -------------------------------------------------------
// 2. CUSTOM CURSOR
// -------------------------------------------------------
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  const ease = 0.12;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * ease;
    ringY += (mouseY - ringY) * ease;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = 'a, button, input, textarea, .form-chip, .time-slot, .form-checkbox-label';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();

// -------------------------------------------------------
// 3. SCROLL PROGRESS BAR
// -------------------------------------------------------
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPct    = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = scrollPct + '%';
  }, { passive: true });
})();

// -------------------------------------------------------
// 4. HEADER SCROLL EFFECT
// -------------------------------------------------------
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

// -------------------------------------------------------
// 5. MOBILE NAV BURGER
// -------------------------------------------------------
(function initMobileNav() {
  const burger    = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  if (!burger || !mobileNav) return;

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('active');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

// -------------------------------------------------------
// 6. CANVAS BACKGROUND (particles + grid)
// -------------------------------------------------------
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  const particles = [];
  const PARTICLE_COUNT = 55;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomRange(a, b) { return a + Math.random() * (b - a); }

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x  = randomRange(0, W);
      this.y  = initial ? randomRange(0, H) : H + 10;
      this.r  = randomRange(0.5, 2);
      this.vy = -randomRange(0.1, 0.5);
      this.vx = randomRange(-0.08, 0.08);
      this.alpha = randomRange(0.1, 0.5);
      this.blue  = Math.random() > 0.5;
    }
    update() {
      this.y += this.vy;
      this.x += this.vx;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.blue
        ? `rgba(56, 190, 255, ${this.alpha})`
        : `rgba(168, 85, 247, ${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  }

  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth   = 1;
    const spacing   = 80;

    for (let x = 0; x <= W; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y <= H; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  resize();
  initParticles();
  animate();

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });
})();

// -------------------------------------------------------
// 7. SCROLL REVEAL
// -------------------------------------------------------
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
})();

// -------------------------------------------------------
// 8. MULTI-STEP FORM
// -------------------------------------------------------
(function initMultiStepForm() {

  let currentStep = 1;
  const totalSteps = 3;

  // ---- STEP NAVIGATION ----
  function goToStep(targetStep, backwards) {
    const currentPage = document.getElementById('step' + currentStep);
    const targetPage  = document.getElementById('step' + targetStep);
    if (!currentPage || !targetPage) return;

    // Animate out
    currentPage.style.display = 'flex';
    currentPage.style.animation = backwards
      ? 'pageIn 0.3s ease reverse'
      : 'pageOut 0.3s ease forwards';

    setTimeout(() => {
      currentPage.classList.remove('active');
      currentPage.style.animation = '';
      currentPage.style.display   = '';

      targetPage.classList.add('active');
      targetPage.style.animation = backwards ? 'pageInBack 0.45s cubic-bezier(0.16,1,0.3,1) both' : '';

      currentStep = targetStep;
      updateStepIndicator();
    }, 280);
  }

  function updateStepIndicator() {
    const steps = document.querySelectorAll('.form-step');
    const lines  = document.querySelectorAll('.form-step__line');

    steps.forEach((step, idx) => {
      const stepNum = idx + 1; // steps are separated by lines so index 0=step1
      step.classList.remove('active', 'completed');
      if (stepNum < currentStep)  step.classList.add('completed');
      if (stepNum === currentStep) step.classList.add('active');
    });

    // Fill step lines
    lines.forEach((line, idx) => {
      line.classList.toggle('filled', idx < currentStep - 1);
    });
  }

  // ---- NEXT BUTTONS ----
  document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.dataset.target);
      if (!validateStep(currentStep)) return;
      goToStep(target, false);
    });
  });

  // ---- BACK BUTTONS ----
  document.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.dataset.target);
      goToStep(target, true);
    });
  });

  // ---- SUBMIT ----
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      if (!validateStep(3)) return;
      handleSubmit();
    });
  }

  // ---- VALIDATION ----
  function validateStep(step) {
    if (step === 1) {
      const firstName = document.getElementById('firstName');
      const email     = document.getElementById('email');
      let valid = true;

      if (!firstName.value.trim()) {
        shakeInput(firstName);
        valid = false;
      }
      if (!email.value.trim() || !email.value.includes('@')) {
        shakeInput(email);
        valid = false;
      }
      return valid;
    }

    if (step === 3) {
      const privacy = document.getElementById('privacy');
      if (!privacy.checked) {
        shakeEl(privacy.closest('.form-checkbox-label'));
        return false;
      }
    }
    return true;
  }

  function shakeInput(input) {
    input.classList.add('error');
    shakeEl(input);
    input.addEventListener('input', () => input.classList.remove('error'), { once: true });
  }

  function shakeEl(el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both';
    el.addEventListener('animationend', () => el.style.animation = '', { once: true });
  }

  // Inject shake keyframe if not present
  if (!document.getElementById('shakeStyle')) {
    const s = document.createElement('style');
    s.id = 'shakeStyle';
    s.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(s);
  }

  // ---- SUBMIT HANDLER ----
  function handleSubmit() {
    const btn      = document.getElementById('submitBtn');
    const textEl   = btn.querySelector('.btn-submit-text');
    const loadEl   = btn.querySelector('.btn-submit-loading');

    // Fake loading state
    textEl.style.display = 'none';
    loadEl.style.display = 'inline';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      showSuccess();
    }, 1800);
  }

  function showSuccess() {
    const formEl    = document.getElementById('contactForm');
    const successEl = document.getElementById('formSuccess');
    const stepsEl   = document.getElementById('formSteps');

    if (formEl)    formEl.style.display    = 'none';
    if (stepsEl)   stepsEl.style.display   = 'none';

    if (successEl) {
      successEl.classList.add('visible');
      spawnConfetti(successEl);
    }
  }

})();

// -------------------------------------------------------
// 9. CHIP SELECTORS
// -------------------------------------------------------
(function initChips() {
  // Service chips — multi-select
  document.querySelectorAll('#serviceChips .form-chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('selected'));
  });

  // Channel chips — single select
  document.querySelectorAll('#channelChips .form-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#channelChips .form-chip')
        .forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });

  // Time slots — single select
  document.querySelectorAll('#timeSlots .time-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      document.querySelectorAll('#timeSlots .time-slot')
        .forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
    });
  });
})();

// -------------------------------------------------------
// 10. BUDGET SLIDER
// -------------------------------------------------------
(function initBudgetSlider() {
  const slider  = document.getElementById('budgetSlider');
  const display = document.getElementById('budgetDisplay');
  if (!slider || !display) return;

  const labels = [
    '< 1.000 €',
    '1.000 – 3.000 €',
    '3.000 – 5.000 €',
    '5.000 – 10.000 €',
    '10.000 – 20.000 €',
    '> 20.000 €'
  ];

  function updateSlider() {
    const val = parseInt(slider.value);
    display.textContent = labels[val];

    // Update track fill
    const pct = (val / (labels.length - 1)) * 100;
    slider.style.background = `linear-gradient(to right, #38beff ${pct}%, rgba(255,255,255,0.08) ${pct}%)`;

    // Trigger pop animation
    display.style.animation = 'none';
    display.offsetHeight;
    display.style.animation = 'budgetPop 0.3s cubic-bezier(0.16,1,0.3,1) both';
  }

  slider.addEventListener('input', updateSlider);
  updateSlider();
})();

// -------------------------------------------------------
// 11. TEXTAREA CHARACTER COUNTER
// -------------------------------------------------------
(function initTextareaCounter() {
  const textarea  = document.getElementById('message');
  const charCount = document.getElementById('charCount');
  if (!textarea || !charCount) return;

  const maxLen = 500;
  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    charCount.textContent = len;
    charCount.style.color = len > maxLen * 0.9 ? '#f87171' : '';
    if (textarea.value.length > maxLen) {
      textarea.value = textarea.value.substring(0, maxLen);
    }
  });
})();

// -------------------------------------------------------
// 12. CONFETTI BURST
// -------------------------------------------------------
function spawnConfetti(container) {
  const colors = ['#38beff', '#a855f7', '#06e5d5', '#f59e0b', '#f472b6'];
  for (let i = 0; i < 40; i++) {
    const p  = document.createElement('div');
    p.className = 'confetti-particle';

    const angle  = Math.random() * Math.PI * 2;
    const dist   = 60 + Math.random() * 120;
    const tx     = Math.cos(angle) * dist;
    const ty     = Math.sin(angle) * dist - 60;
    const rot    = Math.random() * 720 - 360;
    const color  = colors[Math.floor(Math.random() * colors.length)];
    const delay  = Math.random() * 0.3;
    const size   = 4 + Math.random() * 8;

    p.style.cssText = `
      background: ${color};
      width: ${size}px;
      height: ${size}px;
      left: 50%;
      top: 30%;
      --tx: ${tx}px;
      --ty: ${ty}px;
      --rot: ${rot}deg;
      animation-delay: ${delay}s;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    container.appendChild(p);

    setTimeout(() => p.remove(), 2000);
  }
}

// -------------------------------------------------------
// 13. FLOATING PARTICLES (CSS-driven via inline vars)
// -------------------------------------------------------
(function injectParticles() {
  const section = document.querySelector('.contact-hero');
  if (!section) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'contact-particle';

    const size  = 2 + Math.random() * 5;
    const x     = Math.random() * 100;
    const y     = Math.random() * 100;
    const moveY = (-20 - Math.random() * 40) + 'px';
    const moveX = (Math.random() * 30 - 15) + 'px';
    const dur   = (8 + Math.random() * 10) + 's';
    const delay = (-Math.random() * 15) + 's';
    const op    = 0.1 + Math.random() * 0.3;
    const blue  = Math.random() > 0.5;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${y}%;
      background: ${blue ? 'rgba(56,190,255,1)' : 'rgba(168,85,247,1)'};
      --moveY: ${moveY};
      --moveX: ${moveX};
      --dur: ${dur};
      --delay: ${delay};
      --op: ${op};
    `;
    section.appendChild(p);
  }
})();

// -------------------------------------------------------
// 14. INPUT FLOAT LABEL EFFECT (subtle focus glow pulse)
// -------------------------------------------------------
(function initInputEffects() {
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
      const wrap = input.closest('.form-input-wrap, .form-textarea-wrap');
      if (wrap) {
        wrap.style.transition = 'transform 0.3s ease';
        wrap.style.transform  = 'scale(1.01)';
      }
    });
    input.addEventListener('blur', () => {
      const wrap = input.closest('.form-input-wrap, .form-textarea-wrap');
      if (wrap) wrap.style.transform = 'scale(1)';
    });
  });
})();

// -------------------------------------------------------
// 15. MAGNETIC BUTTON EFFECT (subtle, on primary CTA)
// -------------------------------------------------------
(function initMagneticButtons() {
  document.querySelectorAll('.btn--primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * 0.25;
      const dy   = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();
