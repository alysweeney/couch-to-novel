# Checks

Corrections that have already happened once, written down so they can't happen
twice. Dated, forward-only: nothing here gets retro-edited, and a retired check
stays with a note rather than being deleted.

Run `./test/run.sh` before any deploy that touches a render path. The checks
below are the ones a test can't hold.

---

## Verification

**2026-08-10 — Parsing is not verification.** A `const` read one line above its
own declaration parses perfectly and throws on evaluation. The blank Today page
shipped because the only check was a parse. `test/render-smoke.js` now executes
every render path; run it, don't just parse.

**2026-08-10 — A pattern check is only as good as its pattern.** Twice, a grep
for the literal `btn btn-primary` reported "no hardcoded primaries" while the
cool-down used `${cond ? '' : ' btn-primary'}` and stayed orange. Check the
*rendered* result or the semantic property, never one spelling of the source.

**2026-08-10 — Validate a new check before trusting its findings.** A
use-before-declared linter written to catch the TDZ bug produced 42 hits, of
which ~41 were false positives from nested scopes. Run known-good input through
a new check first; a noisy check is worse than none, because it trains you to
ignore it.

**2026-08-10 — Verify the deploy reached the browser before debugging the
behaviour.** GitHub Pages serves `max-age=600`, so a hard refresh can still run
ten-minute-old code. Two rounds were spent on an error message that had already
been deleted. The service worker now fetches with `cache: 'reload'`; when
something looks wrong, confirm what's actually live first.

## Design invariants

**2026-08-10 — Make invariants derived, not remembered.** "Orange marks the one
action on the screen" was written in a comment and then broken three times. It
only held once `primary(n)` computed it from step position. If a rule can be
violated by forgetting it, it isn't a rule yet.

**2026-08-10 — A value defined twice will drift.** The type scale had a base
size and an element-level override that disagreed, so phones rendered headings
larger than desktops. The manifest kept the original navy months after the
palette changed. One token, one definition, referenced everywhere.

**2026-08-10 — Don't fade a card over a coloured page.** `opacity` on a cream
card above deep teal blends the two and turns it grey-green. Mute finished
states with explicit colours and keep the surface solid.

## Content and phase

**2026-08-11 — Anything the programme tells you to do today must be doable
today.** Shipped three times: a cool-down that assumed prose was written, a
warm-up needing a protagonist that doesn't exist until session 6, and a
"Why does she stay?" prompt in module 1. `test/phase-audit.js` enforces it now.
The distinction that holds: instructions must fit the current stage,
explanations and optional reading may run ahead.

**2026-08-10 — One writer per field.** Seven blueprint sessions wrote to the
same `notes` field; opening the fifth would have destroyed the first. Any field
more than one session can write needs to be keyed per session.

## Platform gotchas

**2026-08-10 — macOS packages can't be chosen in a folder picker.** `.scriv` is
a directory with the bundle bit set, so file dialogs present it as a single
document and grey it out. Pick the containing folder and traverse in.

**2026-08-10 — RTF hex escapes are codepage, not Latin-1.** `\'97` is an em
dash in cp1252 and a control character if decoded as Latin-1. And `\uN` is
followed by fallback characters that must be skipped, or every em dash adds a
phantom `?` to the word count. Both were found by testing against real
`textutil` output rather than hand-written samples — generate real fixtures.

## Retired

*(nothing yet — when a check stops applying, move it here with the date and the
reason rather than deleting it)*
