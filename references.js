/* ═══════════════════════════════════════
   references.js
   Handles: numbering, search, filter,
            add new citation, delete,
            localStorage persistence
═══════════════════════════════════════ */

const STORAGE_KEY = 'sel_user_citations';

// ── Helpers ───────────────────────────────────
function getAllCitations() {
  return Array.from(document.querySelectorAll('.citation'));
}

function getSectionEl(sectionId) {
  const map = {
    introduction: document.getElementById('sec-introduction'),
    industry:     document.getElementById('sec-industry'),
    business:     document.getElementById('sec-business'),
    conclusion:   document.getElementById('sec-conclusion'),
  };
  return map[sectionId] || null;
}

// ── Number visible citations ──────────────────
function renumberCitations() {
  const visible = getAllCitations().filter(c => !c.classList.contains('hidden'));
  visible.forEach((c, i) => {
    const num = c.querySelector('.cit-number');
    if (num) num.textContent = i + 1;
  });

  const countEl = document.getElementById('refCount');
  if (countEl) {
    const total = getAllCitations().length;
    countEl.textContent = visible.length === total
      ? `${total} citation${total !== 1 ? 's' : ''} total`
      : `Showing ${visible.length} of ${total} citation${total !== 1 ? 's' : ''}`;
  }
}

// ── Filter by section chip ────────────────────
let activeSection = 'all';
let activeSearch  = '';

function applyFilters() {
  const query = activeSearch.toLowerCase();
  getAllCitations().forEach(c => {
    const sectionMatch = activeSection === 'all' || c.dataset.section === activeSection;
    const text = c.querySelector('.cit-text')?.textContent.toLowerCase() || '';
    const tags = Array.from(c.querySelectorAll('.cit-tag')).map(t => t.textContent.toLowerCase()).join(' ');
    const searchMatch = !query || text.includes(query) || tags.includes(query);
    c.classList.toggle('hidden', !(sectionMatch && searchMatch));
  });

  // Show/hide section headings if all their citations are hidden
  ['introduction','industry','business','conclusion'].forEach(id => {
    const sec = document.getElementById('sec-' + id);
    if (!sec) return;
    const cits = sec.querySelectorAll('.citation');
    const anyVisible = Array.from(cits).some(c => !c.classList.contains('hidden'));
    sec.style.display = anyVisible ? '' : 'none';
  });

  // No-results message
  let noRes = document.getElementById('noResults');
  const anyVisible = getAllCitations().some(c => !c.classList.contains('hidden'));
  if (!noRes) {
    noRes = document.createElement('p');
    noRes.id = 'noResults';
    noRes.className = 'no-results';
    noRes.textContent = 'No citations match your search. Try different keywords or reset the filter.';
    document.querySelector('.container').insertBefore(noRes, document.querySelector('.add-section'));
  }
  noRes.classList.toggle('visible', !anyVisible);

  renumberCitations();
}

// ── Section chip clicks ───────────────────────
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
    chip.classList.add('chip--active');
    activeSection = chip.dataset.section;
    applyFilters();
  });
});

// ── Search input ──────────────────────────────
const searchInput = document.getElementById('searchInput');
const searchWrap  = searchInput?.parentElement;
const clearBtn    = document.getElementById('searchClear');

searchInput?.addEventListener('input', () => {
  activeSearch = searchInput.value.trim();
  searchWrap?.classList.toggle('has-value', activeSearch.length > 0);
  applyFilters();
});

clearBtn?.addEventListener('click', () => {
  searchInput.value = '';
  activeSearch = '';
  searchWrap?.classList.remove('has-value');
  applyFilters();
  searchInput.focus();
});

// ── Build a citation DOM node ─────────────────
function buildCitationNode({ section, citationText, tags, url, isUser }) {
  const div = document.createElement('div');
  div.className = 'citation' + (isUser ? ' user-added' : '');
  div.dataset.section = section;

  const numDiv = document.createElement('div');
  numDiv.className = 'cit-number';

  const body = document.createElement('div');
  body.className = 'cit-body';

  const p = document.createElement('p');
  p.className = 'cit-text';

  // If a URL was provided, wrap the whole citation in a link
  if (url) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = citationText;
    p.appendChild(a);
  } else {
    p.innerHTML = citationText;
  }

  const meta = document.createElement('div');
  meta.className = 'cit-meta';

  if (tags && tags.length) {
    tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'cit-tag';
      span.textContent = tag.trim();
      meta.appendChild(span);
    });
  }

  // Delete button for user-added citations
  if (isUser) {
    const delBtn = document.createElement('button');
    delBtn.className = 'cit-delete';
    delBtn.title = 'Remove this citation';
    delBtn.textContent = '✕ Remove';
    delBtn.addEventListener('click', () => removeCitation(div, { section, citationText, tags, url }));
    meta.appendChild(delBtn);
  }

  body.appendChild(p);
  body.appendChild(meta);
  div.appendChild(numDiv);
  div.appendChild(body);
  return div;
}

// ── Insert citation into correct section ──────
function insertCitation(data) {
  const secEl = getSectionEl(data.section);
  if (!secEl) return;
  const node = buildCitationNode({ ...data, isUser: true });
  secEl.appendChild(node);
  applyFilters();

  // Scroll to new citation
  node.scrollIntoView({ behavior: 'smooth', block: 'center' });
  node.style.background = '#fffbea';
  setTimeout(() => { node.style.transition = 'background 1s'; node.style.background = ''; }, 100);
}

// ── Save user citations to localStorage ───────
function saveUserCitations() {
  const userCits = Array.from(document.querySelectorAll('.citation.user-added')).map(c => ({
    section:      c.dataset.section,
    citationText: c.querySelector('.cit-text')?.innerHTML || '',
    tags:         Array.from(c.querySelectorAll('.cit-tag:not(.cit-delete)')).map(t => t.textContent),
    url:          c.querySelector('a')?.href || '',
  }));
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(userCits)); } catch(e) {}
}

// ── Load from localStorage ────────────────────
function loadSavedCitations() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    saved.forEach(data => insertCitation(data));
  } catch(e) {}
}

// ── Remove a user citation ────────────────────
function removeCitation(node, data) {
  if (!confirm('Remove this citation?')) return;
  node.style.transition = 'opacity 0.3s, transform 0.3s';
  node.style.opacity = '0';
  node.style.transform = 'translateX(20px)';
  setTimeout(() => {
    node.remove();
    saveUserCitations();
    applyFilters();
  }, 300);
}

// ── Add Form ──────────────────────────────────
const addForm     = document.getElementById('addForm');
const formError   = document.getElementById('formError');
const clearFormBtn = document.getElementById('clearFormBtn');

addForm?.addEventListener('submit', e => {
  e.preventDefault();
  formError.textContent = '';

  const section      = document.getElementById('f-section').value.trim();
  const citationText = document.getElementById('f-citation').value.trim();
  const tagsRaw      = document.getElementById('f-tags').value.trim();
  const url          = document.getElementById('f-url').value.trim();

  if (!section) { formError.textContent = 'Please select a section.'; return; }
  if (!citationText) { formError.textContent = 'Please enter the citation text.'; return; }

  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

  const data = { section, citationText, tags, url };
  insertCitation(data);
  saveUserCitations();

  // Reset form
  addForm.reset();
  formError.textContent = '';
});

clearFormBtn?.addEventListener('click', () => {
  addForm.reset();
  formError.textContent = '';
});

// ── Init ──────────────────────────────────────
loadSavedCitations();
renumberCitations();
