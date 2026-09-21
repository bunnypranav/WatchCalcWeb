# WatchCalc
![alt text](icons/icon.svg)
### A feature rich scientific calculator built for a round WearOS Watch display

It is built as light as possible to not overload a watch, and can be hosted over bare github pages or similar. Everything here parses in a few milliseconds and the whole app fits in one HTTP round trip through the tunnel. It has a true black background, for best battery life.

The privacy policy served at [/privacy.html](privacy.html) covers the Wear OS app’s Play listing, and not particularly related or required for the web app. I have just put it here to share the same domain name, https://calc.bunnyorg.in. (by the way that is the where I have this hosted for public use, if anyone is interested)

## Features

Five keypads. Swipe left or right or tap the page name in the top-right to move between them.

| keypad | contents |
| --- | --- |
| **123** | digits, `+ − × ÷`, smart parenthesis, `=`, `⌫` |
| **log** | √ ∛ x² x³ xʸ, ln, log, log₂, 10ˣ, eˣ, x⁻¹, |x|, logᵇ, ʸ√ |
| **trig** | sin/cos/tan, sec/cosec/cot, all six inverses, hyperbolics, π, deg↔︎rad |
| **more** | nCr, nPr, n!, %, mod, gcd, lcm, E, CONST, HIST, DRG, memory, SIG |
| **prime** | standalone prime factoriser |
- Tap a function and you land back on the number pad automatically
- The final **`)`** is auto filled: `sin(30` evaluates to `sin(30)` and `√(2+ln(5` closes both.
- **CONST** opens a scrollable list of 30 physics/chemistry constants, tap to
insert. **HIST** keeps the last 40 results, tap one to paste it back in.
- **SIG** cycles displayed significant figures (4 → 12).
- **DRG** cycles DEG → RAD → GRA. The angle mode, memory, `Ans` and history all
survive a reload.
- The extras in the factor page: `d` is the number of divisors, `σ` their sum, `φ` [Euler’s totient](https://en.wikipedia.org/wiki/Euler%27s_totient_function).
- Exact forms: Under every decimal result the app shows the exact value when it
finds one like fractions, multiples of π, and surds:
    
    ```
    cos(30)   0.8660254038   √3/2
    sin(45)   0.7071067812   √2/2
    π/4       0.7853981634   π/4
    (3*6)÷8   2.25           9/4
    ```

## Screenshots
![page 1](screenshots\1.png)
![page 2](screenshots\2.png)
![page 3](screenshots\3.png)
![page 4](screenshots\4.png)
![page 5](screenshots\5.png)