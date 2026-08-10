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
  { id: 'mr', name: 'After the draft', blurb: 'What to do with the thing once it exists.' },
  { id: 'mg', name: 'Your genre', blurb: "What your genre's readers require that general structure doesn't cover." },
];

// `beat: null` unlocks immediately. Otherwise the lesson unlocks when your word
// count reaches that beat, or when it becomes your current focus.
const LESSONS = [
  // ---------- Foundations ----------
  {
    id: 'ls-not-a-long-short-story', module: 'm0', beat: null, minutes: 9,
    title: 'A novel is not a long short story',
    body: [
      'The difference is not length. It is obligation.',
      'In flash and short fiction, a moment can justify its own existence. An image lands, a small pressure releases, and the piece is complete because it was complete from the first line. Nothing is owed to anything outside the frame. That self-sufficiency is the form working exactly as it should, and producing it reliably is a genuine and uncommon skill.',
      'A novel scene cannot do that, and this is the whole of the transition you are making. A novel scene has to be good on its own AND leave a debt that only the next scene can pay. Two hundred beautiful self-sufficient scenes is not a novel. It is a collection with a recurring cast, and readers feel the difference immediately even when they cannot name it — they describe such books as "beautifully written but I kept putting it down."',
      'Putting it down is the diagnostic. A reader continues because something is unresolved at the level of the sentence they just finished, not because they have been told the book is good. Every scene ending is a decision point where the book asks to be closed. What keeps it open is debt.',
      'Here is the useful reframe. You are not learning to write bigger. Novels are not made of larger units than short stories; the units are roughly the same size, which is why your instincts about scenes are more transferable than they feel. What you are learning is a second skill that sits on top: making each unit incomplete in a specific, controlled direction.',
      'Note "controlled." An unfinished scene is not the same as a scene that withholds. Cliffhangers, coy narration, information deliberately kept from the reader — these produce irritation, not momentum. The debt you want is causal, not informational. The reader should know exactly what just happened, understand precisely why it forces something next, and not yet know what that something is.',
      'One consolation. Of the two halves of this craft, you have already trained the harder one. Making a moment land is difficult and largely unteachable; people spend years failing at it. Wiring moments together is mechanical by comparison — it is a habit of asking one question at the end of every scene, and the question is always the same.',
    ],
    example: {
      label: 'The same moment, closed and open',
      before: 'She let herself into the flat and stood in the dark a while before turning on the light. Her mother\'s coat was still on the hook by the door. She had meant to deal with it in the spring, and then in the summer, and now the year had turned again and the coat was still there, holding its shape.',
      after: 'She let herself into the flat and stood in the dark a while before turning on the light. Her mother\'s coat was still on the hook by the door. She had meant to deal with it in the spring, and then in the summer, and now the year had turned again. She took it down. Underneath, on the hook, was a second key she had never seen.',
      note: 'The first is complete. It has a shape, an ache, a closing cadence — as flash it works, and there is nothing wrong with it. The second uses the same material and the same voice, but ends owing something. Note what did NOT change: no more drama, no bigger emotion, no cliffhanger. One small physical action was added, and it produced a consequence the next scene has to deal with. That is the entire adjustment, repeated a few hundred times.',
    },
    practice: 'Take the last thing you wrote. Write one sentence starting "Because this happened, the next scene has to..." If you cannot finish it, the scene is decorative — good, but decorative. Then find the smallest physical action you could add that would let you finish the sentence.',
  },
  {
    id: 'ls-therefore-but', module: 'm0', beat: null, minutes: 8,
    title: 'Therefore, but, and the words you must not use',
    body: [
      'Trey Parker and Matt Stone have described a test they apply to story beats: if the beats of your outline are joined by "and then," something is broken. The connective tissue you want is "therefore" or "but."',
      'It sounds like a gimmick. It is the most reliable structural tool there is, because it converts a vague feeling — "this section drags" — into a specific, locatable, fixable fault.',
      'Take three events. She goes to the market, and then she meets her brother, and then they argue. Three things happen. Nothing causes anything. Any two could swap places, or be cut, and the passage would survive. That survivability is precisely the problem: a reader senses that nothing is load-bearing, and a book made of removable parts is a book that can be put down at any point.',
      'Now the same three events, rewired. She goes to the market to sell their mother\'s ring, BUT her brother is working the stall that day, THEREFORE she has to choose in front of him between the money and the lie she told about the ring being lost. Nothing was added. No new characters, no raised stakes, no invented drama. The events were simply made to depend on each other, and the order became fixed — you now cannot move or remove any of them without the passage collapsing.',
      'That collapsing quality is the goal. In a well-built novel, pulling out a scene should break something visible downstream. If you can lift a chapter cleanly out of your draft and nothing else needs changing, that chapter was never structural, however good it was.',
      'Two clarifications, because the rule is often over-applied.',
      'First, it is a diagnostic, not a prose instruction. You are not obliged to write "therefore" on the page — that would read appallingly. You are obliged to be able to say it about the join.',
      'Second, "but" and "therefore" do different work and a book needs both. "Therefore" is consequence: the plan proceeds and produces a result. "But" is obstruction: the plan meets something that stops it. An all-"therefore" novel is a competent, airless machine where everything the protagonist intends simply happens. An all-"but" novel is exhausting, a character bounced between walls with no agency. The texture you want alternates, and long runs of either one are worth noticing.',
      'Where this bites hardest for a short-form writer: the vignette form has no need of this at all. A collection of moments is joined by resonance, theme, echo — genuinely valid connective tissue, and often more beautiful than causation. It simply will not carry four hundred pages on its own. You can keep the resonance. You just have to run causation underneath it.',
    ],
    example: {
      label: 'The join, three ways',
      before: 'He quits the job. And then he visits his father. And then he decides to sell the house.',
      after: 'He quits the job, THEREFORE he can no longer cover his father\'s care home fees, BUT the only asset left is the house his father made him promise never to sell.',
      note: 'The first version is a summary of a life. The second is a plot, and notice it generated its own next scene for free — he now has to either break the promise or find another way, and both are scenes. Causal chains are generative. This is why outlining gets easier the further into it you go: each properly wired link suggests the next one, whereas "and then" outlines have to be invented indefinitely.',
    },
    practice: 'List your next five planned scenes as a chain, inserting "therefore" or "but" between each. Every place you reach for "and then" is a place a reader will put the book down. Then check the balance: if all five are "therefore," find the obstruction you are avoiding.',
  },
  {
    id: 'ls-what-a-scene-owes', module: 'm0', beat: null, minutes: 8,
    title: 'What a scene owes',
    body: [
      'A working scene does three jobs at once. Something changes, the change costs somebody something, and the cost creates the situation the next scene opens in.',
      'The most common failure in otherwise excellent prose is a scene where the only change is informational. The reader learns something — a revelation, a piece of history, a confession — but nobody\'s position moves. This is seductive because revelation feels momentous while you are writing it, and because the prose in such scenes is often your best.',
      'Information is not change. A character who knows more but wants the same thing, and can still do all the same things, has not been through a scene. They have been through an update.',
      'The fastest diagnostic is mechanical and takes thirty seconds. Write two short lists: what your protagonist could do before this scene, and what they can do after. If the lists match, you have written an interlude. If the second list is shorter, you have written a good scene. If it is longer, check carefully — scenes that expand a character\'s options are legitimate but rarer, and are usually followed immediately by something that takes the new option away.',
      'Note the asymmetry there. Most working scenes shorten the list. This is the same insight as escalation-by-narrowing, and it is worth sitting with, because it runs against the instinct that a story is about a character gaining power. What a reader experiences as rising tension is the closing of exits.',
      'Interludes are allowed. A novel entirely without them is relentless and tiring, and the quiet scene after a catastrophe is often the one readers remember. Two interludes in a row is where drafts die.',
      'One more thing, since your instinct will be to make the change emotional. Emotional change absolutely counts — but only when it converts into a different available action. "She forgave him" is an interlude if nothing follows from it. "She forgave him, and so she will not now testify" is a scene. The test is not whether feeling occurred; it is whether the feeling has consequences the plot can use.',
      'This is why interiority matters structurally rather than decoratively, and why "show, don\'t tell" is unhelpful advice past a certain level. The interior movement is the machinery that turns an event into a decision.',
    ],
    example: {
      label: 'Update versus scene',
      before: 'Over dinner, her aunt finally tells her the truth about the fire — that her father had been in the house that night after all, and that everyone had agreed never to mention it. She goes home shaken and lies awake a long time.',
      after: 'Over dinner, her aunt finally tells her the truth about the fire — that her father had been in the house that night after all, and that everyone had agreed never to mention it. Her aunt asks her, as the plates are cleared, to keep agreeing. She says yes, because it is easier to say at a table, and now the lie is hers as well as theirs.',
      note: 'Identical revelation, identical prose register. In the first, she ends the evening knowing something and feeling something; her options are unchanged. In the second she has been made complicit, which removes an option — she can no longer be the person who finds out and acts cleanly. Note also how the second version generates the next scene and the first does not.',
    },
    practice: 'For the scene you are about to write, name in advance what will be different at the end — not what will be revealed. Write the two lists. Then write toward the shorter one.',
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

// ---------- Foundations, continued ----------
LESSONS.push(
  {
    id: 'ls-draft-vs-edit', module: 'm0', beat: null, minutes: 7,
    title: 'You cannot draft and edit at the same time',
    body: [
      'These are two different jobs done by two different parts of your attention, and running them simultaneously is the single most common way a novel does not get written.',
      'Drafting is generative and requires a tolerance for being bad. Editing is evaluative and requires a low tolerance for being bad. Held at once, evaluation wins every time, because it is faster: judging a sentence takes a second, writing a good one takes ten minutes. So the critic outruns the generator, and you spend an hour producing and deleting the same paragraph.',
      'Short-form writers are unusually vulnerable here, and for an honourable reason. In flash, editing while drafting is nearly viable — the piece is small enough to hold whole in your head, and the polish is much of the pleasure. That habit, scaled to 100,000 words, becomes a trap: you will polish chapter one for a year.',
      'The separation has to be structural, not a matter of willpower. Some things that work: draft with the screen dimmed or in a font you dislike; never reread more than the last paragraph; keep a running "fix later" note so the critic has somewhere to put its observations instead of interrupting; and set the day\'s stopping point by word count rather than by satisfaction.',
      'The one exception worth allowing is the small re-read at the start of a session to find your voice again. Two paragraphs, no editing, purely to hear the rhythm. Any more and you are editing.',
      'The deeper point is that a first draft is not a bad version of the book. It is a different kind of object — the raw material the book gets made from. Judging it by the standards of a finished thing is a category error, and the reason so many capable writers stall at 20,000 words.',
    ],
    practice: 'Set up one structural barrier before your next session. Not a resolution — a mechanism. Dim the screen, hide the scrollbar, open a fix-later file.',
  },
  {
    id: 'ls-writing-week', module: 'm0', beat: null, minutes: 6,
    title: 'Design a week you can actually keep',
    body: [
      'The daily target this app gives you is arithmetic: words remaining divided by days remaining. It is honest but it is not a plan, because it assumes every day is the same and no day is.',
      'A schedule you can keep beats an ambitious one you cannot, by an enormous margin, because the real cost of a missed day is not the words. It is the renegotiation. Once the programme has been broken, every subsequent session becomes a decision rather than a habit, and decisions are expensive.',
      'So design for your worst week, not your best. If you can reliably manage four sessions a week, build for four and treat the fifth as a bonus rather than building for six and failing at it. The arithmetic will tell you the daily number that implies. If that number is intolerable, the honest fix is a later finish date, not more optimism.',
      'Two structural things help more than motivation. Fix the time of day rather than the duration — habits attach to cues, and "after coffee, before email" is a cue while "sometime today" is not. And decide in advance what the minimum viable session is: on a genuinely terrible day, what still counts? Two hundred words and a cool-down note is a session. Zero is a broken chain.',
      'The programme is built to absorb this. If you miss days, the daily target rises to compensate rather than accusing you of anything, and when it rises past what you can bear, that is real information about the finish date rather than a verdict on you.',
    ],
    practice: 'Write down your realistic number of sessions per week and the fixed cue that starts them. Then set your minimum viable session, the one that counts on the worst day.',
  },
  {
    id: 'ls-structure-scaffold', module: 'm0', beat: null, minutes: 7,
    title: 'Structure is scaffolding, not architecture',
    body: [
      'A caution before you get deep into the beats, because the failure mode at the other end is real.',
      'Save the Cat, the Hero\'s Journey, three-act, the beat sheet in this app — these are descriptive tools that got mistaken for prescriptive ones. They were assembled by looking at stories that worked and noticing where things tended to happen. That is genuinely useful. It is not a law, and a book written to hit fifteen marks on schedule reads exactly like a book written to hit fifteen marks on schedule.',
      'The right relationship is diagnostic. When something feels wrong and you cannot say why, the structure gives you somewhere to look: you are 60% in and the midpoint has not landed, your protagonist has not made a choice since chapter four, the low point arrived from outside. That is what a framework is for — naming a fault you can already feel.',
      'The wrong relationship is generative in the narrow sense: deciding a scene must exist because the template says a beat goes here. If your Catalyst wants to be at 14% rather than 10%, let it. If your B Story character does not appear until a third of the way in, that is a choice with consequences you can evaluate, not an error.',
      'A practical rule: when the structure and the story disagree, find out why before overriding either. Usually the story is right about what it wants and the structure is right that something is missing — the fix is rarely to move the beat, and usually to strengthen what leads into it.',
      'You are permitted to break any of this. You are just not permitted to break it by accident, which is what the map is for.',
    ],
    practice: 'Name one place your story already refuses to fit the beat sheet. Write two sentences on why, and decide deliberately whether to bend the story or the structure.',
  },

  // ---------- Act One, continued ----------
  {
    id: 'ls-pov-choice', module: 'm1', beat: 'opening_image', minutes: 8,
    title: 'Whose story is this?',
    body: [
      'Point of view is the decision that constrains every other decision, and it is much harder to change at 40,000 words than at 400.',
      'Three questions settle most of it. Who changes most? Who has the most to lose? Who is present for the moments that matter? When those answers point at different people you have found something important — often that your protagonist is not who you assumed, or that you have two protagonists and need to commit to that structurally.',
      'Then the mechanics. First person is intimate and voice-forward, which plays to a short-fiction writer\'s strengths, but it locks you out of every scene your narrator is not in, and that constraint compounds across a novel in ways it never does in a story. Close third gives most of the intimacy with an escape hatch: you can pull back for a paragraph of context and return. Multiple POV gives you scope and costs you momentum, because every switch resets the reader\'s investment.',
      'A rule worth adopting: a POV character needs a reason to exist beyond convenience. If a character narrates only because they happen to be present at a plot event, that is a structural problem wearing a POV costume. Every POV character should have their own want, their own arc, and their own reason to be telling us this.',
      'On tense, briefly: present tense creates immediacy and forecloses retrospection — no narrator who knows how this ends, no dramatic irony from hindsight. Past tense is invisible to most readers, which is usually an advantage. Neither is more literary. Choose for what you need and then stop thinking about it.',
      'One test before you commit. Write your opening scene twice, once in each of your two candidate POVs. It costs an afternoon and settles the question permanently, which is cheap against the alternative of discovering the answer in month five.',
    ],
    practice: 'Answer the three questions in writing. If they point at different people, work out why before drafting further.',
  },
  {
    id: 'ls-want-need-wound', module: 'm1', beat: 'setup', minutes: 8,
    title: 'Want, need, and the wound underneath',
    body: [
      'Three things drive a protagonist, and confusing them is why some drafts feel busy but weightless.',
      'The WANT is external, conscious, and stated. Win the case, find the brother, survive the winter. It generates plot, because a want produces goals and goals produce obstacles.',
      'The NEED is internal, usually unconscious, and generally the opposite of the want. To stop protecting herself. To accept help. To be seen. It generates arc, because a need can only be met by changing.',
      'The WOUND is the reason for both — the thing that happened before page one that taught them the lie they now live by. She was abandoned, therefore she leaves first. He failed someone, therefore he takes responsibility for everyone.',
      'The engine of a novel is that the want and the need are incompatible. Pursuing the want with full commitment must, eventually, make the need impossible to ignore. That collision is your Midpoint, and its resolution is your Break Into Three. If your want and need are compatible — if getting the thing also heals the wound — you have a plot with an arc bolted alongside it rather than a story.',
      'This also solves a problem that comes up constantly in Act Two: what should this scene be about? A scene is about the gap. Your protagonist reaches for the want using the strategy the wound taught them, and it works a little and costs a little, and each time the cost is more visible to the reader than to them.',
      'A caution: keep the wound off the page for a long time. The reader should feel its effects for many chapters before learning its cause. Explained early, it becomes an excuse; discovered late, it becomes a key.',
    ],
    example: {
      label: 'The three, separated',
      before: 'She wants to prove her mother was innocent, and she needs to learn to trust people.',
      after: 'WANT: to have the conviction overturned. NEED: to stop treating every relationship as a case to be won. WOUND: at fourteen she believed the official account, and said so publicly, and was right about the facts and wrong about everything.',
      note: 'The first is a summary. The second is a machine: notice how the wound explains why she pursues the want in a specific damaging way, and why the need is precisely what pursuing the want will cost her. Every scene can now be built from the gap between them.',
    },
    practice: 'Write your three in the format above. If you cannot state the wound as a specific past event, keep working — "she has trust issues" is a category, not a wound.',
  },
  {
    id: 'ls-prologue-trap', module: 'm1', beat: 'opening_image', minutes: 5,
    title: 'The prologue trap',
    body: [
      'Most prologues are the writer solving their own problem in public.',
      'The usual shape: a dramatic fragment from the far future or distant past, atmospheric, mysterious, featuring nobody the reader has met. It exists because the writer is anxious that chapter one is too quiet, and wants to promise that excitement is coming.',
      'That anxiety is worth listening to, but the prologue is the wrong response. It asks the reader to invest in strangers, then abandons them, then asks again. Investment does not survive that well, and many readers skip prologues on principle, which means anything load-bearing in there is effectively unwritten.',
      'The diagnostic: if your prologue is compensating for a slow chapter one, fix chapter one. If chapter one genuinely earns its quiet, you do not need the prologue.',
      'Prologues that do work tend to share two features. They are short, and they are structurally necessary rather than atmospheric — establishing a rule of the world that the reader must hold to understand chapter one, or a frame narrative that pays off. Even then, the material can nearly always be moved.',
      'Same applies to the dream opening, the waking-up opening, and the character-alone-thinking opening. Not forbidden, but each starts you in a hole. In a genre where readers sample the first page before buying, that hole is expensive.',
    ],
    practice: 'If you have a prologue, try moving its content into the first three chapters as details. If nothing is lost, you have your answer.',
  },
  {
    id: 'ls-fair-play-rules', module: 'm1', beat: 'setup', minutes: 6,
    title: 'Establish the rules while they are cheap',
    body: [
      'Every story runs on rules — what magic costs, how the institution works, what this family does not discuss. Establishing a rule early is nearly free. Establishing it at the moment it becomes convenient is the most expensive thing you can do to a reader\'s trust.',
      'The reason is fairness. A reader is playing along, predicting, anticipating. When a capability appears at the exact moment it is needed, the reader does not think "how satisfying" — they think "so anything can happen," and from that point they stop predicting, which means they stop being invested.',
      'The fix is unglamorous: introduce the rule while it is inconvenient. The magic that will save her in the Finale should first appear costing her something she did not want to pay, ideally in Act One, ideally for an unrelated reason. Then the Finale is a payoff instead of a rescue.',
      'This applies well beyond fantasy. The friend who can get anyone into anywhere, the loophole in the contract, the fact that the protagonist speaks Portuguese — anything that will matter later must exist before it matters, doing something else.',
      'A useful discipline: keep a running list of every capability, resource and relationship your ending requires. Then check each one appears at least twenty percent earlier, in a scene that is not about it.',
      'Note the shape here is the same as planting payoffs, and that is not a coincidence. Setup and fair play are the same craft seen from two angles: what the reader needs to have felt, and what the reader needs to have been told.',
    ],
    practice: 'List every rule, resource or capability your Finale depends on. For each, name the earlier scene where it first appears doing something else. Missing entries are scenes you owe Act One.',
  },

  // ---------- Act Two A, continued ----------
  {
    id: 'ls-sagging-middle', module: 'm2', beat: 'fun_and_games', minutes: 8,
    title: 'Why middles sag, specifically',
    body: [
      '"Sagging middle" is a symptom described as a diagnosis, which is why the usual advice — add a subplot, raise the stakes — so often fails. There are four distinct causes and they need different fixes.',
      'ONE: no goal. Act One\'s question got answered at the Break Into Two and no new question replaced it. Your protagonist is reacting to events rather than pursuing anything. Fix: give them a concrete, achievable, wrong objective. Not the real solution — the one they believe will work.',
      'TWO: no escalation. Things happen, but the situation is not deteriorating. Each scene resolves at roughly the level it started. Fix: work through the middle scene by scene and mark what each one removes. Anything that removes nothing is a candidate for merging.',
      'THREE: no time pressure. Nothing says these events must happen now. Without a clock, a reader has no reason to feel urgency. Fix: a deadline, ideally one your protagonist chose and cannot extend.',
      'FOUR: the protagonist has stopped choosing. Events push them and they respond. This is the most common cause and the hardest to see, because reactive scenes can be beautifully written. Fix: find the last scene where they made a decision with a cost. Everything after it needs rebuilding around choices.',
      'A quick test for which one you have. Read your middle and, for each scene, answer: what did she want, what did she do, what did it cost? If the first column is empty, cause one. If the third is empty, cause two. If the second is empty, cause four.',
      'None of these is a length problem, which is worth saying because the instinct is to cut. Cutting a middle that sags for cause one or four makes it shorter and equally weightless.',
    ],
    practice: 'Take five consecutive middle scenes and fill in the three columns. The empty column names your cause.',
  },
  {
    id: 'ls-subplots-pay', module: 'm2', beat: 'fun_and_games', minutes: 7,
    title: 'Subplots that carry weight',
    body: [
      'A subplot is not a second story running alongside the first to fill space. It is a second angle on the same thematic question, which is why "add a subplot" fails as advice when the subplot is unrelated.',
      'The reliable structure: your main plot asks a question, and each subplot answers it differently. If the book asks whether loyalty is worth its cost, the A story has your protagonist paying that cost, one subplot has a character who refused to and lives with it, and another has someone who paid too much. The reader assembles a position from the comparison, and that assembly is what makes a novel feel like it was about something.',
      'Three practical constraints. A subplot needs its own want, obstacle and resolution — a thread that just decorates is a texture, not a subplot. It should intersect the main plot at least twice, ideally causally, so it cannot be lifted out cleanly. And it should resolve before the main plot, so the Finale is not competing with itself.',
      'On volume: two subplots is comfortable for a first novel, three is ambitious, four is usually a sign that the main plot is not carrying enough. If you find yourself enjoying the subplots more than the A story, that is diagnostic and worth taking seriously — sometimes the book is telling you which story it wants to be.',
      'Your B Story is already one of these, and in most genres it is the most important. What is worth adding in this stretch is one more, running underneath, so the middle has somewhere to go when the main plot needs a breath.',
    ],
    practice: 'State your book\'s thematic question as a question. Then write how each subplot answers it differently from the A story. Any that give the same answer are redundant.',
  },
  {
    id: 'ls-time-compression', module: 'm2', beat: 'fun_and_games', minutes: 6,
    title: 'Skipping time without losing the reader',
    body: [
      'A novel covering months has to move through them, and how you handle the gaps is a craft skill nobody teaches because it looks like nothing on the page.',
      'The core principle: dramatise the change, summarise the continuity. If three months pass in which she gets steadily better at something, you do not need twelve scenes. You need two — the first time she fails and the first time she succeeds — and a sentence for everything between. The reader constructs the rest and does it more efficiently than you can.',
      'Signal a jump concretely rather than abstractly. "By March the river had dropped enough to see the stones" places us in time and space at once. "Three months passed" is a stage direction and reads as one.',
      'The main failure mode is the opposite: writing every day of the journey because it happened. If a passage exists because chronology demands it rather than because something changes, it is a bridge, and bridges want to be sentences.',
      'The second failure mode is jumping over the interesting part. A common draft skips the two weeks where the relationship actually formed, then asks the reader to accept the result. If a change matters, at least one scene of it has to be on the page — the reader will accept summary for continuity but not for transformation.',
      'For a short-form writer this is one of the genuinely new skills, because a vignette has no gaps to manage. It is worth practising deliberately: the transition sentence is its own small form.',
    ],
    practice: 'Find your next time jump. Write it as one concrete sentence that carries both the duration and a physical detail. No "later that month."',
  },
  {
    id: 'ls-secondary-agendas', module: 'm2', beat: 'fun_and_games', minutes: 6,
    title: 'Everyone wants something',
    body: [
      'The fastest way to make a novel feel inhabited rather than staged is to give every recurring character a want that has nothing to do with your protagonist.',
      'Most first drafts have a cast that exists in relation to the lead: the supportive friend, the sceptical colleague, the mentor. They arrive when needed, perform their function, and go back in the box. Readers do not consciously notice, but the world feels thin, and every scene has a slightly administrative quality.',
      'The fix is small and disproportionately effective. Give each recurring character one ongoing want the protagonist is not central to — a promotion, a sick parent, a move, a grudge. It need not be dramatic. It only needs to be live, so that when they appear they are in the middle of their own week.',
      'The immediate payoff is that scenes acquire friction for free. The friend who would normally deliver the necessary information is distracted, or wants something in return, or is unavailable at the wrong moment. Suddenly a functional scene has a negotiation in it.',
      'The larger payoff arrives in Act Two B, when things need to fall apart. If the secondary cast has their own pressures, the fracture is already loaded and does not have to be invented — people leave because they always had somewhere else to be.',
      'A caution: these wants should stay mostly off-page. You are not writing four subplots. You are writing four people who are visibly not waiting around for your protagonist.',
    ],
    practice: 'List your recurring characters. Give each one sentence: what they want this month that has nothing to do with the protagonist. Then put one of those wants into your next scene as friction.',
  },
  {
    id: 'ls-false-victory', module: 'm2', beat: 'midpoint', minutes: 6,
    title: 'The false victory',
    body: [
      'The Midpoint often takes the form of a win, and getting the flavour of that win right is what separates a book that turns from a book that merely continues.',
      'A false victory means your protagonist gets what they wanted and it does not solve what is wrong. Crucially, it should not feel hollow to them yet. The reader should see the problem before the character does — that gap is dramatic irony, and it is doing a great deal of work in the second half.',
      'The mechanics: they achieve the WANT, using the strategy the wound taught them, and it works. It genuinely works. Then it produces a consequence they did not price in, and that consequence is the thing that closes off the second half\'s easy exits.',
      'The common error is making the victory obviously fake — the prize is revealed as worthless within a page. That is not a false victory, that is a defeat with extra steps, and it cheats the reader of the pleasure of watching someone celebrate something they should not.',
      'Let the win be real. Let them enjoy it. Give it a scene where things are, briefly, good. The book will spend the next quarter dismantling it, and the dismantling is only painful in proportion to how much the reader was allowed to hope.',
      'If your Midpoint is a false defeat instead, the mirror applies: the loss should be real and the clarity it produces should be genuine, but the conclusion they draw from it should be subtly wrong in a way that Act Two B can punish.',
    ],
    practice: 'Write the scene where your protagonist is happy about the midpoint win. Then write the single line, later, where the cost becomes visible.',
  }
);

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

// ---------- Act Two B, Act Three, scene craft, and after the draft ----------
LESSONS.push(
  {
    id: 'ls-passive-protagonist', module: 'm3', beat: 'bad_guys_close_in', minutes: 8,
    title: 'When your protagonist goes passive',
    body: [
      'This is the most common serious fault in a first novel, and the hardest to see from inside, because passivity is invisible at the sentence level. The prose is fine. The scenes are eventful. The book is still dying.',
      'A passive protagonist is one to whom things happen. They react, they endure, they are rescued, they are informed. They are frequently sympathetic and frequently busy — being chased is not agency, and neither is suffering well.',
      'The reason it creeps in during Act Two B is structural. This stretch is about pressure, so the writer generates pressure, and pressure is something applied to someone. Scene after scene of things going wrong quietly converts your lead into a recipient.',
      'The diagnostic is mechanical. Go through ten consecutive scenes and, for each, write the sentence "She decided to ___." If you cannot complete it, that scene has no agency in it. Two or three in a row is a stretch of trouble. Ten is why your beta readers said it dragged.',
      'The fix is not to make them win more. It is to make them choose more, including badly. A protagonist who makes a terrible decision under pressure is active; the plot then punishes the decision rather than simply arriving. This is also how you keep collapse from feeling arbitrary — the low point should be traceable to choices, and choices only exist if they were made.',
      'One nuance: passivity is legitimate as a character trait, but then it has to be the subject. If your protagonist\'s arc is learning to act, their early passivity is the problem the book is about, and it must be visible as a cost to them, remarked on by others, and shed measurably as the book proceeds. That is different from a lead who is passive because the plot is doing the work.',
    ],
    example: {
      label: 'Reacting versus choosing',
      before: 'The guild summons her. She goes, and is told the charge will be dropped if she names the others. She refuses, and they let her go, and she walks home in the rain.',
      after: 'The guild summons her. She goes early, before the others can, so that she is the one who decides what version they hear. She names one man — the one she judges strong enough to survive it — and is wrong about him.',
      note: 'Same scene, same setting, comparable length. In the first she has integrity and no agency; the plot happens at her and she endures it well. In the second she chooses, for a reason the reader can follow, and is wrong — which means everything that follows is hers. Note the second version also generates the next three scenes and the first generates none.',
    },
    practice: 'Do the "She decided to ___" pass on your last ten scenes. Any run of three blanks is where the book goes slack.',
  },
  {
    id: 'ls-stakes-not-volume', module: 'm3', beat: 'bad_guys_close_in', minutes: 6,
    title: 'Raising stakes without raising volume',
    body: [
      'The instinct when tension needs to rise is to make the threat bigger. More enemies, a larger explosion, the fate of the city rather than the village. This works once and then stops working, because scale saturates fast — once the world is at risk there is nowhere left to go, and readers stop feeling numbers.',
      'What actually raises stakes is specificity and proximity. One named person the reader has had a scene with is worth more than a city. The reason is simple: a reader cannot fear for an abstraction, only for something they have been given to hold.',
      'Three moves that work better than escalation of scale. Make the cost personal — the price of winning is something particular to this character. Make it certain rather than possible — a threatened loss is weaker than one already happening. And make it a choice rather than an event: forcing your protagonist to select which thing to lose is far more painful than taking both.',
      'That last one is the strongest tool available in this stretch. A dilemma with two real goods produces more tension than any threat, because the reader is in it too, arguing.',
      'A useful check: if you removed the peril entirely and left only the relationships, would the chapter still be tense? If yes, your stakes are properly grounded. If no, they are borrowed from the plot and will evaporate the moment the plot pauses.',
    ],
    practice: 'Take your next high-tension scene. Remove the external threat and see what is left. Then rebuild the tension out of what remained.',
  },
  {
    id: 'ls-betrayal-earned', module: 'm3', beat: 'bad_guys_close_in', minutes: 6,
    title: 'The betrayal that was always coming',
    body: [
      'A betrayal is the most reliable device in this stretch and the easiest to get wrong. Done well, the reader\'s reaction is "of course" arriving half a second after "no". Done badly, it is just a fact you assert.',
      'The requirement is that the betrayer had a consistent reason all along, visible in retrospect and invisible in prospect. Not a hidden villain revealed, but a person whose priorities the reader has already seen and misread.',
      'Practically: plant the reason early, in a scene where it costs the character something to hold that priority. If she says once, lightly, that she would put her sister before anyone, and later she does, the betrayal is devastating and fair. If her motive appears only in the reveal, the reader feels manipulated rather than moved.',
      'The strongest version is where the betrayer is right, or at least defensible. A betrayal that the reader partly agrees with is far worse to read than a straightforwardly evil one, because it implicates them.',
      'Avoid the version where someone was secretly working for the antagonist the whole time and every previous scene was a performance. It retroactively empties those scenes, and readers resent having their memories devalued. Someone who genuinely meant it and then chose otherwise is more painful and costs you nothing.',
      'A test: reread three of the betrayer\'s earlier scenes knowing what they will do. If the scenes get richer, you have built it correctly. If they become lies, rebuild.',
    ],
    practice: 'Write the earlier scene where your betrayer states their real priority, out loud, and is not believed or not heard.',
  },
  {
    id: 'ls-pacing-descent', module: 'm3', beat: 'all_is_lost', minutes: 6,
    title: 'Pacing the descent',
    body: [
      'The stretch between the Midpoint and the low point wants to accelerate, and acceleration in prose is a rhythmic effect as much as a plot one.',
      'On the plot side: shorten the interval between consequences. Early in the book a decision can take three chapters to come back; here it should return within one. The reader should feel that there is no longer room to recover between blows.',
      'On the prose side, the machinery is concrete. Shorter scenes. Shorter paragraphs. Later entry into each scene and earlier exit. Less interiority per event — not none, but compressed, because a character with time to reflect at length is a character who is not under pressure. Chapter breaks land mid-motion rather than at rest.',
      'What not to do: remove the quiet entirely. A relentless descent goes numb about two chapters in, and numbness reads as boredom. The trick is one still moment placed deliberately, usually just before the worst thing, and shorter than the reader wants. Contrast is what makes speed perceptible.',
      'Watch also for the common structural error of putting your best emotional writing in the wrong place. The low point is not where your most lyrical passage belongs; it is where your plainest, shortest sentences belong. Save the lyricism for the Dark Night immediately after, when the reader needs somewhere to put what just happened.',
    ],
    practice: 'Look at your last four chapters before All Is Lost. Are they getting shorter? If not, that is a fixable pacing problem and cutting is the fix.',
  },
  {
    id: 'ls-endings-land', module: 'm4', beat: 'finale', minutes: 8,
    title: 'Endings that land versus endings that stop',
    body: [
      'An ending that lands does three things at once: it answers the dramatic question, it demonstrates the change, and it costs something. Missing any one produces a specific and recognisable failure.',
      'Answer the question and skip the change: the plot resolves, and the reader closes the book feeling that nothing happened. Common in thrillers and in first novels generally.',
      'Demonstrate change and skip the question: emotionally satisfying, structurally unresolved. Readers describe this as "beautiful but I did not know what it was for."',
      'Do both and skip the cost: everything resolves and everyone is fine. This is the most common failure and the hardest to accept, because by this point you love these people. But a victory that costs nothing was not a victory, it was an inevitability, and the reader retroactively discounts the whole book.',
      'The cost does not need to be a death. It can be a relationship changed permanently, a possibility closed, an innocence gone, a version of themselves they cannot return to. It only has to be real and irreversible, and it has to be something the reader wanted.',
      'One more requirement specific to the last twenty pages: your protagonist has to be the one who does it. Not the mentor, not the army, not a coincidence. If someone else resolves the plot, the arc belongs to them. This sounds obvious and is violated constantly, usually because the writer has made the antagonist too strong to be beaten by the protagonist alone. If you are in that position, the fix is upstream — the protagonist needs a capability, planted earlier, that the antagonist cannot answer.',
    ],
    practice: 'Write your ending in three sentences: what question it answers, what change it demonstrates, what it costs. If the third is hard to write, that is the work.',
  },
  {
    id: 'ls-denouement', module: 'm4', beat: 'final_image', minutes: 5,
    title: 'How much after the ending',
    body: [
      'Once the climax is done the book has one job left: let the reader land. Getting the length of that right is mostly a matter of knowing what it is for.',
      'A denouement exists to show consequence, not to tie every thread. The reader needs to see the new normal — how the world and the people are different now — and they need it briefly, because tension is gone and prose without tension has a short shelf life.',
      'Rough proportions: a chapter, sometimes two. If you are running longer, check whether you are resolving subplots that should have resolved before the climax. Threads left dangling at the end feel like debts; threads tidied after the end feel like admin.',
      'Two reliable moves. Show your protagonist doing something ordinary that they could not have done at the start — this demonstrates change without stating it. And put them back in the frame of the Opening Image, which is what the Final Image beat is for.',
      'What to avoid: explaining the theme, summarising the arc, or a final conversation where characters tell each other what they learned. If the book worked, the reader already has it, and being told reduces it. If the book did not work, this will not rescue it.',
      'The last line is worth real time. Not clever — resonant. Usually it echoes something small from early on, and usually it is shorter than you first wrote it.',
    ],
    practice: 'Draft your last line. Then cut it in half and see which version is stronger.',
  },
  {
    id: 'ls-earned-ambiguity', module: 'm4', beat: 'final_image', minutes: 5,
    title: 'Ambiguity you have earned',
    body: [
      'An ambiguous ending is a legitimate and powerful choice, and it is also where a great many literary-leaning drafts go to avoid making a decision. The difference between the two is entirely a matter of what came before.',
      'Earned ambiguity means the reader has everything they need to decide, and the book declines to decide for them. Both readings are fully supported by the text, and which one you take says something about you. That is the effect worth chasing: the reader arguing with themselves rather than with the author.',
      'Unearned ambiguity means the information required to settle the question was never provided. The reader cannot decide, so they disengage, and they are right to.',
      'The test is straightforward. Could two attentive readers hold opposite readings and both defend theirs from the page? If yes, it is earned. If the honest answer is "nobody could tell," it is not ambiguity, it is an unfinished ending.',
      'A related restraint: ambiguity works at the level of meaning, rarely at the level of fact. Readers will happily sit with not knowing whether she was right to forgive him. They will not happily sit with not knowing whether he actually did it. Withheld facts read as authorial coyness; withheld judgement reads as respect.',
      'One practical note. Whatever you choose, know the answer yourself. A writer who has decided and declines to say produces a different, denser text than one who has not decided.',
    ],
    practice: 'If your ending is ambiguous, write both readings out in full and check each is supported. Then write down, privately, which one is true.',
  },
  {
    id: 'ls-psychic-distance', module: 'mc', beat: 'setup', minutes: 8,
    title: 'Psychic distance, and staying in one head',
    body: [
      'Psychic distance is how close the narration sits to a character\'s consciousness, and controlling it deliberately is one of the biggest available upgrades to close third person.',
      'It runs on a scale. At the far end: "It was winter of 1873. A woman stood on the platform." Nearer: "Mary Chen stood on the cold platform." Nearer still: "Mary hated waiting." Closest: "God, the cold. Where was he."',
      'Most drafts sit at one distance throughout, usually the middle, which produces competent flatness. What good close third does is move — pulling back for context and setting, pushing in for pressure and decision. The movement is what creates the sense of a mind.',
      'The rule that matters: move gradually, never in a single sentence. Jumping from the far end to the closest in consecutive clauses is the jolt readers experience as clumsiness without being able to name it. Slide down the scale over a paragraph and it is invisible.',
      'The related discipline is staying in one head per scene. Head-hopping — dipping into a second character\'s thoughts mid-scene — costs you the reader\'s alignment, because they have to reallocate their sympathy mid-paragraph. If you need another perspective, take a scene break.',
      'A tell worth learning to spot: filter words. "She saw the door was open." "He felt the cold." "She realised he was lying." These sit the reader outside the character, watching them perceive. At close distance, cut the filter: "The door was open." "The cold got in." "He was lying." The perception is implied by the POV and the prose gets closer for free.',
    ],
    example: {
      label: 'Filtered and unfiltered',
      before: 'She noticed that his hands were shaking, and she realised he was frightened. She felt a sudden wave of pity for him.',
      after: 'His hands were shaking. He was frightened, and she had done that, and she was sorry.',
      note: 'Same information, one distance closer. The first has three filter constructions and holds us a step outside her; the second puts us in the head doing the noticing. Note also that removing the filters exposed a gap the first version was hiding — "a wave of pity" was standing in for a specific reaction, and once the scaffolding is gone you have to say what she actually feels.',
    },
    practice: 'Search your draft for "she saw", "he felt", "she realised", "he noticed". Cut the filter and see what the sentence becomes.',
  },
  {
    id: 'ls-description-work', module: 'mc', beat: 'fun_and_games', minutes: 6,
    title: 'Description that does work',
    body: [
      'Description earns its place when it is doing a second job. Description that only describes is where readers skim, and they skim without guilt.',
      'The second job is usually one of three. It characterises — what someone notices tells us who they are, and two characters in the same room should register different details. It creates pressure — the room is too hot, the corridor too narrow, the light going. Or it plants — the object that will matter in ninety pages appears now, unremarked.',
      'The corollary is that description belongs to a person, not to a narrator. "The kitchen had yellow curtains and a scrubbed table" is inventory. "The curtains were the ones her mother had chosen, and someone had scrubbed the table since this morning" is the same kitchen seen by somebody with a history and a suspicion.',
      'On volume: less than you think, and placed at moments of attention. A character under stress does not catalogue a room; they notice one wrong thing. A character at rest notices texture. Matching descriptive density to the character\'s state does more for pace than any amount of trimming.',
      'For a short-form writer this is usually a strength already — flash forces every image to work double. The novel-specific adjustment is distribution: you cannot deliver a setting in one dense paragraph and then run on air for forty pages. Places need re-establishing lightly, with a detail each time, or the reader loses the room.',
    ],
    practice: 'Take a descriptive paragraph. Name which of the three jobs each sentence does. Cut any that do none.',
  },
  {
    id: 'ls-exposition', module: 'mc', beat: 'debate', minutes: 7,
    title: 'Exposition without the dump',
    body: [
      'Every novel has to convey information the reader lacks. The failure is never that you explained something; it is that you explained it when nobody needed it.',
      'The governing principle: information lands when the reader wants it. So generate the want first. A question raised two chapters ago makes its answer feel like a reward; the same paragraph delivered before the question is a lecture.',
      'This inverts the instinct to explain up front so the reader is not confused. A small amount of confusion is not a problem — it is the engine. Readers will tolerate a great deal of not-knowing provided they can feel that the not-knowing is deliberate and that the story is moving.',
      'Tactically, four things work. Withhold and let the question build. Deliver through conflict, so the information arrives as a weapon in an argument rather than as a briefing. Split it — three sentences in three chapters rather than a paragraph. And let a character be wrong about it, so the correction can carry the facts.',
      'The classic anti-pattern is two characters telling each other things they both already know. If you catch yourself writing "as you know," the scene has told you what it is. The fix is usually to give one of them a reason not to want to say it.',
      'A note for fantasy: worldbuilding exposition is the same problem with more temptation, which is why the friction rule matters — the reader learns a rule when it stops somebody getting what they want.',
    ],
    practice: 'Find your longest passage of explanation. Locate the earlier scene where the reader could have been made to want it. Move the question there and see how much of the explanation you still need.',
  },
  {
    id: 'ls-chapter-breaks', module: 'mc', beat: 'fun_and_games', minutes: 5,
    title: 'Where to break a chapter',
    body: [
      'Chapter breaks are pacing instruments, not administrative divisions, and where you place them changes the reading experience more than their length does.',
      'The basic principle: break where the reader has a reason to continue and not a natural place to stop. A chapter that ends with a scene fully resolved gives permission to put the book down. A chapter that ends a beat early — a decision made but not acted on, a door opening, a name spoken — carries the reader across the gap.',
      'This is not the same as a cliffhanger, and constant cliffhangers become exhausting and slightly cheap. Most chapter endings should simply be slightly early: the emotional beat has landed and its consequence has not.',
      'Length is a rhythm tool. Short chapters accelerate — the white space itself reads as speed, which is why thrillers use three-page chapters through their final act. Longer chapters slow and deepen. Varying deliberately is better than uniformity, and matching length to the act you are in is the easiest version: comfortable in Act One, shortening through Act Two B, short and hard through the Finale.',
      'A practical technique: draft without worrying about chapters at all, writing in scenes, then decide the breaks in revision when you can see the shape. Many writers find their chapter structure only exists once the draft does.',
    ],
    practice: 'Look at your last five chapter endings. How many resolve completely? Move one break a paragraph earlier and read the join.',
  },
  {
    id: 'ls-voice', module: 'mc', beat: 'setup', minutes: 7,
    title: 'Voice, and keeping it for 100,000 words',
    body: [
      'Voice is the pattern of choices that makes prose recognisably yours: sentence rhythm, the level of diction, what gets noticed, how much is said versus withheld, where the humour sits. It is not style in the decorative sense and it cannot be added later.',
      'You almost certainly have one. Short-form writers usually do, because the form rewards it and there is nowhere to hide. The novel-specific difficulty is not finding it but sustaining it across months of uneven days, and keeping it consistent when your own mood is not.',
      'Three practical supports. Keep a voice file: two or three pages of your own writing where the voice is unmistakably on, and read a page before you start. It re-tunes the ear faster than anything else. Read the last paragraph of yesterday aloud before beginning today. And know your own tells — the constructions you reach for when tired — so you can spot the flat passages later rather than trying to prevent them now.',
      'A distinction that matters: narrative voice and character voice are different, and in close third they interact. The narration should be inflected by whose head we are in without becoming their dialogue. If your POV character is terse and the narration is lyrical, that gap needs to be deliberate — it can be gorgeous, but only on purpose.',
      'Finally, a permission. Voice drifts across a long draft and that is normal and fixable. It is a revision problem, and a cheap one. Trying to hold it perfectly stable during a first draft is a good way to stop writing, and consistency imposed in the edit is indistinguishable from consistency achieved on the day.',
    ],
    practice: 'Assemble your voice file: two pages of your own work where it is most on. Read a page before your next session.',
  },
  {
    id: 'ls-setting-pressure', module: 'mc', beat: 'bad_guys_close_in', minutes: 6,
    title: 'Setting as pressure',
    body: [
      'A setting can be scenery or it can be an antagonist, and the difference is whether it makes things harder.',
      'Any location becomes active the moment it costs somebody something. Heat that makes tempers short, a house where sound carries, a town small enough that the wrong car outside is news by lunchtime. None of these are plot events; all of them apply force to every scene set there.',
      'This is the cheapest available source of tension in a slow stretch, and it is chronically underused. Before inventing a new complication, ask what the place could be doing. A conversation that would be easy in a kitchen becomes a different scene in a car, in the rain, on a schedule.',
      'Two techniques. Give the setting a property that conflicts with what your protagonist needs — she needs privacy and the walls are thin, he needs to leave and the roads are shut. And let the setting change state as the book proceeds, so the same place reads differently in Act Three than in Act One. A room that was safe becoming a room that is watched requires no new locations and does enormous work.',
      'In fantasy this compounds with worldbuilding. The rule that costs something and the setting that applies pressure are frequently the same device, and using them together means your world is delivered through friction rather than description — which is the only way it stays interesting past chapter three.',
    ],
    practice: 'Take a flat scene. Change nothing except where it happens, choosing a place that makes what the characters want harder. Rewrite the first half page.',
  },
  {
    id: 'ls-first-draft-purpose', module: 'mr', beat: 'finale', minutes: 6,
    title: 'What a first draft is for',
    body: [
      'A first draft exists to find out what the book is. That is its entire function, and measuring it against any other standard is a mistake that stops more novels than lack of talent.',
      'You cannot know what your novel is about until it exists, because meaning emerges from the accumulation of choices, most of which you make instinctively and only understand afterwards. This is why outlines change, why characters "take over", why the ending you planned is often not the ending you write. None of that is failure. That is the process working.',
      'The practical consequence: your first draft will be structurally wrong in at least one significant way, and that is expected rather than shameful. The early chapters were written by someone who did not yet know the book — they are almost always the weakest, and almost always the ones that get rewritten most heavily. Knowing this in advance stops you rewriting chapter one eleven times in search of a foundation you can only build later.',
      'What a first draft owes you is completeness. Not quality — completeness. A finished bad draft is infinitely more valuable than a perfect first act, because it can be revised, and revision is a much easier skill than generation.',
      'When you get there, before anything else: stop. Put it away for at least two weeks, ideally four. You cannot see a draft you have just written; you will read what you intended rather than what is there. The distance is not a luxury, it is the tool.',
    ],
    practice: 'Write down now, before you finish, what you will do with the draft for the first month. Deciding in advance makes the waiting survivable.',
  },
  {
    id: 'ls-reverse-outline', module: 'mr', beat: 'final_image', minutes: 7,
    title: 'The reverse outline',
    body: [
      'The single most useful revision tool, and the least pleasant to do. You outline the book you actually wrote, as opposed to the one you intended.',
      'The method: one line per scene, in order. For each, record three things — what the POV character wants, what they do, and what changes as a result. Nothing else. No commentary, no judgement, no fixing as you go. A 90,000-word novel produces perhaps five pages.',
      'What emerges is unarguable, which is the point. Runs of scenes where the "changes" column is empty. Wants that vanish for six chapters and reappear. Two scenes doing the same job. A midpoint at 62%. Threads opened and never closed. You will have half-known all of this; seeing it in a list makes it addressable.',
      'Then read the "changes" column alone, top to bottom. That is your actual plot, stripped of prose. If it does not read as a chain — if you find yourself inserting "and then" between entries — you have located precisely where the causal wiring failed, at scene resolution rather than as a vague sense that the middle drags.',
      'This is also where the beat map earns its keep a second time. Lay your reverse outline against it and you can see whether the shape you intended is the shape you produced, in an afternoon rather than over months of rereading.',
      'A warning: do not revise while reverse outlining. The temptation to fix as you go is enormous and it destroys the value, because a diagnosis half-completed while treatment begins is not a diagnosis.',
    ],
    practice: 'When your draft is done, reverse outline the first ten chapters. Three columns, no fixing. Then read the third column alone.',
  },
  {
    id: 'ls-read-like-stranger', module: 'mr', beat: 'final_image', minutes: 5,
    title: 'Reading your own draft like a stranger',
    body: [
      'The central difficulty of revision is that you cannot un-know your book. You read what you meant, supply what is missing, and hear cadences that are not on the page. Several tricks genuinely help.',
      'Change the format. Read it on a different device, in a different font, as a PDF, on paper, at a different size. A surprising amount of self-blindness is attached to the visual shape of the manuscript in the software you drafted it in.',
      'Read aloud. Slower and more revealing than anything else, and unbeatable for rhythm, repetition, and dialogue that no human would say. Text-to-speech is a reasonable substitute and has the advantage of being unmoved by your intentions.',
      'Read out of order. Revise chapter fourteen before chapter three sometimes. Sequence is a large part of what smuggles in false continuity.',
      'Take reader notes, not writer notes. Mark where you got bored, where you were confused, where you skimmed — not how to fix it. Diagnosis before treatment, always, because the place a problem is felt is frequently not the place it is caused.',
      'And leave time. Two weeks minimum between finishing and rereading, four is better. There is no technique that substitutes for the distance, and every technique works better with it.',
    ],
    practice: 'Pick your format change now — paper, different font, text-to-speech — so it is decided before you are too close to choose well.',
  },
  {
    id: 'ls-revision-order', module: 'mr', beat: 'final_image', minutes: 7,
    title: 'What to fix first',
    body: [
      'Revision has an order, and doing it out of order wastes enormous amounts of work. The rule: never polish anything you might cut.',
      'PASS ONE, structure. Does the story work? Right protagonist, right want, causal chain intact, beats where they need to be, ending earned. Fixes at this level are brutal — cutting characters, moving or deleting whole sections, rewriting the second half. This is why it comes first: no point perfecting a chapter that structure says should not exist.',
      'PASS TWO, scene. Given the structure holds, does each scene do its job? Something changes, it costs, it causes the next one. Entering late, leaving early. This is where most of the real work happens and where the reverse outline pays off.',
      'PASS THREE, character. Consistent voices, motivations that hold, arcs visible on the page rather than only in your head. Often this means adding — first drafts under-supply interiority because you knew what they were thinking.',
      'PASS FOUR, line. Sentences, rhythm, word choice, cutting filter words and crutch constructions. This is the pass that feels like real writing and it is the last one, because it is only affordable once the words are staying.',
      'PASS FIVE, proof. Typos, consistency of names and details, formatting. A different job again, best done in a different sitting from anything creative.',
      'The temptation is always to start at pass four, because line editing is pleasant and structural work is frightening. Resist it. Every hour spent perfecting sentences in a chapter that gets cut is an hour spent, and worse, it makes the chapter harder to cut — nobody deletes their best-polished pages easily, which is how books end up structured around their prettiest paragraphs.',
    ],
    practice: 'Write the five passes down. When you catch yourself fixing a sentence during pass one, note it in a file and move on.',
  }
);

// Ordering is by module rather than by insertion, so lessons can be appended
// in batches without disturbing the sequence a reader meets them in. Sort is
// stable, so within a module the authored order is preserved.
const MODULE_ORDER = LESSON_MODULES.map((m) => m.id);
LESSONS.sort((a, b) => MODULE_ORDER.indexOf(a.module) - MODULE_ORDER.indexOf(b.module));

function lessonsForModule(moduleId, genre) {
  return LESSONS.filter((l) => l.module === moduleId && (!l.genres || l.genres.indexOf(genre) >= 0));
}

function lessonAppliesToGenre(lesson, genre) {
  return !lesson.genres || lesson.genres.indexOf(genre) >= 0;
}
