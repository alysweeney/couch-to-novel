#!/bin/sh
# Executes every render path against a stub DOM.
#
# Parsing only proves the file is syntactically valid. It said the app was fine
# while renderBlueprintSession threw a temporal-dead-zone error and the page
# rendered blank. This actually runs the functions, so evaluation-order bugs,
# undefined variables and null property reads surface here instead of on screen.
#
# Needs no install: JavaScriptCore ships with macOS.
cd "$(dirname "$0")/.."
JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc
[ -x "$JSC" ] || { echo "JavaScriptCore not found at $JSC"; exit 1; }

TMP=$(mktemp /tmp/c2n-smoke-XXXXXX.js)
trap 'rm -f "$TMP"' EXIT

# app.js is a module and its boot block touches auth and the network, so strip
# the imports and stop at Boot.
sed -e "/^import .* from '.*';$/d" app.js | sed -n '1,/^\/\/ ---------- Boot ----------$/p' > /tmp/c2n-app.js

cat test/dom-stub.js beats.js curriculum.js blueprint.js lessons.js /tmp/c2n-app.js test/render-smoke.js > "$TMP"
"$JSC" "$TMP" || exit 1

echo
AUDIT=$(mktemp /tmp/c2n-audit-XXXXXX.js)
cat curriculum.js blueprint.js test/phase-audit.js > "$AUDIT"
"$JSC" "$AUDIT" || exit 1
rm -f "$AUDIT"

echo
# app.js up to the Storage marker is the pure maths; the export builder sits
# after it and is pulled in separately.
sed -n '1,/^\/\/ ---------- Storage/p' /tmp/c2n-app.js > /tmp/c2n-math.js
# The range ends ON the next function's opening line, which would leave an
# unbalanced brace -- drop it.
sed -n '/^function blueprintMarkdown/,/^function downloadBlueprint/p' /tmp/c2n-app.js | sed '$d' >> /tmp/c2n-math.js
EDGES=$(mktemp /tmp/c2n-edges-XXXXXX.js)
cat beats.js curriculum.js blueprint.js lessons.js /tmp/c2n-math.js test/edges.js > "$EDGES"
"$JSC" "$EDGES"
rm -f "$EDGES" /tmp/c2n-math.js
rm -f /tmp/c2n-app.js
