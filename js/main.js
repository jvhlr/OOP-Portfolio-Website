/* ============================================================
   main.js - Dark Developer Portfolio
   Minimal interactions: nav, scroll fade-in, tabs,
   collapsible cards, copy-to-clipboard, progress bar.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollFadeIn();
  initCards();
  initTabs();
  initCopyButtons();
  initProgressBar();
  initContactForm();
  initLightbox();
  initTyped();
  initProjects();
  initTheme();
  initTerminal();
  initSkills();
  initBackToTop();
  initEduToggle();
});


/* ──────────────────────────────
   1. NAVIGATION
   ────────────────────────────── */
function initNav() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.textContent = isOpen ? 'Close' : 'Menu';
  });

  links.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.textContent = 'Menu';
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      links.classList.remove('open');
      toggle.textContent = 'Menu';
    }
  });
}


/* ──────────────────────────────
   2. SCROLL FADE-IN
   ────────────────────────────── */
function initScrollFadeIn() {
  const els = document.querySelectorAll('.fade-in, .stagger');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  els.forEach(el => observer.observe(el));
}


/* ──────────────────────────────
   3. COLLAPSIBLE CARDS
   ────────────────────────────── */
function initCards() {
  document.querySelectorAll('.card__header').forEach(header => {
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.setAttribute('aria-expanded', 'false');

    header.addEventListener('click', () => toggleCard(header));
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard(header);
      }
    });
  });
}

function toggleCard(header) {
  const card = header.closest('.card');
  // Use :scope > .card__body to make sure we only target the direct child body
  const body = card.querySelector(':scope > .card__body') || card.querySelector('.card__body');
  const isExpanded = card.classList.contains('expanded');

  card.classList.toggle('expanded');
  header.setAttribute('aria-expanded', !isExpanded);

  if (!isExpanded) {
    body.style.maxHeight = body.scrollHeight + 'px';
    setTimeout(() => {
      if (card.classList.contains('expanded')) {
        body.style.maxHeight = 'none';
      }
    }, 400); // Wait for transition
  } else {
    // If we're closing and height was none, we need to set it back to pixel value first
    if (body.style.maxHeight === 'none') {
      body.style.maxHeight = body.scrollHeight + 'px';
      // Force reflow
      void body.offsetHeight;
    }
    body.style.maxHeight = '0px';
  }
}


/* ──────────────────────────────
   4. TABS
   ────────────────────────────── */
function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const tabs = group.querySelectorAll('.tab');
    const panels = group.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
      // Dynamically count items and append to tab text
      const target = tab.dataset.target;
      const panel = group.querySelector(`#${target}`);

      if (panel && !tab.hasAttribute('data-counted')) {
        // Count only the direct top-level cards (the actual main items)
        const count = panel.querySelectorAll(':scope > .card').length;
        tab.innerHTML += ` <span style="opacity: 0.5; font-size: 0.85em; margin-left: 4px;">(${count})</span>`;
        tab.setAttribute('data-counted', 'true');
      }

      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        if (panel) panel.classList.add('active');
      });
    });
  });
}


/* ──────────────────────────────
   5. COPY TO CLIPBOARD
   ────────────────────────────── */
function initCopyButtons() {
  document.querySelectorAll('.code-block__copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const code = btn.closest('.code-block').querySelector('pre').textContent;
      try {
        await navigator.clipboard.writeText(code);
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      } catch {
        btn.textContent = 'Error';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      }
    });
  });
}


/* ──────────────────────────────
   6. READING PROGRESS
   ────────────────────────────── */
function initProgressBar() {
  const bar = document.querySelector('.progress__bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? (window.scrollY / h) * 100 + '%' : '0%';
  }, { passive: true });
}


/* ──────────────────────────────
   7. CONTACT FORM
   ────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#form-name').value.trim();
    const email = form.querySelector('#form-email').value.trim();
    const subject = form.querySelector('#form-subject').value.trim();
    const message = form.querySelector('#form-message').value.trim();

    if (!name || !email || !message) {
      showMsg(form, 'Please fill in all fields.', 'error');
      return;
    }
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:jayveehilario26@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio inquiry')}&body=${encodeURIComponent(body)}`;
    showMsg(form, 'Opening your email app. Press Send there to deliver your message.', 'success');
    form.reset();
  });
}

function showMsg(form, text, type) {
  const existing = form.querySelector('.form-msg');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.className = 'form-msg';
  el.textContent = text;
  el.style.cssText = `
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    margin-top: 1rem;
    border: 1px solid ${type === 'success' ? '#2a2a32' : '#3a2020'};
    background: ${type === 'success' ? '#111113' : '#1a1010'};
    color: ${type === 'success' ? '#8edba1' : '#e08080'};
  `;
  form.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.3s';
    setTimeout(() => el.remove(), 300);
  }, 3500);
}


/* ════════════════════════════════════════════════════════════
   8. IMAGE LIGHTBOX
   ════════════════════════════════════════════════════════════ */
function initLightbox() {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox__close');

  if (!modal || !modalImg || !closeBtn) return;

  // Add click listener to images with a specific class
  document.querySelectorAll('.previewable-image').forEach(img => {
    img.addEventListener('click', function () {
      modal.classList.add('show');
      modalImg.src = this.src;
      modalImg.alt = this.alt;
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
  });

  // Close modal functions
  function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => { modalImg.src = ''; }, 300); // clear after fade
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(); // Close when clicking outside image
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });
}


/* ──────────────────────────────
   9. TYPED EFFECT (hero)
   ────────────────────────────── */
function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const phrases = ['machine learning.', 'software development.', 'web apps.', 'mobile apps.', 'game dev.'];
  let pi = 0, ci = 0, deleting = false;
  (function tick() {
    const word = phrases[pi];
    ci += deleting ? -1 : 1;
    el.textContent = word.slice(0, ci);
    let delay = deleting ? 40 : 80;
    if (!deleting && ci === word.length) { delay = 1600; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 400; }
    setTimeout(tick, delay);
  })();
}

/* ──────────────────────────────
   10. LIVE GITHUB PROJECTS
   ────────────────────────────── */
async function initProjects() {
  const grid = document.getElementById('project-grid');
  if (!grid) return;
  try {
    const res = await fetch('https://api.github.com/users/jvhlr/repos?sort=updated&per_page=100');
    if (!res.ok) throw new Error('github api');
    const repos = (await res.json()).filter(r => !r.fork && r.name !== 'OOP-Portfolio-Website');
    if (!repos.length) return;
    const rewards = {
      'Trading-Agent': 'Python, ML, backtesting',
      'HydroReminder': 'React Native, notifications'
    };
    grid.innerHTML = repos.map(repo => {
      const lang = repo.language ? `<span>${repo.language}</span> &middot; ` : '';
      const stars = `&#9733; ${repo.stargazers_count}`;
      const updated = new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const desc = repo.description ? repo.description : 'No description yet.';
      const wip = repo.name === 'Trading-Agent' || repo.name === 'HydroReminder';
      const status = wip
        ? '<span class="quest__status quest__status--wip">[IN PROGRESS]</span>'
        : '<span class="quest__status">[ACTIVE]</span>';
      const reward = rewards[repo.name] || (repo.language ? repo.language + ' XP' : 'XP');
      let thumb = '';
      if (repo.name === 'Trading-Agent') {
        thumb = `<img class="quest__img" src="img/trading-agent-gui.jpg" alt="Trading-Agent Market Chart screen" loading="lazy">`;
      } else if (repo.name === 'HydroReminder') {
        thumb = `<img class="quest__img quest__img--icon" src="img/hydroreminder-icon.png" alt="HydroReminder app icon" loading="lazy">`;
      }
      return `<article class="${thumb ? 'quest' : 'quest quest--noimg'}">
        ${thumb}
        <div class="quest__body">
        <h3 class="quest__title">${repo.name} ${status}</h3>
        <p class="quest__text">${desc}</p>
        <p class="quest__reward">REWARD: ${reward}</p>
        <p class="quest__meta">${lang}${stars} &middot; updated ${updated}</p>
        <p class="quest__link"><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View on GitHub</a></p>
        </div>
      </article>`;
    }).join('');
    grid.innerHTML += `<article class="quest">
        <img class="quest__img" src="img/kiosk-gui.jpg" alt="Government Assistance Kiosk welcome screen" loading="lazy">
        <div class="quest__body">
        <h3 class="quest__title">Government Assistance Kiosk <span class="quest__status">[COMPLETE]</span></h3>
        <p class="quest__text">A kiosk-style web app for government assistance applications: program selection, requirements checklist, document upload, reference-number tracking, and ID photo capture.</p>
        <p class="quest__reward">REWARD: Web development, deployment</p>
        <p class="quest__link"><a href="https://kioskkk.netlify.app/" target="_blank" rel="noopener noreferrer">Visit live site</a></p>
        </div>
      </article>`;
    grid.classList.add('visible');
  } catch (e) {
    /* keep the static fallback quests */
  }
}


/* ──────────────────────────────
   11. THEME TOGGLE (dark / light)
   ────────────────────────────── */
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  try {
    if (localStorage.getItem('theme') === 'light') root.setAttribute('data-theme', 'light');
  } catch (e) { /* storage unavailable */ }
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', 'light');
    try { localStorage.setItem('theme', isLight ? 'dark' : 'light'); } catch (e) { /* ignore */ }
  });
}

/* ──────────────────────────────
   12. TERMINAL (about section)
   ────────────────────────────── */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const body = document.getElementById('terminal-body');
  if (!input || !body) return;

  const commands = {
    help: 'try: whoami · skills · projects · contact · clear',
    whoami: 'jayvee hilario: bsit student, aspiring developer, network engineer & game dev, bulacan',
    skills: 'java · python · javascript · html/css · git · currently exploring ml',
    projects: 'trading-agent (python) · hydroreminder (js) · this portfolio (see the projects section below)',
    contact: 'jayveehilario26@gmail.com · github.com/jvhlr',
    clear: null,
  };

  function printLine(prompted, text, cls) {
    const line = document.createElement('div');
    line.className = cls || 'terminal__line';
    if (prompted) {
      const p = document.createElement('span');
      p.className = 'terminal__prompt';
      p.textContent = '>';
      line.appendChild(p);
      line.appendChild(document.createTextNode('\u00a0' + text));
    } else {
      line.textContent = text;
      line.classList.add('terminal__output');
    }
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const raw = input.value.trim().toLowerCase();
    input.value = '';
    if (!raw) return;
    printLine(true, raw);
    if (raw === 'clear') { replayBoot(); return; }
    if (commands[raw]) printLine(false, commands[raw]);
    else printLine(false, `command not found: ${raw} (try 'help')`);
  });

  /* Clear replays the boot sequence instead of blanking the screen */
  let booting = false;
  function replayBoot() {
    if (booting) return;
    booting = true;
    input.disabled = true;
    body.innerHTML = '';
    const bootLines = [
      'PHOSPHOR WORKS (TM) TERMLINK PROTOCOL',
      'SECURE CONNECTION ESTABLISHED',
    ];
    let i = 0;
    const nextLine = () => {
      if (i < bootLines.length) {
        printLine(false, bootLines[i]);
        i++;
        setTimeout(nextLine, 280);
      } else {
        animateProgress();
      }
    };
    const animateProgress = () => {
      const line = document.createElement('div');
      line.className = 'terminal__line terminal__output';
      body.appendChild(line);
      let pct = 0;
      const tick = () => {
        const filled = Math.floor(pct / 10);
        line.textContent = 'INITIALIZING [' + '#'.repeat(filled) + '-'.repeat(10 - filled) + '] ' + pct + '%';
        body.scrollTop = body.scrollHeight;
        if (pct < 100) {
          pct += 10;
          setTimeout(tick, 90);
        } else {
          printLine(false, '');
          printLine(false, "type 'help' to begin.");
          booting = false;
          input.disabled = false;
          input.focus();
        }
      };
      tick();
    };
    nextLine();
  }

  // focus input when clicking anywhere in the terminal
  const term = input.closest('.terminal');
  if (term) term.addEventListener('click', () => input.focus());
}

/* ──────────────────────────────
   13. INTERACTIVE SKILLS
   ────────────────────────────── */
function initSkills() {
  document.querySelectorAll('.skill-chip').forEach((chip) => {
    const card = chip.closest('.feature');
    const hint = card ? card.querySelector('.skill-used') : null;
    if (!hint) return;
    const def = hint.textContent;
    const show = () => {
      hint.textContent = '\u2192 ' + chip.dataset.used;
      hint.classList.add('skill-used--active');
    };
    const hide = () => {
      hint.textContent = def;
      hint.classList.remove('skill-used--active');
    };
    chip.addEventListener('mouseenter', show);
    chip.addEventListener('focus', show);
    chip.addEventListener('mouseleave', hide);
    chip.addEventListener('blur', hide);
  });
}

/* ──────────────────────────────
   14. BACK TO TOP
   ────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('back-to-top--visible', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
