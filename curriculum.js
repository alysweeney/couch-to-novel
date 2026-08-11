// The program content: what you actually do in a session.
//
// beats.js is the *structure* (where beats sit, how many words they get).
// This file is the *curriculum* (what to write, and what to do either side of
// writing it). Keeping them apart means a new beat framework doesn't require
// rewriting the exercises, and rewriting an exercise doesn't touch the math.
//
// Every session has three parts, borrowed from Couch to 5K:
//   warm-up  -- low-stakes, never manuscript work, gets the hand moving
//   main     -- the next assignment in your current beat
//   cool-down -- consolidates today and sets up tomorrow's cold start
//
// A note on emphasis: these are written for someone who can already write a
// good scene and struggles to make scenes *require each other*. So the prompts
// push relentlessly at causality -- the joins between moments, not the moments.

// ---------- Warm-ups ----------
// Rotated by day so the same one doesn't come up twice in a month. None of
// these touch the manuscript; that's the point. The cost of a bad warm-up
// should be zero.
//
// needsStory marks the ones that assume a protagonist exists or that you wrote
// something last session. In module 1 of the blueprint you have neither, so
// "pick something your protagonist owns" is an exercise you cannot start.
// Those are held back until there is a cast.

const WARMUPS = [
  { id: 'wu-sensory', minutes: 5, name: 'Sensory sweep',
    prompt: 'Describe the room you are sitting in using only sound and texture. No sight words. Stop at five minutes even if you are enjoying it.' },
  { id: 'wu-object', needsStory: true, minutes: 5, name: 'Object interrogation',
    prompt: 'Pick something your protagonist owns. Write 100 words on how it came into their possession. You will probably never use this.' },
  { id: 'wu-overheard', minutes: 5, name: 'Overheard',
    prompt: 'Write ten lines of dialogue with no attribution and no action beats. Two people, one room. Make it clear who is speaking from rhythm alone.' },
  { id: 'wu-lastline', minutes: 4, name: 'Last line first',
    prompt: 'Write the closing sentence of a scene that does not exist yet. Do not write the scene.' },
  { id: 'wu-verbs', needsStory: true, minutes: 5, name: 'Verb hunt',
    prompt: 'Take a paragraph you wrote last session. Replace every verb doing no work. Notice how many were "was".' },
  { id: 'wu-weather', needsStory: true, minutes: 6, name: 'Weather three ways',
    prompt: "Describe today's weather neutrally. Then as your protagonist on their best day. Then on their worst. Same weather, three paragraphs." },
  { id: 'wu-twosentence', minutes: 4, name: 'Two-sentence scene',
    prompt: 'A complete conflict in exactly two sentences. Setup and detonation. Write three of them.' },
  { id: 'wu-hands', minutes: 5, name: 'Hands',
    prompt: "Write 80 words describing only what a character's hands do during an argument. No faces, no dialogue." },
  { id: 'wu-lie', minutes: 5, name: 'The tell',
    prompt: 'A character tells a small, unnecessary lie. Write the moment, including the thing that gives them away to someone paying attention.' },
  { id: 'wu-therefore', needsStory: true, minutes: 6, name: 'Therefore / but',
    prompt: 'Write five sentences about your story in the form "X happens, therefore Y happens." If you catch yourself writing "and then", the link is broken. This is the muscle the whole novel runs on.' },
  { id: 'wu-roomafter', minutes: 5, name: 'The room after',
    prompt: 'Describe a space immediately after something violent or tender happened in it. Never say what happened.' },
  { id: 'wu-smell', needsStory: true, minutes: 4, name: 'Smell memory',
    prompt: 'Write 100 words set off by a smell your protagonist would recognise instantly and wish they did not.' },
  { id: 'wu-samewant', minutes: 6, name: 'Same want',
    prompt: 'Eight lines of dialogue where both people want the exact same thing and are still fighting. Agreement is not the same as peace.' },
  { id: 'wu-bodyfirst', minutes: 5, name: 'Body first',
    prompt: 'Write a paragraph of intense emotion using only physical sensation. No emotion words at all. No "felt".' },
  { id: 'wu-neversay', needsStory: true, minutes: 4, name: 'Never say',
    prompt: 'List twenty things your protagonist would never say out loud. Go fast. The last five are the useful ones.' },
  { id: 'wu-interrupt', minutes: 5, name: 'The interruption',
    prompt: 'Start a scene. Interrupt it at the worst possible moment. Stop writing. Do not resolve it.' },
  { id: 'wu-borrowed', needsStory: true, minutes: 6, name: 'Borrowed voice',
    prompt: 'Write 100 words about your own story in the voice of a writer you love. Steal the rhythm, not the words. Then read it back and find the one sentence that is actually yours.' },
  { id: 'wu-negative', minutes: 5, name: 'Negative space',
    prompt: 'Describe a character entirely by what is missing from their room. No people in the scene.' },
  { id: 'wu-witness', needsStory: true, minutes: 6, name: 'The witness',
    prompt: 'Describe your protagonist from the point of view of someone who finds them exhausting. Be fair to the observer.' },
  { id: 'wu-silence', minutes: 5, name: 'Silence',
    prompt: 'Write a scene where the important thing goes unsaid. The reader should know exactly what it is.' },
  { id: 'wu-obstacle', minutes: 5, name: 'Mundane obstacle',
    prompt: 'A completely ordinary object stops your character getting what they want. No magic, no villains. Two hundred words.' },
  { id: 'wu-fiveopenings', minutes: 5, name: 'Five openings',
    prompt: 'Write five first lines for a scene you have not planned. Keep none of them. The point is the throat-clearing, not the lines.' },
  { id: 'wu-consequence', needsStory: true, minutes: 6, name: 'Consequence chain',
    prompt: 'Take something small your protagonist did in the last thing you wrote. Follow it three steps forward. Who else does it touch?' },
  { id: 'wu-onegesture', minutes: 4, name: 'One gesture',
    prompt: 'A single physical gesture that tells us a whole relationship. Write the gesture, then the sentence of context that makes it land.' },
];

// ---------- Cool-downs ----------
// These are the highest-leverage two minutes of the session. Stopping well is
// what makes starting tomorrow cheap.

const COOLDOWNS = [
  { id: 'cd-midsentence', minutes: 1, name: 'Stop mid-sentence',
    prompt: 'Leave tomorrow\'s first sentence half-written. Hemingway\'s trick: never stop at a clean break. Tomorrow you get to finish something instead of starting something.' },
  { id: 'cd-oneline', minutes: 2, name: 'One line forward',
    prompt: 'Write one sentence describing the very next thing that happens. Do not write the scene. Just leave the note.' },
  { id: 'cd-wire', minutes: 2, name: 'Name the wire',
    prompt: 'Finish this sentence in your notes: "Because this scene happened, the next one has to..." If you cannot finish it, today\'s scene is decorative. Flag it and move on.' },
  { id: 'cd-wobble', minutes: 2, name: 'Flag the wobble',
    prompt: 'Note the one moment in today\'s pages that felt false. Do not fix it. Revision-you will want the list.' },
  { id: 'cd-change', minutes: 2, name: 'Count the change',
    prompt: 'One line: what is different for your protagonist now versus when you sat down? If nothing, that is worth knowing before tomorrow.' },
  { id: 'cd-question', minutes: 2, name: 'Tomorrow\'s question',
    prompt: 'Write the question the next scene has to answer. Put it where you will see it first thing.' },
  { id: 'cd-saveline', minutes: 1, name: 'Save a line',
    prompt: 'Copy the best sentence you wrote today into a running file. On bad days you will want evidence that you can do this.' },
  { id: 'cd-loops', minutes: 2, name: 'Close the loop',
    prompt: 'Note anything you opened today that still needs paying off. Loops you forget are the ones readers remember.' },
];

// ---------- Blueprint cool-downs ----------
// The drafting cool-downs above all assume you produced prose today -- today's
// pages, the next scene, the best sentence you wrote. None of that exists yet
// during the blueprint, so these close a thinking session instead of a writing
// one. Same job: consolidate what shifted, and leave tomorrow somewhere to
// start from.

const BLUEPRINT_COOLDOWNS = [
  { id: 'bcd-decided', minutes: 2, name: 'Name the decision',
    prompt: 'Write one sentence: what did you decide today that you had not decided yesterday? If the honest answer is nothing, write that instead -- some sessions are for gathering, and knowing which kind you had is worth more than pretending.' },
  { id: 'bcd-question', minutes: 2, name: 'Tomorrow\'s question',
    prompt: 'Write the question you want to be holding when you sit down next. Not a task -- a question. "Why does she stay?" restarts you faster than "work on character".' },
  { id: 'bcd-surprise', minutes: 2, name: 'What surprised you',
    prompt: 'Note the one thing that came out differently than you expected. Surprises are where the story is telling you something your plan had not accounted for, and they are easy to lose overnight.' },
  { id: 'bcd-avoiding', minutes: 2, name: 'Name the avoidance',
    prompt: 'Write down the thing you kept circling and did not settle. You are not fixing it now. You are refusing to let it stay invisible, because the unsettled thing is usually the one the draft breaks on.' },
  { id: 'bcd-aboutness', minutes: 3, name: 'What it is about, today',
    prompt: 'One sentence on what your book is about, as of today. Keep every version. Watching this sentence change across thirty sessions tells you more about your story than any single answer will.' },
  { id: 'bcd-alive', minutes: 2, name: 'Mark what is alive',
    prompt: 'Reread what you wrote today and underline the one line that has heat in it. That line is the book. The rest is scaffolding you can rebuild.' },
  { id: 'bcd-deleted', minutes: 2, name: 'The thing you almost wrote',
    prompt: 'Write down the idea you started to put in and then talked yourself out of. Those are usually discarded for being too strange or too personal, which are the two best reasons to keep something.' },
  { id: 'bcd-onestep', minutes: 1, name: 'Leave the door open',
    prompt: 'Write the first line of tomorrow\'s session now, however rough. The blueprint equivalent of stopping mid-sentence: arriving to something already started is far cheaper than arriving to a blank page.' },
];

function pickBlueprintCooldown(dayIndex) {
  const n = BLUEPRINT_COOLDOWNS.length;
  return BLUEPRINT_COOLDOWNS[((dayIndex % n) + n) % n];
}

// ---------- On-ramp ----------
// An optional five-day week zero for when the writing muscles are cold. No
// manuscript, no word target, no beats. C25K does not start you at 5k, and the
// point here is only to make sitting down feel normal again.
// Day 2 deliberately plays to a short-form writer's strengths; days 3 and 5
// start bridging from the vignette toward the chain.

const ON_RAMP = [
  { day: 1, minutes: 15, name: 'Just the room',
    prompt: 'Write 300 words describing one room in your story world. No plot, no characters, no stakes. You are only re-learning what it feels like to put words down without judging them.' },
  { day: 2, minutes: 20, name: 'Ordinary competence',
    prompt: 'A 400-word vignette: your protagonist doing something completely ordinary, and being quietly good at it. This is the thing you already know how to do. Do it well and enjoy it.' },
  { day: 3, minutes: 20, name: 'The sentence that makes it matter',
    prompt: "Reread yesterday's vignette. Write the single sentence that makes it matter to a larger story -- the thing at stake underneath the ordinary competence. Then write 300 more words with that sentence live in your head." },
  { day: 4, minutes: 20, name: 'Want versus need',
    prompt: 'One sentence: what your protagonist wants. One sentence: what they actually need. Then a paragraph on why getting the first would cost them the second. This tension is your whole book.' },
  { day: 5, minutes: 25, name: 'Chain three moments',
    prompt: 'Write three short moments in sequence, 400 words total, connected only by "therefore" or "but" -- never "and then". This is the exact skill a novel needs and a vignette does not. Tomorrow the program starts.' },
];

// ---------- Beat assignments ----------
// Bite-sized, ordered work for each beat, keyed to beats.js. A single task may
// take more than one session; the word target handles volume, this handles
// sequence. Ticking a task is what tells the app where your *story* is, as
// opposed to where your word count is.

const BEAT_TASKS = {
  opening_image: [
    { id: 'oi-1', label: 'Write the image', detail: 'One scene, 500-800 words. Your protagonist in motion in their ordinary world. No exposition, no backstory.' },
    { id: 'oi-2', label: 'Check it against the ending', detail: 'Write one line describing the Final Image you are aiming at. If the opening is not its opposite, change the opening, not the ending.' },
  ],
  setup: [
    { id: 'su-1', label: 'The competence scene', detail: 'Show your protagonist good at something. Readers forgive a lot in someone they respect.' },
    { id: 'su-2', label: 'The thing they are avoiding', detail: 'A scene where your protagonist could address what is broken in their life, and does not. Do not name the flaw. Show the swerve.' },
    { id: 'su-3', label: 'The people who will cost them', detail: 'Introduce two people who will make the Break Into Two expensive. We need to like what they will lose.' },
    { id: 'su-4', label: 'Plant three payoffs', detail: 'Three concrete details -- an object, a habit, a promise -- that Act Three will cash in. Write them into scenes, not a list.' },
    { id: 'su-5', label: 'The clock on the wall', detail: 'Something that establishes the world is already changing without your protagonist. It makes the Catalyst inevitable rather than random.' },
  ],
  theme_stated: [
    { id: 'ts-1', label: 'Write the line', detail: 'A secondary character says the lesson out loud, in passing, without weight. If it sounds like a thesis statement, bury it deeper.' },
    { id: 'ts-2', label: 'Write the dismissal', detail: 'Your protagonist deflects it in a way that shows exactly why they are not ready to hear it yet.' },
  ],
  catalyst: [
    { id: 'ca-1', label: 'Write the event', detail: 'The thing that ends the old world. Make it concrete and external -- something that happens, not something realised.' },
    { id: 'ca-2', label: 'Make it personal', detail: 'Revise so it lands harder on this character than it would on anyone else, using something you planted in the Set-Up. If it could happen to a stranger, it is happening near your protagonist rather than to them.' },
  ],
  debate: [
    { id: 'de-1', label: 'The cost of going', detail: 'A scene that makes the refusal reasonable. Give the old life a real argument.' },
    { id: 'de-2', label: 'The cost of staying', detail: 'A scene that makes staying unbearable. Both pans of the scale need weight.' },
    { id: 'de-3', label: 'The failed half-measure', detail: 'Your protagonist tries to solve this without changing. It has to not work, and it has to not work because of who they are.' },
    { id: 'de-4', label: 'Ask the question', detail: 'Land the central dramatic question explicitly enough that a reader could state it. "Will she..." -- finish that sentence.' },
  ],
  break_into_two: [
    { id: 'bt-1', label: 'Write the choice', detail: 'Your protagonist actively decides. Not pushed, not tricked, not swept along. If someone else makes the decision, rewrite it.' },
    { id: 'bt-2', label: 'Shut the door', detail: 'Add the detail that makes going back impossible or humiliating. Act One should not still be an option.' },
  ],
  b_story: [
    { id: 'bs-1', label: 'Introduce the carrier', detail: 'The character who will teach the theme. First impression should not telegraph their function.' },
    { id: 'bs-2', label: 'Make them irritating', detail: 'Give them a quality your protagonist finds annoying, which is the exact quality they will need by the Break Into Three.' },
  ],
  fun_and_games: [
    { id: 'fg-1', label: 'Deliver the promise', detail: 'The scene someone would describe when recommending your book. Write it early so the rest has something to live up to.' },
    { id: 'fg-2', label: 'Show the new competence', detail: 'Your protagonist getting good at the new world. Enjoy this. So should they.' },
    { id: 'fg-3', label: 'The first real cost', detail: 'Something the new world takes that they did not expect to pay. Small. It will not feel small later.' },
    { id: 'fg-4', label: 'Escalate twice', detail: 'Two scenes where the stakes rise. Connect them with "therefore", not "and then". If you cannot, one of them is decorative.' },
    { id: 'fg-5', label: 'The B Story deepens', detail: 'A scene with the theme-carrier that has nothing to do with the plot. This is the one readers will quote.' },
    { id: 'fg-6', label: 'Set the Midpoint fuse', detail: 'Plant the thing that detonates at the Midpoint. It should already be on the page before it matters.' },
  ],
  midpoint: [
    { id: 'mp-1', label: 'Write the turn', detail: 'A false victory or a false defeat. Either way the fun ends and something becomes irreversible.' },
    { id: 'mp-2', label: 'Start the clock', detail: 'Add or tighten a deadline. The second half needs time pressure the first half did not have.' },
    { id: 'mp-3', label: 'Shift want to need', detail: 'Show the goal changing from what they want to what they need. One line of dialogue or one decision is enough. This is the hinge of the whole book.' },
  ],
  bad_guys_close_in: [
    { id: 'bg-1', label: 'Regroup the opposition', detail: 'Whoever opposes your protagonist learns from the Midpoint and adapts. Opposition that does not adapt is scenery.' },
    { id: 'bg-2', label: 'Fracture the team', detail: 'The internal cracks widen. The doubts should be correct, which is what makes them hurt.' },
    { id: 'bg-3', label: 'A win that costs', detail: 'Let them succeed at something and lose something for it. Never a clean win in this stretch.' },
    { id: 'bg-4', label: 'The old flaw resurfaces', detail: 'The Set-Up flaw returns under pressure and makes things worse. This is the setup for All Is Lost.' },
    { id: 'bg-5', label: 'Break the B Story', detail: 'Damage the relationship carrying the theme, so its repair in Act Three means something.' },
    { id: 'bg-6', label: 'Strip the resources', detail: 'Remove the advantages one at a time so the low point is earned rather than announced.' },
  ],
  all_is_lost: [
    { id: 'al-1', label: 'Take the thing', detail: 'Remove what they have been clinging to since the Set-Up. Not a random loss -- the specific one.' },
    { id: 'al-2', label: 'Make it their fault', detail: 'Connect the loss to a choice they made. Bad luck is not a low point, it is an accident.' },
  ],
  dark_night_of_the_soul: [
    { id: 'dn-1', label: 'Sit in it', detail: 'A scene with no plot progress at all. Grief, stillness, the wrong coping mechanism. Resist solving anything.' },
    { id: 'dn-2', label: 'Reach the wrong conclusion', detail: 'Let your protagonist decide something that sounds like wisdom and is not quite right. They are close.' },
    { id: 'dn-3', label: 'Leave the door ajar', detail: 'One small detail that will let the answer arrive. Place it now so the Break Into Three is not a rescue.' },
  ],
  break_into_three: [
    { id: 'b3-1', label: 'Let the theme land', detail: 'The lesson stated back at 5% finally gets heard, ideally through the B Story character. Do not restate the line verbatim.' },
    { id: 'b3-2', label: 'Write the new plan', detail: 'Your protagonist decides what to do, from the changed self. The plan should be impossible for the person they were in Act One.' },
  ],
  finale: [
    { id: 'fi-1', label: 'Gather', detail: 'Assemble whatever and whoever is needed. Repair what broke in Bad Guys Close In.' },
    { id: 'fi-2', label: 'Execute and fail', detail: 'The plan runs and does not fully work. If it works first time, the ending is a formality.' },
    { id: 'fi-3', label: 'The high tower surprise', detail: 'Something the opposition held in reserve. It should be fair -- planted earlier, not invented here.' },
    { id: 'fi-4', label: 'Dig deep', detail: 'Your protagonist acts from the lesson, at cost, with no guarantee. This is the sentence the whole book was written for.' },
    { id: 'fi-5', label: 'Cash the payoffs', detail: 'Spend the three details you planted in the Set-Up. Check them off literally.' },
    { id: 'fi-6', label: 'Dismantle both problems', detail: 'The external problem and the internal one resolve in the same motion. If you can solve one without the other, the theme is bolted on.' },
  ],
  final_image: [
    { id: 'fim-1', label: 'Mirror the opening', detail: 'Same frame as the Opening Image, different person. Reuse a concrete detail so the echo is visible.' },
    { id: 'fim-2', label: 'Read them side by side', detail: 'Put the opening and closing passages next to each other. If you cannot see the arc, the book is not finished. Note what is missing.' },
  ],
};

// Rotate deterministically by day index so a re-render never swaps the
// exercise mid-session, but consecutive days always differ.
function warmupPool(hasStory) {
  return hasStory ? WARMUPS : WARMUPS.filter((w) => !w.needsStory);
}

function pickWarmup(dayIndex, hasStory) {
  const pool = warmupPool(hasStory !== false);
  return pool[((dayIndex % pool.length) + pool.length) % pool.length];
}

function pickCooldown(dayIndex) {
  return COOLDOWNS[((dayIndex % COOLDOWNS.length) + COOLDOWNS.length) % COOLDOWNS.length];
}
