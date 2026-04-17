// === THABO THE CAR DEALER — MAIN JS ===

(function () {
  'use strict';

  // ─── MOBILE MENU ───
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('navLinks');
  const headerEl   = document.querySelector('header');

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMenu() {
    // Sync panel top to actual header height (handles resize / different screens)
    if (headerEl) navLinks.style.top = headerEl.offsetHeight + 'px';
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Close on any nav link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (navLinks.classList.contains('open') &&
          !hamburger.contains(e.target) &&
          !navLinks.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
    });

    // Re-sync on resize (e.g. orientation change)
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  // ─── STICKY HEADER SCROLL STATE ───
  if (headerEl) {
    function updateHeaderState() {
      if (window.scrollY > 14) {
        headerEl.classList.add('scrolled');
      } else {
        headerEl.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', updateHeaderState, { passive: true });
    updateHeaderState();
  }

  // ─── IMAGE GALLERY (detail page) ───
  const galleryMain   = document.getElementById('galleryMain');
  const galleryThumbs = document.getElementById('galleryThumbs');
  const prevBtn       = document.getElementById('prevBtn');
  const nextBtn       = document.getElementById('nextBtn');
  const counterEl     = document.getElementById('galleryCounter');

  if (galleryMain) {
    const images = Array.from(galleryMain.querySelectorAll('img'));
    const thumbs = galleryThumbs ? Array.from(galleryThumbs.querySelectorAll('.gallery-thumb')) : [];
    let current  = 0;
    const total  = images.length;

    function goTo(index) {
      images[current].classList.remove('active');
      if (thumbs[current]) thumbs[current].classList.remove('active');

      current = (index + total) % total;

      images[current].classList.add('active');
      if (thumbs[current]) {
        thumbs[current].classList.add('active');
        thumbs[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }

      if (counterEl) counterEl.textContent = (current + 1) + ' / ' + total;
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        goTo(parseInt(thumb.getAttribute('data-index'), 10));
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    // Touch / swipe support
    let touchStartX = 0;
    galleryMain.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    galleryMain.addEventListener('touchend', function (e) {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? goTo(current + 1) : goTo(current - 1);
      }
    }, { passive: true });
  }

  // ─── SMOOTH SCROLL for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── ACTIVE NAV on scroll (index page only) ───
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navItems.length) {
    function updateActiveNav() {
      let current = '';
      sections.forEach(function (section) {
        if (window.scrollY >= section.offsetTop - 100) {
          current = section.getAttribute('id');
        }
      });
      navItems.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  }

  // ─── CHATBOT ASSISTANT (index page only) ───
  const chatbotToggle  = document.getElementById('chatbotToggle');
  const chatbotPanel   = document.getElementById('chatbotPanel');
  const chatbotClose   = document.getElementById('chatbotClose');
  const chatbotRestart = document.getElementById('chatbotRestart');
  const chatbotQEl     = document.getElementById('chatbotQuestion');
  const chatbotOptEl   = document.getElementById('chatbotOptions');
  const chatbotResEl   = document.getElementById('chatbotResult');
  const chatbotWAEl    = document.getElementById('chatbotWhatsApp');

  if (chatbotToggle && chatbotPanel && chatbotQEl && chatbotOptEl && chatbotResEl) {
    const questions = [
      { key: 'credit', text: 'Is your credit score 600 or higher?', options: [{ label: 'Yes', value: true, points: 2 }, { label: 'No', value: false, points: -2 }] },
      { key: 'blacklisted', text: 'Are you currently blacklisted?', options: [{ label: 'No', value: false, points: 2 }, { label: 'Yes', value: true, points: -3 }] },
      { key: 'debtReview', text: 'Are you under debt review?', options: [{ label: 'No', value: false, points: 2 }, { label: 'Yes', value: true, points: -3 }] },
      { key: 'payslips', text: 'Can you provide 3 recent payslips?', options: [{ label: 'Yes', value: true, points: 1 }, { label: 'No', value: false, points: -1 }] },
      { key: 'bankStatements', text: 'Can you provide 3 months bank statements?', options: [{ label: 'Yes', value: true, points: 1 }, { label: 'No', value: false, points: -1 }] }
    ];

    let currentQuestion = 0;
    let score = 0;
    const answers = {};

    function openChatbot() {
      chatbotPanel.hidden = false;
      chatbotToggle.setAttribute('aria-expanded', 'true');
    }

    function closeChatbot() {
      chatbotPanel.hidden = true;
      chatbotToggle.setAttribute('aria-expanded', 'false');
    }

    function renderQuestion() {
      chatbotResEl.className = 'chatbot-result';
      chatbotResEl.textContent = '';

      const q = questions[currentQuestion];
      chatbotQEl.textContent = (currentQuestion + 1) + '/' + questions.length + ': ' + q.text;
      chatbotOptEl.innerHTML = '';

      q.options.forEach(function (option) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chatbot-option';
        btn.textContent = option.label;
        btn.addEventListener('click', function () {
          answers[q.key] = option.value;
          score += option.points;
          currentQuestion += 1;

          if (currentQuestion >= questions.length) {
            showResult();
          } else {
            renderQuestion();
          }
        });
        chatbotOptEl.appendChild(btn);
      });
    }

    function showResult() {
      let level = 'low';
      let message = 'Based on your answers, your finance approval chance is currently low.';

      if (score >= 4) {
        level = 'good';
        message = 'Great news: you look likely to qualify for finance. Continue on WhatsApp and we will assist with the next step.';
      } else if (score >= 1) {
        level = 'medium';
        message = 'You may qualify, but we need to verify a few details. Continue on WhatsApp and we will guide you.';
      }

      chatbotQEl.textContent = 'Assistant check complete';
      chatbotOptEl.innerHTML = '';
      chatbotResEl.className = 'chatbot-result show ' + level;
      chatbotResEl.textContent = message;

      if (chatbotWAEl) {
        const waMessage =
          'Hi Thabo, I completed the chatbot assistant questions. ' +
          'Result: ' + (level === 'good' ? 'Likely qualify' : (level === 'medium' ? 'Needs review' : 'Low chance')) + '. ' +
          'Credit score 600+: ' + (answers.credit ? 'Yes' : 'No') + ', ' +
          'Blacklisted: ' + (answers.blacklisted ? 'Yes' : 'No') + ', ' +
          'Under debt review: ' + (answers.debtReview ? 'Yes' : 'No') + ', ' +
          '3 payslips: ' + (answers.payslips ? 'Yes' : 'No') + ', ' +
          '3 bank statements: ' + (answers.bankStatements ? 'Yes' : 'No') + '.';
        chatbotWAEl.href = 'https://wa.me/27682515329?text=' + encodeURIComponent(waMessage);
      }
    }

    function restartChatbot() {
      currentQuestion = 0;
      score = 0;
      Object.keys(answers).forEach(function (k) { delete answers[k]; });
      renderQuestion();
    }

    chatbotToggle.addEventListener('click', function () {
      if (chatbotPanel.hidden) {
        openChatbot();
      } else {
        closeChatbot();
      }
    });

    if (chatbotClose) chatbotClose.addEventListener('click', closeChatbot);
    if (chatbotRestart) chatbotRestart.addEventListener('click', restartChatbot);

    renderQuestion();
    openChatbot();
  }

})();
