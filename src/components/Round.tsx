import Button from './Button';
import { shuffleCards } from '../lib/helpers';
import { useConextIfPopulated } from '../lib/hooks';
import GameContext from '../contexts/gameContext';
import { StyledBackgroundContiner } from './styles/BackgroundContiner.styled';
import Face from './Face';
import { StyledInterstitialContainer } from './styles/Container-Interstitial.styled';

type Proptypes = {
  round: number;
  setRemainingCards: React.Dispatch<React.SetStateAction<Cards>>;
  cards: Cards;
  setRemainingTime: React.Dispatch<React.SetStateAction<number>>;
  color: string;
};

const Round = ({ round, cards, setRemainingCards, setRemainingTime, color }: Proptypes) => {
  const { setScreen }: GameContext = useConextIfPopulated(GameContext);

  let roundTitle: string;
  let roundDescription: string;
  if (round === 1) {
    roundTitle = 'Use any words, sounds, or gestures.';
    roundDescription = "You can't use the name itself. If you use any part of the name, you have to skip that word. Reading the clue text is allowed.";
  } else if (round === 2) {
    roundTitle = 'Use only 1 word as a clue.';
    roundDescription = 'It can be anything except the name itself. You can repeat that word as much as you like, but no sounds or gestures.';
  } else if (round === 3) {
    roundTitle = 'Just charades.';
    roundDescription = 'No words. Sound effects are OK (within reason).';
  } else {
    throw Error(`${round} is an invalid round number. Must be 1-3.`);
  }

  function startRound(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setRemainingCards(shuffleCards(cards));
    setScreen('game|switch-player');
  }
  return (
    <StyledBackgroundContiner className="background--titlePage" background={color}>
      <StyledInterstitialContainer>
        <div>
          <h2 className="all-caps">Round {round}</h2>
          <Face round={round} color={color} />
          <h3>{roundTitle}</h3>
          <p>{roundDescription}</p>
        </div>
        <Button className="button__bottom-aligned" color={color} handleClick={startRound}>
          Next
        </Button>
      </StyledInterstitialContainer>
    </StyledBackgroundContiner>
  );
};

export default Round;
