// Guards the rule the last several bugs all broke: anything the programme tells
// you to do TODAY must be doable at the stage you are actually at.
//
// Instructions are checked, not explanations -- a lesson may reason about
// drafting while you are outlining. And blueprint sessions are checked in
// order, since a session is allowed to presume whatever an earlier one created.

var fails = 0;
function assert(l, g, w) {
  var ok = String(g) === String(w);
  if (!ok) fails++;
  print((ok ? '  pass  ' : '  FAIL  ') + l + '  got=' + g + (ok ? '' : '  want=' + w));
}

var PRESUMES_CHARACTER = /your protagonist|your main character|she stay|your cast\b/i;
var PRESUMES_PROSE = /you wrote last session|today's pages|the last thing you wrote|your pages\b/i;
var PRESUMES_PLOT = /the next scene\b|planned scenes|your scene list/i;

print('-- what the programme can ask for before a cast exists --');
[['warm-up', warmupPool(false)], ['cool-down', blueprintCooldownPool(false)]].forEach(function (pair) {
  var bad = pair[1].filter(function (x) {
    return PRESUMES_CHARACTER.test(x.prompt) || PRESUMES_PROSE.test(x.prompt) || PRESUMES_PLOT.test(x.prompt);
  }).map(function (x) { return x.id; });
  assert(pair[0] + ' pool presumes nothing', bad.length ? bad.join(',') : 0, 0);
});
assert('warm-ups still rotate without repeating', (function () {
  var seen = {}; var n = warmupPool(false).length;
  for (var i = 0; i < n; i++) seen[pickWarmup(i, false).id] = 1;
  return Object.keys(seen).length;
})(), warmupPool(false).length);
assert('cool-downs still rotate without repeating', (function () {
  var seen = {}; var n = blueprintCooldownPool(false).length;
  for (var i = 0; i < n; i++) seen[pickBlueprintCooldown(i, false).id] = 1;
  return Object.keys(seen).length;
})(), blueprintCooldownPool(false).length);

print('-- blueprint sessions are in a workable order --');
var order = {};
BLUEPRINT_TASKS.forEach(function (t, i) { order[t.id] = i; });
var castExists = order['bp-who-this-happens-to'];
var early = BLUEPRINT_TASKS.filter(function (t) {
  return order[t.id] < castExists && PRESUMES_CHARACTER.test(t.prompt);
}).map(function (t) { return t.id; });
assert('no session needs a cast before session ' + (castExists + 1), early.length ? early.join(',') : 0, 0);

var scenesExist = order['bp-generate-scenes'];
var earlyScenes = BLUEPRINT_TASKS.filter(function (t) {
  return order[t.id] < scenesExist && PRESUMES_PLOT.test(t.prompt);
}).map(function (t) { return t.id; });
assert('no session needs a scene list before session ' + (scenesExist + 1), earlyScenes.length ? earlyScenes.join(',') : 0, 0);

print('-- drafting content stays in the drafting phase --');
var drafting = COOLDOWNS.filter(function (c) { return PRESUMES_PROSE.test(c.prompt) || PRESUMES_PLOT.test(c.prompt); });
assert('drafting cool-downs do presume prose, as they should', drafting.length > 0, true);
var leaked = BLUEPRINT_COOLDOWNS.filter(function (b) {
  return COOLDOWNS.some(function (c) { return c.id === b.id; });
}).length;
assert('the two cool-down sets share no ids', leaked, 0);

print(fails === 0 ? '\nPHASE AUDIT OK' : '\n' + fails + ' PHASE PROBLEMS');
