import { useEffect, useState } from 'react';
import GameContext from '../contexts/gameContext';
import { useConextIfPopulated, useLocalStorage } from '../lib/hooks';
import { StyledBackgroundContiner } from './styles/BackgroundContiner.styled';
import { StyledContainer } from './styles/Container.styled';
import Button from './Button';
import Header from './Header';
import getCards from '../lib/getCards';
import PauseMenu from './PauseMenu';
import DraftCard from './DraftCard';
import DraftingTransition from './DraftingTransition';
import styled from 'styled-components';

const StyledDraftContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  margin: 0 0 ${({ theme }) => theme.gridPoints * 3}px 0;
  padding: ${({ theme }) => theme.gridPoints * 3}px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledDraftGrid = styled.div`
  display: grid;
  /* 3 cards per row on large screens */
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;

  @media (max-width: 1200px) {
    /* 2 cards per row on medium screens */
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    /* 1 card per row on smaller screens */
    grid-template-columns: 1fr;
  }
`;

type Proptypes = {
    onDraftComplete: (selectedCards: Card[]) => void;
};

const DraftingRound = ({ onDraftComplete }: Proptypes) => {
    const { settings, wikiData }: GameContext = useConextIfPopulated(GameContext);
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [playerCards, setPlayerCards] = useState<Card[]>([]);
    const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
    const [draftedCards, setDraftedCards] = useState<Card[]>([]);
    const [allCards, setAllCards] = useState<Card[]>([]);
    const [paused, setPaused] = useLocalStorage(false, 'paused');
    const [showTransition, setShowTransition] = useState(true);

    // Calculate how many cards each player should select
    const cardsPerPlayer = settings.cardCount / settings.playerCount;

    // Get all cards once when component mounts
    useEffect(() => {
        if (
          (settings.cardType === "base" ||
            settings.cardType === "generate" ||
            settings.cardType === "base_hr") &&
          (settings.cardType === "base" ||
            settings.cardType === "base_hr" ||
            wikiData)
        ) {
          // Get enough cards for all players to draft from
          const totalCards = getCards(
            {
              ...settings,
              cardCount: settings.cardCount * 2, // Double the cards since each player sees twice what they'll pick
            },
            wikiData || []
          );
          setAllCards(totalCards);
        }
    }, [settings, wikiData]);

    // Deal cards to current player whenever they change
    useEffect(() => {
        if (allCards.length > 0 && !showTransition) {
            // Calculate the range for this player's cards
            const startIdx = (currentPlayer - 1) * cardsPerPlayer * 2;
            const endIdx = startIdx + (cardsPerPlayer * 2);
            const playerCardSet = allCards.slice(startIdx, endIdx);
            setPlayerCards(playerCardSet);
        }
    }, [currentPlayer, allCards, cardsPerPlayer, showTransition]);

    const handleCardClick = (index: number) => {
        if (paused) return;
        const newSelected = new Set(selectedCards);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else if (newSelected.size < cardsPerPlayer) {
            newSelected.add(index);
        }
        setSelectedCards(newSelected);
    };

    const handleConfirmSelection = () => {
        if (paused) return;
        // Add selected cards to drafted cards
        const selectedCardObjects = Array.from(selectedCards).map(index => playerCards[index]);
        const newDraftedCards = [...draftedCards, ...selectedCardObjects];
        setDraftedCards(newDraftedCards);

        if (currentPlayer < settings.playerCount) {
            // Move to next player
            setCurrentPlayer(currentPlayer + 1);
            setSelectedCards(new Set());
            setShowTransition(true);
        } else {
            // All players have drafted, start the game
            onDraftComplete(newDraftedCards);
        }
    };

    const handlePause = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaused(!paused);
    };

    const handleTransitionContinue = () => {
        setShowTransition(false);
    };

    if (allCards.length === 0) {
        return (
            <StyledBackgroundContiner background="blue">
                <StyledContainer>
                    <Header title="Preparing Draft" />
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <p>Loading cards...</p>
                    </div>
                </StyledContainer>
            </StyledBackgroundContiner>
        );
    }

    if (showTransition) {
        return <DraftingTransition currentPlayer={currentPlayer} onContinue={handleTransitionContinue} />;
    }

    return (
        <StyledBackgroundContiner background="blue">
            {paused && <PauseMenu paused={paused} setPaused={setPaused} color="blue" />}
            <StyledContainer>
                <Header title={`Player ${currentPlayer}'s Draft`}>
                    <Button className="button__pause" handleClick={handlePause} color="blue">
                        <svg width="12" height="13" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Pause">
                            <rect x="1" y="0" width="3" height="15" fill="white" />
                            <rect x="9" y="0" width="3" height="15" fill="white" />
                        </svg>
                    </Button>
                </Header>
                <StyledDraftContainer>
                    <div style={{ textAlign: 'center' }}>
                        <p>Select {cardsPerPlayer} cards to add to the game</p>
                        <p>
                            {selectedCards.size} / {cardsPerPlayer} cards selected
                        </p>
                    </div>
                    <StyledDraftGrid>
                        {playerCards.map((card, index) => (
                            <DraftCard
                                key={index}
                                card={card}
                                isSelected={selectedCards.has(index)}
                                onClick={() => handleCardClick(index)}
                                disabled={paused || (selectedCards.size >= cardsPerPlayer && !selectedCards.has(index))}
                            />
                        ))}
                    </StyledDraftGrid>
                    <div style={{ textAlign: 'center' }}>
                        <Button
                            color="blue"
                            disabled={selectedCards.size !== cardsPerPlayer || paused}
                            handleClick={handleConfirmSelection}
                        >
                            {currentPlayer < settings.playerCount ? 'Next Player' : 'Start Game'}
                        </Button>
                    </div>
                </StyledDraftContainer>
            </StyledContainer>
        </StyledBackgroundContiner>
    );
};

export default DraftingRound;