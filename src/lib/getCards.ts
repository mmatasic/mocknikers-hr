import baseCards from '../data/base_cards.json';
import baseCardsHR from "../data/base_cards_hr.json";
import { shuffleCards } from './helpers';

function getCards(settings: Settings, wikiData: Article[]): Cards {
  let cards: Cards = [];

  if (settings.cardType === 'written') {
    const wordArray: string[] = settings.cardText
      .trim()
      .split('\n')
      .filter((n) => n);
    cards = wordArray.map((word) => {
      return {
        title: word,
        description: '',
        category: '',
        points: 1, // Default points for written cards
      };
    });
  } else if (settings.cardType === 'base' || settings.cardType === 'base_hr') {
    // Transform baseCards to correct type before shuffling
    let selectedBaseCards =
      settings.cardType === "base" ? baseCards : baseCardsHR;
    const transformedCards: Cards = selectedBaseCards.map((card) => ({
      title: card.title,
      description: card.description,
      category: card.category,
      points: card.points,
    }));
    const shuffledCards = shuffleCards(transformedCards);
    const numCardsToSelect = Math.min(settings.cardCount, shuffledCards.length);
    cards = shuffledCards.slice(0, numCardsToSelect);
  } else {
    if (settings.cardCount > wikiData.length) throw Error('Too many cards.');
    const arrayOfNumbers = Array.from(Array(wikiData.length).keys());
    const generateRandomIndex = (max: number) => {
      return Math.floor(Math.random() * max);
    };
    const cleanupDescription = (description: string) => {
      let cleanedDescription = description.replace(/\s\([^)]*\)/g, '');
      cleanedDescription = cleanedDescription.replace(/\n/g, ' ');
      return cleanedDescription;
    };
    for (let i = 1; i <= settings.cardCount; i++) {
      const index = generateRandomIndex(arrayOfNumbers.length);
      cards.push({
        title: wikiData[arrayOfNumbers[index]].title,
        description: cleanupDescription(
          wikiData[arrayOfNumbers[index]].extract
        ),
        category: '', // Default category
        points: 1, // Default points
      });
      arrayOfNumbers.splice(index, 1);
    }
  }
  return cards;
}

export default getCards;
