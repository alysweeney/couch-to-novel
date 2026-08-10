# Couch to Novel

A guided drafting program for writing a novel, built the way Couch to 5K works:
you don't decide what to do each day, the program tells you. It maps your
manuscript onto a story structure (Save the Cat's 15 beats), gives you an
adaptive daily word target, and tells you when your draft is drifting out of
shape.

No build step, no bundler — plain HTML/CSS/JS. Sign-in and data sync are
handled by Firebase (Auth + Firestore) on its free tier; everything else is
static files you can host anywhere.

## Why it isn't just a word counter

Every writing tracker counts words. This one knows *where those words are
supposed to go*. Save the Cat's beats sit at fixed percentages of a
manuscript, so a target length turns into a word budget per beat:

| Beat | Words (at 100k) | Budget |
| --- | --- | --- |
| Set-Up | 1,000–10,000 | 9,000 |
| Catalyst | 10,000 | single scene |
| Debate | 10,000–20,000 | 10,000 |
| Fun and Games | 20,000–50,000 | 30,000 |
| Midpoint | 50,000 | single scene |
| Bad Guys Close In | 50,000–75,000 | 25,000 |
| All Is Lost | 75,000 | single scene |
| Dark Night of the Soul | 75,000–80,000 | 5,000 |
| Finale | 80,000–99,000 | 19,000 |

That gives two independent pace signals, and you can be fine on one and badly
off on the other:

- **Calendar pace** — are you writing enough per week to finish by your date?
- **Structural pace** — is your word count where it should be *for the beat
  you're in*? At 52,000 words with no Midpoint written, you're bloating Act 2A.

## A session has three parts

Borrowed from Couch to 5K, where a session is never just "run" — it's warm-up
walk, intervals, cool-down walk.

- **Warm-up** (4–6 min) — a small exercise that never touches the manuscript.
  Rotates through 24 of them, so the same one won't come round twice in a
  month. The cost of a bad warm-up should be zero.
- **Main** — the next bite-sized assignment in your current beat, not the whole
  beat. A single assignment may span several sessions; the word target handles
  volume, the assignment handles sequence.
- **Cool-down** (1–2 min) — the highest-leverage part. Stop mid-sentence, leave
  a note on what happens next, name why the next scene has to follow this one.
  Starting tomorrow is cheap only if you stopped well today.

There's also an optional **5-day warm-up week** before the program proper: no
word targets, no manuscript, no beats. Couch to 5K doesn't put you on a 5K in
week one.

## Features

- **Today**: an adaptive daily word target (remaining words ÷ remaining days),
  the beat you're currently in, today's assignment, and a warm-up and cool-down
  either side of it. Log the day's count by typing it or pasting your writing
  to have it counted.
- **Map**: all 15 beats with their word ranges, what's done, where you are, and
  which spans you've overrun.
- **Trends**: cumulative words against the on-pace line, rolling averages, a
  projected finish date, and your session history.
- **Account & sync**: email + password sign-in, synced across every device.
  Data caches locally (Firestore offline persistence), so logging a session
  with no signal works instantly and syncs later.
- **Backup**: export/import a JSON file of your project and history (gear icon,
  top right).
- Installable to your phone's home screen (PWA).

## Beats are single scenes vs. stretches

Beats come in two kinds, and the distinction drives the whole pacing engine:

- **Moments** (`kind: 'moment'`) are one scene that lands at a point — Catalyst,
  Midpoint, All Is Lost. A moment can't be "too long," only late, so it never
  triggers an overrun warning. You tick it off when you've written it.
- **Spans** (`kind: 'span'`) are stretches with a real word budget — Set-Up,
  Fun and Games, Finale. These are the ones that can bloat, so these are the
  ones that get drift warnings.

## Cloud setup (Firebase)

This app expects **its own Firebase project**, separate from any other app.
Enable **Authentication → Email/Password** and create a **Firestore database**,
then paste the web config into `cloud.js` (the Firebase web API key is not
secret — access is enforced by the Firestore security rules below, not by
hiding it).

Firestore security rules (Firestore → Rules):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/novel/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId}/novelEntries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This scopes every user to only their own project doc and their own sessions.

## Running locally

No build step needed — just serve the folder statically, e.g.:

```
python3 -m http.server 8000
```

then open `http://localhost:8000`. (Sign-in requires network access to
Firebase; everything after that first sign-in also works offline.)

## Deploying (GitHub Pages)

1. In this repo, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Pick `main` and folder `/ (root)`, then save.
4. GitHub publishes it at `https://<owner>.github.io/<repo>/` within a minute
   or two.
5. On your phone, open that URL and use **Add to Home Screen** to install it.

## Editing the program

Structure and content are deliberately separate files, so changing one never
means touching the other.

**`beats.js` is the structure** — names, percentage positions, summaries, and
whether each beat is a moment or a span. Adding a second framework (Hero's
Journey, a romance beat sheet) means adding another entry to `BEAT_TEMPLATES`
with the same shape; nothing in `app.js` is hardcoded to Save the Cat. Genre
word-count defaults for the setup wizard live in `GENRE_TARGETS` here too.

**`lessons.js` is the course** — 23 short craft readings in six modules, each
with a practice exercise. They unlock by *position in the manuscript*, not by
date: a lesson attached to a beat opens when your word count reaches that beat,
and the three Foundations lessons are open from day one. That's deliberate.
Course platforms drip weekly on a calendar; here the word count already knows
where you are, so a lesson can arrive when it's about to be useful instead of
piling into a backlog.

**`curriculum.js` is the session content** — what you actually do day to day:

- `WARMUPS` / `COOLDOWNS` — the exercises either side of the writing, picked by
  day index so a re-render never swaps one mid-session
- `ON_RAMP` — the optional warm-up week
- `BEAT_TASKS` — ordered, bite-sized assignments keyed to beat keys in
  `beats.js`

Adding an assignment is appending an object with a unique `id`; completion is
stored against that id, so **don't reuse or renumber ids** on beats you've
already worked through.

The prompts are written for someone who can already write a good scene and is
learning to make scenes *require each other*, so they push at causality — the
joins between beats rather than the beats themselves. If that's not your gap,
rewrite them; nothing in the code depends on their wording.
