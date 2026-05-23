<br />
Fork of https://github.com/15huangtimothy/mocknikers - adds Croatian cards, sounds and few tweaks.

Live version: <a href="https://mmatasic.duckdns.org/mocknikers/" target="_blank">https://mmatasic.duckdns.org/mocknikers/</a>

# Mocknikers

Inspired by <a href="https://www.cmyk.games/products/monikers" target="_blank">Monikers</a>, a card game in which you guess an item lised on the card from a verbal description or from gestures. This is a digital adaptation of the physical card game.

### Gameplay

Players split into any number of teams of at least 2 poeple. Players will take turns describing the word(s) on the screen while their teammates guess the word. Once a teammate guesses the word, you proceed to the next word. Once the time runs out, the device is passed to the next team for a chance to guess. The round is complete once all the words have been guessed. The game is comprised of 3 rounds:

- Round 1: Use any words, sounds, or gestures.
- Round 2: Use only 1 word as a clue.
- Round 3: No words, just charades.

The team that guess the most cards after thhe 3 rounds wins thhe game.

_Visit <a href="https://boardgamegeek.com/boardgame/156546/monikers" target="_blank">Board Game Geek</a> to read more about rules, watch videos, and learn general information about the game._

### Game Modes

You can play the game in three different modes:

1. **Base Game**: Play with cards from the official [Monikers Print-and-Play](https://s3.amazonaws.com/www.monikersgame.com/Press+kit/Monikers+PnP.pdf) set ([Creative Commons BY-NC-SA 4.0 License](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en))
2. **Generated Cards**: Cards are generated from Wikipedia's daily top articles, keeping the content fresh and relevant to current events.
3. **Written Cards**: Create your own custom deck by writing your own cards, perfect for themed games or inside jokes.
4. **Croatian Cards**: Generated using AI
### Card Selection

There are two ways to build your deck:

1. **Standard**: The game automatically selects cards from your chosen mode (Base Game or Generated).
2. **Drafting**: Each player gets to personally select cards to add to the game deck. Players take turns choosing from a set of cards, allowing for more strategic and personalized gameplay.

### Alterations of the Physical Game

Cards are slightly different than in the physical game:

1. When using Generated Cards mode, cards change from day to day. The previous day's top 1,000 most viewed topics on Wikipedia will be randomly pulled for a chance to use in the game. This achieves 2 things. One, an automated way to generate cards. And, two, keeps the cards relevant to current times.
2. There are no points assigned to cards in Generated Cards mode. Every card is worth 1 point.
3. There is a setting to write your own cards instead of using the Base Game or Generated cards.

## Getting Started

This site is built on <a href="https://react.dev" target="_blank">React</a>. To install and run the app locally, in a terminal window run

    git clone https://github.com/mmatasic/mocknikers
    nvm install
    npm install
    npm start
