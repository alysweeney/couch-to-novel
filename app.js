import * as Cloud from './cloud.js';

// ---------- Utilities ----------

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function todayStr() {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d - tz).toISOString().slice(0, 10);
}

function parseDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(dateStr, n) {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + n);
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d - tz).toISOString().slice(0, 10);
}

// Whole days from a to b. Both are midnight-local so DST can't produce
// a fractional day here.
function daysBetween(aStr, bStr) {
  return Math.round((parseDate(bStr) - parseDate(aStr)) / 86400000);
}

function formatDate(dateStr) {
  return parseDate(dateStr).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDateLong(dateStr) {
  return parseDate(dateStr).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
}

function fmt(n) {
  return Math.round(n).toLocaleString();
}

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

// Counts words the way a manuscript does: whitespace-separated tokens.
function countWords(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

// ---------- Program math ----------
// Everything the app "knows" derives from three inputs: the beat template,
// the target word count, and the logged entries. Kept pure and free of DOM
// so it stays easy to reason about (and to test by hand in the console).

function computeBeats(project) {
  const tpl = BEAT_TEMPLATES[project.templateId] || BEAT_TEMPLATES[DEFAULT_TEMPLATE_ID];
  return tpl.beats.map((b) => ({
    ...b,
    startWords: Math.round(b.startPct * project.targetWords),
    endWords: Math.round(b.endPct * project.targetWords),
  }));
}

function totalWords(entries) {
  return entries.reduce((sum, e) => sum + (e.words || 0), 0);
}

function programState(project, entries) {
  const beats = computeBeats(project);
  const total = totalWords(entries);
  const marks = project.beatMarks || {};
  const spans = beats.filter((b) => b.kind === 'span');
  const moments = beats.filter((b) => b.kind === 'moment');

  // Spans tile the manuscript end to end, so the first one you haven't
  // written past is the one you're in.
  const currentSpan = spans.find((b) => total < b.endWords) || spans[spans.length - 1];

  // Moments get ticked off in story order -- you can't write All Is Lost before
  // the Midpoint -- so the first unticked one is what the story currently owes
  // you. It's "due" once your word count reaches where it should land.
  const nextMoment = moments.find((b) => !marks[b.key]) || null;
  const dueMoment = nextMoment && total >= nextMoment.startWords ? nextMoment : null;

  // The real drift signal: how far past its landing point you've written
  // without hitting the next milestone. A span can't overrun on its own,
  // because the word count simply carries you into the next span. What
  // actually means something is the gap between where your words are and
  // where your story is.
  const momentDrift = dueMoment ? total - dueMoment.startWords : 0;

  // A due milestone outranks the span for today's prescription: a missing
  // Midpoint matters more than another 1,500 words of Fun and Games.
  const focus = dueMoment || currentSpan;

  const today = todayStr();
  const totalDays = Math.max(1, daysBetween(project.startDate, project.targetDate));
  const elapsedDays = clamp(daysBetween(project.startDate, today), 0, totalDays);
  const daysLeft = Math.max(0, daysBetween(today, project.targetDate));
  const expectedByNow = Math.round(project.targetWords * (elapsedDays / totalDays));
  const remaining = Math.max(0, project.targetWords - total);
  const dailyTarget = daysLeft > 0 ? Math.ceil(remaining / daysLeft) : remaining;

  return {
    beats,
    spans,
    moments,
    total,
    marks,
    currentSpan,
    nextMoment,
    dueMoment,
    momentDrift,
    focus,
    totalDays,
    elapsedDays,
    daysLeft,
    expectedByNow,
    calendarDelta: total - expectedByNow,
    remaining,
    dailyTarget,
    pctComplete: clamp(total / project.targetWords, 0, 1),
  };
}

function wordsOnDate(entries, dateStr) {
  return entries.filter((e) => e.date === dateStr).reduce((s, e) => s + (e.words || 0), 0);
}

function currentStreak(entries) {
  const days = new Set(entries.filter((e) => (e.words || 0) > 0).map((e) => e.date));
  if (!days.size) return 0;
  // Today not being logged yet shouldn't read as a broken streak until
  // tomorrow, so start counting from yesterday if today is still empty.
  let cursor = days.has(todayStr()) ? todayStr() : addDays(todayStr(), -1);
  let streak = 0;
  while (days.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function averagePerDay(entries, windowDays) {
  const cutoff = addDays(todayStr(), -windowDays);
  const recent = entries.filter((e) => e.date > cutoff);
  if (!recent.length) return 0;
  return totalWords(recent) / windowDays;
}

function projectedFinish(project, entries) {
  const avg = averagePerDay(entries, 14);
  if (avg <= 0) return null;
  const remaining = Math.max(0, project.targetWords - totalWords(entries));
  if (remaining === 0) return todayStr();
  return addDays(todayStr(), Math.ceil(remaining / avg));
}

// ---------- Storage (Firestore-backed, kept live via onSnapshot) ----------

let currentUser = null;
let projectCache = null;
let entriesCache = [];
let unsubProject = null;
let unsubEntries = null;

function sortedEntries() {
  return entriesCache.slice().sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

async function saveProject(patch) {
  projectCache = { ...(projectCache || {}), ...patch };
  await Cloud.saveProjectCloud(currentUser.uid, projectCache);
}

async function upsertEntry(entry) {
  await Cloud.saveEntryCloud(currentUser.uid, entry);
}

async function removeEntry(id) {
  await Cloud.deleteEntryCloud(currentUser.uid, id);
}

async function logToday(words, note) {
  const date = todayStr();
  const existing = entriesCache.find((e) => e.date === date);
  const entry = existing
    ? { ...existing, words, note: note || '' }
    : { id: uid(), date, words, note: note || '' };
  await upsertEntry(entry);
}

// ---------- Routing ----------

function getRoute() {
  const hash = location.hash.replace(/^#\/?/, '');
  return hash || 'today';
}

function navigate(path) {
  location.hash = '#/' + path;
}

window.addEventListener('hashchange', render);

document.getElementById('settings-btn').addEventListener('click', () => {
  if (currentUser) openSettings();
});

document.querySelectorAll('.nav-btn').forEach((btn) => {
  btn.addEventListener('click', () => navigate(btn.dataset.route));
});

function syncNav() {
  const route = getRoute();
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.route === route);
  });
  document.querySelector('.bottomnav').style.display = currentUser && projectCache ? 'flex' : 'none';
}

// ---------- Render ----------

function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  syncNav();

  if (!Cloud.isConfigured) {
    app.appendChild(renderConfigGate());
    return;
  }
  if (!currentUser) {
    app.appendChild(renderAuthGate());
    return;
  }
  if (!projectCache) {
    app.appendChild(renderSetup());
    return;
  }

  const route = getRoute();
  if (route === 'map') app.appendChild(renderMap());
  else if (route === 'trends') app.appendChild(renderTrends());
  else app.appendChild(renderToday());
}

function renderConfigGate() {
  return el(`
    <div class="card">
      <h2>Almost there</h2>
      <p class="prose">This app needs its own Firebase project before it can sign you in or sync anything.</p>
      <p class="prose muted">Create a project, turn on <strong>Authentication &rarr; Email/Password</strong>, create a <strong>Firestore database</strong>, then paste the web config into <code>cloud.js</code>. The README has the security rules to go with it.</p>
    </div>
  `);
}

function renderAuthGate() {
  const wrap = el(`
    <div class="card">
      <h2>Couch to Novel</h2>
      <p class="prose muted">A guided drafting program. Sign in to sync your manuscript progress across devices.</p>
      <label for="auth-email">Email</label>
      <input id="auth-email" type="email" autocomplete="email" inputmode="email" />
      <label for="auth-password">Password</label>
      <input id="auth-password" type="password" autocomplete="current-password" />
      <div style="height:16px"></div>
      <button class="btn btn-primary" id="auth-submit">Sign in</button>
      <div style="height:8px"></div>
      <button class="btn btn-ghost" id="auth-toggle" style="width:100%">Create an account instead</button>
      <div class="error" id="auth-error" hidden></div>
    </div>
  `);

  let mode = 'signin';
  const submit = wrap.querySelector('#auth-submit');
  const toggle = wrap.querySelector('#auth-toggle');
  const errBox = wrap.querySelector('#auth-error');

  toggle.addEventListener('click', () => {
    mode = mode === 'signin' ? 'signup' : 'signin';
    submit.textContent = mode === 'signin' ? 'Sign in' : 'Create account';
    toggle.textContent = mode === 'signin' ? 'Create an account instead' : 'I already have an account';
    errBox.hidden = true;
  });

  submit.addEventListener('click', async () => {
    const email = wrap.querySelector('#auth-email').value.trim();
    const password = wrap.querySelector('#auth-password').value;
    if (!email || !password) return;
    submit.disabled = true;
    try {
      if (mode === 'signin') await Cloud.signIn(email, password);
      else await Cloud.signUp(email, password);
    } catch (err) {
      errBox.textContent = Cloud.authErrorMessage(err);
      errBox.hidden = false;
    } finally {
      submit.disabled = false;
    }
  });

  return wrap;
}

// ---------- Setup ----------

function renderSetup() {
  const genreOptions = GENRE_TARGETS.map((g) => `<option value="${g.id}">${g.label} (~${fmt(g.words)} words)</option>`).join('');
  const defaultTarget = addDays(todayStr(), 180);

  const wrap = el(`
    <div>
      <div class="card">
        <div class="eyebrow">Set up your program</div>
        <h2>What are you writing?</h2>
        <p class="prose muted">This generates your beat map and a daily word target that adapts as you go.</p>

        <label for="su-title">Working title</label>
        <input id="su-title" type="text" placeholder="Untitled" />

        <label for="su-genre">Genre</label>
        <select id="su-genre">${genreOptions}</select>
        <div class="hint">Sets a starting word count. Beat positions are percentages, so they scale to whatever you pick.</div>

        <label for="su-target">Target word count</label>
        <input id="su-target" type="number" inputmode="numeric" min="10000" step="1000" />

        <label for="su-start">Start date</label>
        <input id="su-start" type="date" value="${todayStr()}" />

        <label for="su-end">Target finish date</label>
        <input id="su-end" type="date" value="${defaultTarget}" />
        <div class="hint" id="su-pace"></div>

        <div style="height:18px"></div>
        <button class="btn btn-primary" id="su-create">Start the program</button>
        <div class="error" id="su-error" hidden></div>
      </div>
    </div>
  `);

  const genre = wrap.querySelector('#su-genre');
  const target = wrap.querySelector('#su-target');
  const start = wrap.querySelector('#su-start');
  const end = wrap.querySelector('#su-end');
  const pace = wrap.querySelector('#su-pace');

  function syncTargetFromGenre() {
    const g = GENRE_TARGETS.find((x) => x.id === genre.value);
    target.value = g ? g.words : 90000;
    syncPace();
  }

  function syncPace() {
    const words = Number(target.value) || 0;
    const days = daysBetween(start.value, end.value);
    if (days > 0 && words > 0) {
      pace.textContent = `${days} days, about ${fmt(words / days)} words a day if you write every day.`;
    } else {
      pace.textContent = 'Finish date needs to be after the start date.';
    }
  }

  genre.addEventListener('change', syncTargetFromGenre);
  [target, start, end].forEach((input) => input.addEventListener('input', syncPace));
  syncTargetFromGenre();

  wrap.querySelector('#su-create').addEventListener('click', async () => {
    const errBox = wrap.querySelector('#su-error');
    const words = Number(target.value) || 0;
    const days = daysBetween(start.value, end.value);
    if (words < 1000 || days <= 0) {
      errBox.textContent = 'Check the word count and make sure the finish date is after the start date.';
      errBox.hidden = false;
      return;
    }
    await saveProject({
      title: wrap.querySelector('#su-title').value.trim() || 'Untitled',
      genre: genre.value,
      targetWords: words,
      startDate: start.value,
      targetDate: end.value,
      templateId: DEFAULT_TEMPLATE_ID,
      beatMarks: {},
      createdAt: new Date().toISOString(),
    });
    render();
  });

  return wrap;
}

// ---------- Today ----------

function pacePill(state) {
  const d = state.calendarDelta;
  if (d >= 0) return `<span class="pill pill-good">${fmt(d)} ahead of schedule</span>`;
  return `<span class="pill pill-warn">${fmt(-d)} behind schedule</span>`;
}

function renderToday() {
  const project = projectCache;
  const entries = sortedEntries();
  const state = programState(project, entries);
  const loggedToday = wordsOnDate(entries, todayStr());
  const streak = currentStreak(entries);
  const existingNote = (entries.find((e) => e.date === todayStr()) || {}).note || '';

  const focus = state.focus;
  const isMoment = focus.kind === 'moment';

  let structural;
  if (state.momentDrift > 0) {
    structural = `<span class="pill pill-bad">${fmt(state.momentDrift)} words past where ${escapeHtml(focus.name)} should land</span>`;
  } else if (state.dueMoment) {
    structural = `<span class="pill pill-warn">${escapeHtml(focus.name)} is due now</span>`;
  } else if (state.nextMoment) {
    structural = `<span class="pill">${fmt(state.nextMoment.startWords - state.total)} words until ${escapeHtml(state.nextMoment.name)}</span>`;
  } else {
    structural = `<span class="pill pill-good">Every beat written</span>`;
  }

  const wrap = el(`
    <div>
      <div class="card">
        <div class="eyebrow">Day ${state.elapsedDays + 1} of ${state.totalDays} &middot; ${escapeHtml(project.title)}</div>
        <div class="today-target">${fmt(state.dailyTarget)} <small>words today</small></div>
        <div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap">${pacePill(state)} ${structural}</div>

        <div class="progress"><div class="progress-fill" style="width:${(state.pctComplete * 100).toFixed(1)}%"></div></div>
        <div class="muted" style="font-size:13px">${fmt(state.total)} of ${fmt(project.targetWords)} words &middot; ${state.daysLeft} days left</div>
      </div>

      <div class="card">
        <div class="eyebrow">${isMoment ? 'Scene due' : 'Current beat'}</div>
        <h2>${escapeHtml(focus.name)}</h2>
        <p class="prose muted" style="margin-bottom:0">${escapeHtml(focus.summary)}</p>
        <p class="beat-prompt">${escapeHtml(focus.prompt)}</p>
        ${isMoment ? `<div style="height:14px"></div><button class="btn" id="mark-beat">I wrote the ${escapeHtml(focus.name)}</button>` : ''}
      </div>

      <div class="card">
        <div class="eyebrow">Log today</div>
        <h2>${loggedToday ? `${fmt(loggedToday)} words logged` : 'Nothing logged yet'}</h2>

        <label for="log-words">Words written today</label>
        <input id="log-words" type="number" inputmode="numeric" min="0" step="10" value="${loggedToday || ''}" placeholder="0" />
        <button class="btn btn-ghost" id="paste-count" style="margin-top:6px">or paste today's writing and count it</button>

        <label for="log-note">Note (optional)</label>
        <textarea id="log-note" placeholder="What happened in the story today?">${escapeHtml(existingNote)}</textarea>

        <div style="height:14px"></div>
        <button class="btn btn-primary" id="log-save">Save today</button>
      </div>

      <div class="stats card">
        <div class="stat">
          <div class="stat-value">${streak}</div>
          <div class="stat-label">Day streak</div>
        </div>
        <div class="stat">
          <div class="stat-value">${fmt(averagePerDay(entries, 14))}</div>
          <div class="stat-label">Avg / day</div>
        </div>
        <div class="stat">
          <div class="stat-value">${fmt(state.remaining)}</div>
          <div class="stat-label">Words to go</div>
        </div>
      </div>
    </div>
  `);

  const markBtn = wrap.querySelector('#mark-beat');
  if (markBtn) {
    markBtn.addEventListener('click', async () => {
      const marks = { ...(project.beatMarks || {}) };
      marks[focus.key] = { words: state.total, date: todayStr() };
      await saveProject({ beatMarks: marks });
      render();
    });
  }

  wrap.querySelector('#paste-count').addEventListener('click', () => openPasteCounter(wrap.querySelector('#log-words')));

  wrap.querySelector('#log-save').addEventListener('click', async (ev) => {
    const words = Number(wrap.querySelector('#log-words').value) || 0;
    const note = wrap.querySelector('#log-note').value.trim();
    ev.target.disabled = true;
    await logToday(words, note);
    render();
  });

  return wrap;
}

function openPasteCounter(targetInput) {
  const modal = el(`
    <div class="modal-backdrop">
      <div class="modal-card">
        <h2>Count today's words</h2>
        <p class="prose muted">Paste what you wrote. Nothing here is saved anywhere -- only the number goes into your log.</p>
        <textarea id="pc-text" style="min-height:180px" placeholder="Paste your draft..."></textarea>
        <div class="hint" id="pc-count">0 words</div>
        <div style="height:14px"></div>
        <button class="btn btn-primary" id="pc-use">Use this count</button>
        <div style="height:8px"></div>
        <button class="btn btn-ghost" id="pc-cancel" style="width:100%">Cancel</button>
      </div>
    </div>
  `);

  const text = modal.querySelector('#pc-text');
  const count = modal.querySelector('#pc-count');
  text.addEventListener('input', () => {
    count.textContent = `${fmt(countWords(text.value))} words`;
  });

  modal.querySelector('#pc-use').addEventListener('click', () => {
    targetInput.value = countWords(text.value);
    modal.remove();
  });
  modal.querySelector('#pc-cancel').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

  document.getElementById('modal-root').appendChild(modal);
  text.focus();
}

// ---------- Map ----------

function renderMap() {
  const project = projectCache;
  const entries = sortedEntries();
  const state = programState(project, entries);

  const rows = state.beats.map((b) => {
    const mark = state.marks[b.key];
    const isCurrent = b.key === state.focus.key;
    const done = b.kind === 'moment' ? !!mark : state.total >= b.endWords;

    let dotClass = 'beat-dot';
    if (b.kind === 'moment') dotClass += ' moment';
    if (done) dotClass += ' done';
    else if (isCurrent) dotClass += ' current';

    const range = b.kind === 'moment'
      ? `at ${fmt(b.startWords)}`
      : `${fmt(b.startWords)}&ndash;${fmt(b.endWords)}`;

    let bar = '';
    if (b.kind === 'span') {
      const budget = b.endWords - b.startWords;
      const into = clamp(state.total - b.startWords, 0, budget * 2);
      const pct = clamp((into / budget) * 100, 0, 100);
      bar = `<div class="beat-bar"><div class="beat-bar-fill${into > budget ? ' over' : ''}" style="width:${pct.toFixed(1)}%"></div></div>`;
    }

    return `
      <div class="beat-row${isCurrent ? ' is-current' : ''}">
        <div class="${dotClass}"></div>
        <div>
          <div class="beat-name"><span>${escapeHtml(b.name)}</span><span class="beat-range">${range}</span></div>
          <div class="beat-summary">${escapeHtml(b.summary)}</div>
          ${bar}
        </div>
      </div>`;
  }).join('');

  const tpl = BEAT_TEMPLATES[project.templateId] || BEAT_TEMPLATES[DEFAULT_TEMPLATE_ID];

  return el(`
    <div>
      <div class="card">
        <div class="eyebrow">${escapeHtml(tpl.name)}</div>
        <h2>Your beat map</h2>
        <p class="prose muted">Diamonds are single scenes that land at a point. Circles are stretches with a word budget you can overrun.</p>
        <div style="margin-top:6px">${rows}</div>
      </div>
    </div>
  `);
}

// ---------- Trends ----------

function cumulativeSeries(entries) {
  let running = 0;
  const byDate = new Map();
  entries.forEach((e) => {
    running += e.words || 0;
    byDate.set(e.date, running);
  });
  return Array.from(byDate, ([date, words]) => ({ date, words }));
}

function renderChart(project, entries) {
  const series = cumulativeSeries(entries);
  if (series.length < 2) return '<p class="prose muted">Log a couple of days and a curve shows up here.</p>';

  const W = 600, H = 190, padL = 8, padR = 8, padT = 12, padB = 22;
  const startX = 0;
  const endX = Math.max(1, daysBetween(project.startDate, project.targetDate));
  const maxY = Math.max(project.targetWords, series[series.length - 1].words);

  const x = (dateStr) => padL + (clamp(daysBetween(project.startDate, dateStr), startX, endX) / endX) * (W - padL - padR);
  const y = (words) => padT + (1 - clamp(words / maxY, 0, 1)) * (H - padT - padB);

  const points = series.map((p) => `${x(p.date).toFixed(1)},${y(p.words).toFixed(1)}`).join(' ');
  const areaPoints = `${x(series[0].date).toFixed(1)},${(H - padB).toFixed(1)} ${points} ${x(series[series.length - 1].date).toFixed(1)},${(H - padB).toFixed(1)}`;
  const goal = `${x(project.startDate).toFixed(1)},${y(0).toFixed(1)} ${x(project.targetDate).toFixed(1)},${y(project.targetWords).toFixed(1)}`;

  return `
    <svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Cumulative words over time">
      <line class="chart-axis" x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}" />
      <polygon class="chart-area" points="${areaPoints}" />
      <polyline class="chart-goal" points="${goal}" />
      <polyline class="chart-line" points="${points}" />
    </svg>
    <div style="display:flex; justify-content:space-between; font-size:11px" class="muted">
      <span>${formatDate(project.startDate)}</span><span>dashed = on-pace line</span><span>${formatDate(project.targetDate)}</span>
    </div>`;
}

function renderTrends() {
  const project = projectCache;
  const entries = sortedEntries();
  const state = programState(project, entries);
  const finish = projectedFinish(project, entries);

  const recent = entries.slice().reverse().slice(0, 30);
  const list = recent.length
    ? recent.map((e) => `
        <div class="entry-row" data-id="${e.id}">
          <div>
            <div class="entry-date">${formatDate(e.date)}</div>
            ${e.note ? `<div class="entry-note">${escapeHtml(e.note)}</div>` : ''}
          </div>
          <div class="entry-words">${fmt(e.words)}</div>
        </div>`).join('')
    : '<div class="empty"><span class="empty-icon">📖</span>No sessions logged yet.</div>';

  let finishLine;
  if (!finish) {
    finishLine = 'Not enough recent writing to project a finish date.';
  } else if (finish <= project.targetDate) {
    finishLine = `At your current pace you finish around <strong>${formatDateLong(finish)}</strong>, ahead of target.`;
  } else {
    finishLine = `At your current pace you finish around <strong>${formatDateLong(finish)}</strong>, which is ${daysBetween(project.targetDate, finish)} days past target.`;
  }

  const wrap = el(`
    <div>
      <div class="card">
        <div class="eyebrow">Progress</div>
        <h2>${fmt(state.total)} words</h2>
        ${renderChart(project, entries)}
      </div>

      <div class="card">
        <div class="eyebrow">Projection</div>
        <p class="prose">${finishLine}</p>
        <div class="stats">
          <div class="stat">
            <div class="stat-value">${fmt(averagePerDay(entries, 7))}</div>
            <div class="stat-label">Last 7 days</div>
          </div>
          <div class="stat">
            <div class="stat-value">${fmt(averagePerDay(entries, 30))}</div>
            <div class="stat-label">Last 30 days</div>
          </div>
          <div class="stat">
            <div class="stat-value">${fmt(state.dailyTarget)}</div>
            <div class="stat-label">Needed / day</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="eyebrow">Sessions</div>
        <h2>Recent</h2>
        ${list}
        <div class="hint">Tap a session to delete it.</div>
      </div>
    </div>
  `);

  wrap.querySelectorAll('.entry-row').forEach((row) => {
    row.addEventListener('click', async () => {
      if (!confirm('Delete this session?')) return;
      await removeEntry(row.dataset.id);
      render();
    });
  });

  return wrap;
}

// ---------- Settings ----------

function openSettings() {
  const project = projectCache;
  const modal = el(`
    <div class="modal-backdrop">
      <div class="modal-card">
        <h2>Settings</h2>
        <p class="prose muted">${escapeHtml(currentUser.email || '')}</p>

        ${project ? `
        <label for="st-title">Working title</label>
        <input id="st-title" type="text" value="${escapeHtml(project.title)}" />

        <label for="st-target">Target word count</label>
        <input id="st-target" type="number" inputmode="numeric" min="1000" step="1000" value="${project.targetWords}" />

        <label for="st-end">Target finish date</label>
        <input id="st-end" type="date" value="${project.targetDate}" />

        <div style="height:14px"></div>
        <button class="btn btn-primary" id="st-save">Save project</button>
        <div style="height:18px"></div>` : ''}

        <button class="btn" id="st-export">Export backup (JSON)</button>
        <div style="height:8px"></div>
        <button class="btn" id="st-import">Import backup</button>
        <input id="st-file" type="file" accept="application/json" hidden />
        <div style="height:18px"></div>
        <button class="btn btn-danger" id="st-signout">Sign out</button>
        <div style="height:8px"></div>
        <button class="btn btn-ghost" id="st-close" style="width:100%">Close</button>
      </div>
    </div>
  `);

  const save = modal.querySelector('#st-save');
  if (save) {
    save.addEventListener('click', async () => {
      await saveProject({
        title: modal.querySelector('#st-title').value.trim() || 'Untitled',
        targetWords: Number(modal.querySelector('#st-target').value) || project.targetWords,
        targetDate: modal.querySelector('#st-end').value || project.targetDate,
      });
      modal.remove();
      render();
    });
  }

  modal.querySelector('#st-export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ project: projectCache, entries: entriesCache }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `couch-to-novel-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  const file = modal.querySelector('#st-file');
  modal.querySelector('#st-import').addEventListener('click', () => file.click());
  file.addEventListener('change', async () => {
    if (!file.files.length) return;
    try {
      const data = JSON.parse(await file.files[0].text());
      if (!Array.isArray(data.entries)) throw new Error('No entries in that file.');
      if (!confirm(`Import ${data.entries.length} sessions? This replaces what's here now.`)) return;
      await Cloud.bulkDeleteCloud(currentUser.uid, entriesCache);
      await Cloud.bulkImportCloud(currentUser.uid, data.entries);
      if (data.project) await Cloud.saveProjectCloud(currentUser.uid, data.project);
      modal.remove();
    } catch (err) {
      alert('Could not read that backup: ' + err.message);
    }
  });

  modal.querySelector('#st-signout').addEventListener('click', async () => {
    modal.remove();
    await Cloud.signOutUser();
  });

  modal.querySelector('#st-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

  document.getElementById('modal-root').appendChild(modal);
}

// ---------- Boot ----------

if (Cloud.isConfigured) {
  Cloud.onAuthChange((user) => {
    currentUser = user;

    if (unsubProject) { unsubProject(); unsubProject = null; }
    if (unsubEntries) { unsubEntries(); unsubEntries = null; }

    if (!user) {
      projectCache = null;
      entriesCache = [];
      render();
      return;
    }

    unsubProject = Cloud.subscribeProject(user.uid, (project) => {
      projectCache = project;
      render();
    });
    unsubEntries = Cloud.subscribeEntries(user.uid, (entries) => {
      entriesCache = entries;
      render();
    });
  });
} else {
  render();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
}
