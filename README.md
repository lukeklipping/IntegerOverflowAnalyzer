# Wraparound Lab: Integer Overflow Visualizer

An interactive teaching tool that shows how fixed-width integers wrap around, and how that turns into a real memory-safety bug.

**Files:** `index.html` (markup), `styles.css` (styling), `app.js` (logic).

**Run it:** open `index.html` in any modern browser.

## What it teaches

1. **Fixed-width arithmetic** (8/16/32-bit): pick A, B, and `+`, `−`, or `×`. See the true result, the high bits that get dropped, and the stored value.
2. **Signed vs. unsigned**: the same bits are read both ways, with separate overflow flags. `127 + 1` overflows signed but not unsigned; `0 − 1` does the opposite.
3. **Allocation-size overflow**: `malloc(count * size)` wraps, so the buffer is smaller than the loop that fills it. A bar shows how many bytes land past the end.

## Interactions

- Width dropdown, number inputs, operation dropdown
- Click any bit (or focus and press Enter/Space) to flip it
- "Try an overflow example" cycles through classic cases

## Suggested exercises

- Find the smallest A that overflows when B = 100 at 8 bits.
- Make unsigned overflow but signed not, then the reverse.
- At 32 bits, find `count` values where `count * 4` wraps to a tiny allocation.

## Safety note

Educational only. It performs arithmetic with `BigInt` and draws bars. It contains no exploit, shellcode, or attack tooling.

## How it was built

Built with AI assistance (Claude).

## Ideas for extension

Stack-frame buffer overflow view (saved frame pointer / return address), off-by-one demos, checked-arithmetic toggle.
