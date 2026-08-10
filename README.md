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

## Features

- **Today**: an adaptive daily word target (remaining words ÷ remaining days),
  the beat you're currently in, and a written prompt for that beat. Log the
  day's count by typing it or pasting your writing to have it counted.
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

## Editing the beats

The beat template lives in `beats.js` as a plain object — names, percentage
positions, summaries, and the daily prompt for each beat. Edit that file and
refresh. Adding a second structure (Hero's Journey, a romance beat sheet) means
adding another entry to `BEAT_TEMPLATES` with the same shape; nothing in
`app.js` is hardcoded to Save the Cat.

Genre word-count defaults for the setup wizard are in `GENRE_TARGETS` in the
same file.
