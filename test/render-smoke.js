// Renders every view in every meaningful state and fails on any exception.
//
// This is not a unit test suite -- it asserts almost nothing about output. Its
// whole job is to make each function actually run, because the bugs that have
// reached the screen in this project were evaluation errors that a syntax check
// cannot see: a const read one line above its own declaration, a property read
// off a null, a variable renamed in one branch and not another.

var fails = 0;
function tryRender(label, fn) {
  try { fn(); print('  pass  ' + label); }
  catch (e) { fails++; print('  FAIL  ' + label + '  ->  ' + e); }
}

var today = todayStr();

function baseProject(o) {
  o = o || {};
  var p = {
    firstName: 'Aly', title: 'TBD!', genre: 'unsure', genreConfirmed: false, targetWords: 90000,
    templateId: DEFAULT_TEMPLATE_ID, startDate: today, targetDate: addDays(today, 180),
    phase: 'blueprint', blueprint: {}, characters: [], beatNotes: {}, scenes: [],
    blueprintMarks: {}, beatMarks: {}, taskMarks: {}, lessonMarks: {}, onRampDays: 0,
  };
  for (var k in o) p[k] = o[k];
  return p;
}

currentUser = { uid: 'u1', email: 'a@b.c' };
warmupsCache = [];

print('-- blueprint session, every step position --');
[[{}, 'nothing done'],
 [{ warmedUp: true }, 'warmed up'],
 [{ warmedUp: true, sessionDone: true, sessionTaskId: 'bp-write-for-yourself' }, 'session done'],
 [{ warmedUp: true, sessionDone: true, sessionTaskId: 'bp-write-for-yourself', cooledDown: true }, 'all three done'],
].forEach(function (pair) {
  projectCache = baseProject();
  entriesCache = [{ id: 'e1', date: today, words: 0, note: '' }];
  for (var k in pair[0]) entriesCache[0][k] = pair[0][k];
  tryRender('blueprint: ' + pair[1], function () { renderToday(); });
});

print('-- blueprint edge cases --');
projectCache = baseProject({
  blueprintMarks: (function () { var m = {}; BLUEPRINT_TASKS.forEach(function (t) { m[t.id] = { date: today }; }); return m; })(),
});
entriesCache = [];
tryRender('blueprint complete', function () { renderToday(); });

projectCache = baseProject({ blueprintMarks: { 'bp-familiar-twist': { date: today } } });
entriesCache = [];
tryRender('genre confirm due', function () { renderToday(); });

// A task id can vanish if the curriculum is edited between sessions.
projectCache = baseProject();
entriesCache = [{ id: 'e', date: today, words: 0, sessionDone: true, sessionTaskId: 'no-such-task' }];
tryRender('session id that no longer exists', function () { renderToday(); });

print('-- drafting session --');
[[{ scenes: [] }, 'no scene list'],
 [{ scenes: distributeScenes(computeBeats(baseProject({ targetWords: 110000 })), 44), targetWords: 110000, genre: 'romantasy', genreConfirmed: true }, 'with scenes'],
 [{ beatMarks: { opening_image: { words: 0, date: today } } }, 'a beat ticked'],
].forEach(function (pair) {
  projectCache = baseProject(pair[0]);
  projectCache.phase = 'draft';
  entriesCache = [{ id: 'e1', date: today, words: 1200, note: '' }];
  tryRender('drafting: ' + pair[1], function () { renderToday(); });
});

projectCache = baseProject({ phase: 'draft' }); entriesCache = [];
tryRender('drafting: first day, nothing logged', function () { renderToday(); });

projectCache = baseProject({ phase: 'draft', onRampDays: 5 }); entriesCache = [];
tryRender('drafting: warm-up week', function () { renderToday(); });

projectCache = baseProject({
  phase: 'draft',
  scrivener: { projectName: 'TBD!.scriv', syncedAt: new Date().toISOString(), total: 1200, documents: [{ id: 'a', title: 'Scene', path: 'Manuscript > Scene', words: 1200 }] },
});
entriesCache = [{ id: 'e', date: today, words: 1200, source: 'scrivener' }];
scrivHandle = { name: 'TBD!.scriv' };
tryRender('drafting: scrivener connected', function () { renderToday(); });
scrivHandle = null;

print('-- the other views --');
projectCache = baseProject(); entriesCache = [];
tryRender('learn', function () { renderLearn(); });
tryRender('studio', function () { renderStudio(); });
tryRender('story', function () { renderStory(); });
tryRender('trends', function () { renderTrends(); });
tryRender('setup', function () { renderSetup(); });
tryRender('auth gate', function () { renderAuthGate(); });

projectCache = baseProject({
  scenes: distributeScenes(computeBeats(baseProject()), 36),
  characters: [{ id: 'c', name: 'X', role: 'lead', want: 'w', need: 'n', wound: 'd', notes: '' }],
  beatNotes: { setup: 'note' },
  blueprint: { logline: 'L', premise: 'P', theme: 'T', notes: 'N' },
});
tryRender('story, fully populated', function () { renderStory(); });
tryRender('blueprint export builds', function () {
  blueprintMarkdown(projectCache, [{ id: 'w', date: today, exerciseId: 'wu-sensory', text: 'hi there' }]);
});


print('-- modals and editors --');
projectCache = baseProject({
  scenes: distributeScenes(computeBeats(baseProject()), 36),
  characters: [{ id: 'c', name: 'X', role: 'lead', want: 'w', need: 'n', wound: 'd', notes: '' }],
  blueprint: { logline: 'L', premise: 'P', theme: 'T', notes: 'N' },
});
entriesCache = [];
var sampleTask = BLUEPRINT_TASKS[0];

// With a task (opened from a session card) and without (opened from Story) --
// the second path is where a missing null-guard would surface.
tryRender('text artifact, from a session', function () { openTextArtifact('notes', sampleTask); });
tryRender('text artifact, from Story', function () { openTextArtifact('notes'); });
tryRender('cast editor, new', function () { openCastEditor(null, sampleTask); });
tryRender('cast editor, existing', function () { openCastEditor('c'); });
tryRender('beat notes editor', function () { openBeatNotesEditor(null, sampleTask); });
tryRender('beat notes, one beat', function () { openBeatNotesEditor('setup'); });
tryRender('scene editor, generate', function () { openSceneEditor(); });
tryRender('scene editor, one scene', function () { openSceneEditor(projectCache.scenes[0].id); });
tryRender('warm-up writing', function () { openWarmupExercise(WARMUPS[0]); });
tryRender('lesson reader', function () { openLesson(LESSONS[0]); });
tryRender('blueprint task modal', function () { openBlueprintTask(sampleTask); });
tryRender('genre confirm', function () { openGenreConfirm(); });
tryRender('settings', function () { openSettings(); });
tryRender('paste counter', function () { openPasteCounter({ value: '' }); });
tryRender('artifact editor routes to each kind', function () {
  ['notes', 'characters', 'beats', 'scenes'].forEach(function (k) { openArtifactEditor(k, sampleTask); });
});

print(fails === 0 ? '\nALL RENDERS OK' : '\n' + fails + ' RENDER FAILURES');
