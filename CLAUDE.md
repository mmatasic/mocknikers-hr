# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
nvm use          # switch to Node v16 (see .nvmrc)
npm install      # install dependencies
npm start        # start dev server at localhost:3000
npm run build    # production build (deployed to /mocknikers path)
npm test         # run Jest tests
```

## What this is

Mocknikers is a digital Monikers card game (fork with Croatian content added). Players split into teams and guess cards through 3 rounds of increasing difficulty: open description → one-word clue → charades. Deployed at `https://mmatasic.duckdns.org/mocknikers_hr/`.

## Architecture

**State flow:** `App.tsx` provides a `GameContext` (screen name + settings + wikiData) to all components. The two main screens are `Settings.tsx` (pre-game configuration) and `Game.tsx` (gameplay orchestrator). All game state is persisted via a custom `useLocalStorage` hook so sessions survive page reloads.

**Game.tsx** is the core: it initializes teams and card arrays from settings, manages the active card, timer state, scores, round progression, and undo. It conditionally renders sub-screens: `Round` (intro), `SwitchPlayer`, `DraftingRound`, the main play view (Timer + Card + buttons), and `RoundRecap`.

**Card sources** (selected in Settings):
- `base` — USA official Monikers Print-and-Play cards (`src/data/base_cards.json`)
- `base_hr` — Croatian AI-generated cards (`src/data/base_cards_hr.json`, current default)
- `generate` — Wikipedia daily trending articles (fetched via `src/lib/getWikiData.ts`)
- `written` — User-created cards entered in Settings

Card JSON shape: `{ title, description, category, points }`.

**Styling:** styled-components with a theme object at `src/styles/theme.ts` (colors, 8px grid, Nunito font). All styled components live in `src/components/styles/`.

**Audio:** Sound files are in `public/sounds/` and triggered inline via `new window.Audio(...)` on correct/skip actions.

**Analytics:** React GA4 tracks gameplay events; runs in debug mode during development.

## Key files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root: context provider, home/settings/game routing |
| `src/contexts/gameContext.tsx` | Global context: screen, settings, wikiData |
| `src/components/Game.tsx` | Game state machine and all gameplay logic |
| `src/components/Settings.tsx` | Pre-game setup (teams, timer, card type, count) |
| `src/lib/getCards.ts` | Card selection/shuffle by type |
| `src/lib/getWikiData.ts` | Wikipedia API fetching and filtering |
| `src/lib/helpers.ts` | Shuffle, color mapping, team utilities |
| `src/lib/hooks.ts` | `useLocalStorage`, `useContextIfPopulated` |
| `src/lib/defaultSettings.ts` | Default game configuration values |
| `src/styles/theme.ts` | Styled-components theme |

## Adding Croatian cards to `src/data/base_cards_hr.json`

When the user asks to generate/add new Croatian cards, follow the workflow and conventions below.

**Card JSON shape:** `{ title, description, category, points }` — field order matters, match the existing file.

**Spirit of the descriptions** (gleaned from the existing 577 cards):
- 1–3 sentences, evocative and a bit playful — not encyclopedic.
- Lead with a defining identification, then layer atmosphere, cultural hooks, or sensory detail.
- **Never include the title word (or an obvious root of it) in the description** — it gives away the answer.
- For people: what they're known for + a visual/cultural quirk a player could act out or one-word.
- For places: defining feature + emotional/sensory detail.
- For idioms (APSTRAKTNI IZRAZ): describe the *meaning*, not the literal words.

**Canonical categories** (use ONLY these — the file has typo/one-off categories like `MJESTOS`, `ŽIVOTNJA`, `FOOD`, `NATURE`; do not perpetuate them):

| Category | Use for | Example titles already in file |
|---|---|---|
| `STVAR` | physical thing / object | Baterija, Disketa, Frižider |
| `MJESTO` | place (real or famous) | Aerodrom, Brijuni, Hollywood |
| `JELO` | food / dish | Burek, Gulaš, Pašticada |
| `LIK` | fictional character | Batman, Frodo Baggins, Drakula |
| `POZNATA OSOBA` | modern celebrity (musician/actor/athlete) | Arsen Dedić, Goran Ivanišević |
| `APSTRAKTNI IZRAZ` | Croatian idiom / phrase | Bacati bisere pred svinje, Bogu iza nogu |
| `ŽIVOTINJA` | animal | Klokan, Bubamara |
| `POVIJESNA OSOBA` | historical person | Kleopatra, Albert Einstein |
| `POJAM` | abstract concept (scientific / philosophical) | Entropija, Dunning-Krugerov efekt |
| `SPORT` | sport | Biciklizam, Košarka |
| `OSOBA` | person archetype, not a specific individual | Kolega koji stalno kuka |
| `PIĆE` | drink | Cedevita, Gemišt, Krvava Mary |

**Points (difficulty 1–4):**
- `1` — easy, mainstream, well-known across generations.
- `2` — moderately known.
- `3` — niche or requires some specialist knowledge.
- `4` — hardest: obscure, abstract, or hard to act out. **Idioms (APSTRAKTNI IZRAZ) are almost always 4.**
- Calibrate against existing cards in the same category before assigning.

**Workflow:**
1. **Dedupe first.** Read the file and check the candidate title against existing titles (case-insensitive). If present, pick another.
2. **Propose one card at a time** as a complete JSON object (all four fields) and ask the user to confirm or deny.
3. **On confirm:** append the card to the end of the array. The file is *not* strictly alphabetically sorted — recent additions are appended, so appending is fine. Insert before the closing `]`, change the preceding `}` to `},`, and use 2-space indent matching surrounding entries.
4. **On deny:** skip silently and propose the next.
5. Continue until the user says to stop.

**Quality bar before proposing:**
- Title is unique (verified against the file).
- Description does not contain the title or its obvious root.
- Category matches the canonical list above.
- Points feel right relative to peers in the same category.
