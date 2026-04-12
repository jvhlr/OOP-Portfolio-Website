/* ============================================================
   main.js — Dark Developer Portfolio
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
});


/* ──────────────────────────────
   1. NAVIGATION
   ────────────────────────────── */
function initNav() {
  const toggle = document.querySelector('.nav__toggle');
  const links  = document.querySelector('.nav__links');
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
  const body = card.querySelector('.card__body');
  const isExpanded = card.classList.contains('expanded');

  card.classList.toggle('expanded');
  header.setAttribute('aria-expanded', !isExpanded);

  if (!isExpanded) {
    body.style.maxHeight = body.scrollHeight + 'px';
  } else {
    body.style.maxHeight = '0px';
  }
}


/* ──────────────────────────────
   4. TABS
   ────────────────────────────── */
function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const tabs   = group.querySelectorAll('.tab');
    const panels = group.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.target;

        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const panel = group.querySelector(`#${target}`);
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
    const message = form.querySelector('#form-message').value.trim();

    if (!name || !email || !message) {
      showMsg(form, 'Please fill in all fields.', 'error');
      return;
    }
    showMsg(form, 'Message sent successfully.', 'success');
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
