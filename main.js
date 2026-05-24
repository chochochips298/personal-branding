/* ===== main.js — shared across all pages ===== */

// ── Floating Hearts Background ───────────────────────────────────────────────
(function createHearts() {
  const container = document.getElementById('hearts-container');
  if (!container) return;

  const heartEmojis = ['💗', '💖', '💝', '💓', '💕', '🩷', '❤️', '💞', '💘', '💟'];

  function spawnHeart() {
    const h = document.createElement('div');
    h.classList.add('heart');
    h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    const size = Math.random() * 1.4 + 0.7;
    h.style.fontSize = size + 'rem';
    h.style.left = Math.random() * 100 + '%';
    const duration = Math.random() * 10 + 8;
    h.style.animationDuration = duration + 's';
    h.style.animationDelay = '0s';
    container.appendChild(h);
    setTimeout(() => h.remove(), duration * 1000);
  }

  // initial burst
  for (let i = 0; i < 18; i++) {
    setTimeout(spawnHeart, i * 350);
  }
  // continuous spawn
  setInterval(spawnHeart, 700);
})();

// ── Navbar mobile toggle ──────────────────────────────────────────────────────
const menuToggle = document.querySelector('.menu-toggle');
const navMenu    = document.querySelector('.nav-menu');
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
}

// ── Active nav link (hash-based for multi-page) ───────────────────────────────
(function setActiveNav() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ── Progress bars (Skills page) ───────────────────────────────────────────────
function initProgressBars() {
  const skillsSection = document.getElementById('skills-section');
  if (!skillsSection) return;

  const bars = skillsSection.querySelectorAll('.progress-fill');
  const pcts = [88, 72, 80, 92, 85, 90, 88, 82];

  let ran = false;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !ran) {
      ran = true;
      bars.forEach((bar, i) => {
        if (i < pcts.length) bar.style.width = pcts[i] + '%';
      });
    }
  }, { threshold: 0.3 });
  obs.observe(skillsSection);
}
initProgressBars();

// Also run on page load if already visible
window.addEventListener('load', initProgressBars);

// ── Typing animation (Home page) ─────────────────────────────────────────────
function initTyping() {
  const nameEl  = document.getElementById('typingName');
  const aboutEl = document.getElementById('typingAbout');
  if (!nameEl) return;

  const nameText  = "Ferissa Ilen Aswa Aulia";
  const aboutText = "Saya pelajar Informatika yang passion di bidang pengembangan web dan desain antarmuka. Saya percaya bahwa teknologi dan estetika bisa berjalan beriringan menciptakan pengalaman digital yang bermakna.";

  let ni = 0, ai = 0;

  function typeName() {
    if (ni < nameText.length) {
      nameEl.innerHTML = nameText.substring(0, ++ni) + '<span class="cursor">|</span>';
      setTimeout(typeName, 100);
    } else {
      nameEl.innerHTML = nameText + '<span class="cursor">|</span>';
      if (aboutEl) setTimeout(typeAbout, 300);
    }
  }
  function typeAbout() {
    if (ai < aboutText.length) {
      aboutEl.innerHTML = aboutText.substring(0, ++ai) + '<span class="cursor">|</span>';
      setTimeout(typeAbout, 28);
    } else {
      aboutEl.innerHTML = aboutText + '<span class="cursor">|</span>';
    }
  }

  setTimeout(typeName, 400);
}
window.addEventListener('load', initTyping);

// ── Portfolio / Design popup modal ───────────────────────────────────────────
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');

function openModal(data) {
  if (!modalOverlay) return;
  document.getElementById('modalImg').src         = data.img   || '';
  document.getElementById('modalImg').alt         = data.title || '';
  document.getElementById('modalTitle').textContent = data.title || '';
  document.getElementById('modalDesc').textContent  = data.desc  || '';

  // tags
  const tagsEl = document.getElementById('modalTags');
  tagsEl.innerHTML = '';
  (data.tags || []).forEach(t => {
    const s = document.createElement('span');
    s.className = 'modal-tag'; s.textContent = t;
    tagsEl.appendChild(s);
  });

  // action buttons
  const actEl = document.getElementById('modalActions');
  actEl.innerHTML = '';
  (data.actions || []).forEach(btn => {
    const a = document.createElement('a');
    a.className = btn.cls || 'btn-view';
    a.innerHTML = `<i class="${btn.icon}"></i> ${btn.label}`;
    a.href = btn.href || '#';
    if (btn.href && btn.href !== '#') a.target = '_blank';
    else a.addEventListener('click', e => e.preventDefault());
    actEl.appendChild(a);
  });

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (modalClose)   modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Certificates pagination ───────────────────────────────────────────────────
function initCertPagination() {
  const grid    = document.getElementById('certGrid');
  const prevBtn = document.getElementById('certPrev');
  const nextBtn = document.getElementById('certNext');
  const info    = document.getElementById('certPageInfo');
  if (!grid) return;

  const items    = Array.from(grid.querySelectorAll('.cert-item'));
  const perPage  = 6;
  let   page     = 0;
  const total    = Math.ceil(items.length / perPage);

  function render() {
    items.forEach((item, i) => {
      item.style.display = (i >= page * perPage && i < (page + 1) * perPage) ? '' : 'none';
    });
    if (info) info.textContent = `Halaman ${page + 1} / ${total}`;
    if (prevBtn) prevBtn.disabled = page === 0;
    if (nextBtn) nextBtn.disabled = page === total - 1;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { if (page > 0) { page--; render(); grid.scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
  if (nextBtn) nextBtn.addEventListener('click', () => { if (page < total - 1) { page++; render(); grid.scrollIntoView({ behavior: 'smooth', block: 'start' }); } });

  render();
}
initCertPagination();
