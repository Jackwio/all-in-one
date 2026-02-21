#!/usr/bin/env bash
set -euo pipefail

fail() {
  echo "FAIL: $1" >&2
  exit 1
}

assert_file() {
  local file="$1"
  [[ -f "$file" ]] || fail "missing file: $file"
}

assert_contains() {
  local file="$1"
  local pattern="$2"
  grep -qE "$pattern" "$file" || fail "expected pattern '$pattern' in $file"
}

assert_file "index.html"
assert_file "assets/styles.css"
assert_file "assets/app.js"

assert_contains "index.html" "role=\"tablist\""
assert_contains "index.html" "id=\"feature-tabs\""
assert_contains "index.html" "id=\"cards-grid\""
assert_contains "index.html" "id=\"tab-panel\""

assert_contains "assets/app.js" "const featureCatalog ="
assert_contains "assets/app.js" "function renderTabs"
assert_contains "assets/app.js" "function renderCards"
assert_contains "assets/app.js" "function switchTab"

assert_contains "assets/styles.css" "\\.feature-tabs"
assert_contains "assets/styles.css" "\\.feature-card"
assert_contains "assets/styles.css" "@media \\(max-width: 768px\\)"

echo "PASS: page structure is valid"
