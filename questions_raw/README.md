# Comprehension question bank

One file per parole hearing — 8 multiple-choice questions per transcript:

| File                          | Transcript | Hearing  |
| ----------------------------- | ---------- | -------- |
| `TranscrA_Davis.txt`          | TranscrA   | Davis    |
| `TranscrB_Bates.txt`          | TranscrB   | Bates    |
| `TranscrC_Lorenze.txt`        | TranscrC   | Lorenze  |
| `TranscrD_Feliciano.txt`      | TranscrD   | Feliciano|

## Format

Each file is plain text. Header line is optional. Each question is a block:

```
L1
What charges are included in Davis' pardon application?
A) Assault, risk of injury to a minor, and failure to register
B) Assault, risk of injury to a minor, and probation violation
C) Strangulation, risk of injury to a minor, and probation violation
D) Assault, child endangerment, and probation violation
```

- First line of the block: **Level** (`L1` / `L2` / `L3` / `L4`).
- Next line: the **question prompt**.
- Then four lines starting with `A) `, `B) `, `C) `, `D) ` for the options.
- Mark the correct option by prefixing its line with `✅` (before the letter).
- Separate question blocks with a blank line.

Example:

```
L1
How long has Davis been off probation at the time of the hearing?
A) Three years
B) Four years
✅C) Six years
D) Eight years
```
