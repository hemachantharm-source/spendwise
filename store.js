// ── Storage helpers ───────────────────────────────────────────────────────────
const STORE_KEY = 'spendwise-data';

function loadStore() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  } catch { return {}; }
}

function saveStore(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

function getStore() {
  const d = loadStore();
  return {
    transactions: d.transactions || [],
    goals: d.goals || [],
    settings: d.settings || { weeklyAllowance: 0, weeklySavingsTarget: 0, currency: 'INR' },
  };
}

// ── CRUD ──────────────────────────────────────────────────────────────────────
function addTransaction(tx) {
  const s = getStore();
  s.transactions.unshift({ ...tx, id: Date.now(), createdAt: new Date().toISOString() });
  saveStore(s);
}

function updateTransaction(id, tx) {
  const s = getStore();
  s.transactions = s.transactions.map(t => t.id === id ? { ...t, ...tx } : t);
  saveStore(s);
}

function deleteTransaction(id) {
  const s = getStore();
  s.transactions = s.transactions.filter(t => t.id !== id);
  saveStore(s);
}

function addGoal(goal) {
  const s = getStore();
  s.goals.unshift({ ...goal, id: Date.now(), createdAt: new Date().toISOString() });
  saveStore(s);
}

function updateGoal(id, goal) {
  const s = getStore();
  s.goals = s.goals.map(g => g.id === id ? { ...g, ...goal } : g);
  saveStore(s);
}

function deleteGoal(id) {
  const s = getStore();
  s.goals = s.goals.filter(g => g.id !== id);
  saveStore(s);
}

function updateSettings(settings) {
  const s = getStore();
  s.settings = { ...s.settings, ...settings };
  saveStore(s);
}

// ── Formatters ────────────────────────────────────────────────────────────────
function currency(amount, code) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: code || getStore().settings.currency || 'INR', maximumFractionDigits: 0,
  }).format(amount || 0);
}

function dateLabel(value) {
  return new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    .format(new Date(value + 'T00:00:00'));
}

function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const icons = {
  dollar:    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>`,
  dashboard: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
  wallet:    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>`,
  chart:     `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>`,
  target:    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  settings:  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  logout:    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`,
  menu:      `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`,
  close:     `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  pencil:    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
  trash:     `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  arrowDown: `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  arrowUp:   `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="19" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`,
  plus:      `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  check:     `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  trending:  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>`,
  filter:    `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  search:    `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
};

// ── Sidebar HTML ──────────────────────────────────────────────────────────────
function renderSidebar(activePage) {
  const navItems = [
    { href: 'dashboard.html', label: 'Overview',      icon: 'dashboard' },
    { href: 'history.html',   label: 'Transactions',  icon: 'wallet' },
    { href: 'analytics.html', label: 'Analytics',     icon: 'chart' },
    { href: 'goals.html',     label: 'Savings goals', icon: 'target' },
  ];
  return `
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
    <aside class="sidebar closed" id="sidebar">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:40px">
        <a href="index.html" class="sidebar-logo">
          <span class="sidebar-logo-icon">${icons.dollar}</span>
          <span class="sidebar-logo-text">SpendWise</span>
        </a>
        <button onclick="closeSidebar()" style="background:none;border:none;color:rgba(245,240,228,.7);cursor:pointer;padding:6px;border-radius:8px">${icons.close}</button>
      </div>
      <div class="sidebar-section-label">Your money</div>
      <nav>
        ${navItems.map(item => `
          <a href="${item.href}" class="nav-link ${activePage === item.href ? 'active' : ''}">
            ${icons[item.icon]}<span>${item.label}</span>
          </a>
        `).join('')}
      </nav>
      <div class="sidebar-section-label" style="margin-top:28px">Account</div>
      <a href="settings.html" class="nav-link ${activePage === 'settings.html' ? 'active' : ''}">
        ${icons.settings}<span>Settings</span>
      </a>
      <div class="sidebar-user">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <div class="sidebar-avatar">Y</div>
          <div>
            <p style="font-size:13px;font-weight:600">You</p>
            <p style="font-size:11px;color:rgba(245,240,228,.5)">Personal account</p>
          </div>
        </div>
        <a href="index.html" style="display:flex;align-items:center;gap:6px;color:rgba(245,240,228,.6);font-size:12px;text-decoration:none">
          ${icons.logout} Sign out
        </a>
      </div>
    </aside>`;
}

function renderTopbar(subtitle) {
  return `
    <header class="topbar">
      <button class="hamburger" onclick="openSidebar()">${icons.menu}</button>
      <div style="display:flex;align-items:center;gap:16px">
        <span style="font-size:12px;color:var(--muted-fg)">${subtitle || 'A little clarity, every day.'}</span>
        <div class="topbar-avatar">Y</div>
      </div>
    </header>`;
}

function openSidebar() {
  document.getElementById('sidebar').classList.remove('closed');
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar').classList.add('closed');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

// ── Transaction form HTML ─────────────────────────────────────────────────────
const CATEGORIES = ['Food','Snacks','Transport','College','Shopping','Entertainment','Bills','Recharge','Health','Other'];
const SOURCES = ['Pocket Money','Gift','Salary','Scholarship','Freelance','Other'];
const PAYMENT_METHODS = ['UPI','Cash','Card','Other'];

function renderTransactionForm(initial, formId) {
  const type = initial?.type || 'expense';
  return `
    <form id="${formId}" onsubmit="return false">
      <div class="type-toggle">
        <button type="button" class="type-btn ${type === 'expense' ? 'active' : ''}" onclick="toggleTxType(this,'expense','${formId}')">Expense</button>
        <button type="button" class="type-btn ${type === 'income' ? 'active' : ''}" onclick="toggleTxType(this,'income','${formId}')">Income</button>
      </div>
      <input type="hidden" name="type" value="${type}">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
        <label class="label">Amount
          <input class="input" type="number" name="amount" min="1" required placeholder="0" value="${initial?.amount || ''}" style="margin-top:6px">
        </label>
        <div id="${formId}-cat-source">
          ${type === 'expense' ? renderCategorySelect(initial?.category) : renderSourceSelect(initial?.source)}
        </div>
        <div id="${formId}-payment">
          ${type === 'expense' ? renderPaymentSelect(initial?.paymentMethod) : ''}
        </div>
        <label class="label">Date
          <input class="input" type="date" name="date" required value="${initial?.date?.slice(0,10) || new Date().toISOString().slice(0,10)}" style="margin-top:6px">
        </label>
      </div>
      <label class="label" style="margin-bottom:16px">Note
        <input class="input" name="note" placeholder="What was this for?" value="${initial?.note || ''}" style="margin-top:6px">
      </label>
      <div style="display:flex;justify-content:flex-end;gap:8px;padding-top:8px">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Save transaction</button>
      </div>
    </form>`;
}

function renderCategorySelect(val) {
  return `<label class="label">Category
    <select class="select" name="category" required style="margin-top:6px">
      <option value="">Choose</option>
      ${CATEGORIES.map(c => `<option ${val===c?'selected':''}>${c}</option>`).join('')}
    </select></label>`;
}
function renderSourceSelect(val) {
  return `<label class="label">Source
    <select class="select" name="source" required style="margin-top:6px">
      <option value="">Choose</option>
      ${SOURCES.map(s => `<option ${val===s?'selected':''}>${s}</option>`).join('')}
    </select></label>`;
}
function renderPaymentSelect(val) {
  return `<label class="label">Payment method
    <select class="select" name="paymentMethod" required style="margin-top:6px">
      <option value="">Choose</option>
      ${PAYMENT_METHODS.map(m => `<option ${val===m?'selected':''}>${m}</option>`).join('')}
    </select></label>`;
}

function toggleTxType(btn, type, formId) {
  const form = document.getElementById(formId);
  form.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  form.querySelector('[name="type"]').value = type;
  document.getElementById(`${formId}-cat-source`).innerHTML =
    type === 'expense' ? renderCategorySelect('') : renderSourceSelect('');
  document.getElementById(`${formId}-payment`).innerHTML =
    type === 'expense' ? renderPaymentSelect('') : '';
}

function getFormData(formId) {
  const form = document.getElementById(formId);
  const fd = new FormData(form);
  return {
    type: fd.get('type'),
    amount: Number(fd.get('amount')),
    category: fd.get('category') || '',
    source: fd.get('source') || '',
    note: fd.get('note') || '',
    paymentMethod: fd.get('paymentMethod') || '',
    date: fd.get('date'),
  };
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function openModal(title, bodyHtml) {
  let overlay = document.getElementById('globalModal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'globalModal';
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
        <button onclick="closeModal()" style="background:none;border:none;cursor:pointer;padding:8px;border-radius:10px;color:var(--muted-fg)">${icons.close}</button>
      </div>
      ${bodyHtml}
    </div>`;
  overlay.style.display = 'flex';
}

function closeModal() {
  const m = document.getElementById('globalModal');
  if (m) m.style.display = 'none';
}

// ── Transaction row HTML ──────────────────────────────────────────────────────
function renderTxRow(tx, showActions) {
  const isIncome = tx.type === 'income';
  const arrowSvg = isIncome
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="19" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>`;
  return `
    <div class="tx-row">
      <div class="tx-icon ${isIncome ? 'income' : 'expense'}">${arrowSvg}</div>
      <div>
        <p class="tx-title">${tx.source || tx.category || (isIncome ? 'Money in' : 'Money out')}</p>
        <p class="tx-sub">${tx.note || tx.category || ''} · ${dateLabel(tx.date)}</p>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="tx-amount ${isIncome ? 'income' : ''}">${isIncome ? '+' : '−'}${currency(tx.amount)}</span>
        ${showActions ? `
          <div class="tx-actions">
            <button class="icon-btn" onclick="editTx(${tx.id})">${icons.pencil}</button>
            <button class="icon-btn danger" onclick="deleteTx(${tx.id})">${icons.trash}</button>
          </div>` : ''}
      </div>
    </div>`;
}

// ── Goal progress HTML ────────────────────────────────────────────────────────
function renderGoalProgress(goal) {
  const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  return `
    <div>
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:12px">
        <div>
          <p class="font-display" style="font-size:18px;font-weight:700">${goal.name}</p>
          <p style="font-size:12px;color:var(--muted-fg);margin-top:2px">${currency(goal.currentAmount)} saved of ${currency(goal.targetAmount)}</p>
        </div>
        <span class="font-mono" style="font-size:14px;color:var(--accent)">${pct}%</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    </div>`;
}
