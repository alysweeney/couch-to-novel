// The Blueprint phase: everything before the first sentence of the draft.
//
// The drafting programme assumes you have a story. This is where you get one.
// Four weeks, twenty sessions, each producing a concrete artifact rather than
// a feeling of progress -- by the end you have a logline, a cast, fifteen
// beats filled in with your story, and a scene list.
//
// Soft gate: the app defaults you here and nudges you through it, but there is
// always a way to skip to drafting. Outlining is the most comfortable place in
// the world to hide, and a programme that will not let you leave is a trap for
// exactly the writer this app is built for.
//
// Each task names the artifact it writes, so the Story tab fills in as you go
// and nothing has to be re-entered later.

const BLUEPRINT_WEEKS = [
  { week: 1, name: 'The idea', blurb: 'Find the idea with a novel in it, and prove it has one.' },
  { week: 2, name: 'The people', blurb: 'Who this happens to, and why it costs them.' },
  { week: 3, name: 'The shape', blurb: 'Your fifteen beats, filled in with your story.' },
  { week: 4, name: 'The outline', blurb: 'The scene list you will draft from.' },
];

const BLUEPRINT_TASKS = [
  // ---------- Week 1: the idea ----------
  {
    id: 'bp-what-if', week: 1, minutes: 25, artifact: 'premise',
    name: 'The what-if',
    prompt:
      'Write ten what-if questions about your story. Not ten ideas -- ten versions of the same idea, each pushed further. "What if a woman inherited a house" is a situation. "What if a woman inherited a house she had been told burned down thirty years ago" is closer. Go until one of them makes you uncomfortable, then write three more past it.',
    help: 'Most first ideas are situations rather than stories. A situation has a setting and a character; a story has a situation that cannot continue. The tenth question is usually better than the first because the first is the one you have already imagined and therefore already resolved.',
  },
  {
    id: 'bp-edge-plausibility', week: 1, minutes: 20, artifact: 'premise',
    name: 'The problem at the edge',
    prompt:
      'Take your strongest what-if and write the problem it creates, stated as a difficulty that cannot be solved by any obvious means. Then list the three obvious solutions and write one sentence each on why they fail.',
    help: 'A premise is only load-bearing if the easy answers are closed. If a reader can solve your book in a sentence, so can your protagonist, and the story becomes a question of why they do not. Closing the obvious exits now saves you from discovering the problem at 40,000 words.',
  },
  {
    id: 'bp-logline', week: 1, minutes: 25, artifact: 'logline',
    name: 'The logline',
    prompt:
      'One sentence: [protagonist with a defining trait] must [do the difficult thing] or [stakes], but [central obstacle]. Write eight versions. Keep the one that makes you want to write the book rather than the one that sounds most professional.',
    help: 'This is not marketing copy, it is a brief. Its function is to be the thing you check against when a scene feels wrong at chapter nineteen. If your logline needs two sentences, you likely have two books or an unclear protagonist.',
  },
  {
    id: 'bp-why-this', week: 1, minutes: 20, artifact: 'theme',
    name: 'Why this story',
    prompt:
      'Write a paragraph on the question underneath your premise -- the thing you are actually arguing about. Phrase it as a question with two defensible answers. Then write which answer you are drawn to, and the strongest case against it.',
    help: 'This becomes your theme, but do not think of it as a message. A message is a position you hold; a theme is a question you have not settled. Books built on settled questions read as lectures. The case against your own answer is where the antagonist and the B Story come from.',
  },
  {
    id: 'bp-genre-promises', week: 1, minutes: 20, artifact: 'notes',
    name: 'What your genre promises',
    prompt:
      'Name three books a reader would shelve beside yours. For each, write the promise it makes in its first fifty pages and whether yours makes the same one. Then list the two or three things readers of your genre will not forgive being left out.',
    help: 'Genre is a contract, not a constraint. Knowing the contract lets you decide deliberately which terms to honour and which to break, rather than breaking one by accident and losing readers who cannot say why they stopped.',
  },

  // ---------- Week 2: the people ----------
  {
    id: 'bp-protagonist-want', week: 2, minutes: 25, artifact: 'characters',
    name: 'Your protagonist, and what they want',
    prompt:
      'Create your protagonist. Name, age, what they do all day, and the external goal they would state out loud if asked. The want must be concrete enough to fail at -- something you could photograph them achieving.',
    help: 'Vague wants produce vague plots. "To be happy" cannot be pursued in a scene; "to buy back the shop" can. The want is your plot engine, so it needs to generate goals, and goals need to generate obstacles.',
  },
  {
    id: 'bp-protagonist-need', week: 2, minutes: 30, artifact: 'characters',
    name: 'The need and the wound',
    prompt:
      'For your protagonist, write the NEED (the internal thing they must learn, usually the opposite of the want) and the WOUND (the specific past event that taught them the lie they live by). Then write one sentence on why getting the want would cost them the need.',
    help: 'That last sentence is the engine of your whole novel. If pursuing the want and meeting the need are compatible, you have a plot with an arc bolted alongside rather than a story. The wound must be an event, not a condition -- "she was abandoned at eleven" rather than "she has trust issues".',
  },
  {
    id: 'bp-antagonist', week: 2, minutes: 25, artifact: 'characters',
    name: 'The opposition',
    prompt:
      'Create whoever or whatever opposes your protagonist. Write their want, why it is reasonable to them, and what it costs them to pursue it. Then write the sentence where they are right and your protagonist is wrong.',
    help: 'Opposition without its own logic produces a book where the protagonist argues with weather. The strongest antagonists embody the shadow side of your theme -- they are the other defensible answer to the question you wrote in week one, taken seriously.',
  },
  {
    id: 'bp-theme-carrier', week: 2, minutes: 25, artifact: 'characters',
    name: 'The one who carries the theme',
    prompt:
      'Create your B Story character. Give them the quality your protagonist lacks, then write how that quality reads as a flaw on first meeting. Write the line they say around 5% that your protagonist does not hear.',
    help: 'This is the person who teaches the lesson without ever teaching it. If your protagonist admires them from the start there is nothing to learn, so the first impression should have friction in it -- and the friction should be about precisely the thing that will later save them.',
  },
  {
    id: 'bp-supporting-cast', week: 2, minutes: 25, artifact: 'characters',
    name: 'Everyone else, and what they want',
    prompt:
      'Add three to five supporting characters. For each: one line on who they are to your protagonist, and one line on what they want this month that has nothing to do with your protagonist.',
    help: 'That second line is what stops your cast feeling like staff. Characters with their own live concerns generate friction for free -- the friend who would normally help is distracted, or wants something in return -- and they make Act Two B fracture naturally rather than by authorial decree.',
  },

  // ---------- Week 3: the shape ----------
  {
    id: 'bp-bookends', week: 3, minutes: 30, artifact: 'beats',
    name: 'Opening and final image',
    prompt:
      'Fill in your Opening Image and Final Image. Same frame, changed person. Choose a concrete thing -- object, room, gesture -- that appears in both, and write what it means each time.',
    help: 'Doing these together, before anything between them, is the single most useful ordering decision in outlining. The gap between the two images is your character arc stated in physical terms, and every beat in the middle now has a direction to point.',
  },
  {
    id: 'bp-act-one-beats', week: 3, minutes: 30, artifact: 'beats',
    name: 'Catalyst, Debate, Break Into Two',
    prompt:
      'Fill in your Catalyst, Debate and Break Into Two. For the Catalyst, write the sentence "this is worse for her than for anyone else because ___". For Break Into Two, write the sentence where she decides.',
    help: 'If the Catalyst blank needs backstory the reader will not have yet, you have found a Set-Up scene you owe. If you cannot write the decision sentence, your protagonist is being carried into Act Two rather than choosing it.',
  },
  {
    id: 'bp-midpoint-beat', week: 3, minutes: 30, artifact: 'beats',
    name: 'The Midpoint',
    prompt:
      'Fill in your Midpoint. Write what turns, what becomes irreversible, and what clock starts. Then write one line on how the goal shifts from what she wants to what she needs.',
    help: 'This is the hinge of the whole book and the beat most worth getting right before drafting. Everything after it has to be paid for by what came before, so knowing it now tells you what Act One has to establish.',
  },
  {
    id: 'bp-act-three-beats', week: 3, minutes: 30, artifact: 'beats',
    name: 'All Is Lost, Break Into Three, Finale',
    prompt:
      'Fill in your low point, the synthesis and the Finale. For All Is Lost, draw the line from the Set-Up flaw to the loss in three steps. For the Finale, write how the external and internal problems resolve in the same motion.',
    help: 'If you cannot draw the three-step line, the collapse is arriving from outside the story. If the external and internal resolutions are separate events, the theme is bolted on and the ending will land at half strength.',
  },
  {
    id: 'bp-remaining-beats', week: 3, minutes: 30, artifact: 'beats',
    name: 'The rest of the map',
    prompt:
      'Fill in every remaining beat: Theme Stated, Set-Up, B Story, Fun and Games, Bad Guys Close In, Dark Night of the Soul. A sentence or two each. Then read all fifteen in order.',
    help: 'Reading them in sequence is the point. You are checking that each beat makes the next one necessary -- if you find yourself mentally inserting "and then", you have found the join that will fail at 50,000 words, and it is enormously cheaper to fix here.',
  },

  // ---------- Week 4: the outline ----------
  {
    id: 'bp-generate-scenes', week: 4, minutes: 20, artifact: 'scenes',
    name: 'Build the scene list',
    prompt:
      'Generate your scene slots. The app divides your target word count into scenes of roughly 2,500 words and distributes them across the beats by each beat\'s word budget. Review the distribution and adjust the count if a beat looks starved or bloated.',
    help: 'A scene is roughly the size of a short story or a long vignette, which is deliberately the unit you already think in. From here the novel is not one enormous object -- it is forty-odd pieces you already know how to write, in an order that makes each one necessary.',
  },
  {
    id: 'bp-outline-act-one', week: 4, minutes: 40, artifact: 'scenes',
    name: 'Summarise Act One',
    prompt:
      'Write a one or two sentence summary for every scene up to the Break Into Two. For each: whose POV, what they want, and what changes. Do not write prose.',
    help: 'Three columns, no craft. The point is speed and honesty -- a summary you can write in ninety seconds is a scene you understand. Any scene where the "what changes" column is hard to fill is one to merge or cut now, while it costs a sentence rather than a week.',
  },
  {
    id: 'bp-outline-act-two-a', week: 4, minutes: 40, artifact: 'scenes',
    name: 'Summarise Act Two A',
    prompt:
      'Summarise every scene from Break Into Two to the Midpoint. As you go, mark what each scene costs. If two consecutive scenes cost the same, merge them.',
    help: 'This is the stretch that bloats, and it bloats here at the outline stage where it is trivially fixable. A Fun and Games section that reads as a list of enjoyable incidents rather than an escalating sequence is telling you something now instead of in four months.',
  },
  {
    id: 'bp-outline-act-two-b', week: 4, minutes: 40, artifact: 'scenes',
    name: 'Summarise Act Two B and Three',
    prompt:
      'Summarise the remaining scenes through to the Final Image. For the Act Two B scenes, note which option each one removes.',
    help: 'Options removed rather than events added is what makes a descent feel like a descent. If you reach All Is Lost and your protagonist still has three viable ways out, the low point will not land however bad the event is.',
  },
  {
    id: 'bp-pressure-test', week: 4, minutes: 35, artifact: 'notes',
    name: 'Pressure-test the chain',
    prompt:
      'Read your scene list top to bottom, inserting "therefore" or "but" between every pair. Mark every place you have to use "and then". Then fix them -- usually by changing what the earlier scene costs, not by adding a new scene.',
    help: 'This is the last thing you do before drafting and the most valuable. Every "and then" you fix here is a place a reader would have put the book down, found while it is still one sentence rather than nine thousand words. When this reads clean, you are ready to start.',
  },
];

// Artifact-first ordering means the Story tab fills in predictably as you go.
function blueprintTasksForWeek(week) {
  return BLUEPRINT_TASKS.filter((t) => t.week === week);
}

// A scene is about the size of a long vignette -- deliberately the unit a
// short-form writer already thinks in. Count is derived from the target so a
// 70k YA gets ~28 and a 110k romantasy gets ~44, rather than a fixed number
// that would make short books dense and long books thin.
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

  // Emit in story order so scene numbers run 1..n front to back.
  const scenes = [];
  beats.forEach((b) => {
    for (let i = 0; i < (alloc[b.key] || 0); i++) {
      scenes.push({
        id: `sc-${b.key}-${i + 1}`,
        beatKey: b.key,
        title: '',
        summary: '',
        pov: '',
        done: false,
      });
    }
  });
  return scenes.map((s, i) => ({ ...s, index: i + 1 }));
}
