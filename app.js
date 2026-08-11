import * as Cloud from './cloud.js';
import * as Scriv from './scrivener.js';

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

// ---------- Greetings ----------
// Rotated by day rather than at random, so it's stable across a re-render but
// different tomorrow.

const GREETINGS = [
  "{n}, let's work on your novel.",
  "It's time to write, {n}.",
  "Back to it, {n}.",
  "{n}, where were we?",
  "Let's find some words, {n}.",
  "Good to see you, {n}.",
  "{n}, the book is waiting.",
  "Today's pages, {n}.",
  "Ready when you are, {n}.",
  "{n}, one session at a time.",
];

const ROUTE_TITLE = { learn: 'The course', studio: 'Warm-ups', story: 'Your story', map: 'Your story', trends: 'Progress' };

function topbarTitle(project, route) {
  if (ROUTE_TITLE[route]) return ROUTE_TITLE[route];
  const name = (project && project.firstName || '').trim();
  if (!name) return 'Couch to Novel';
  const start = project.startDate || todayStr();
  const day = Math.abs(daysBetween(start, todayStr()));
  return GREETINGS[day % GREETINGS.length].replace('{n}', name);
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

  // Optional week zero. During it there's no word target at all, so those days
  // are excluded from the denominator -- otherwise the target would look
  // achievable now and jump the moment drafting actually starts.
  const onRampDays = project.onRampDays || 0;
  const inOnRamp = elapsedDays < onRampDays;
  const onRampToday = inOnRamp ? ON_RAMP[Math.min(elapsedDays, ON_RAMP.length - 1)] : null;
  const draftingDaysLeft = Math.max(0, daysLeft - Math.max(0, onRampDays - elapsedDays));
  const paceTarget = draftingDaysLeft > 0 ? Math.ceil(remaining / draftingDaysLeft) : remaining;
  const dailyTarget = inOnRamp ? 0 : paceTarget;

  // Bite-sized work within the current beat. Ticking a task is how the app
  // learns where your story is; the word count only knows where your volume is.
  const taskMarks = project.taskMarks || {};
  const beatTasks = BEAT_TASKS[focus.key] || [];
  const currentTask = beatTasks.find((t) => !taskMarks[t.id]) || null;
  const taskNumber = currentTask ? beatTasks.indexOf(currentTask) + 1 : beatTasks.length;

  const warmup = pickWarmup(elapsedDays);
  const cooldown = pickCooldown(elapsedDays);

  // Blueprint phase. Soft gate: this is where new projects start and the app
  // keeps pointing here, but nothing prevents switching to drafting. A
  // programme you cannot leave is a trap for a writer whose actual risk is
  // outlining forever.
  const inBlueprint = project.phase === 'blueprint';
  // Session 5 is the comps exercise, which is the point at which genre becomes
  // knowable. Confirm it there rather than trusting the guess from setup.
  const GENRE_GATE_TASK = 'bp-familiar-twist';
  const bpMarks = project.blueprintMarks || {};
  const bpTask = BLUEPRINT_TASKS.find((t) => !bpMarks[t.id]) || null;
  const bpDone = BLUEPRINT_TASKS.filter((t) => bpMarks[t.id]).length;
  const bpComplete = bpDone === BLUEPRINT_TASKS.length;
  const genreConfirmDue = !!bpMarks[GENRE_GATE_TASK] && !project.genreConfirmed;

  // Lessons unlock by position in the manuscript rather than by date, so one
  // arrives when it's about to be useful instead of accumulating into a
  // backlog. Foundations (beat: null) are open from day one.
  const lessonMarks = project.lessonMarks || {};
  const reachedBeats = new Set(
    beats.filter((b) => total >= b.startWords || b.key === focus.key).map((b) => b.key)
  );
  const availableLessons = LESSONS.filter((l) => lessonAppliesToGenre(l, project.genre));
  const unlockedLessons = availableLessons.filter((l) => !l.beat || reachedBeats.has(l.beat));
  const nextLesson = unlockedLessons.find((l) => !lessonMarks[l.id]) || null;

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
    inOnRamp,
    onRampToday,
    onRampDays,
    paceTarget,
    taskMarks,
    beatTasks,
    currentTask,
    taskNumber,
    warmup,
    cooldown,
    inBlueprint,
    genreConfirmDue,
    bpMarks,
    bpTask,
    bpDone,
    bpComplete,
    lessonMarks,
    reachedBeats,
    availableLessons,
    unlockedLessons,
    nextLesson,
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
let warmupsCache = [];
let unsubProject = null;
let unsubEntries = null;
let unsubWarmups = null;

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
  await patchTodayEntry({ words, note: note || '' });
}

// Warm-up and cool-down ticks live on the day's entry rather than in their own
// collection, so a session is one document and the backup stays readable.
async function patchTodayEntry(patch) {
  const date = todayStr();
  const existing = entriesCache.find((e) => e.date === date);
  const entry = existing
    ? { ...existing, ...patch }
    : { id: uid(), date, words: 0, note: '', ...patch };
  await upsertEntry(entry);
}

// ---------- Scrivener (read-only) ----------

let scrivHandle = null;

async function loadScrivHandle() {
  if (!Scriv.isSupported()) return null;
  scrivHandle = await Scriv.getStoredHandle();
  return scrivHandle;
}

// Sync sets *today's* entry so the cumulative total matches the manuscript.
// Keeping the daily-log shape means pace, streaks, the chart and drift all
// carry on working untouched -- they only ever needed the running total, and
// this way a manuscript number and a hand-typed one are the same kind of thing.
async function syncScrivener() {
  if (!scrivHandle) throw new Error('No project connected.');
  const result = await Scriv.syncFromHandle(scrivHandle);

  const today = todayStr();
  const priorDays = entriesCache
    .filter((e) => e.date !== today)
    .reduce((s, e) => s + (e.words || 0), 0);
  // Deleting words can put the manuscript below what earlier days already
  // logged. Clamping at zero keeps history honest rather than inventing a
  // negative day; the discrepancy shows up in the breakdown.
  const todayWords = Math.max(0, result.total - priorDays);

  // Sync recomputes today from the manuscript total, so a count typed by hand
  // this morning would vanish without warning -- which matters most on days
  // you wrote somewhere other than Scrivener.
  const existing = entriesCache.find((e) => e.date === today);
  if (existing && (existing.words || 0) > 0 && existing.source !== 'scrivener') {
    const ok = confirm(
      `Today already has ${fmt(existing.words)} words logged by hand.\n\n` +
      `Syncing replaces that with ${fmt(todayWords)} from Scrivener. If you wrote somewhere else today, that writing will stop being counted.\n\nSync anyway?`
    );
    if (!ok) return { ...result, cancelled: true };
  }

  await patchTodayEntry({ words: todayWords, source: 'scrivener' });
  await saveProject({
    scrivener: {
      projectName: result.projectName,
      syncedAt: result.syncedAt,
      total: result.total,
      documents: result.documents,
    },
  });
  return result;
}

function scrivStatusLine(project) {
  const s = project.scrivener;
  if (!s) return '';
  const mins = Math.round((Date.now() - new Date(s.syncedAt).getTime()) / 60000);
  const when = mins < 1 ? 'just now' : mins < 60 ? `${mins} min ago` : `${Math.round(mins / 60)}h ago`;
  return `${escapeHtml(s.projectName)} &middot; synced ${when}`;
}

function chooseScrivProject(candidates) {
  return new Promise((resolve) => {
    const modal = el(`
      <div class="modal-backdrop">
        <div class="modal-card">
          <div class="eyebrow">Scrivener</div>
          <h2>Which project?</h2>
          <p class="prose muted">Found ${candidates.length} Scrivener projects in that folder.</p>
          ${candidates.map((c, i) => `
            <div class="lesson-row" data-idx="${i}">
              <div class="lesson-mark">📄</div>
              <div><div class="lesson-title">${escapeHtml(c.name)}</div></div>
            </div>`).join('')}
          <div style="height:14px"></div>
          <button class="btn btn-ghost" id="cp-cancel" style="width:100%">Cancel</button>
        </div>
      </div>`);
    const done = (v) => { modal.remove(); resolve(v); };
    modal.querySelectorAll('[data-idx]').forEach((row) => {
      row.addEventListener('click', () => done(candidates[Number(row.dataset.idx)]));
    });
    modal.querySelector('#cp-cancel').addEventListener('click', () => done(null));
    modal.addEventListener('click', (e) => { if (e.target === modal) done(null); });
    document.getElementById('modal-root').appendChild(modal);
  });
}

function openScrivBreakdown() {
  const s = (projectCache || {}).scrivener;
  if (!s) return;
  const rows = s.documents.length
    ? s.documents.map((d) => `
        <div class="entry-row">
          <div>
            <div class="entry-date">${escapeHtml(d.title)}</div>
            <div class="entry-note">${escapeHtml(d.path)}</div>
          </div>
          <div class="entry-words">${fmt(d.words)}</div>
        </div>`).join('')
    : '<p class="prose muted">No documents in the Draft folder yet.</p>';

  const modal = el(`
    <div class="modal-backdrop">
      <div class="modal-card">
        <div class="eyebrow">Manuscript &middot; ${escapeHtml(s.projectName)}</div>
        <h2>${fmt(s.total)} words in ${s.documents.length} documents</h2>
        <p class="prose muted">Only documents inside Scrivener's Draft folder are counted. Front matter, character sketches, research and template sheets sit outside it and are ignored, as is anything you've unticked from Include in Compile.</p>
        ${rows}
        <div style="height:16px"></div>
        <button class="btn btn-ghost" id="sb-close" style="width:100%">Close</button>
      </div>
    </div>`);
  modal.querySelector('#sb-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.getElementById('modal-root').appendChild(modal);
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

// One deep tone per tab, set on the root element so every component -- and
// every property derived from it -- reads a single --tone variable.
const ROUTE_TONE = { today: 'today', learn: 'learn', studio: 'studio', story: 'story', map: 'story', trends: 'trends' };


// The installed-PWA title bar takes its colour from the theme-color meta tag,
// so pointing it at the page's computed background makes the window chrome
// follow whichever room you're in. Read the resolved background rather than
// the custom property: getPropertyValue on a var() chain is not reliably
// substituted across browsers, whereas backgroundColor always comes back as a
// concrete rgb().
function syncThemeColor() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  const bg = getComputedStyle(document.body).backgroundColor;
  if (bg && bg !== 'rgba(0, 0, 0, 0)') meta.setAttribute('content', bg);
}

function syncNav() {
  const route = getRoute();
  document.documentElement.dataset.tone = ROUTE_TONE[route] || 'today';
  syncThemeColor();
  document.getElementById('topbar-title').textContent = topbarTitle(projectCache, route);
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
  if (route === 'story' || route === 'map') app.appendChild(renderStory());
  else if (route === 'learn') app.appendChild(renderLearn());
  else if (route === 'studio') app.appendChild(renderStudio());
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

        <label for="su-name">Your first name</label>
        <input id="su-name" type="text" placeholder="Aly" value="${escapeHtml(localStorage.getItem('firstName') || '')}" />
        <div class="hint">Only used to say hello.</div>

        <label for="su-title">Working title</label>
        <input id="su-title" type="text" placeholder="Untitled" />

        <label for="su-genre">Genre</label>
        <select id="su-genre">${genreOptions}</select>
        <div class="hint">A guess is fine &mdash; the blueprint revisits this once you've named your comparable books, and the word target follows. Beat positions are percentages, so they scale to whatever you land on.</div>

        <label for="su-target">Target word count</label>
        <input id="su-target" type="number" inputmode="numeric" min="10000" step="1000" />

        <label for="su-start">Start date</label>
        <input id="su-start" type="date" value="${todayStr()}" />

        <label for="su-end">Target finish date</label>
        <input id="su-end" type="date" value="${defaultTarget}" />
        <div class="hint" id="su-pace"></div>

        <label style="display:flex; align-items:flex-start; gap:9px; margin-top:16px; font-weight:600; color:var(--text)">
          <input type="checkbox" id="su-onramp" checked style="width:auto; margin-top:2px" />
          <span>Start with a ${ON_RAMP.length}-day warm-up week</span>
        </label>
        <div class="hint">No word targets and no manuscript for the first ${ON_RAMP.length} days -- short exercises to get writing again before the program starts. Couch to 5K doesn't put you on a 5K in week one either.</div>

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
  genre.value = 'unsure';

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
    const firstName = wrap.querySelector('#su-name').value.trim();
    if (firstName) localStorage.setItem('firstName', firstName);
    await saveProject({
      firstName,
      title: wrap.querySelector('#su-title').value.trim() || 'Untitled',
      genre: genre.value,
      genreConfirmed: false,
      targetWords: words,
      startDate: start.value,
      targetDate: end.value,
      templateId: DEFAULT_TEMPLATE_ID,
      phase: 'blueprint',
      blueprint: {},
      characters: [],
      beatNotes: {},
      scenes: [],
      blueprintMarks: {},
      beatMarks: {},
      taskMarks: {},
      onRampDays: wrap.querySelector('#su-onramp').checked ? ON_RAMP.length : 0,
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
  if (state.inBlueprint) return renderBlueprintSession(project, entries, state);
  const todayEntry = entries.find((e) => e.date === todayStr()) || {};
  const loggedToday = wordsOnDate(entries, todayStr());
  const streak = currentStreak(entries);
  const focus = state.focus;

  // Exactly one card is loud at a time. Writing and logging are one step --
  // you can't tell the writing happened until the number lands.
  const step = !todayEntry.warmedUp ? 1 : loggedToday === 0 ? 2 : 3;
  const stepCls = (n) => `step ${n === step ? 'is-current' : n < step ? 'is-done' : 'is-upcoming'}`;
  const primary = (n) => (n === step ? ' btn-primary' : '');
  const rowCls = (n) => (n < step ? ' is-done' : n === step ? ' is-current' : '');
  const stepN = (n) => `<span class="step-n">${n < step ? '✓' : n}</span>`;

  let structural;
  if (state.inOnRamp) {
    structural = `<span class="pill">Warm-up week</span>`;
  } else if (state.momentDrift > 0) {
    structural = `<span class="pill pill-bad">${fmt(state.momentDrift)} words past where ${escapeHtml(focus.name)} should land</span>`;
  } else if (state.dueMoment) {
    structural = `<span class="pill pill-warn">${escapeHtml(focus.name)} is due now</span>`;
  } else if (state.nextMoment) {
    structural = `<span class="pill">${fmt(state.nextMoment.startWords - state.total)} words until ${escapeHtml(state.nextMoment.name)}</span>`;
  } else {
    structural = `<span class="pill pill-good">Every beat written</span>`;
  }

  const headerCard = state.inOnRamp
    ? `<div class="card">
         <div class="eyebrow">Warm-up week &middot; day ${state.elapsedDays + 1} of ${state.onRampDays} &middot; ${escapeHtml(project.title)}</div>
         <div class="today-target">No target <small>yet</small></div>
         <div style="margin-top:10px">${structural}</div>
         <div class="muted" style="font-size:13px; margin-top:8px">Drafting starts ${formatDateLong(addDays(project.startDate, state.onRampDays))} at about ${fmt(state.paceTarget)} words a day. Until then the only job is showing up.</div>
       </div>`
    : `<div class="panel">
         <div class="eyebrow">Day ${state.elapsedDays + 1} of ${state.totalDays} &middot; ${escapeHtml(project.title)}</div>
         <div class="today-target">${fmt(state.dailyTarget)} <small>words today</small></div>
         <div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap">${pacePill(state)} ${structural}</div>
         <div class="progress"><div class="progress-fill" style="width:${(state.pctComplete * 100).toFixed(1)}%"></div></div>
         <div class="muted" style="font-size:13px">${fmt(state.total)} of ${fmt(project.targetWords)} words &middot; ${state.daysLeft} days left</div>
       </div>`;

  const warmupCard = `
    <div class="card ${stepCls(1)}">
      <div class="eyebrow">${stepN(1)}Warm-up &middot; ${state.warmup.minutes} min &middot; not the manuscript</div>
      <h2>${escapeHtml(state.warmup.name)}</h2>
      <p class="beat-prompt">${escapeHtml(state.warmup.prompt)}</p>
      ${homeStrip('Warm-ups tab', 'in this app &middot; never counted toward your novel')}
      <div style="height:12px"></div>
      <div class="btn-row">
        <button class="btn${primary(1)}" id="warmup-write">Write it here</button>
        <button class="btn" id="warmup-done">${todayEntry.warmedUp ? 'Undo' : 'Mark done'}</button>
      </div>
    </div>`;

  let mainCard;
  if (state.inOnRamp) {
    const o = state.onRampToday;
    mainCard = `
      <div class="card">
        <div class="eyebrow">Today's work &middot; about ${o.minutes} min</div>
        <h2>${escapeHtml(o.name)}</h2>
        <p class="beat-prompt">${escapeHtml(o.prompt)}</p>
      </div>`;
  } else {
    const t = state.currentTask;
    const allDone = !t;
    // Name the actual document when a scene list exists, so "write in
    // Scrivener" becomes "write in this document" -- the difference between
    // an instruction and a destination.
    const scenes = project.scenes || [];
    const nextScene =
      scenes.find((sc) => !sc.done && sc.beatKey === focus.key) ||
      scenes.find((sc) => !sc.done) ||
      null;
    const scrivWhere = nextScene
      ? `Scrivener &rarr; Manuscript &rarr; ${escapeHtml(nextScene.title || `Scene ${nextScene.index}`)}`
      : 'Scrivener &rarr; Manuscript';
    const scrivNote = nextScene
      ? `scene ${nextScene.index} of ${scenes.length}${nextScene.summary ? ` &middot; ${escapeHtml(nextScene.summary.slice(0, 80))}` : ''}`
      : 'the only writing that counts toward your word target';
    mainCard = `
      <div class="card ${stepCls(2)}">
        <div class="eyebrow">${stepN(2)}${focus.kind === 'moment' ? 'Scene due' : 'Current beat'} &middot; ${escapeHtml(focus.name)}</div>
        ${t ? `
          <h2>${escapeHtml(t.label)}</h2>
          <div class="session-meta">Assignment ${state.taskNumber} of ${state.beatTasks.length} &middot; may take more than one session</div>
          <p class="beat-prompt">${escapeHtml(t.detail)}</p>
          ${homeStrip(scrivWhere, scrivNote, 'external')}
          <div style="height:14px"></div>
          <button class="btn" id="task-done">Mark this assignment done</button>
        ` : `
          <h2>${escapeHtml(focus.name)} is written</h2>
          <p class="prose muted">${escapeHtml(focus.summary)}</p>
          ${focus.kind === 'moment' && !state.marks[focus.key]
            ? `<button class="btn${primary(2)}" id="mark-beat">Tick off ${escapeHtml(focus.name)}</button>`
            : `<p class="prose muted" style="margin:0">Keep going. The word count moves you into the next beat.</p>`}
        `}
      </div>`;
  }

  const scrivCard = scrivHandle
    ? `<div class="card ${stepCls(2)}">
         <div class="eyebrow">Manuscript &middot; ${scrivStatusLine(project) || 'not synced yet'}</div>
         <h2>${project.scrivener ? `${fmt(project.scrivener.total)} words` : 'Sync to count'}</h2>
         <p class="prose muted" style="margin-bottom:12px">Counted straight from your Scrivener Draft folder. Front matter, notes and research are excluded.</p>
         <div class="btn-row">
           <button class="btn${primary(2)}" id="scriv-sync">Sync now</button>
           ${project.scrivener ? '<button class="btn" id="scriv-breakdown">Breakdown</button>' : ''}
         </div>
         <div class="error" id="scriv-error" hidden></div>
       </div>`
    : '';

  const logCard = `
    <div class="card ${stepCls(2)}">
      <div class="eyebrow">Log today${scrivHandle ? ' &middot; manual override' : ''}</div>
      <h2>${loggedToday ? `${fmt(loggedToday)} words logged` : 'Nothing logged yet'}</h2>
      <label for="log-words">Words written today</label>
      <input id="log-words" type="number" inputmode="numeric" min="0" step="10" value="${loggedToday || ''}" placeholder="0" />
      <button class="btn btn-ghost" id="paste-count" style="margin-top:6px">or paste today's writing and count it</button>
      <label for="log-note">Note (optional)</label>
      <textarea id="log-note" placeholder="What happened in the story today?">${escapeHtml(todayEntry.note || '')}</textarea>
      <div style="height:14px"></div>
      <button class="btn${scrivHandle ? '' : primary(2)}" id="log-save">Save today</button>
    </div>`;

  const cooldownCard = `
    <div class="card ${stepCls(3)}">
      <div class="eyebrow">${stepN(3)}Cool-down &middot; ${state.cooldown.minutes} min &middot; do not skip this one</div>
      <h2>${escapeHtml(state.cooldown.name)}</h2>
      <p class="beat-prompt">${escapeHtml(state.cooldown.prompt)}</p>
      ${homeStrip('Wherever you draft', 'a note to your future self &middot; nothing is saved here', 'nowhere')}
      <div style="height:12px"></div>
      <button class="btn${todayEntry.cooledDown ? '' : primary(3)}" id="cooldown-done">${todayEntry.cooledDown ? 'Undo' : 'Done'}</button>
    </div>`;

  // The rail answers "what's left of today", not "where am I in the
  // programme" -- that lives in Learn, and repeating it here is what made the
  // old rail read as noise.
  const sessionDone = loggedToday > 0;
  const statsCard = `
    <div class="panel">
      <div class="eyebrow">This session</div>
      <div class="checklist">
        <div class="check-row${rowCls(1)}">
          <div class="check-mark">✓</div><div class="check-label">Warm-up</div>
        </div>
        <div class="check-row${rowCls(2)}">
          <div class="check-mark">✓</div><div class="check-label">${sessionDone ? `${fmt(loggedToday)} words` : `${fmt(state.dailyTarget)} words`}</div>
        </div>
        <div class="check-row${rowCls(3)}">
          <div class="check-mark">✓</div><div class="check-label">Cool-down</div>
        </div>
      </div>
    </div>
    <div class="stats panel">
      <div class="stat"><div class="stat-value">${streak}</div><div class="stat-label">Day streak</div></div>
      <div class="stat"><div class="stat-value">${fmt(averagePerDay(entries, 14))}</div><div class="stat-label">Avg / day</div></div>
      <div class="stat"><div class="stat-value">${fmt(state.remaining)}</div><div class="stat-label">Words to go</div></div>
    </div>`;

  const lessonCard = state.nextLesson
    ? `<div class="card lesson-callout">
         <div class="eyebrow">New lesson unlocked &middot; ${state.nextLesson.minutes} min</div>
         <h2>${escapeHtml(state.nextLesson.title)}</h2>
         <div style="height:10px"></div>
         <button class="btn" id="read-lesson">Read it</button>
       </div>`
    : '';

  // Three groups rather than a flat list, so wide screens can put the session
  // in one column and status in a rail without changing the mobile order.
  const wrap = el(`
    <div class="view-today">
      <div class="grp-head">${headerCard}${lessonCard}</div>
      <div class="grp-main">${warmupCard}${mainCard}${scrivCard}${logCard}${cooldownCard}</div>
      <div class="grp-side">${statsCard}</div>
    </div>`);

  const readBtn = wrap.querySelector('#read-lesson');
  if (readBtn) readBtn.addEventListener('click', () => openLesson(state.nextLesson));

  wrap.querySelector('#warmup-write').addEventListener('click', () => openWarmupExercise(state.warmup));
  wrap.querySelector('#warmup-done').addEventListener('click', async () => {
    await patchTodayEntry({ warmedUp: !todayEntry.warmedUp });
    render();
  });

  wrap.querySelector('#cooldown-done').addEventListener('click', async () => {
    await patchTodayEntry({ cooledDown: !todayEntry.cooledDown });
    render();
  });

  const taskBtn = wrap.querySelector('#task-done');
  if (taskBtn) {
    taskBtn.addEventListener('click', async () => {
      const t = state.currentTask;
      const taskMarks = { ...(project.taskMarks || {}), [t.id]: { date: todayStr(), words: state.total } };
      const patch = { taskMarks };
      // Finishing the last assignment for a moment ticks the beat itself, so
      // the two never drift out of sync.
      const stillOpen = state.beatTasks.filter((x) => !taskMarks[x.id]);
      if (!stillOpen.length && focus.kind === 'moment') {
        patch.beatMarks = { ...(project.beatMarks || {}), [focus.key]: { date: todayStr(), words: state.total } };
      }
      await saveProject(patch);
      render();
    });
  }

  const markBtn = wrap.querySelector('#mark-beat');
  if (markBtn) {
    markBtn.addEventListener('click', async () => {
      const marks = { ...(project.beatMarks || {}) };
      marks[focus.key] = { words: state.total, date: todayStr() };
      await saveProject({ beatMarks: marks });
      render();
    });
  }

  const syncBtn = wrap.querySelector('#scriv-sync');
  if (syncBtn) {
    syncBtn.addEventListener('click', async () => {
      const errBox = wrap.querySelector('#scriv-error');
      errBox.hidden = true;
      syncBtn.disabled = true;
      syncBtn.textContent = 'Syncing...';
      try {
        await syncScrivener();
        render();
      } catch (err) {
        errBox.textContent = err.message;
        errBox.hidden = false;
        syncBtn.disabled = false;
        syncBtn.textContent = 'Sync now';
      }
    });
  }
  const bdBtn = wrap.querySelector('#scriv-breakdown');
  if (bdBtn) bdBtn.addEventListener('click', openScrivBreakdown);

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


// Every piece of writing the programme asks for has exactly one home, and the
// card says which. Four kinds exist and only one of them belongs in Scrivener,
// which is precisely the thing that was impossible to tell from the UI.
function homeStrip(where, note, kind) {
  const cls = kind === 'external' ? ' is-external' : kind === 'nowhere' ? ' is-nowhere' : '';
  return `<div class="home-strip${cls}">
    <span class="home-label">Goes to</span>
    <span><span class="home-where">${where}</span>${note ? ` <span class="home-note">&middot; ${note}</span>` : ''}</span>
  </div>`;
}

// ---------- Blueprint ----------

const ARTIFACT_LABEL = {
  premise: 'Premise',
  logline: 'Logline',
  theme: 'Theme',
  notes: 'Notes',
  characters: 'Cast',
  beats: 'Beats',
  scenes: 'Scene list',
};

async function startDrafting() {
  // Soft gate: drafting begins whenever you say so. Start date resets to today
  // so the pace maths reflects the runway you actually have left, rather than
  // reporting you as weeks behind for time spent outlining.
  await saveProject({ phase: 'draft', startDate: todayStr() });
  navigate('today');
  render();
}


// Genre is asked for at setup because the word target has to start somewhere,
// but it isn't knowable until you've named your comparable books. This runs
// after that session and is the point at which the target becomes real.
function openGenreConfirm() {
  const project = projectCache;
  const opts = GENRE_TARGETS.filter((g) => g.id !== 'unsure')
    .map((g) => `<option value="${g.id}"${g.id === project.genre ? ' selected' : ''}>${g.label} (~${fmt(g.words)} words)</option>`).join('');
  const current = GENRE_TARGETS.find((g) => g.id === project.genre);

  const modal = el(`
    <div class="modal-backdrop">
      <div class="modal-card">
        <div class="eyebrow">Blueprint &middot; after the comps</div>
        <h2>What are you actually writing?</h2>
        <p class="prose muted">You started with ${escapeHtml(current ? current.label.toLowerCase() : 'a guess')}. Now that you've named the books yours would sit beside, this is the moment to make it real &mdash; it sets your word target, and the scene list is built from that.</p>

        <label for="gc-genre">Genre</label>
        <select id="gc-genre">${opts}</select>

        <label for="gc-target">Target word count</label>
        <input id="gc-target" type="number" inputmode="numeric" min="10000" step="1000" value="${project.targetWords}" />
        <div class="hint" id="gc-hint"></div>

        <div style="height:16px"></div>
        <button class="btn btn-primary" id="gc-save">Confirm</button>
        <div style="height:8px"></div>
        <button class="btn btn-ghost" id="gc-later" style="width:100%">Still deciding &mdash; ask me later</button>
      </div>
    </div>`);

  const sel = modal.querySelector('#gc-genre');
  const tgt = modal.querySelector('#gc-target');
  const hint = modal.querySelector('#gc-hint');
  const suggest = () => {
    const g = GENRE_TARGETS.find((x) => x.id === sel.value);
    if (!g) return;
    hint.textContent = Number(tgt.value) === g.words
      ? `Typical for ${g.label.toLowerCase()}.`
      : `${g.label} usually runs about ${fmt(g.words)} words.`;
  };
  sel.addEventListener('change', () => { const g = GENRE_TARGETS.find((x) => x.id === sel.value); if (g) tgt.value = g.words; suggest(); });
  tgt.addEventListener('input', suggest);
  suggest();

  modal.querySelector('#gc-save').addEventListener('click', async () => {
    await saveProject({
      genre: sel.value,
      targetWords: Number(tgt.value) || project.targetWords,
      genreConfirmed: true,
    });
    modal.remove();
    render();
  });
  modal.querySelector('#gc-later').addEventListener('click', () => modal.remove());
  document.getElementById('modal-root').appendChild(modal);
}

function renderBlueprintSession(project, entries, state) {
  const todayEntry = entries.find((e) => e.date === todayStr()) || {};
  const task = doneToday || state.bpTask;
  const mod = task ? BLUEPRINT_MODULES.find((m) => m.id === task.module) : null;
  const pct = (state.bpDone / BLUEPRINT_TASKS.length) * 100;
  // Which of the three steps you're on, so exactly one card is loud.
  const bpSessionDone = !!todayEntry.sessionDone;
  // Once today's session is marked done the card keeps showing THAT task with
  // an undo, rather than silently advancing to the next one and offering to
  // mark it done as well.
  const doneToday = bpSessionDone
    ? BLUEPRINT_TASKS.find((t) => t.id === todayEntry.sessionTaskId) || null
    : null;
  const step = !todayEntry.warmedUp ? 1 : !bpSessionDone ? 2 : 3;
  const stepCls = (n) => `step ${n === step ? 'is-current' : n < step ? 'is-done' : 'is-upcoming'}`;
  // While the genre prompt is up it is the one thing to do, so the step
  // buttons stand down rather than competing with it for the eye.
  const primary = (n) => (n === step && !state.genreConfirmDue ? ' btn-primary' : '');
  const rowCls = (n) => (n < step ? ' is-done' : n === step ? ' is-current' : '');
  const stepN = (n) => `<span class="step-n">${n < step ? '✓' : n}</span>`;

  const headerCard = `
    <div class="panel">
      <div class="eyebrow">Blueprint &middot; ${escapeHtml(project.title)}</div>
      <div class="today-target">${state.bpDone}<small> of ${BLUEPRINT_TASKS.length} done</small></div>
      <div class="progress"><div class="progress-fill" style="width:${pct.toFixed(1)}%"></div></div>
      <div class="muted" style="font-size:13px">${mod ? `Module ${mod.id}: ${escapeHtml(mod.name)}` : 'Blueprint complete'}</div>
      <div style="height:14px"></div>
      <button class="btn${state.bpComplete ? ' btn-primary' : ''}" id="start-draft">${state.bpComplete ? 'Start drafting' : 'Skip ahead to drafting'}</button>
      ${state.bpComplete ? '' : '<div class="hint">You can leave the blueprint at any point. Outlining is the most comfortable place in the world to hide.</div>'}
    </div>`;

  const genreCard = state.genreConfirmDue
    ? `<div class="card lesson-callout">
         <div class="eyebrow">One thing to settle</div>
         <h2>Is it still ${escapeHtml((GENRE_TARGETS.find((g) => g.id === project.genre) || {}).label || 'that genre')}?</h2>
         <p class="prose muted">You've named your comps, so genre is knowable now. It sets your word target, and your scene list gets built from that.</p>
         <div style="height:10px"></div>
         <button class="btn btn-primary" id="confirm-genre">Confirm your genre</button>
       </div>`
    : '';

  const warmupCard = `
    <div class="card ${stepCls(1)}">
      <div class="eyebrow">${stepN(1)}Warm-up &middot; ${state.warmup.minutes} min</div>
      <h2>${escapeHtml(state.warmup.name)}</h2>
      <p class="beat-prompt">${escapeHtml(state.warmup.prompt)}</p>
      ${homeStrip('Warm-ups tab', 'in this app &middot; never counted toward your novel')}
      <div style="height:12px"></div>
      <div class="btn-row">
        <button class="btn${primary(1)}" id="warmup-write">Write it here</button>
        <button class="btn" id="warmup-done">${todayEntry.warmedUp ? 'Undo' : 'Mark done'}</button>
      </div>
    </div>`;

  const mainCard = task
    ? `<div class="card ${stepCls(2)}">
         <div class="eyebrow">${stepN(2)}Session ${state.bpDone + 1} of ${BLUEPRINT_TASKS.length} &middot; ${task.minutes} min &middot; writes your ${escapeHtml(ARTIFACT_LABEL[task.artifact] || task.artifact)}</div>
         <h2>${escapeHtml(task.name)}</h2>
         <p class="beat-prompt">${escapeHtml(task.prompt)}</p>
         ${homeStrip(`Story tab &rarr; ${escapeHtml(ARTIFACT_LABEL[task.artifact] || task.artifact)}`, 'in this app &middot; exportable to Scrivener any time')}
         <div class="lesson-practice"><div class="eyebrow" style="margin-bottom:4px">Why</div>${escapeHtml(task.help)}</div>
         <div style="height:14px"></div>
         <div class="btn-row">
           <button class="btn${primary(2)}" id="bp-open">Open your ${escapeHtml((ARTIFACT_LABEL[task.artifact] || '').toLowerCase())}</button>
           <button class="btn" id="bp-done">${bpSessionDone ? 'Undo' : 'Mark done'}</button>
         </div>
       </div>`
    : `<div class="card">
         <div class="eyebrow">Blueprint complete</div>
         <h2>You have a book to write</h2>
         <p class="prose muted">Premise, cast, fifteen beats and a scene list. The drafting programme picks up from here and every scene already knows what it is for.</p>
       </div>`;

  const cooldownCard = `
    <div class="card ${stepCls(3)}">
      <div class="eyebrow">${stepN(3)}Cool-down &middot; ${state.cooldown.minutes} min</div>
      <h2>${escapeHtml(state.cooldown.name)}</h2>
      <p class="beat-prompt">${escapeHtml(state.cooldown.prompt)}</p>
      ${homeStrip('Wherever you draft', 'a note to your future self &middot; nothing is saved here', 'nowhere')}
      <div style="height:12px"></div>
      <button class="btn${todayEntry.cooledDown ? '' : primary(3)}" id="cooldown-done">${todayEntry.cooledDown ? 'Undo' : 'Done'}</button>
    </div>`;

  const bpMod = task ? BLUEPRINT_MODULES.find((m) => m.id === task.module) : null;
  const weeksCard = `
    <div class="panel">
      <div class="eyebrow">This session</div>
      <div class="checklist">
        <div class="check-row${rowCls(1)}">
          <div class="check-mark">✓</div><div class="check-label">Warm-up</div>
        </div>
        <div class="check-row${rowCls(2)}">
          <div class="check-mark">✓</div><div class="check-label">${task ? `Session ${state.bpDone + 1} of ${BLUEPRINT_TASKS.length}` : 'Blueprint complete'}</div>
        </div>
        <div class="check-row${rowCls(3)}">
          <div class="check-mark">✓</div><div class="check-label">Cool-down</div>
        </div>
      </div>
      ${bpMod ? `<div class="hint" style="margin-top:12px">Module ${bpMod.id} &middot; ${escapeHtml(bpMod.name)}</div>` : ''}
      <div style="height:12px"></div>
      <button class="btn" id="see-all-sessions">See all ${BLUEPRINT_TASKS.length} sessions</button>
    </div>`;

  const wrap = el(`
    <div class="view-today">
      <div class="grp-head">${headerCard}${genreCard}</div>
      <div class="grp-main">${warmupCard}${mainCard}${cooldownCard}</div>
      <div class="grp-side">${weeksCard}</div>
    </div>`);

  wrap.querySelector('#warmup-write').addEventListener('click', () => openWarmupExercise(state.warmup));
  wrap.querySelector('#warmup-done').addEventListener('click', async () => {
    await patchTodayEntry({ warmedUp: !todayEntry.warmedUp });
    render();
  });
  wrap.querySelector('#cooldown-done').addEventListener('click', async () => {
    await patchTodayEntry({ cooledDown: !todayEntry.cooledDown });
    render();
  });
  const gcBtn = wrap.querySelector('#confirm-genre');
  if (gcBtn) gcBtn.addEventListener('click', openGenreConfirm);

  wrap.querySelector('#start-draft').addEventListener('click', async () => {
    if (!state.bpComplete && !confirm('Leave the blueprint and start drafting? You can come back to it any time from the Story tab.')) return;
    await startDrafting();
  });

  wrap.querySelector('#see-all-sessions').addEventListener('click', () => navigate('learn'));

  const open = wrap.querySelector('#bp-open');
  if (open) open.addEventListener('click', () => openArtifactEditor(task.artifact));
  const done = wrap.querySelector('#bp-done');
  if (done) {
    done.addEventListener('click', async () => {
      const marks = { ...(project.blueprintMarks || {}) };
      if (bpSessionDone) {
        delete marks[task.id];
        await saveProject({ blueprintMarks: marks });
        await patchTodayEntry({ sessionDone: false, sessionTaskId: '' });
      } else {
        marks[task.id] = { date: todayStr() };
        await saveProject({ blueprintMarks: marks });
        await patchTodayEntry({ sessionDone: true, sessionTaskId: task.id });
      }
      render();
    });
  }

  return wrap;
}

function openBlueprintTask(task) {
  const project = projectCache;
  const marks = project.blueprintMarks || {};
  const done = !!marks[task.id];
  const mod = BLUEPRINT_MODULES.find((m) => m.id === task.module);
  const n = BLUEPRINT_TASKS.indexOf(task) + 1;

  const modal = el(`
    <div class="modal-backdrop">
      <div class="modal-card">
        <div class="eyebrow">Session ${n} of ${BLUEPRINT_TASKS.length} &middot; ${escapeHtml(mod ? mod.name : '')} &middot; ${task.minutes} min</div>
        <h2>${escapeHtml(task.name)}</h2>
        <p class="beat-prompt">${escapeHtml(task.prompt)}</p>
        ${homeStrip(`Story tab &rarr; ${escapeHtml(ARTIFACT_LABEL[task.artifact] || task.artifact)}`, 'in this app')}
        <div class="lesson-practice">
          <div class="eyebrow" style="margin-bottom:4px">Why</div>
          ${escapeHtml(task.help)}
        </div>
        <div style="height:16px"></div>
        <button class="btn btn-primary" id="bpt-open">Open your ${escapeHtml((ARTIFACT_LABEL[task.artifact] || '').toLowerCase())}</button>
        <div style="height:8px"></div>
        <button class="btn" id="bpt-done">${done ? '✓ Done — mark undone' : 'Mark done'}</button>
        <div style="height:8px"></div>
        <button class="btn btn-ghost" id="bpt-close" style="width:100%">Close</button>
      </div>
    </div>`);

  modal.querySelector('#bpt-open').addEventListener('click', () => {
    modal.remove();
    openArtifactEditor(task.artifact);
  });
  modal.querySelector('#bpt-done').addEventListener('click', async () => {
    const next = { ...marks };
    if (done) delete next[task.id];
    else next[task.id] = { date: todayStr() };
    await saveProject({ blueprintMarks: next });
    modal.remove();
    render();
  });
  modal.querySelector('#bpt-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.getElementById('modal-root').appendChild(modal);
}

// ---------- Artifact editors ----------

function openArtifactEditor(kind) {
  if (kind === 'characters') return openCastEditor();
  if (kind === 'beats') return openBeatNotesEditor();
  if (kind === 'scenes') return openSceneEditor();
  return openTextArtifact(kind);
}

function openTextArtifact(field) {
  const bp = projectCache.blueprint || {};
  const modal = el(`
    <div class="modal-backdrop">
      <div class="modal-card">
        <div class="eyebrow">Blueprint</div>
        <h2>${escapeHtml(ARTIFACT_LABEL[field] || field)}</h2>
        <textarea id="ta-text" style="min-height:220px">${escapeHtml(bp[field] || '')}</textarea>
        <div style="height:12px"></div>
        <button class="btn btn-primary" id="ta-save">Save</button>
        <div style="height:8px"></div>
        <button class="btn btn-ghost" id="ta-close" style="width:100%">Close</button>
      </div>
    </div>`);
  modal.querySelector('#ta-save').addEventListener('click', async () => {
    await saveProject({ blueprint: { ...bp, [field]: modal.querySelector('#ta-text').value } });
    modal.remove();
    render();
  });
  modal.querySelector('#ta-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.getElementById('modal-root').appendChild(modal);
  modal.querySelector('#ta-text').focus();
}

function openCastEditor(editId) {
  const cast = projectCache.characters || [];
  const c = cast.find((x) => x.id === editId) || { id: uid(), name: '', role: '', want: '', need: '', wound: '', notes: '' };
  const isNew = !cast.find((x) => x.id === c.id);

  const modal = el(`
    <div class="modal-backdrop">
      <div class="modal-card">
        <div class="eyebrow">Cast</div>
        <h2>${isNew ? 'New character' : escapeHtml(c.name || 'Character')}</h2>
        <label for="ch-name">Name</label>
        <input id="ch-name" type="text" value="${escapeHtml(c.name)}" />
        <label for="ch-role">Role</label>
        <input id="ch-role" type="text" value="${escapeHtml(c.role)}" placeholder="Protagonist, antagonist, theme carrier..." />
        <label for="ch-want">Want (external, they would say it out loud)</label>
        <textarea id="ch-want">${escapeHtml(c.want)}</textarea>
        <label for="ch-need">Need (internal, usually the opposite)</label>
        <textarea id="ch-need">${escapeHtml(c.need)}</textarea>
        <label for="ch-wound">Wound (a specific past event, not a condition)</label>
        <textarea id="ch-wound">${escapeHtml(c.wound)}</textarea>
        <label for="ch-notes">Notes</label>
        <textarea id="ch-notes">${escapeHtml(c.notes)}</textarea>
        <div style="height:14px"></div>
        <button class="btn btn-primary" id="ch-save">Save</button>
        <div style="height:8px"></div>
        ${isNew ? '' : '<button class="btn btn-danger" id="ch-del">Delete</button><div style="height:8px"></div>'}
        <button class="btn btn-ghost" id="ch-close" style="width:100%">Close</button>
      </div>
    </div>`);

  modal.querySelector('#ch-save').addEventListener('click', async () => {
    const updated = {
      ...c,
      name: modal.querySelector('#ch-name').value.trim() || 'Unnamed',
      role: modal.querySelector('#ch-role').value.trim(),
      want: modal.querySelector('#ch-want').value.trim(),
      need: modal.querySelector('#ch-need').value.trim(),
      wound: modal.querySelector('#ch-wound').value.trim(),
      notes: modal.querySelector('#ch-notes').value.trim(),
    };
    const next = isNew ? cast.concat([updated]) : cast.map((x) => (x.id === c.id ? updated : x));
    await saveProject({ characters: next });
    modal.remove();
    render();
  });
  const del = modal.querySelector('#ch-del');
  if (del) del.addEventListener('click', async () => {
    if (!confirm('Delete this character?')) return;
    await saveProject({ characters: cast.filter((x) => x.id !== c.id) });
    modal.remove();
    render();
  });
  modal.querySelector('#ch-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.getElementById('modal-root').appendChild(modal);
}

function openBeatNotesEditor(beatKey) {
  const project = projectCache;
  const beats = computeBeats(project);
  const notes = project.beatNotes || {};
  const target = beatKey ? beats.find((b) => b.key === beatKey) : beats[0];

  const rows = beats.map((b) => `
    <label for="bn-${b.key}">${escapeHtml(b.name)} <span class="muted" style="font-weight:400">&middot; ${b.kind === 'moment' ? `at ${fmt(b.startWords)}` : `${fmt(b.startWords)}–${fmt(b.endWords)}`}</span></label>
    <textarea id="bn-${b.key}" placeholder="${escapeHtml(b.summary)}">${escapeHtml(notes[b.key] || '')}</textarea>
  `).join('');

  const modal = el(`
    <div class="modal-backdrop">
      <div class="modal-card">
        <div class="eyebrow">Beats</div>
        <h2>Your fifteen beats</h2>
        <p class="prose muted">A sentence or two each. Then read them in order and check each one makes the next necessary.</p>
        ${rows}
        <div style="height:14px"></div>
        <button class="btn btn-primary" id="bn-save">Save</button>
        <div style="height:8px"></div>
        <button class="btn btn-ghost" id="bn-close" style="width:100%">Close</button>
      </div>
    </div>`);

  modal.querySelector('#bn-save').addEventListener('click', async () => {
    const next = {};
    beats.forEach((b) => { next[b.key] = modal.querySelector(`#bn-${b.key}`).value.trim(); });
    await saveProject({ beatNotes: next });
    modal.remove();
    render();
  });
  modal.querySelector('#bn-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.getElementById('modal-root').appendChild(modal);
  if (target) {
    const f = modal.querySelector(`#bn-${target.key}`);
    if (f && beatKey) f.focus();
  }
}

function openSceneEditor(sceneId) {
  const project = projectCache;
  const scenes = project.scenes || [];

  if (sceneId) {
    const s = scenes.find((x) => x.id === sceneId);
    const beat = computeBeats(project).find((b) => b.key === s.beatKey);
    const modal = el(`
      <div class="modal-backdrop">
        <div class="modal-card">
          <div class="eyebrow">Scene ${s.index} &middot; ${escapeHtml(beat ? beat.name : '')}</div>
          <h2>${escapeHtml(s.title || 'Untitled scene')}</h2>
          <label for="sc-title">Title</label>
          <input id="sc-title" type="text" value="${escapeHtml(s.title)}" placeholder="A few words you'll recognise" />
          <label for="sc-pov">POV</label>
          <input id="sc-pov" type="text" value="${escapeHtml(s.pov || '')}" />
          <label for="sc-summary">What happens, and what changes</label>
          <textarea id="sc-summary" style="min-height:120px">${escapeHtml(s.summary)}</textarea>
          <div class="hint">One or two sentences. If "what changes" is hard to write, merge or cut this scene now while it costs a sentence.</div>
          <div style="height:14px"></div>
          <button class="btn btn-primary" id="sc-save">Save</button>
          <div style="height:8px"></div>
          <button class="btn" id="sc-toggle">${s.done ? 'Mark not drafted' : 'Mark drafted'}</button>
          <div style="height:8px"></div>
          <button class="btn btn-ghost" id="sc-close" style="width:100%">Close</button>
        </div>
      </div>`);

    const put = async (patch) => {
      await saveProject({ scenes: scenes.map((x) => (x.id === s.id ? { ...x, ...patch } : x)) });
      modal.remove();
      render();
    };
    modal.querySelector('#sc-save').addEventListener('click', () => put({
      title: modal.querySelector('#sc-title').value.trim(),
      pov: modal.querySelector('#sc-pov').value.trim(),
      summary: modal.querySelector('#sc-summary').value.trim(),
    }));
    modal.querySelector('#sc-toggle').addEventListener('click', () => put({ done: !s.done }));
    modal.querySelector('#sc-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    document.getElementById('modal-root').appendChild(modal);
    return;
  }

  // No scene list yet: offer to build one.
  const suggested = suggestedSceneCount(project.targetWords);
  const modal = el(`
    <div class="modal-backdrop">
      <div class="modal-card">
        <div class="eyebrow">Scene list</div>
        <h2>Build your scene list</h2>
        <p class="prose muted">Your ${fmt(project.targetWords)}-word target divides into scenes of roughly ${fmt(WORDS_PER_SCENE)} words, distributed across the beats by each beat's word budget. Moments get exactly one scene, because a moment is one scene by definition.</p>
        <label for="sc-count">Number of scenes</label>
        <input id="sc-count" type="number" inputmode="numeric" min="12" max="200" value="${suggested}" />
        <div class="hint">A scene is about the size of a long vignette. That is deliberate: it is the unit you already know how to write.</div>
        ${scenes.length ? '<div class="error">This replaces your existing scene list and its summaries.</div>' : ''}
        ${project.genre === 'unsure' || !project.genreConfirmed ? '<div class="hint" style="color:var(--warn)">Your genre is still a guess, so this target may be off. Confirming it first will give you a scene count that matches the book you are actually writing.</div>' : ''}
        <div style="height:14px"></div>
        <button class="btn btn-primary" id="sc-gen">${scenes.length ? 'Rebuild the list' : 'Build the list'}</button>
        <div style="height:8px"></div>
        <button class="btn btn-ghost" id="sc-cancel" style="width:100%">Cancel</button>
      </div>
    </div>`);

  modal.querySelector('#sc-gen').addEventListener('click', async () => {
    const n = clamp(Number(modal.querySelector('#sc-count').value) || suggested, 12, 200);
    if (scenes.length && !confirm('Replace the existing scene list? Summaries will be lost.')) return;
    await saveProject({ scenes: distributeScenes(computeBeats(project), n) });
    modal.remove();
    render();
  });
  modal.querySelector('#sc-cancel').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.getElementById('modal-root').appendChild(modal);
}


// Everything written in the blueprint lives on the project doc in Firestore.
// This is the door out: one Markdown file you can drop into Scrivener's
// Research folder, mail to yourself, or keep. Plain text on purpose -- it
// should still be readable in ten years without this app.
function blueprintMarkdown(project, warmups) {
  const bp = project.blueprint || {};
  const out = [];
  const section = (title, body) => { if (body && body.trim()) out.push(`## ${title}\n\n${body.trim()}\n`); };

  out.push(`# ${project.title || 'Untitled'}\n`);
  out.push(`_${(GENRE_TARGETS.find((g) => g.id === project.genre) || {}).label || ''} · target ${fmt(project.targetWords)} words · exported ${formatDateLong(todayStr())}_\n`);

  section('Logline', bp.logline);
  section('Premise', bp.premise);
  section('Theme', bp.theme);
  section('Notes', bp.notes);

  const cast = project.characters || [];
  if (cast.length) {
    out.push('## Cast\n');
    cast.forEach((c) => {
      out.push(`### ${c.name}${c.role ? ` — ${c.role}` : ''}\n`);
      if (c.want) out.push(`**Wants:** ${c.want}\n`);
      if (c.need) out.push(`**Needs:** ${c.need}\n`);
      if (c.wound) out.push(`**Wound:** ${c.wound}\n`);
      if (c.notes) out.push(`${c.notes}\n`);
    });
  }

  const notes = project.beatNotes || {};
  const beats = computeBeats(project);
  if (Object.values(notes).some(Boolean)) {
    out.push('## Beats\n');
    beats.forEach((b) => {
      const range = b.kind === 'moment' ? `at ${fmt(b.startWords)}` : `${fmt(b.startWords)}–${fmt(b.endWords)}`;
      out.push(`### ${b.name} (${range})\n`);
      out.push(`${notes[b.key] || `_${b.summary}_`}\n`);
    });
  }

  const scenes = project.scenes || [];
  if (scenes.length) {
    out.push('## Scene list\n');
    let lastBeat = null;
    scenes.forEach((sc) => {
      const beat = beats.find((b) => b.key === sc.beatKey);
      if (beat && beat.key !== lastBeat) { out.push(`### ${beat.name}\n`); lastBeat = beat.key; }
      out.push(`${sc.index}. **${sc.title || 'Untitled'}**${sc.pov ? ` (${sc.pov})` : ''}${sc.done ? ' ✓' : ''}`);
      if (sc.summary) out.push(`   ${sc.summary}`);
    });
    out.push('');
  }

  if (warmups && warmups.length) {
    out.push('## Warm-up writing\n');
    warmups.slice().sort((a, b) => (a.date < b.date ? -1 : 1)).forEach((w) => {
      const ex = WARMUPS.find((x) => x.id === w.exerciseId);
      out.push(`### ${ex ? ex.name : 'Warm-up'} — ${formatDate(w.date)}\n`);
      out.push(`${w.text}\n`);
    });
  }

  return out.join('\n');
}

function downloadBlueprint(includeWarmups) {
  const md = blueprintMarkdown(projectCache, includeWarmups ? warmupsCache : null);
  const blob = new Blob([md], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${(projectCache.title || 'blueprint').replace(/[^\w -]/g, '')} blueprint.md`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ---------- Warm-up studio ----------
// A permanent home for the exercises, plus anywhere to actually write them.
// Nothing here touches the manuscript: no word counts, no pacing, no beats.

function openWarmupExercise(exercise) {
  const pieces = warmupsCache
    .filter((p) => p.exerciseId === exercise.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const history = pieces.length
    ? pieces.map((p) => `
        <div class="piece" data-id="${p.id}">
          <div class="piece-meta">${formatDate(p.date)} &middot; ${fmt(countWords(p.text))} words <button class="piece-del" data-del="${p.id}" aria-label="Delete">×</button></div>
          <div class="piece-text">${escapeHtml(p.text)}</div>
        </div>`).join('')
    : '';

  const modal = el(`
    <div class="modal-backdrop">
      <div class="modal-card">
        <div class="eyebrow">Warm-up &middot; ${exercise.minutes} min</div>
        <h2>${escapeHtml(exercise.name)}</h2>
        <p class="beat-prompt">${escapeHtml(exercise.prompt)}</p>

        <label for="wu-text">Write it here</label>
        <textarea id="wu-text" style="min-height:200px" placeholder="Nothing here counts toward your novel."></textarea>
        <div class="hint" id="wu-count">0 words</div>
        <div style="height:12px"></div>
        <button class="btn btn-primary" id="wu-save">Save this piece</button>
        <div style="height:8px"></div>
        <button class="btn btn-ghost" id="wu-close" style="width:100%">Close</button>

        ${pieces.length ? `<div style="height:22px"></div><div class="eyebrow">Your pieces (${pieces.length})</div>${history}` : ''}
      </div>
    </div>
  `);

  const text = modal.querySelector('#wu-text');
  const count = modal.querySelector('#wu-count');
  text.addEventListener('input', () => { count.textContent = `${fmt(countWords(text.value))} words`; });

  modal.querySelector('#wu-save').addEventListener('click', async (ev) => {
    if (!text.value.trim()) return;
    ev.target.disabled = true;
    await Cloud.saveWarmupCloud(currentUser.uid, {
      id: uid(), date: todayStr(), exerciseId: exercise.id, text: text.value.trim(),
    });
    await patchTodayEntry({ warmedUp: true });
    modal.remove();
    render();
  });

  modal.querySelectorAll('[data-del]').forEach((btn) => {
    btn.addEventListener('click', async (ev) => {
      ev.stopPropagation();
      if (!confirm('Delete this piece?')) return;
      await Cloud.deleteWarmupCloud(currentUser.uid, btn.dataset.del);
      modal.remove();
      render();
    });
  });

  modal.querySelector('#wu-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

  document.getElementById('modal-root').appendChild(modal);
  text.focus();
}

function renderStudio() {
  const written = new Map();
  warmupsCache.forEach((p) => written.set(p.exerciseId, (written.get(p.exerciseId) || 0) + 1));
  const totalWords = warmupsCache.reduce((s, p) => s + countWords(p.text), 0);

  const rows = WARMUPS.map((w) => {
    const n = written.get(w.id) || 0;
    return `
      <div class="lesson-row" data-id="${w.id}">
        <div class="lesson-mark">${n ? '✓' : '○'}</div>
        <div>
          <div class="lesson-title">${escapeHtml(w.name)}</div>
          <div class="lesson-sub">${w.minutes} min${n ? ` &middot; ${n} piece${n > 1 ? 's' : ''}` : ''}</div>
        </div>
      </div>`;
  }).join('');

  const recent = warmupsCache
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 8)
    .map((p) => {
      const ex = WARMUPS.find((w) => w.id === p.exerciseId);
      return `
        <div class="piece" data-open="${p.exerciseId}">
          <div class="piece-meta">${escapeHtml(ex ? ex.name : 'Warm-up')} &middot; ${formatDate(p.date)} &middot; ${fmt(countWords(p.text))} words</div>
          <div class="piece-text piece-clamp">${escapeHtml(p.text)}</div>
        </div>`;
    }).join('');

  const wrap = el(`
    <div>
      <div class="card">
        <div class="eyebrow">The studio</div>
        <h2>${WARMUPS.length} exercises</h2>
        <p class="prose muted" style="margin:0">Scales, not the performance. Nothing written here counts toward your word target, touches your beats, or shows up in your novel's history &mdash; do them for fun, out of order, as many times as you like.</p>
        ${warmupsCache.length ? `<div class="stats" style="margin-top:16px">
          <div class="stat"><div class="stat-value">${warmupsCache.length}</div><div class="stat-label">Pieces</div></div>
          <div class="stat"><div class="stat-value">${fmt(totalWords)}</div><div class="stat-label">Words, just for you</div></div>
          <div class="stat"><div class="stat-value">${written.size}/${WARMUPS.length}</div><div class="stat-label">Tried</div></div>
        </div>` : ''}
      </div>

      ${recent ? `<div class="card"><div class="eyebrow">Recent pieces</div>${recent}</div>` : ''}

      <div class="card">
        <div class="eyebrow">All exercises</div>
        ${rows}
      </div>
    </div>
  `);

  wrap.querySelectorAll('.lesson-row').forEach((row) => {
    row.addEventListener('click', () => openWarmupExercise(WARMUPS.find((w) => w.id === row.dataset.id)));
  });
  wrap.querySelectorAll('[data-open]').forEach((p) => {
    p.addEventListener('click', () => openWarmupExercise(WARMUPS.find((w) => w.id === p.dataset.open)));
  });

  return wrap;
}

// ---------- Learn ----------

function openLesson(lesson) {
  const paras = lesson.body.map((p) => `<p class="lesson-para">${escapeHtml(p)}</p>`).join('');
  const read = !!(projectCache.lessonMarks || {})[lesson.id];

  const ex = lesson.example;
  const exampleBlock = ex
    ? `<div class="lesson-example">
         <div class="eyebrow">${escapeHtml(ex.label || 'Worked example')}</div>
         ${ex.before ? `<div class="ex-label">Before</div><div class="ex-text">${escapeHtml(ex.before)}</div>` : ''}
         ${ex.after ? `<div class="ex-label">After</div><div class="ex-text ex-after">${escapeHtml(ex.after)}</div>` : ''}
         ${ex.text ? `<div class="ex-text">${escapeHtml(ex.text)}</div>` : ''}
         ${ex.source ? `<div class="ex-source">${escapeHtml(ex.source)}</div>` : ''}
         ${ex.note ? `<p class="ex-note">${escapeHtml(ex.note)}</p>` : ''}
       </div>`
    : '';

  const modal = el(`
    <div class="modal-backdrop">
      <div class="modal-card">
        <div class="eyebrow">${escapeHtml((LESSON_MODULES.find((m) => m.id === lesson.module) || {}).name || '')} &middot; ${lesson.minutes} min</div>
        <h2>${escapeHtml(lesson.title)}</h2>
        <div style="height:8px"></div>
        ${paras}
        ${exampleBlock}
        <div class="lesson-practice">
          <div class="eyebrow" style="margin-bottom:4px">Try it</div>
          ${escapeHtml(lesson.practice)}
        </div>
        <div style="height:16px"></div>
        <button class="btn btn-primary" id="lesson-read">${read ? 'Close' : 'Mark as read'}</button>
        <div style="height:8px"></div>
        <button class="btn btn-ghost" id="lesson-close" style="width:100%">Close</button>
      </div>
    </div>
  `);

  modal.querySelector('#lesson-read').addEventListener('click', async () => {
    if (!read) {
      const marks = { ...(projectCache.lessonMarks || {}), [lesson.id]: { date: todayStr() } };
      await saveProject({ lessonMarks: marks });
    }
    modal.remove();
    render();
  });
  modal.querySelector('#lesson-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

  document.getElementById('modal-root').appendChild(modal);
  modal.querySelector('.modal-card').scrollTop = 0;
}

// Which accordion panels are open. Ephemeral by design: on load the module
// you're actually in opens and the rest stay shut, which is the point of the
// accordion -- you should see the shape of the course, not all 85 items.
const openPanels = new Set();
let panelsPrimed = false;

function togglePanel(id) {
  if (openPanels.has(id)) openPanels.delete(id);
  else openPanels.add(id);
}

function accordion(id, label, title, blurb, count, rowsHtml) {
  const open = openPanels.has(id);
  return `
    <div class="acc ${open ? 'is-open' : 'is-closed'}">
      <button class="acc-head" data-panel="${id}">
        <div>
          <div class="acc-label">${escapeHtml(label)}</div>
          <div class="acc-title">${escapeHtml(title)}</div>
          ${blurb ? `<div class="acc-blurb">${escapeHtml(blurb)}</div>` : ''}
        </div>
        <div class="acc-count">${escapeHtml(count)}</div>
        <div class="acc-chev">▶</div>
      </button>
      <div class="acc-body">${rowsHtml}</div>
    </div>`;
}

function renderLearn() {
  const project = projectCache;
  const state = programState(project, sortedEntries());
  const unlockedIds = new Set(state.unlockedLessons.map((l) => l.id));

  // Open the module you're in the first time this renders, then leave it alone.
  if (!panelsPrimed) {
    panelsPrimed = true;
    if (state.bpTask) openPanels.add('bp-' + state.bpTask.module);
    else if (state.nextLesson) openPanels.add('ls-' + state.nextLesson.module);
  }

  const bpDone = BLUEPRINT_TASKS.filter((t) => state.bpMarks[t.id]).length;

  const bpPanels = BLUEPRINT_MODULES.map((m) => {
    const ts = blueprintTasksForModule(m.id);
    const done = ts.filter((t) => state.bpMarks[t.id]).length;
    const rows = ts.map((t) => {
      const isDone = !!state.bpMarks[t.id];
      const isNext = state.bpTask && state.bpTask.id === t.id;
      return `
        <div class="lesson-row${isDone ? ' is-read' : ''}" data-bp="${t.id}">
          <div class="lesson-mark">${isDone ? '✓' : isNext ? '▶' : '○'}</div>
          <div>
            <div class="lesson-title">${escapeHtml(t.name)}${isNext ? ' <span class="pill" style="font-size:10px">next</span>' : ''}</div>
            <div class="lesson-sub">${t.minutes} min &middot; writes your ${escapeHtml((ARTIFACT_LABEL[t.artifact] || t.artifact).toLowerCase())}</div>
          </div>
        </div>`;
    }).join('');
    return accordion('bp-' + m.id, `Module ${m.id}`, m.name, m.blurb, `${done}/${ts.length}`, rows);
  }).join('');

  const lsPanels = LESSON_MODULES.map((mod) => {
    const lessons = lessonsForModule(mod.id, project.genre);
    if (!lessons.length) return '';
    const readN = lessons.filter((l) => state.lessonMarks[l.id]).length;
    const openN = lessons.filter((l) => unlockedIds.has(l.id)).length;

    const rows = lessons.map((l) => {
      const unlocked = unlockedIds.has(l.id);
      const read = !!state.lessonMarks[l.id];
      const beat = l.beat ? state.beats.find((b) => b.key === l.beat) : null;
      const sub = unlocked
        ? `${l.minutes} min${read ? ' &middot; read' : ''}`
        : `Unlocks at ${fmt(beat ? beat.startWords : 0)} words`;
      return `
        <div class="lesson-row${unlocked ? '' : ' is-locked'}${read ? ' is-read' : ''}" data-lesson="${l.id}">
          <div class="lesson-mark">${unlocked ? (read ? '✓' : '●') : '🔒'}</div>
          <div>
            <div class="lesson-title">${escapeHtml(l.title)}</div>
            <div class="lesson-sub">${sub}</div>
          </div>
        </div>`;
    }).join('');

    return accordion('ls-' + mod.id, `${lessons.length} lessons`, mod.name, mod.blurb, `${readN}/${lessons.length}`, rows);
  }).join('');

  const wrap = el(`
    <div>
      <div class="card">
        <div class="eyebrow">The course</div>
        <h2>Blueprint ${bpDone} of ${BLUEPRINT_TASKS.length} &middot; Craft ${state.unlockedLessons.length} of ${state.availableLessons.length} unlocked</h2>
        <div class="progress"><div class="progress-fill" style="width:${((bpDone / BLUEPRINT_TASKS.length) * 100).toFixed(1)}%"></div></div>
        <p class="prose muted" style="margin:8px 0 0">Blueprint sessions are work you do in order. Craft lessons unlock as your manuscript reaches each beat, so one arrives when you're about to need it rather than all at once.</p>
      </div>

      <div class="section-rule">Before the draft</div>
      ${bpPanels}

      <div class="section-rule">While you draft</div>
      ${lsPanels}
    </div>
  `);

  wrap.querySelectorAll('[data-panel]').forEach((head) => {
    head.addEventListener('click', () => { togglePanel(head.dataset.panel); render(); });
  });
  wrap.querySelectorAll('[data-bp]').forEach((row) => {
    row.addEventListener('click', () => openBlueprintTask(BLUEPRINT_TASKS.find((t) => t.id === row.dataset.bp)));
  });
  wrap.querySelectorAll('[data-lesson]').forEach((row) => {
    if (row.classList.contains('is-locked')) return;
    row.addEventListener('click', () => openLesson(LESSONS.find((l) => l.id === row.dataset.lesson)));
  });

  return wrap;
}

// ---------- Map ----------

function renderStory() {
  const project = projectCache;
  const state = programState(project, sortedEntries());
  const bp = project.blueprint || {};
  const cast = project.characters || [];
  const notes = project.beatNotes || {};
  const scenes = project.scenes || [];
  const tpl = BEAT_TEMPLATES[project.templateId] || BEAT_TEMPLATES[DEFAULT_TEMPLATE_ID];

  const field = (label, key, value) => `
    <div class="artifact" data-text="${key}">
      <div class="eyebrow">${escapeHtml(label)}</div>
      <div class="artifact-body${value ? '' : ' is-empty'}">${value ? escapeHtml(value) : 'Not written yet. Tap to add.'}</div>
    </div>`;

  const premiseCard = `
    <div class="card">
      <div class="eyebrow">The idea</div>
      <h2>${escapeHtml(project.title)}</h2>
      ${field('Logline', 'logline', bp.logline)}
      ${field('Premise', 'premise', bp.premise)}
      ${field('Theme', 'theme', bp.theme)}
      ${field('Notes', 'notes', bp.notes)}
    </div>`;

  const castCard = `
    <div class="card">
      <div class="eyebrow">Cast &middot; ${cast.length}</div>
      ${cast.length ? cast.map((c) => `
        <div class="lesson-row" data-char="${c.id}">
          <div class="lesson-mark">${c.wound ? '●' : '○'}</div>
          <div>
            <div class="lesson-title">${escapeHtml(c.name)}${c.role ? ` <span class="muted" style="font-weight:400">&middot; ${escapeHtml(c.role)}</span>` : ''}</div>
            <div class="lesson-sub">${c.want ? escapeHtml(c.want.slice(0, 90)) : 'No want yet'}</div>
          </div>
        </div>`).join('') : '<p class="prose muted">Nobody yet.</p>'}
      <div style="height:12px"></div>
      <button class="btn" id="add-char">Add a character</button>
    </div>`;

  const beatRows = state.beats.map((b) => {
    const mark = state.marks[b.key];
    const isCurrent = b.key === state.focus.key;
    const done = b.kind === 'moment' ? !!mark : state.total >= b.endWords;
    let dotClass = 'beat-dot';
    if (b.kind === 'moment') dotClass += ' moment';
    if (done) dotClass += ' done';
    else if (isCurrent) dotClass += ' current';

    const range = b.kind === 'moment' ? `at ${fmt(b.startWords)}` : `${fmt(b.startWords)}&ndash;${fmt(b.endWords)}`;
    let bar = '';
    if (b.kind === 'span') {
      const budget = b.endWords - b.startWords;
      const into = clamp(state.total - b.startWords, 0, budget * 2);
      bar = `<div class="beat-bar"><div class="beat-bar-fill${into > budget ? ' over' : ''}" style="width:${clamp((into / budget) * 100, 0, 100).toFixed(1)}%"></div></div>`;
    }
    const note = notes[b.key];
    return `
      <div class="beat-row${isCurrent ? ' is-current' : ''}" data-beat="${b.key}">
        <div class="${dotClass}"></div>
        <div>
          <div class="beat-name"><span>${escapeHtml(b.name)}</span><span class="beat-range">${range}</span></div>
          <div class="beat-summary">${note ? escapeHtml(note) : `<span class="muted" style="font-style:italic">${escapeHtml(b.summary)}</span>`}</div>
          ${bar}
        </div>
      </div>`;
  }).join('');

  const beatsCard = `
    <div class="card">
      <div class="eyebrow">${escapeHtml(tpl.name)} &middot; ${Object.values(notes).filter(Boolean).length}/15 filled in</div>
      <h2>Your beats</h2>
      <p class="prose muted">Diamonds are single scenes. Circles are stretches with a word budget. Tap any beat to write yours in.</p>
      <div style="margin-top:6px">${beatRows}</div>
    </div>`;

  let scenesCard;
  if (!scenes.length) {
    scenesCard = `
      <div class="card">
        <div class="eyebrow">Scene list</div>
        <h2>Not built yet</h2>
        <p class="prose muted">Your target divides into scenes of roughly ${fmt(WORDS_PER_SCENE)} words &mdash; about ${suggestedSceneCount(project.targetWords)} of them &mdash; distributed across the beats. Vignette-sized, on purpose.</p>
        <div style="height:12px"></div>
        <button class="btn btn-primary" id="build-scenes">Build the scene list</button>
      </div>`;
  } else {
    const written = scenes.filter((s) => s.done).length;
    const summarised = scenes.filter((s) => s.summary).length;
    let lastBeat = null;
    const rows = scenes.map((s) => {
      const beat = state.beats.find((b) => b.key === s.beatKey);
      const header = beat && beat.key !== lastBeat
        ? `<div class="scene-beat">${escapeHtml(beat.name)}</div>` : '';
      lastBeat = beat ? beat.key : lastBeat;
      return `${header}
        <div class="scene-row${s.done ? ' is-done' : ''}" data-scene="${s.id}">
          <div class="scene-num">${s.index}</div>
          <div>
            <div class="scene-title">${escapeHtml(s.title || 'Untitled')}${s.pov ? ` <span class="muted" style="font-weight:400">&middot; ${escapeHtml(s.pov)}</span>` : ''}</div>
            <div class="scene-summary">${s.summary ? escapeHtml(s.summary) : '<span style="font-style:italic">No summary yet</span>'}</div>
          </div>
        </div>`;
    }).join('');

    scenesCard = `
      <div class="card">
        <div class="eyebrow">Scene list &middot; ${summarised}/${scenes.length} summarised &middot; ${written} drafted</div>
        <h2>${scenes.length} scenes</h2>
        <div style="margin-top:8px">${rows}</div>
        <div style="height:12px"></div>
        <button class="btn btn-ghost" id="build-scenes" style="width:auto">Rebuild the list</button>
      </div>`;
  }

  const phaseCard = state.inBlueprint
    ? ''
    : `<div class="card">
         <div class="eyebrow">Phase</div>
         <h2>Drafting</h2>
         <p class="prose muted">${state.bpComplete ? 'Blueprint complete.' : `Blueprint is ${state.bpDone}/${BLUEPRINT_TASKS.length} done &mdash; you can go back to it any time without losing drafting progress.`}</p>
         ${state.bpComplete ? '' : '<div style="height:12px"></div><button class="btn" id="back-to-bp">Back to the blueprint</button>'}
       </div>`;

  const homesCard = `
    <div class="card">
      <div class="eyebrow">Where your writing lives</div>
      <h2>Four homes</h2>
      <p class="prose muted">Only one of them is Scrivener. Every session card tells you which one it means.</p>
      ${homeStrip('Warm-ups tab', 'exercises &middot; never counted')}
      ${homeStrip('Story tab', 'logline, premise, theme, cast, beats, scene summaries')}
      ${homeStrip('Scrivener &rarr; Manuscript', 'the novel itself &middot; the only thing counted', 'external')}
      ${homeStrip('Nowhere', 'cool-down notes are for you, not for the app', 'nowhere')}
    </div>`;

  const exportCard = `
    <div class="card">
      <div class="eyebrow">Your writing</div>
      <h2>Everything here lives in this app</h2>
      <p class="prose muted">Your logline, premise, cast, beats and scene summaries are saved to your account and sync across devices &mdash; none of it is in Scrivener. Export a Markdown copy to drop into Scrivener's Research folder, or just to have it somewhere that outlives this app.</p>
      <div class="btn-row">
        <button class="btn btn-primary" id="ex-bp">Export blueprint</button>
        <button class="btn" id="ex-bp-all">Include warm-ups</button>
      </div>
    </div>`;

  const wrap = el(`<div>${homesCard}${premiseCard}${castCard}${beatsCard}${scenesCard}${exportCard}${phaseCard}</div>`);
  wrap.querySelector('#ex-bp').addEventListener('click', () => downloadBlueprint(false));
  wrap.querySelector('#ex-bp-all').addEventListener('click', () => downloadBlueprint(true));

  wrap.querySelectorAll('[data-text]').forEach((n) => {
    n.addEventListener('click', () => openTextArtifact(n.dataset.text));
  });
  wrap.querySelectorAll('[data-char]').forEach((n) => {
    n.addEventListener('click', () => openCastEditor(n.dataset.char));
  });
  wrap.querySelectorAll('[data-beat]').forEach((n) => {
    n.addEventListener('click', () => openBeatNotesEditor(n.dataset.beat));
  });
  wrap.querySelectorAll('[data-scene]').forEach((n) => {
    n.addEventListener('click', () => openSceneEditor(n.dataset.scene));
  });
  wrap.querySelector('#add-char').addEventListener('click', () => openCastEditor());
  const build = wrap.querySelector('#build-scenes');
  if (build) build.addEventListener('click', () => openSceneEditor());
  const back = wrap.querySelector('#back-to-bp');
  if (back) back.addEventListener('click', async () => {
    await saveProject({ phase: 'blueprint' });
    navigate('today');
    render();
  });

  return wrap;
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
        <label for="st-name">Your first name</label>
        <input id="st-name" type="text" value="${escapeHtml(project.firstName || '')}" />

        <label for="st-title">Working title</label>
        <input id="st-title" type="text" value="${escapeHtml(project.title)}" />

        <label for="st-genre">Genre</label>
        <select id="st-genre">${GENRE_TARGETS.map((g) => `<option value="${g.id}"${g.id === project.genre ? ' selected' : ''}>${g.label} (~${fmt(g.words)} words)</option>`).join('')}</select>
        <div class="hint">Safe to change any time. Genre only sets the suggested word count and adds a few genre-specific lessons -- your beats, progress and history are untouched.</div>

        <label for="st-target">Target word count</label>
        <input id="st-target" type="number" inputmode="numeric" min="1000" step="1000" value="${project.targetWords}" />
        <div class="hint" id="st-target-hint"></div>

        <label for="st-end">Target finish date</label>
        <input id="st-end" type="date" value="${project.targetDate}" />

        <div style="height:14px"></div>
        <button class="btn btn-primary" id="st-save">Save project</button>
        <div style="height:18px"></div>` : ''}

        <div class="eyebrow">Manuscript</div>
        ${Scriv.isSupported()
          ? `<button class="btn" id="st-scriv">${scrivHandle ? 'Disconnect Scrivener' : 'Connect a Scrivener project'}</button>
             <div class="hint">${scrivHandle
               ? `Connected to ${escapeHtml((projectCache.scrivener || {}).projectName || 'a project')}. Read-only &mdash; this app never writes to your .scriv.`
               : 'Point the app at your .scriv folder and it counts the Draft folder for you instead of you typing a number. Read-only.'}</div>`
          : '<div class="hint">Scrivener sync needs the File System Access API, which is Chrome or Edge on desktop only. On this browser, log word counts manually.</div>'}
        <div style="height:18px"></div>

        <button class="btn" id="st-new">Start a new project</button>
        <div class="hint">Wipes the current project and its logged sessions and takes you back through setup. Export a backup first if you want to keep this one. Your warm-up writing is never touched.</div>
        <div style="height:18px"></div>

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
    const genreSel = modal.querySelector('#st-genre');
    const targetInput = modal.querySelector('#st-target');
    const targetHint = modal.querySelector('#st-target-hint');

    // Changing genre offers the new suggested length rather than silently
    // overwriting it -- the target may well have been set deliberately, and
    // rewriting someone's word goal behind their back would be rude.
    genreSel.addEventListener('change', () => {
      const g = GENRE_TARGETS.find((x) => x.id === genreSel.value);
      if (!g || Number(targetInput.value) === g.words) { targetHint.innerHTML = ''; return; }
      targetHint.innerHTML = `${escapeHtml(g.label)} usually runs about ${fmt(g.words)} words. <button class="btn-ghost" id="st-use-suggested" style="padding:0; font-size:12px; font-weight:600">Use that</button>`;
      targetHint.querySelector('#st-use-suggested').addEventListener('click', () => {
        targetInput.value = g.words;
        targetHint.innerHTML = '';
      });
    });

    save.addEventListener('click', async () => {
      const nm = modal.querySelector('#st-name').value.trim();
      if (nm) localStorage.setItem('firstName', nm);
      await saveProject({
        firstName: nm,
        title: modal.querySelector('#st-title').value.trim() || 'Untitled',
        genre: genreSel.value,
        targetWords: Number(targetInput.value) || project.targetWords,
        targetDate: modal.querySelector('#st-end').value || project.targetDate,
      });
      modal.remove();
      render();
    });
  }

  const scrivBtn = modal.querySelector('#st-scriv');
  if (scrivBtn) {
    scrivBtn.addEventListener('click', async () => {
      try {
        if (scrivHandle) {
          if (!confirm('Disconnect the Scrivener project? Your logged history is kept.')) return;
          await Scriv.disconnect();
          scrivHandle = null;
        } else {
          const found = await Scriv.findProjects();
          const chosen = found.length === 1 ? found[0] : await chooseScrivProject(found);
          if (!chosen) return;
          scrivHandle = await Scriv.useProject(chosen);
        }
        modal.remove();
        render();
      } catch (err) {
        if (err.name === 'AbortError') return; // folder picker dismissed
        alert(err.message);
      }
    });
  }

  modal.querySelector('#st-new').addEventListener('click', async () => {
    if (!confirm('Delete this project and all its logged sessions, and start again from the blueprint? Warm-up writing is kept.')) return;
    if (!confirm('Last check -- this cannot be undone.')) return;
    await Cloud.bulkDeleteCloud(currentUser.uid, entriesCache);
    await Cloud.deleteProjectCloud(currentUser.uid);
    projectCache = null;
    modal.remove();
    navigate('today');
    render();
  });

  modal.querySelector('#st-export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ project: projectCache, entries: entriesCache, warmups: warmupsCache }, null, 2)], { type: 'application/json' });
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
    if (unsubWarmups) { unsubWarmups(); unsubWarmups = null; }

    if (!user) {
      projectCache = null;
      entriesCache = [];
      warmupsCache = [];
      render();
      return;
    }

    loadScrivHandle().then(() => render());

    unsubProject = Cloud.subscribeProject(user.uid, (project) => {
      projectCache = project;
      render();
    });
    unsubEntries = Cloud.subscribeEntries(user.uid, (entries) => {
      entriesCache = entries;
      render();
    });
    unsubWarmups = Cloud.subscribeWarmups(user.uid, (pieces) => {
      warmupsCache = pieces;
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
