// The lessons layer: short craft readings that unlock as you reach each beat.
//
// Unlocking is by *position in the manuscript*, not by date. A lesson arrives
// when you need it and not before, which is the one thing that keeps a
// curriculum from turning into a backlog you feel guilty about. Courses that
// drip weekly do this with a calendar; here the word count already knows where
// you are, so it can do a better job than a calendar could.
//
// Written for a writer with real short-form chops who is learning to make
// scenes require each other. So the recurring subject is causality: what a
// scene owes the scene after it. A lesson that would be equally at home in a
// beginner's course does not belong in here.

const LESSON_MODULES = [
  { id: 'm0', name: 'Foundations', blurb: 'What a novel asks for that a short story does not.' },
  { id: 'm1', name: 'Act One', blurb: 'Making the opening owe something to the ending.' },
  { id: 'm2', name: 'Act Two A', blurb: 'Escalation, and the difference between more and worse.' },
  { id: 'm3', name: 'Act Two B', blurb: 'Pressure, collapse, and earning the low point.' },
  { id: 'm4', name: 'Act Three', blurb: 'Paying off everything you planted.' },
  { id: 'mc', name: 'Scene craft', blurb: 'The unit you already know how to write.' },
  { id: 'mg', name: 'Your genre', blurb: "What your genre's readers require that general structure doesn't cover." },
];

// `beat: null` unlocks immediately. Otherwise the lesson unlocks when your word
// count reaches that beat, or when it becomes your current focus.
const LESSONS = [
  // ---------- Foundations ----------
  {
    id: 'ls-not-a-long-short-story', module: 'm0', beat: null, minutes: 5,
    title: 'A novel is not a long short story',
    body: [
      'The difference is not length. It is obligation.',
      'In flash and short fiction, a moment can justify its own existence. An image lands, a small pressure releases, and the piece is complete because it was complete from the first line. That self-sufficiency is the form working correctly, and it is a genuine skill.',
      'A novel scene cannot do that. It has to be good on its own AND leave a debt that only the next scene can pay. Two hundred beautiful self-sufficient scenes is not a novel; it is a collection with a recurring cast. What makes it a novel is that scene 12 could not have happened before scene 11, and makes scene 13 unavoidable.',
      'If you have written a lot of short work, you have already trained the harder half of this. The half you are adding is the wire between the moments. That is a smaller thing to learn than it feels like from the outside.',
    ],
    practice: 'Take the last thing you wrote. Write one sentence starting "Because this happened, the next scene has to..." If you cannot finish it, the scene is decorative — good, but decorative.',
  },
  {
    id: 'ls-therefore-but', module: 'm0', beat: null, minutes: 4,
    title: 'Therefore, but, and the words you must not use',
    body: [
      'Trey Parker and Matt Stone describe a test they use on story beats: if you can connect your scenes with "and then," something is broken. The connective tissue you want is "therefore" or "but."',
      '"She goes to the market, and then she meets her brother, and then they argue." Three things happen. Nothing causes anything.',
      '"She goes to the market to sell the ring, but her brother is working the stall, therefore she has to choose between the money and the lie she told him." Same three events. Now they are a story, because each one closes off options and forces the next.',
      'This is a diagnostic, not a writing rule — you are not obliged to put "therefore" on the page. You are obliged to be able to.',
    ],
    practice: 'List your next five planned scenes as a chain, inserting "therefore" or "but" between each. Every place you reach for "and then" is a place a reader will put the book down.',
  },
  {
    id: 'ls-what-a-scene-owes', module: 'm0', beat: null, minutes: 5,
    title: 'What a scene owes',
    body: [
      'A working scene does three jobs at once. Something changes, that change costs somebody something, and the cost creates the situation the next scene opens in.',
      'The most common failure in otherwise excellent prose is a scene where the change is informational — the reader learns something, but nobody\'s position moves. Information is not change. A character who knows more but wants the same thing and can still do the same things has not been through a scene.',
      'The fastest check: write down what your protagonist could do before the scene and what they can do after. If the lists match, you have written an interlude.',
      'Interludes are allowed. Two in a row are not.',
    ],
    practice: 'For the scene you are about to write, name in advance what will be different at the end — not what will be revealed. Then write toward it.',
  },

  // ---------- Act One ----------
  {
    id: 'ls-opening-promise', module: 'm1', beat: 'opening_image', minutes: 4,
    title: 'The opening is a contract',
    body: [
      'Your first scene tells the reader what kind of attention to pay. Tone, scale, whose head we are in, what sort of trouble counts as trouble in this book. Readers are extraordinarily good at reading this signal and will hold you to it for four hundred pages.',
      'This is where short-form instincts serve you well: you already know how to make a first page do a lot of work quickly. The one addition is that a novel\'s opening also has to be answerable. The Final Image will rhyme with it, so the opening has to contain something specific enough to be echoed and inverted later.',
      'A gorgeous atmospheric opening with nothing concrete in it cannot be echoed. Put an object, a gesture, or a place in there — something you can physically bring back.',
    ],
    practice: 'Name the one concrete thing in your opening that the last page will bring back changed.',
  },
  {
    id: 'ls-planting', module: 'm1', beat: 'setup', minutes: 5,
    title: 'Planting without telegraphing',
    body: [
      'Everything Act Three spends, Act One has to plant. The trick is planting it while the reader is paying attention to something else.',
      'A detail introduced because it will matter later reads as furniture — the reader senses the author\'s hand and files it away. A detail introduced because it characterises someone right now, and which happens to matter later, reads as inevitability. Same object, completely different effect.',
      'So give every plant a present-tense job. The knife is not there for Act Three; it is there because of how carelessly he leaves it out, which tells us something about him today. That it also matters in the Finale is your business, not the reader\'s.',
    ],
    practice: 'For each of your three planted payoffs, write the reason it is on the page today, with no reference to its future use. If you cannot, it is furniture.',
  },
  {
    id: 'ls-theme-quietly', module: 'm1', beat: 'theme_stated', minutes: 4,
    title: 'Stating a theme without a thesis',
    body: [
      'The Theme Stated beat asks a secondary character to say the thing your protagonist needs to learn, roughly 5% in. Done badly this is the most embarrassing moment in structural writing — a character stepping forward to deliver the moral.',
      'Two fixes. First, the line should be about something else. Advice about the plot, a complaint, a throwaway observation about a third party. Its application to the protagonist should be invisible to everyone in the room including the speaker.',
      'Second, the protagonist has to not hear it. Not argue with it — arguing means they registered it. They should be checking the door.',
      'When it lands again in Act Three, the reader gets the pleasure of remembering it. That pleasure is the entire point, and it only works if the first pass was quiet.',
    ],
    practice: 'Write your theme line, then delete the half that explains it.',
  },
  {
    id: 'ls-personal-catalyst', module: 'm1', beat: 'catalyst', minutes: 5,
    title: 'Why the catalyst has to be personal',
    body: [
      'An inciting incident that could happen to anyone produces a protagonist who is merely nearby. The event has to exploit something specific about this person — a weakness, a history, a promise they made.',
      'A war breaks out: that happens to everyone. A war breaks out and the conscription notice arrives for the brother she promised their mother she would protect: that happens to her.',
      'Notice this is a Set-Up problem, not a Catalyst problem. If the Catalyst feels generic, the fix is almost always upstream — you have not yet established the specific thing it can press on. Go back and plant it rather than making the event bigger.',
      'Bigger is the usual instinct and it never works. Scale is not stakes.',
    ],
    practice: 'Write the sentence "This is worse for her than for anyone else because ___." If the blank needs backstory the reader does not have yet, you have found your missing Set-Up scene.',
  },
  {
    id: 'ls-debate-weight', module: 'm1', beat: 'debate', minutes: 4,
    title: 'The refusal needs a real case',
    body: [
      'The Debate is where most drafts get thin, because the writer already knows the protagonist will go. So the hesitation becomes a formality — a page of worrying before the inevitable.',
      'The reader has to believe staying is genuinely defensible. Not cowardice, not stupidity: a real argument, with real things on its side. Somebody the protagonist loves should be making that argument, and they should be at least partly right.',
      'The strength of the Debate is what sets the value of the choice. A decision made against no resistance costs nothing, and the reader prices it accordingly.',
      'This is also the beat where a short-form writer can shine, because it is fundamentally an interior, atmospheric stretch — the kind of thing a vignette does beautifully. Use that. Just make sure each interior scene closes off one more option.',
    ],
    practice: 'Write the strongest version of the argument for staying, as spoken by someone who loves your protagonist. If you find yourself weakening it to make the plot work, the plot is not ready.',
  },
  {
    id: 'ls-active-choice', module: 'm1', beat: 'break_into_two', minutes: 4,
    title: 'Pushed, or chose',
    body: [
      'At the 20% mark your protagonist enters the new world. The single most common structural mistake in a first novel is that they are carried there.',
      'Kidnapped, drafted, chosen by prophecy, left with no alternative — all of these can appear in the scene, but none of them can be the thing that moves the character across the line. Somewhere in the beat, they have to decide, knowing the cost.',
      'The reason is not moral, it is mechanical. A protagonist who chose can be blamed. A protagonist who was taken can only be pitied, and pity does not sustain four hundred pages. Everything that goes wrong from here needs to be traceable to a door they walked through.',
    ],
    practice: 'Find the sentence where your protagonist decides. If there is not one, write it, and put it before the point of no return rather than after.',
  },
  {
    id: 'ls-b-story-function', module: 'm1', beat: 'b_story', minutes: 4,
    title: 'The subplot is not a subplot',
    body: [
      'The B Story looks like a romance, a friendship, a mentorship. Structurally it is the delivery mechanism for the theme, which is why it can seem to have nothing to do with the plot and still be the reason the book works.',
      'The A Story is where your protagonist fails using the old self. The B Story is where they are shown another way of being by someone who embodies it without lecturing. At the Break Into Three, the two collide: what they learned over here solves what was impossible over there.',
      'Which means the B Story character needs the quality your protagonist lacks, and it should initially read as a flaw. Patience looks like passivity. Openness looks like naivety. If your protagonist admires them from the start, there is nothing to learn.',
    ],
    practice: 'Name the quality your B Story character has that your protagonist needs. Then name how it irritates them in chapter one.',
  },

  // ---------- Act Two A ----------
  {
    id: 'ls-promise-premise', module: 'm2', beat: 'fun_and_games', minutes: 4,
    title: 'The promise of the premise',
    body: [
      'This is the longest stretch of your book and the one people buy it for. If the pitch is "a chef discovers her restaurant is a front for something older," this is where we get restaurants and something older, at length and with pleasure.',
      'The trap is that plot slows down here, because the tension of Act One has resolved and the pressure of the Midpoint has not arrived. Writers fill the gap with incident.',
      'Incident is not escalation. Three more encounters with the same creature at the same level of threat is one scene printed three times, however different the choreography.',
      'The reliable engine: let your protagonist get good at the new world, and let each success cost slightly more than the last.',
    ],
    practice: 'List your Fun and Games scenes and mark what each one costs. If two in a row cost the same, merge them.',
  },
  {
    id: 'ls-escalation', module: 'm2', beat: 'fun_and_games', minutes: 5,
    title: 'More is not worse',
    body: [
      'Escalation is not an increase in volume. It is a narrowing of options.',
      'A bigger threat that can be met the same way is not an escalation. A smaller threat that cannot be met any of the ways that worked before is. Readers track possibility, not decibels — the sensation of rising tension is the sensation of exits closing.',
      'This is the single most useful thing to internalise if you think in moments, because moments naturally escalate by intensity, and intensity plateaus fast. Once everything is at maximum, nothing can rise. But options can keep being removed right up to the last page.',
      'Ask of each scene: which thing can she no longer do?',
    ],
    practice: 'For your next three scenes, write only the list of options removed. No prose. If a scene removes nothing, cut or combine it.',
  },
  {
    id: 'ls-midpoint-hinge', module: 'm2', beat: 'midpoint', minutes: 6,
    title: 'The midpoint is the hinge',
    body: [
      'At the halfway mark something turns: a false victory that curdles, or a false defeat that clarifies. Either way the fun ends, a clock starts, and the reader feels the book change gear.',
      'The deepest job of this beat is the swap from want to need. Up to here your protagonist has pursued what they want — the external goal, stated in Act One. From here they begin, usually without noticing, to pursue what they actually need. The two are rarely compatible, and the ending is the bill for that.',
      'This is also where a first draft most often goes soft, because the midpoint is the last structural beat you can write on momentum alone. Everything after it has to be paid for by what came before.',
      'A good test: after the Midpoint, could the first half be shortened without breaking anything? If yes, the Midpoint has not actually changed the terms — it has only interrupted them.',
    ],
    practice: 'Write two sentences: what she wanted on page one, and what she needs. Then write the moment where reaching for one costs her the other.',
  },

  // ---------- Act Two B ----------
  {
    id: 'ls-adaptive-opposition', module: 'm3', beat: 'bad_guys_close_in', minutes: 5,
    title: 'Opposition that learns',
    body: [
      'After the Midpoint, whatever opposes your protagonist has to adapt. Not get angrier — adapt. It should watch what worked, and close that route.',
      'Opposition that keeps doing the same thing while the hero improves is scenery, and readers stop fearing it around the second repetition. Opposition that responds intelligently makes every past victory feel provisional, which is exactly the mood this stretch needs.',
      'This applies to impersonal antagonists too. A storm does not learn, but the situation around it can: the shelter that worked last time is gone, the people who helped are stretched thinner.',
      'The measure of a good antagonist in this act is that they force your protagonist to change methods, and the only method left is the one requiring the lesson they have not learned yet.',
    ],
    practice: 'Write the moment the opposition changes tactics in response to something specific your protagonist did. Name the thing they did.',
  },
  {
    id: 'ls-earned-collapse', module: 'm3', beat: 'all_is_lost', minutes: 5,
    title: 'Make the low point their fault',
    body: [
      'All Is Lost lands at 75%. The temptation is to make it as devastating as possible, which usually means making it as external as possible: a betrayal, an ambush, a death out of nowhere.',
      'Devastation is not the goal. Consequence is. The low point works when the reader can trace it to a choice your protagonist made from the flaw established in the Set-Up — ideally a choice that looked reasonable at the time.',
      'Misfortune that arrives from outside produces sympathy. Collapse the character caused produces dread, and dread is what makes the last quarter unputdownable.',
      'It should also take the specific thing they have been protecting since page one. Not their most valuable thing — their most defended thing.',
    ],
    practice: 'Draw the line from the Set-Up flaw to the loss in three steps. If you cannot get there in three, the collapse is arriving from outside the story.',
  },
  {
    id: 'ls-dark-night', module: 'm3', beat: 'dark_night_of_the_soul', minutes: 4,
    title: 'Do not rush the dark',
    body: [
      'The Dark Night is a short stretch with no plot progress, and writers cut it because nothing happens. It is the beat that makes the ending believable.',
      'The reader has to sit in the possibility that there is no answer. If your protagonist finds the way forward in the same scene where they lost everything, the loss was not real and the recovery is not earned.',
      'This is also, structurally, a vignette. Interiority, stillness, the wrong coping mechanism, a scene where nothing is decided. If you came from short fiction, this may be the beat you write best in the whole book. It is the one place where the form you already have mastery over is exactly the form required.',
      'Take the space. Four thousand words of grief will do more for your ending than four thousand more words of plot.',
    ],
    practice: 'Write a scene in which your protagonist does something small and useless. No decisions, no revelations, no plot.',
  },

  // ---------- Act Three ----------
  {
    id: 'ls-synthesis', module: 'm4', beat: 'break_into_three', minutes: 5,
    title: 'The two stories collide',
    body: [
      'The Break Into Three is where the B Story lesson solves the A Story problem. Done well it produces the feeling readers describe as a book "coming together," which is really the sensation of two things they had been tracking separately turning out to be one thing.',
      'The mechanics: your protagonist cannot solve the external problem with the skills or worldview they had. The relationship subplot has been quietly teaching a different way of being. Here they apply it, and it works — not because it is nicer, but because it is the only approach the situation actually admits.',
      'Do not restate the Theme Stated line word for word. Let the reader make the connection. They will, and the fact that they made it themselves is why the beat lands.',
    ],
    practice: 'Write the plan your protagonist forms here. Then check: could the person from chapter three have made this plan? If yes, they have not changed.',
  },
  {
    id: 'ls-cash-payoffs', module: 'm4', beat: 'finale', minutes: 5,
    title: 'Spend everything',
    body: [
      'The Finale is where Act One gets cashed. Every object, promise, habit and unresolved argument you planted should be spent, and a satisfying ending usually spends more than the writer remembers planting.',
      'A useful and slightly mechanical exercise: list every setup from the first 20% and physically tick them off as the Finale uses them. Unticked items are either cuts you owe Act One, or payoffs you owe Act Three. Both are useful to know.',
      'The other rule: the external problem and the internal one have to resolve in the same motion. If your protagonist could defeat the antagonist without having changed, the character arc is decoration bolted to a plot. The victory has to be impossible for the person they were.',
      'That is the sentence the whole book exists to earn. Write it last and write it slowly.',
    ],
    practice: 'Make the setup list. Tick what the Finale spends. Deal with the remainder honestly.',
  },
  {
    id: 'ls-final-mirror', module: 'm4', beat: 'final_image', minutes: 4,
    title: 'The mirror',
    body: [
      'The Final Image answers the Opening Image. Same frame, changed person — the "after" photograph.',
      'Reuse something concrete: the object, the room, the gesture, the phrase. The echo has to be visible or it is not an echo. Abstract resonance is not the same thing and readers do not feel it.',
      'The test is brutally simple and worth doing literally. Put your opening passage and your closing passage side by side on one screen. Read them in sequence with nothing in between.',
      'If you can see the arc from those two passages alone, the novel works. If you cannot, no amount of middle will fix it — and now you know exactly what you are revising toward.',
    ],
    practice: 'Do the side-by-side. Write down what you see, or what is missing.',
  },

  // ---------- Scene craft ----------
  {
    id: 'ls-late-early', module: 'mc', beat: 'setup', minutes: 4,
    title: 'Enter late, leave early',
    body: [
      'Start scenes as close to the change as you can manage, and stop the moment it has landed. The arrival, the greetings, the settling-in, the goodbyes: readers fill these in without noticing.',
      'This is craft you likely already have, because short forms punish throat-clearing immediately. The novel-specific addition is that leaving early does double duty here — a scene cut a beat too soon leaves the reader carrying momentum into the next one, which is precisely the connective pressure a novel needs and a standalone piece does not.',
      'A vignette can afford to close its own door. A chapter should hand the reader forward.',
    ],
    practice: 'Take a finished scene. Delete the first paragraph and the last. Usually it improves. Notice which ones do not, and why.',
  },
  {
    id: 'ls-interiority', module: 'mc', beat: 'debate', minutes: 5,
    title: 'Interiority is a plot device',
    body: [
      'Interiority — the running interpretation inside your protagonist\'s head — is what makes a reader feel a scene rather than watch it. It is also structural, not decorative.',
      'Its job is to convert events into decisions. Something happens, the character reads it in their particular biased way, and that reading is what makes their next action inevitable rather than arbitrary. Remove the interiority and the same action looks random.',
      'This is why "show don\'t tell" is bad advice past a point. You can show an event; you cannot show what it means to this specific person. That part has to be told, in their voice, and it is usually the difference between competent and alive.',
      'The failure mode is interiority that only reports emotion. "She was furious" is a status update. What you want is the interpretation that leads somewhere: what she now believes, and therefore what she is about to do.',
    ],
    practice: 'Find a paragraph of interiority in your draft. Does it end somewhere the plot can use? If it only reports a feeling, extend it one sentence further.',
  },
  {
    id: 'ls-dialogue-action', module: 'mc', beat: 'fun_and_games', minutes: 4,
    title: 'Dialogue is something people do to each other',
    body: [
      'Dialogue is not information transfer with quotation marks. It is two people trying to change each other\'s position, mostly indirectly.',
      'The reliable diagnostic: for each speaker, name what they want from the other person in this exchange. Not what they want to say — what they want the other person to do, feel, or admit. If either answer is "nothing," the exchange is exposition wearing a costume.',
      'The best scenes give both people the same want and still have them fight, or opposite wants and have them agree. Both create the gap between surface and intent that makes dialogue feel real.',
      'And people rarely answer the question they were asked. Reading a page of your dialogue where every line responds directly to the one before it is a reliable sign that nobody is really in the room.',
    ],
    practice: 'Take an exchange and write each character\'s want in the margin. Then rewrite so neither states it.',
  },
  {
    id: 'ls-scene-sequel', module: 'mc', beat: 'bad_guys_close_in', minutes: 5,
    title: 'Scene and sequel',
    body: [
      'A traditional and still useful pairing: a scene is goal, conflict, and setback. A sequel is the shorter passage after it — reaction, dilemma, decision — which converts the setback into the next goal.',
      'Sequels are what most drafts are missing, and their absence is felt as breathlessness or as a plot that seems to happen to nobody. Without the reaction, the reader has not metabolised the setback. Without the dilemma, the next goal appears out of nowhere.',
      'Sequels are also short. A paragraph often does it. The proportions in a working novel are roughly a long scene and a brief sequel, over and over.',
      'If you like writing interior, atmospheric passages, this is where they belong, and it is why they belong there: the sequel is where a moment-in-time piece does load-bearing structural work.',
    ],
    practice: 'After your next setback, write the three-beat sequel: how she reacts, what her options are, what she picks. Keep it under 300 words.',
  },
];

// Genre-specific lessons. Deliberately few: causality, escalation and scene
// craft don't change between genres, and a course that re-teaches structure
// per genre is padding. These exist only where a genre's reader expectations
// actually conflict with the general beat structure.
LESSONS.push(
  {
    id: 'ls-romance-co-plot', module: 'mg', beat: 'b_story', minutes: 6,
    genres: ['romantasy', 'romance'],
    title: 'In romance, the B Story is not a subplot',
    body: [
      'This is the one place where Save the Cat will actively mislead you.',
      'The standard structure files the relationship under B Story: a subplot that carries the theme and collides with the main plot in Act Three. In most genres that is right. In romance and romantasy it is wrong, and following it produces a book that romance readers will put down.',
      'In these genres the relationship is a co-equal plot with its own complete arc — meeting, attraction, deepening, the crisis that seems to end it, and the earned reunion. It needs roughly half your page count, its own beats, and its own escalation. A reader who picked up a romantasy came for that arc at least as much as for the magic.',
      'The practical fix is not to restructure. It is to run two beat sheets over the same manuscript: the plot beats you already have, and a romance arc laid alongside them. Where they land on the same page, the book sings.',
    ],
    practice: 'Sketch the relationship arc as its own five points. Then mark where each one falls against your existing beats. Anywhere the two are more than 10% apart, one of them is drifting.',
  },
  {
    id: 'ls-two-arcs-one-midpoint', module: 'mg', beat: 'midpoint', minutes: 5,
    genres: ['romantasy', 'romance'],
    title: 'Two arcs, one midpoint',
    body: [
      'With two co-equal plots the danger is that they run in parallel and never touch — a fantasy plot with a romance happening beside it, rather than a book.',
      'The join is the Midpoint. Whatever turns the external plot should also turn the relationship, in the same scene if you can manage it. The victory that raises the stakes is also the moment they admit something. The betrayal that starts the clock is also the betrayal between them.',
      'When those two are the same event, the reader cannot separate the plot from the feeling, which is the whole appeal of the genre. When they are different events in different chapters, you have written two competent halves of two different books.',
      'Same applies at All Is Lost. The lowest point of the plot and the lowest point of the relationship want to be one scene.',
    ],
    practice: 'Write your Midpoint twice — once as a plot event, once as a relationship event. Then find the single scene that is both.',
  },
  {
    id: 'ls-world-through-friction', module: 'mg', beat: 'setup', minutes: 5,
    genres: ['fantasy', 'historical-fantasy', 'romantasy', 'sci-fi'],
    title: 'Deliver the world through friction',
    body: [
      'You will know far more about your world than the book can hold, and the temptation is to find places to put it. Resist by making a rule: the reader learns a piece of the world only when a character needs it and cannot get it easily.',
      'Not "the guild has three tiers and the lowest cannot testify," but a character needing to testify and being turned away. The rule arrives as an obstacle, so it lands as story rather than as reference material.',
      'This has a useful side effect. Any part of your world that never becomes an obstacle for anyone does not need to be on the page, which is a much easier cut to make than trying to judge whether a passage is "too much worldbuilding."',
      'The other reliable move is entitlement: your POV character already knows this world and finds it unremarkable. Their boredom with something extraordinary tells the reader more than a paragraph of explanation, and it is faster.',
    ],
    practice: 'Take your three favourite worldbuilding facts. For each, write the scene where it stops somebody getting what they want. Any that resist are the ones to leave out.',
  }
);

function lessonsForModule(moduleId, genre) {
  return LESSONS.filter((l) => l.module === moduleId && (!l.genres || l.genres.indexOf(genre) >= 0));
}

function lessonAppliesToGenre(lesson, genre) {
  return !lesson.genres || lesson.genres.indexOf(genre) >= 0;
}
