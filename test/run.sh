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
"$JSC" "$TMP"
rm -f /tmp/c2n-app.js
