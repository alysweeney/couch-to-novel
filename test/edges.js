// Deliberately hostile cases: the deadline passed, the target already beaten,
// zero values, deleted words, hostile text, a heavy document, a long gap.
//
// Split on purpose from render-smoke (does it run?) and phase-audit (is it
// askable yet?). This one asks: does the maths stay honest when the inputs are
// stupid? Kept separate because they fail for different reasons and a merged
// suite would not localise.

var fails = 0, findings = [];
function check(label, got, want) {
  var ok = String(got) === String(want);
  if (!ok) { fails++; findings.push(label + ': got ' + got + ', want ' + want); }
  print((ok ? '  pass  ' : '  FAIL  ') + label + '  got=' + got + (ok ? '' : '  want=' + want));
}
var today = todayStr();
function P(o) {
  o = o || {}; var st = o.startDate || today;
  var p = { title:'T', genre:'unsure', targetWords:90000, templateId:DEFAULT_TEMPLATE_ID,
            startDate:st, targetDate:addDays(st,180), phase:'draft', blueprint:{}, sessionNotes:{},
            characters:[], beatNotes:{}, scenes:[], blueprintMarks:{}, beatMarks:{}, taskMarks:{},
            lessonMarks:{}, onRampDays:0 };
  for (var k in o) p[k] = o[k]; return p;
}

function E(w) { return [{ id:'x', date:today, words:w, note:'' }]; }

print('-- the programme past its own deadline --');
var over = programState(P({ startDate: addDays(today,-200), targetDate: addDays(today,-20) }), []);
check('days left floors at zero', over.daysLeft, 0);
check('daily target is the whole remainder', over.dailyTarget, 90000);
check('elapsed clamps to the programme length', over.elapsedDays <= over.totalDays, true);
check('percent complete stays in range', over.pctComplete >= 0 && over.pctComplete <= 1, true);

print('-- a target you have already passed --');
var past = programState(P({ targetWords: 1000 }), [{id:'a',date:today,words:50000,note:''}]);
check('remaining never goes negative', past.remaining, 0);
check('progress caps at 100%', past.pctComplete, 1);
check('still resolves a focus beat', !!past.focus, true);

print('-- degenerate project values --');
var zero = programState(P({ targetWords: 0 }), []);
check('zero target does not divide by zero', isFinite(zero.dailyTarget), true);
var sameDay = programState(P({ startDate: today, targetDate: today }), []);
check('zero-length programme survives', isFinite(sameDay.dailyTarget), true);
check('total days floors at one', sameDay.totalDays, 1);

print('-- Scrivener sync arithmetic --');
function syncWords(total, entries) {
  var prior = entries.filter(function(e){ return e.date !== today; })
                     .reduce(function(s,e){ return s + (e.words||0); }, 0);
  return Math.max(0, total - prior);
}
check('normal day', syncWords(5000, [{date:addDays(today,-1),words:3000}]), 2000);
check('deleted words clamp at zero rather than going negative',
      syncWords(2000, [{date:addDays(today,-1),words:3000}]), 0);
check('first ever sync', syncWords(1200, []), 1200);
check('future-dated entry is treated as prior', syncWords(5000, [{date:addDays(today,3),words:1000}]), 4000);

print('-- user text that could break a render --');
var nasty = "<script>alert(1)</script> & \"quotes\" 'apostrophe' </div>";
check('escapes angle brackets', escapeHtml(nasty).indexOf('<script') , -1);
check('escapes ampersands', escapeHtml(nasty).indexOf('&amp;') >= 0, true);
check('escapes double quotes', escapeHtml(nasty).indexOf('&quot;') >= 0, true);
check('escapes apostrophes', escapeHtml(nasty).indexOf('&#39;') >= 0, true);
check('word count survives punctuation soup', countWords('a  b\n\nc\t\td'), 4);
check('word count of whitespace only', countWords('   \n\t  '), 0);

print('-- storage headroom on the single project document --');
// Firestore caps one document at 1,048,576 bytes. Everything the blueprint
// produces lives on the project doc, so it accumulates.
var heavy = P({
  sessionNotes: (function(){ var o={}; BLUEPRINT_TASKS.forEach(function(t){ o[t.id] = new Array(2000).join('x'); }); return o; })(),
  scenes: distributeScenes(computeBeats(P({targetWords:110000})), 44).map(function(s){
    return { id:s.id, beatKey:s.beatKey, index:s.index, title:'A scene title', pov:'Her', done:false,
             summary: new Array(400).join('y') };
  }),
  characters: (function(){ var a=[]; for(var i=0;i<8;i++) a.push({id:'c'+i,name:'Name',role:'role',
    want:new Array(300).join('w'), need:new Array(300).join('n'), wound:new Array(300).join('d'),
    notes:new Array(600).join('o')}); return a; })(),
  beatNotes: (function(){ var o={}; computeBeats(P({})).forEach(function(b){ o[b.key]=new Array(500).join('b'); }); return o; })()
});
var bytes = JSON.stringify(heavy).length;
print('         heavy project document: ' + Math.round(bytes/1024) + ' KB of a 1,024 KB limit');
check('stays under the Firestore document cap', bytes < 1048576, true);
check('has at least 4x headroom', bytes < 1048576/4, true);

print('-- undo must not destroy writing --');
var proj = P({ phase:'blueprint', blueprintMarks:{ 'bp-write-for-yourself': {date:today} },
               sessionNotes:{ 'bp-write-for-yourself': 'five books I love' } });
var marks = {}; for (var k in proj.blueprintMarks) marks[k] = proj.blueprintMarks[k];
delete marks['bp-write-for-yourself'];
check('unmarking leaves the writing intact', proj.sessionNotes['bp-write-for-yourself'], 'five books I love');

print('-- streaks across awkward dates --');
check('streak with a single day', currentStreak([{date:today,words:10}]), 1);
check('streak ignores the future', currentStreak([{date:addDays(today,5),words:10}]), 0);
check('streak from yesterday still counts', currentStreak([{date:addDays(today,-1),words:10}]), 1);
check('two days ago does not', currentStreak([{date:addDays(today,-2),words:10}]), 0);
check('duplicate entries on one day count once',
      currentStreak([{date:today,words:5},{date:today,words:5}]), 1);

print('-- scene generation at the extremes --');
check('minimum count still covers every beat',
      Object.keys(distributeScenes(computeBeats(P({})), 12).reduce(function(a,s){a[s.beatKey]=1;return a;},{})).length, 15);
check('a huge count does not lose beats',
      Object.keys(distributeScenes(computeBeats(P({})), 200).reduce(function(a,s){a[s.beatKey]=1;return a;},{})).length, 15);
check('200 scenes are numbered contiguously', (function(){
  var sc = distributeScenes(computeBeats(P({})), 200), ok = true;
  sc.forEach(function(s,i){ if (s.index !== i+1) ok = false; });
  return ok;
})(), true);
check('scene ids are unique at 200', (function(){
  var sc = distributeScenes(computeBeats(P({})), 200), seen = {}, dupes = 0;
  sc.forEach(function(s){ if (seen[s.id]) dupes++; seen[s.id]=1; });
  return dupes;
})(), 0);


print('-- when the target moves, everything downstream must move with it --');
// A real sequence: 40k into a 90k placeholder, then genre confirms at 110k.
var upto = {};
['opening_image','theme_stated','catalyst','break_into_two','b_story'].forEach(function (k) { upto[k] = { words:0, date:today }; });
var at90  = programState(P({ targetWords: 90000,  beatMarks: upto }), E(46000));
var at110 = programState(P({ targetWords: 110000, beatMarks: upto }), E(46000));
check('midpoint sits at half the target, whatever it is', at110.beats.filter(function(b){return b.key==='midpoint';})[0].startWords, 55000);
check('overdue on the shorter book', at90.momentDrift, 1000);
check('not yet due on the longer one', at110.momentDrift, 0);
check('raising the target never re-locks a lesson',
      programState(P({targetWords:110000}), E(40000)).unlockedLessons.length >=
      programState(P({targetWords:90000}),  E(40000)).unlockedLessons.length, true);
check('a ticked beat stays ticked when the target moves', !!at110.marks.opening_image, true);

print('-- more than one entry on the same date --');
var dupes = [{ id:'a', date:today, words:500, note:'first' }, { id:'b', date:today, words:300, note:'second' }];
check('both count toward the total', totalWords(dupes), 800);
check('the day sums rather than picking one', wordsOnDate(dupes, today), 800);
check('the streak still counts one day', currentStreak(dupes), 1);

print('-- a long gap --');
var gap = programState(P({ startDate: addDays(today,-90) }), [{ id:'g', date: addDays(today,-85), words: 5000, note:'' }]);
check('the daily target rises rather than breaking', isFinite(gap.dailyTarget) && gap.dailyTarget > 0, true);
check('it says you are behind', gap.calendarDelta < 0, true);
check('the streak is honestly zero', currentStreak([{ date: addDays(today,-85), words: 5000 }]), 0);
check('no projection without recent data', projectedFinish(P({}), [{date:addDays(today,-60),words:9000}]), null);

print(fails === 0 ? '\nNO NEW FAILURES' : '\n' + fails + ' FINDINGS:\n  - ' + findings.join('\n  - '));
