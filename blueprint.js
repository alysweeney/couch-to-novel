// The Blueprint phase: everything before the first sentence of the draft.
//
// The drafting programme assumes you have a story. This is where you get one.
// Thirty sessions in two modules -- find the idea, then build the outline --
// each producing a concrete artifact rather than a feeling of progress. By the
// end you have a logline, a cast with wants and wounds, fifteen beats filled in
// with your story, and a scene list you can draft straight from.
//
// Soft gate: the app defaults you here and keeps pointing back, but there is
// always a way to skip to drafting. Outlining is the most comfortable place in
// the world to hide, and a programme you cannot leave is a trap for exactly the
// writer this app is built for.
//
// The recurring emphasis is causality, because that is the gap this whole app
// exists to close. A writer who can already make a moment land is not learning
// to write scenes here. They are learning to build a chain.

const BLUEPRINT_MODULES = [
  {
    id: 1,
    name: 'Finding the story',
    blurb: 'Find the idea with a novel in it, and prove it has one before you spend a year on it.',
  },
  {
    id: 2,
    name: 'Building the outline',
    blurb: 'Turn the idea into a blueprint: beats, cast, and a scene list you can draft from.',
  },
];

const BLUEPRINT_TASKS = [
  // ================= Module 1: finding the story =================
  {
    id: 'bp-write-for-yourself', module: 1, minutes: 25, artifact: 'notes',
    name: 'Write for yourself first',
    prompt:
      'List the five books you have loved most, and for each write one sentence on what it gave you. Then write a paragraph on the kind of book only you could write -- not the one you think you should write, or the one that is selling.',
    help:
      'Every novel that gets finished is finished because the writer wanted to read it. Four hundred pages is far too long to sustain on duty. This list is also diagnostic: the pattern in what you love is usually the shape of what you can make.',
  },
  {
    id: 'bp-the-wound', module: 1, minutes: 30, artifact: 'notes',
    name: 'Where your material actually is',
    prompt:
      'Write privately about three things: something you got wrong and cannot fix, something you wanted badly and did not get, and something you believe that most people around you do not. No story yet. Just the material.',
    help:
      'The most individual thing in your novel will not be the plot -- plots are common property. It will be the specific unfairness you cannot stop thinking about. Fiction lets you hand your problem to somebody else and watch them fail at it differently. This is private and nobody reads it, but every strong premise you write in the next fortnight will draw on it.',
  },
  {
    id: 'bp-ten-what-ifs', module: 1, minutes: 30, artifact: 'premise',
    name: 'Ten what-ifs',
    prompt:
      'Write ten what-if questions. Not ten ideas -- ten versions of the same idea, each pushed further. "What if a woman inherited a house" is a situation. "What if a woman inherited a house she had been told burned down thirty years ago" is closer. Go until one makes you uncomfortable, then write three more past it.',
    help:
      'Most first ideas are situations rather than stories. A situation has a setting and a character; a story has a situation that cannot continue. The tenth question is usually better than the first, because the first is the one you have already imagined and therefore already resolved.',
  },
  {
    id: 'bp-edge-plausibility', module: 1, minutes: 25, artifact: 'premise',
    name: 'The problem at the edge',
    prompt:
      'Take your strongest what-if and state the problem it creates as a difficulty no ordinary approach survives. Then list the three obvious solutions and write one sentence each on why each one fails.',
    help:
      'A premise is only load-bearing if the easy answers are closed. If a reader can solve your book in a sentence, so can your protagonist, and the story collapses into wondering why they do not. Closing the obvious exits now saves discovering the problem at 40,000 words.',
  },
  {
    id: 'bp-familiar-twist', module: 1, minutes: 25, artifact: 'notes',
    name: 'Familiar, with a twist',
    prompt:
      'Name five books a reader would shelve beside yours. For each, write the promise it makes in its first fifty pages. Then write what yours promises, and the one way it differs.',
    help:
      'Readers want the familiar delivered unfamiliarly. Entirely novel is unsellable and entirely familiar is unnecessary. Knowing your neighbours tells you which conventions you are keeping -- deliberately -- and which single one you are breaking, which is usually all a book needs.',
  },
  {
    id: 'bp-who-this-happens-to', module: 1, minutes: 30, artifact: 'characters',
    name: 'Who this happens to',
    prompt:
      'Create your protagonist. Name, age, what they do all day, and how they would describe their own life in one sentence. Then answer three questions: who changes most, who has most to lose, and who is present for the moments that matter.',
    help:
      'When those three answers point at different people you have learned something important -- usually that your protagonist is not who you assumed. This is far cheaper to discover now than at 40,000 words, when point of view is nearly impossible to change.',
  },
  {
    id: 'bp-worth-following', module: 1, minutes: 25, artifact: 'characters',
    name: 'Worth four hundred pages',
    prompt:
      'Write the scene, in summary, where your protagonist is good at something. Then write the flaw that same competence conceals. Two paragraphs.',
    help:
      'Readers forgive a great deal in someone they respect, and almost nothing in someone they pity. Competence buys you the patience to show the flaw. The strongest pairing is when the two are the same trait seen from different angles: the thoroughness that makes her excellent is the control that makes her impossible.',
  },
  {
    id: 'bp-the-want', module: 1, minutes: 25, artifact: 'characters',
    name: 'What they want',
    prompt:
      'Write your protagonist\'s want: the external goal they would state out loud if asked. Make it concrete enough to photograph them achieving. Then write three obstacles that stand between them and it.',
    help:
      'Vague wants produce vague plots. "To be happy" cannot be pursued in a scene; "to buy back the shop" can. The want is your plot engine, because a want produces goals, goals produce obstacles, and obstacles produce scenes.',
  },
  {
    id: 'bp-the-need', module: 1, minutes: 30, artifact: 'characters',
    name: 'What they actually need',
    prompt:
      'Write the need -- the internal thing they must learn, usually the opposite of the want -- and the wound, the specific past event that taught them the lie they live by. Then one sentence: why getting the want would cost them the need.',
    help:
      'That last sentence is the engine of your entire novel, and it is worth an hour on its own. If the want and the need are compatible, you have a plot with an arc bolted alongside rather than a story. The wound must be an event, not a condition: "she was believed and then proved wrong at fourteen", not "she has trust issues".',
  },
  {
    id: 'bp-opposition', module: 1, minutes: 30, artifact: 'characters',
    name: 'The opposition, taken seriously',
    prompt:
      'Create whoever or whatever opposes your protagonist. Write their want, why it is reasonable to them, what it costs them, and the sentence where they are right and your protagonist is wrong.',
    help:
      'The strongest antagonists embody the shadow side of your theme -- they are the other defensible answer to your question, argued well. Opposition without its own logic produces a book where the protagonist argues with weather, and readers disengage from that faster than from almost anything else.',
  },
  {
    id: 'bp-something-set-right', module: 1, minutes: 25, artifact: 'theme',
    name: 'Something wrong, set right',
    prompt:
      'Write the injustice at the centre of your story -- the thing that is wrong and ought not to be. Then write what "set right" would look like, and what it would cost. It need not be legal or dramatic; a broken promise counts.',
    help:
      'Nearly every story that holds a reader runs on a sense of fairness violated. It is why we keep turning pages: not curiosity about what happens, but a need for the scales to move. Knowing your specific injustice tells you what your ending has to deliver, and endings that ignore it feel arbitrary however well written.',
  },
  {
    id: 'bp-values-collide', module: 1, minutes: 25, artifact: 'theme',
    name: 'Two value systems collide',
    prompt:
      'State your story\'s question with two defensible answers. Write the strongest case for each, one paragraph apiece. Then name which character carries which.',
    help:
      'Conflict at the level that sustains a novel is not two people wanting the same object. It is two people who genuinely believe different things about how to live, forced into the same room. If you cannot make the case against your own position, the book will be a lecture and the antagonist will be a device.',
  },
  {
    id: 'bp-setting-state-of-mind', module: 1, minutes: 25, artifact: 'notes',
    name: 'Setting as a state of mind',
    prompt:
      'Write half a page on where this happens, chosen for what it does to people rather than for how it looks. Then name one property of the place that will make your protagonist\'s want harder.',
    help:
      'Setting is not wallpaper and it is not a map. It is a pressure system. The question is never what your world looks like but what it costs to live in -- which is also, conveniently, the only reliable way to deliver worldbuilding without stopping the story to explain it.',
  },
  {
    id: 'bp-the-treasure', module: 1, minutes: 25, artifact: 'theme',
    name: 'The treasure and the real treasure',
    prompt:
      'Write what your protagonist is chasing, and then what they will actually have at the end. Then write the moment where they would have to choose between them.',
    help:
      'The gap between those two is your whole story, and the moment of choosing is your climax. If they can have both without cost, the ending will feel unearned. If the second is obviously better from page one, the reader is ahead of your protagonist in a way that makes them look slow rather than human.',
  },
  {
    id: 'bp-choose-your-idea', module: 1, minutes: 35, artifact: 'logline',
    name: 'Choose it, and write the logline',
    prompt:
      'Test everything so far against four questions. Does it still excite you after two weeks? Is the problem genuinely hard? Do you have a personal stake? Would you read it? Then write your logline eight times: [protagonist with a defining trait] must [do the difficult thing] or [stakes], but [obstacle]. Keep the one that makes you want to write the book, not the one that sounds most professional.',
    help:
      'This is the commitment point, and committing is the work. The logline is not marketing copy -- it is the brief you will check against when a scene feels wrong at chapter nineteen. If it needs two sentences, you have two books or an unclear protagonist.',
  },

  // ================= Module 2: building the outline =================
  {
    id: 'bp-big-question', module: 2, minutes: 25, artifact: 'premise',
    name: 'The dramatic question',
    prompt:
      'Write the question your book answers, as a yes-or-no question a reader could state aloud by the end of Act One. Then raise its urgency: add a deadline, add a cost to failure, and write it again in the simplest form you can.',
    help:
      'This is what the reader is actually holding for four hundred pages. Everything else -- the prose, the world, the cast -- is how they enjoy the wait. If your question cannot be stated simply, readers will not carry it, and the book will feel like it is about nothing in particular however good the scenes are.',
  },
  {
    id: 'bp-pov-timeframe', module: 2, minutes: 30, artifact: 'notes',
    name: 'Point of view and timeframe',
    prompt:
      'Decide person and tense, and write two sentences on why. Then decide how much time the book covers, and write what a tighter timeframe would cost you and what it would buy.',
    help:
      'Both decisions constrain everything downstream and are painful to change later. Compressed time creates pressure for free; a book spanning eighteen months has to generate urgency some other way. First person is voice-forward and locks you out of every scene the narrator misses -- a constraint that compounds across a novel in a way it never does in a short story.',
  },
  {
    id: 'bp-pin-the-theme', module: 2, minutes: 25, artifact: 'theme',
    name: 'Pin the theme down',
    prompt:
      'Write your theme as a question, not a message. Then write the line a secondary character says around 5% that states it -- in passing, about something else. Then write how your protagonist deflects it.',
    help:
      'A theme must be humble and mostly hidden. Stated as a message it becomes a lecture; carried as a question it becomes an argument the reader joins. And your protagonist must not hear the line -- arguing with it means they registered it, and the book then has nowhere left to travel.',
  },
  {
    id: 'bp-desire-denial', module: 2, minutes: 35, artifact: 'beats',
    name: 'Desire, denial, resistance',
    prompt:
      'Write the first plot pass as a chain of six to ten events, joined only by "therefore" or "but". Never "and then". Do not worry about beats yet -- just build a chain where each event forces the next.',
    help:
      'This is the exercise this entire app exists for. A chain that survives the therefore/but test is a novel; a list joined by "and then" is a collection of moments however good each one is. Every place you reach for "and then" is a place a reader would put the book down -- found now, while it costs a sentence.',
  },
  {
    id: 'bp-bookends', module: 2, minutes: 30, artifact: 'beats',
    name: 'The bookends',
    prompt:
      'Fill in your Opening Image and Final Image together. Same frame, changed person. Choose a concrete thing -- object, room, gesture -- that appears in both, and write what it means each time.',
    help:
      'Doing these two together, before anything between them, is the single most useful ordering decision in outlining. The gap between them is your character arc stated in physical terms, and every beat in the middle now has a direction to point. More generally: fill in the beats you are certain of first and work outward. Outlines built strictly front-to-back tend to be strongest in Act One and vaguest exactly where drafts fail.',
  },
  {
    id: 'bp-catalyst-choice', module: 2, minutes: 30, artifact: 'beats',
    name: 'The catalyst and the choice',
    prompt:
      'Fill in Catalyst, Debate and Break Into Two. For the Catalyst, complete: "this is worse for her than for anyone else because ___". For Break Into Two, write the sentence where she decides.',
    help:
      'If the Catalyst blank needs backstory the reader will not have yet, you have found a Set-Up scene you owe. If you cannot write the decision sentence, your protagonist is being carried into Act Two rather than choosing it, and everything that follows will feel like it happens to them.',
  },
  {
    id: 'bp-midpoint', module: 2, minutes: 30, artifact: 'beats',
    name: 'The midpoint',
    prompt:
      'Fill in your Midpoint. Write what turns, what becomes irreversible, and what clock starts. Then one line on how the goal shifts from what she wants to what she needs.',
    help:
      'The point of no return. It kills false hope, exposes the flaw, and breaks the coping strategy so thoroughly that the old approach stops being available. Everything after it has to be paid for by what came before, which is why knowing it now tells you what Act One must establish.',
  },
  {
    id: 'bp-b-story', module: 2, minutes: 25, artifact: 'characters',
    name: 'The B story',
    prompt:
      'Create your B Story character. Give them the quality your protagonist lacks, then write how it reads as a flaw on first meeting. Then write how their subplot resolves the A story problem at the Break Into Three.',
    help:
      'The B Story is a dangerous promise or a tempting delusion -- another way of living, embodied by someone who never lectures about it. If your protagonist admires them from the start there is nothing to learn. The friction at first meeting should be about precisely the thing that later saves them.',
  },
  {
    id: 'bp-second-character', module: 2, minutes: 25, artifact: 'characters',
    name: 'The second character',
    prompt:
      'Add the character who stands at the opposite end of your theme from your protagonist -- not a duplicate, not the antagonist. Write what they have that your protagonist lacks, and what they lose in the exchange.',
    help:
      'This figure can be sidekick, rival, antihero or love interest; the function is contrast. They exist so the reader can see your protagonist clearly by comparison, and the strongest versions pay a price for what they teach.',
  },
  {
    id: 'bp-wider-cast', module: 2, minutes: 30, artifact: 'characters',
    name: 'The wider cast',
    prompt:
      'Add three to five more characters. For each write one line on who they are to your protagonist and one line on what they want this month that has nothing to do with your protagonist. Then note which of them will make Act Two B hurt.',
    help:
      'That second line is what stops a cast feeling like staff. Characters with live concerns of their own generate friction for free, and they make the Act Two B fracture happen naturally rather than by authorial decree -- people leave because they always had somewhere else to be.',
  },
  {
    id: 'bp-remaining-beats', module: 2, minutes: 35, artifact: 'beats',
    name: 'Fill in the rest of the map',
    prompt:
      'Complete every remaining beat: Theme Stated, Set-Up, Fun and Games, Bad Guys Close In, All Is Lost, Dark Night, Break Into Three, Finale. A sentence or two each. Then read all fifteen in order.',
    help:
      'Reading them in sequence is the point. You are checking that each beat makes the next necessary. For All Is Lost specifically, draw the line from the Set-Up flaw to the loss in three steps -- if you cannot, the collapse is arriving from outside the story and will feel arbitrary.',
  },
  {
    id: 'bp-synopsis', module: 2, minutes: 40, artifact: 'notes',
    name: 'The one-page synopsis',
    prompt:
      'Write your whole novel as one page of prose, present tense, beginning to end, including the ending. Where we find her, what she wants, why we care, what tips her life off its axis, and how it resolves.',
    help:
      'One page is enough to feel whether the story has fuel. It is also the first time you will see the whole shape at once, and problems that were invisible across fifteen separate beats become obvious in six paragraphs -- most often a second act that takes two sentences to describe.',
  },
  {
    id: 'bp-generate-scenes', module: 2, minutes: 25, artifact: 'scenes',
    name: 'Build the scene list',
    prompt:
      'Generate your scene slots. The app divides your target into scenes of roughly 2,500 words and distributes them across the beats by word budget. Review the distribution and adjust if a beat looks starved or bloated.',
    help:
      'A scene is about the size of a long vignette -- deliberately the unit you already think in. From here your novel is not one enormous object. It is forty-odd pieces you already know how to write, in an order that makes each one necessary.',
  },
  {
    id: 'bp-summarise-scenes', module: 2, minutes: 45, artifact: 'scenes',
    name: 'Summarise every scene',
    prompt:
      'Write one or two sentences per scene: whose POV, what they want, what changes. No prose. Any scene where "what changes" is hard to fill is one to merge or cut now.',
    help:
      'A summary you can write in ninety seconds is a scene you understand. This is the longest session in the blueprint and the one that saves the most time later -- cutting a weak scene here costs a sentence, cutting it in the draft costs a week and an argument with yourself.',
  },
  {
    id: 'bp-pressure-test', module: 2, minutes: 40, artifact: 'notes',
    name: 'Pressure-test, then begin',
    prompt:
      'Read your scene list top to bottom, inserting "therefore" or "but" between every pair. Mark every place you need "and then" and fix it -- usually by changing what the earlier scene costs, not by adding a scene. Then write your opening paragraph. Badly. On purpose.',
    help:
      'When the chain reads clean you are ready, and the deliberately bad opening paragraph is not a joke: it breaks the spell of the perfect unwritten book, which is the last thing standing between you and a draft. Tomorrow the drafting programme starts and you will have somewhere to be every day.',
  },
];

function blueprintTasksForModule(moduleId) {
  return BLUEPRINT_TASKS.filter((t) => t.module === moduleId);
}

// A scene is about the size of a long vignette -- deliberately the unit a
// short-form writer already thinks in. Count derives from the target so a 70k
// YA gets ~28 and a 110k romantasy ~44, rather than a fixed number that would
// make short books dense and long books thin.
const WORDS_PER_SCENE = 2500;

function suggestedSceneCount(targetWords) {
  return Math.max(12, Math.round(targetWords / WORDS_PER_SCENE));
}

// Distributes scene slots across beats in proportion to each beat's word
// budget, so Fun and Games gets many and the Catalyst gets one. Moments always
// get exactly one: a moment is a single scene by definition.
function distributeScenes(beats, sceneCount) {
  const spans = beats.filter((b) => b.kind === 'span');
  const moments = beats.filter((b) => b.kind === 'moment');
  const spanBudget = Math.max(1, sceneCount - moments.length);
  const totalSpanWords = spans.reduce((s, b) => s + (b.endWords - b.startWords), 0) || 1;

  const alloc = {};
  moments.forEach((b) => { alloc[b.key] = 1; });

  let assigned = 0;
  spans.forEach((b, i) => {
    const share = (b.endWords - b.startWords) / totalSpanWords;
    const n = i === spans.length - 1
      ? Math.max(1, spanBudget - assigned)
      : Math.max(1, Math.round(spanBudget * share));
    alloc[b.key] = n;
    assigned += n;
  });

  const scenes = [];
  beats.forEach((b) => {
    for (let i = 0; i < (alloc[b.key] || 0); i++) {
      scenes.push({ id: `sc-${b.key}-${i + 1}`, beatKey: b.key, title: '', summary: '', pov: '', done: false });
    }
  });
  return scenes.map((s, i) => ({ ...s, index: i + 1 }));
}
