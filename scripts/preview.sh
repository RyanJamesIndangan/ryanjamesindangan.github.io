#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# preview.sh — local monitoring/preview harness for the portfolio.
# Boots the static site and captures screenshots + console logs at BOTH a
# desktop and a mobile viewport, so changes can be verified visually and any
# runtime errors surfaced. Output lands in ./.preview/ (gitignored).
#
# Mode is forced via query params (headless Chrome doesn't report a coarse
# pointer, so width alone won't trigger the mobile shell): desktop uses
# ?desktop=1, mobile uses ?mobile=1; both use ?fastboot=1 to skip the intro.
#
# Usage:  bash scripts/preview.sh [port]
# Requires: Google Chrome, python3, curl.
# ---------------------------------------------------------------------------
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${1:-8155}"
BASE="http://localhost:${PORT}/index.html"
OUT="${ROOT}/.preview"
mkdir -p "$OUT"

CHROME=""
for c in \
  "/c/Program Files/Google/Chrome/Application/chrome.exe" \
  "/c/Program Files (x86)/Google/Chrome/Application/chrome.exe" \
  "$(command -v google-chrome 2>/dev/null)" \
  "$(command -v chrome 2>/dev/null)"; do
  if [ -n "$c" ] && [ -x "$c" ]; then CHROME="$c"; break; fi
done
if [ -z "$CHROME" ]; then echo "ERROR: Chrome not found." >&2; exit 1; fi

python -m http.server "$PORT" --directory "$ROOT" >/dev/null 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null' EXIT
curl --retry 50 --retry-connrefused --retry-delay 0 -s -o /dev/null "${BASE}?fastboot=1" || {
  echo "ERROR: server did not come up on port ${PORT}" >&2; exit 1; }

shoot() {
  # $1=label  $2=width  $3=height  $4=url  $5..=extra chrome args
  local label="$1" w="$2" h="$3" url="$4"; shift 4
  "$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size="${w},${h}" --virtual-time-budget=9000 \
    --run-all-compositor-stages-before-draw \
    --enable-logging=stderr --v=1 "$@" \
    --screenshot="${OUT}/${label}.png" "$url" 2>"${OUT}/${label}-console.log"
  echo "  ${label}: ${OUT}/${label}.png"
}

echo "Capturing screenshots..."
# Desktop at 1x; mobile rendered at ~390 CSS px via a 2x window so the headless
# layout viewport matches a real phone width (avoids a DSF/viewport clipping quirk).
shoot "desktop" 1440 900  "${BASE}?fastboot=1&desktop=1"
shoot "mobile"  780  1688 "${BASE}?fastboot=1&mobile=1" --force-device-scale-factor=2

echo
for v in desktop mobile; do
  echo "=== Console errors (${v}) ==="
  grep -aE "ERROR:CONSOLE|Uncaught|TypeError|ReferenceError|Refused to|net::ERR" "${OUT}/${v}-console.log" \
    | sed -E 's/.*CONSOLE[^]]*\] //' | grep -avE "Histogram|GroupMarker|GPU|favicon" | head -20 || true
  echo "(empty = clean)"
done
