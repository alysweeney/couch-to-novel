// Beat templates. Plain global script (not a module) so it stays hand-editable
// and loads without a fetch -- same pattern as data.js in workout-tracker.
//
// Beats are either 'moment' (a single scene that lands at a point) or 'span'
// (a stretch with a real word budget). Only spans can overrun, so only spans
// get drift warnings; a moment can only be early or late.
//
// startPct/endPct are fractions of the manuscript's target word count.

const BEAT_TEMPLATES = {
  'save-the-cat': {
    id: 'save-the-cat',
    name: 'Save the Cat',
    source: "Blake Snyder's 15 beats, percentages adapted for novel length",
    beats: [
      {
        key: 'opening_image',
        name: 'Opening Image',
        kind: 'moment',
        startPct: 0,
        endPct: 0.01,
        summary: "A snapshot of your protagonist's world before anything changes.",
        prompt:
          "Open on your protagonist in their ordinary world. Show us who they are before the story breaks them. This is the 'before' photo, so it should feel like the opposite of your ending.",
      },
      {
        key: 'setup',
        name: 'Set-Up',
        kind: 'span',
        startPct: 0.01,
        endPct: 0.1,
        summary: 'Establish the status quo, the supporting cast, and what is missing.',
        prompt:
          'Build the world your protagonist is about to lose. Introduce the people who matter and plant what is broken in their life. Every flaw you show here has to pay off later.',
      },
      {
        key: 'theme_stated',
        name: 'Theme Stated',
        kind: 'moment',
        startPct: 0.05,
        endPct: 0.05,
        summary: 'Someone says the thing your protagonist needs to learn, and they miss it.',
        prompt:
          "Have a secondary character state the story's lesson out loud, usually in passing. Your protagonist should dismiss it. They will earn it by the end.",
      },
      {
        key: 'catalyst',
        name: 'Catalyst',
        kind: 'moment',
        startPct: 0.1,
        endPct: 0.1,
        summary: 'The inciting incident. The old world stops being an option.',
        prompt:
          'Break the status quo. Something arrives, dies, or is discovered, and it cannot be undone. Do not soften it. This is the hinge the whole book swings on.',
      },
      {
        key: 'debate',
        name: 'Debate',
        kind: 'span',
        startPct: 0.1,
        endPct: 0.2,
        summary: "Your protagonist resists the call. The story's central question gets asked.",
        prompt:
          'Let your protagonist hesitate. Give the refusal real weight: what will it cost them to go? A debate that is too short makes the choice feel cheap.',
      },
      {
        key: 'break_into_two',
        name: 'Break Into Two',
        kind: 'moment',
        startPct: 0.2,
        endPct: 0.2,
        summary: 'Your protagonist chooses the new world. Act One ends.',
        prompt:
          'Your protagonist actively decides to enter the new world. Key word: actively. If they are dragged in, the reader stops rooting for them.',
      },
      {
        key: 'b_story',
        name: 'B Story',
        kind: 'moment',
        startPct: 0.22,
        endPct: 0.22,
        summary: 'The relationship subplot begins, carrying the theme.',
        prompt:
          'Introduce the character who will carry the theme: the love interest, mentor, or foil. This subplot is where the lesson actually gets taught.',
      },
      {
        key: 'fun_and_games',
        name: 'Fun and Games',
        kind: 'span',
        startPct: 0.2,
        endPct: 0.5,
        summary: 'The promise of the premise. The reason someone picked up this book.',
        prompt:
          'Deliver what the cover promised. This is the longest stretch of the book and the easiest to bloat. If a scene does not escalate or delight, cut it.',
      },
      {
        key: 'midpoint',
        name: 'Midpoint',
        kind: 'moment',
        startPct: 0.5,
        endPct: 0.5,
        summary: 'A false victory or false defeat. Stakes rise and the clock starts.',
        prompt:
          "Raise the stakes and kill the fun. Whether it is a peak or a collapse, your protagonist's goal shifts from what they want to what they need.",
      },
      {
        key: 'bad_guys_close_in',
        name: 'Bad Guys Close In',
        kind: 'span',
        startPct: 0.5,
        endPct: 0.75,
        summary: 'Pressure mounts from outside and inside. The team frays.',
        prompt:
          'Tighten the screws. External forces regroup and internal doubts get louder. Every win here should cost something.',
      },
      {
        key: 'all_is_lost',
        name: 'All Is Lost',
        kind: 'moment',
        startPct: 0.75,
        endPct: 0.75,
        summary: 'The lowest point. Often something or someone dies.',
        prompt:
          'Take everything. The old way of being has to die here so the new one can exist. Make sure what is lost is the thing they were clinging to in the Set-Up.',
      },
      {
        key: 'dark_night_of_the_soul',
        name: 'Dark Night of the Soul',
        kind: 'span',
        startPct: 0.75,
        endPct: 0.8,
        summary: 'Your protagonist sits in the loss before finding the answer.',
        prompt:
          'Let them grieve. Do not rush to the solution. The reader needs to believe there is not one before your protagonist finds it.',
      },
      {
        key: 'break_into_three',
        name: 'Break Into Three',
        kind: 'moment',
        startPct: 0.8,
        endPct: 0.8,
        summary: 'The synthesis. A and B story collide and the answer arrives.',
        prompt:
          'The lesson from the B Story unlocks the A Story problem. Your protagonist finally hears the thing that was stated back at 5%.',
      },
      {
        key: 'finale',
        name: 'Finale',
        kind: 'span',
        startPct: 0.8,
        endPct: 0.99,
        summary: 'Your protagonist executes the new plan and proves they have changed.',
        prompt:
          "Storm the castle. Your protagonist leads now, acting from the lesson rather than around it. Dismantle the world's problem and their own in the same motion.",
      },
      {
        key: 'final_image',
        name: 'Final Image',
        kind: 'moment',
        startPct: 0.99,
        endPct: 1,
        summary: 'The mirror of the Opening Image. Proof of change.',
        prompt:
          'Echo your opening, transformed. Same frame, different person. If you can put the two passages side by side and see the arc, you are done.',
      },
    ],
  },
};

const DEFAULT_TEMPLATE_ID = 'save-the-cat';

// Typical finished-manuscript lengths for a debut, used only to seed the
// setup wizard. Beat percentages are length-independent; this just picks the
// number they get multiplied by.
const GENRE_TARGETS = [
  // Deliberately first and the setup default. The blueprint's whole job is
  // working out what the book is, so demanding a genre before session one is
  // asking for an answer that hasn't been earned. 90k is a neutral placeholder
  // and gets revisited once the comps session makes genre knowable.
  { id: 'unsure', label: 'Not sure yet', words: 90000 },
  { id: 'fantasy', label: 'Fantasy', words: 100000 },
  { id: 'romantasy', label: 'Romantasy', words: 110000 },
  { id: 'historical-fantasy', label: 'Historical fantasy', words: 100000 },
  { id: 'sci-fi', label: 'Science fiction', words: 95000 },
  { id: 'thriller', label: 'Thriller / mystery', words: 85000 },
  { id: 'literary', label: 'Literary', words: 85000 },
  { id: 'romance', label: 'Romance', words: 80000 },
  { id: 'ya', label: 'Young adult', words: 70000 },
];
