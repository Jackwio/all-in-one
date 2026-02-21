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
  grep -qE -- "$pattern" "$file" || fail "expected pattern '$pattern' in $file"
}

assert_not_contains() {
  local file="$1"
  local pattern="$2"
  if grep -qE -- "$pattern" "$file"; then
    fail "unexpected pattern '$pattern' in $file"
  fi
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
assert_contains "assets/app.js" "id: \"notes\""
assert_contains "assets/app.js" "AI 相關筆記"
assert_contains "assets/app.js" "Deploy 相關"
assert_contains "assets/app.js" "https://jackwio.github.io/ai-note/"
assert_contains "assets/app.js" "https://jackwio.github.io/deploy-note/"
assert_contains "assets/app.js" "href=\"\\$\\{escapeHtml\\(feature.url\\)\\}\""
assert_not_contains "assets/app.js" "target=\"_blank\""
assert_not_contains "assets/app.js" "rel=\"noopener noreferrer\""
assert_contains "assets/app.js" "let activeTab = featureCatalog\\.find\\(\\(item\\) => item\\.id === \"notes\"\\)\\?\\.id \\?\\? featureCatalog\\[0\\]\\.id;"

assert_contains "assets/styles.css" "\\.feature-tabs"
assert_contains "assets/styles.css" "\\.feature-card"
assert_contains "assets/styles.css" "@media \\(max-width: 768px\\)"
assert_contains "assets/styles.css" "--bg-top: #05070c;"
assert_contains "assets/styles.css" "--bg-bottom: #0d111c;"

assert_not_contains "index.html" "一眼看懂所有功能"
assert_not_contains "index.html" "以分類 Tab 快速切換能力領域，透過卡片檢視每項功能的價值、用途與狀態。"
assert_not_contains "assets/app.js" "日常最常用的整合能力，快速處理主要工作流。"

echo "PASS: page structure is valid"
