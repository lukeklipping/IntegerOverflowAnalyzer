# Reflection

**Note: this is a draft. Replace the bracketed parts with your own experience before submitting.**

## Why We chose integer overflow

We chose integer overflow because it is the root of many memory-safety bugs, and in lecture we could relate this to our learning in COMS321 Computer Architecture, with learning binary and overflow concepts.

## Workflow

1. **Design:** Decided on three views: raw bit arithmetic, signed vs. unsigned, and a malloc-size scenario linking overflow to heap corruption.
2. **Generation:** The AI wrote `index.html`, `app.js`, and `styles.css`.
3. **Publishing:** We created a GitHub repo and added the files.

## What I learned

- Overflow is not an error at the hardware level. The CPU just keeps the low N bits; the bug is in the program's assumptions.
- The same bit pattern is both a large unsigned number and a negative signed one, and overflow is defined separately for each interpretation.
- The fix is to check before the operation, not after (e.g., `count > MAX / size`).

## How the app helped

Flipping bits by hand and watching the "dropped" bits turn red made wraparound concrete.

## Reflection on AI-assisted development

AI was fast at scaffolding and UI, but I still had to verify the arithmetic and decide what was worth teaching.
