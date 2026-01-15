import { useEffect, useState } from 'react';
import GameContext from '../contexts/gameContext';
import getCards from '../lib/getCards';
import { useConextIfPopulated, useLocalStorage } from '../lib/hooks';
import Card from './Card';
import Round from './Round';
import PauseMenu from './PauseMenu';
import Timer from './Timer';
import Button from './Button';
import { chooseColor, getStateFromLocalStorgage, nextCard, skipCard } from '../lib/helpers';
import SwitchPlayer from './SwitchPlayer';
import RoundRecap from './RoundRecap';
import { StyledBackgroundContiner } from './styles/BackgroundContiner.styled';
import { StyledContainer } from './styles/Container.styled';
import Header from './Header';
import { StyledCardContainer } from './styles/CardContainer.styled';
import ReactGA from 'react-ga4';
import DraftingRound from './DraftingRound';

type ActionType = "next" | "skip";

type LastAction = {
  type: ActionType;
  previousTeams: Teams;
  previousRemainingCards: Cards;
  previousScreen: string;
  previousRemainingTime: number;
  previousFirstPlayerInRound: boolean;
};

const Game = () => {
  const { settings, screen, setScreen, wikiData }: GameContext =
    useConextIfPopulated(GameContext);
  const [round, setRound] = useLocalStorage(1, "round");
  const [cards, setCards] = useLocalStorage(null, "cards");
  const [teams, setTeams] = useLocalStorage(null, "teams");
  const [remainingCards, setRemainingCards] = useLocalStorage(
    null,
    "remainingCards"
  );
  const [paused, setPaused] = useLocalStorage(false, "paused");
  const [firstPlayerInRound, setfirstPlayerInRound] = useLocalStorage(
    true,
    "firstPlayerInRound"
  );
  const [remainingTime, setRemainingTime] = useState<number>(
    getStateFromLocalStorgage(settings.timer, "remainingTime")
  );
  const [color, setColor] = useState<string>("green");
  const [draftedCards, setDraftedCards] = useLocalStorage(null, "draftedCards");
  const publicUrl = (process.env.PUBLIC_URL || "").replace(/\/$/, "");
  const getSoundUrl = (fileName: string) =>
    `${publicUrl || ""}/sounds/${fileName}`;
  const [lastAction, setLastAction] = useState<LastAction | null>(null);

  useEffect(() => {
    setColor(chooseColor(round));
  }, [round]);

  useEffect(() => {
    setLastAction(null);
  }, [round]);

  useEffect(() => {
    // Only get cards if we're not in drafting mode or if we already have drafted cards
    if (
      !cards && // No cards loaded yet
      (settings.cardType !== "generate" || wikiData) && // Only need wikiData for generated cards
      (!settings.isDrafting || draftedCards)
    ) {
      setCards(
        settings.isDrafting ? draftedCards : getCards(settings, wikiData || [])
      );
    }
  }, [cards, setCards, settings, wikiData, draftedCards]);

  useEffect(() => {
    if (!teams) {
      setTeams(
        settings.teams.map((team) => ({
          team: team,
          score: 0,
        }))
      );
    }
  }, [setTeams, settings.teams, teams]);

  const pauseGame = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPaused(!paused);
  };

  const captureLastAction = (type: ActionType) => {
    if (!remainingCards || !teams) return;
    const previousTeams = (teams as Teams).map((team) => ({ ...team }));
    setLastAction({
      type,
      previousTeams,
      previousRemainingCards: [...remainingCards],
      previousScreen: screen,
      previousRemainingTime: remainingTime,
      previousFirstPlayerInRound: firstPlayerInRound,
    });
  };

  const handleUndo = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!lastAction) return;
    setRemainingCards(lastAction.previousRemainingCards);
    setTeams(lastAction.previousTeams);
    setRemainingTime(lastAction.previousRemainingTime);
    setfirstPlayerInRound(lastAction.previousFirstPlayerInRound);
    setScreen(lastAction.previousScreen);
    setLastAction(null);
  };

  const next = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (paused) return;
    if (!remainingCards || !teams || remainingCards.length === 0) return;
    captureLastAction("next");
    const correctAudio = new window.Audio(getSoundUrl("correct.mp3"));
    correctAudio.currentTime = 0;
    correctAudio.play();
    const tempTeams = [...teams];
    const currentCard = remainingCards[0] as Card;
    tempTeams[0].score += currentCard.points;
    setTeams(tempTeams);
    if (remainingCards.length > 1) {
      nextCard(remainingCards, setRemainingCards);
    } else {
      ReactGA.event("turn_end", {
        level_name: `round ${round}`,
      });
      ReactGA.event("level_end", {
        level_name: `round ${round}`,
      });
      if (round === 3) {
        ReactGA.event("game_complete");
      }
      setRemainingCards(null);
      setRemainingTime(settings.timer);
      setfirstPlayerInRound(true);
      setScreen("game|round-recap");
    }
  };

  const skip = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (paused) return;
    if (!remainingCards || remainingCards.length === 0) return;
    captureLastAction("skip");
    const skipAudio = new window.Audio(getSoundUrl("skip.mp3"));
    skipAudio.currentTime = 0;
    skipAudio.play();
    ReactGA.event("skipped");
    skipCard(remainingCards, setRemainingCards);
  };

  const handleDraftComplete = (selectedCards: Card[]) => {
    setDraftedCards(selectedCards);
    setCards(selectedCards);
    setScreen("game|round");
  };

  return (
    <>
      {cards || screen === "game|drafting" ? (
        <>
          {screen === "game" && (
            <>
              {paused && (
                <PauseMenu
                  paused={paused}
                  setPaused={setPaused}
                  color={color}
                />
              )}
              <StyledBackgroundContiner background={`${color}`}>
                <StyledContainer>
                  <Header title={`Round ${round}`}>
                    <Button
                      className="button__pause"
                      handleClick={pauseGame}
                      color={`${color}`}
                    >
                      <svg
                        width="12"
                        height="13"
                        viewBox="0 0 14 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="Pause"
                      >
                        <rect x="1" y="0" width="3" height="15" fill="white" />
                        <rect x="9" y="0" width="3" height="15" fill="white" />
                      </svg>
                    </Button>
                    <Button
                      className="button__undo"
                      handleClick={handleUndo}
                      color={`${color}`}
                      disabled={!lastAction}
                    >
                      ⟲
                    </Button>
                  </Header>
                  <StyledCardContainer>
                    <Timer
                      paused={paused}
                      remainingTime={remainingTime}
                      setRemainingTime={setRemainingTime}
                      setTeams={setTeams}
                      teams={teams}
                      color={color}
                      remainingCards={remainingCards}
                      setRemainingCards={setRemainingCards}
                      round={round}
                    />
                    <Card card={remainingCards[0] as Card} />
                    <div className="button-container">
                      {settings.allowSkips && (
                        <Button
                          className="button__half button__half--left button--reverse"
                          handleClick={skip}
                          color={`${color}`}
                          disabled={remainingCards.length === 1 || paused}
                        >
                          Skip
                        </Button>
                      )}
                      <Button
                        className={
                          settings.allowSkips
                            ? "button__half button__half--right"
                            : ""
                        }
                        handleClick={next}
                        color={`${color}`}
                        disabled={paused}
                      >
                        Next
                      </Button>
                    </div>
                  </StyledCardContainer>
                </StyledContainer>
              </StyledBackgroundContiner>
            </>
          )}
          {screen === "game|drafting" && (
            <DraftingRound onDraftComplete={handleDraftComplete} />
          )}
          {screen === "game|round" && (
            <Round
              round={round}
              setRemainingCards={setRemainingCards}
              setRemainingTime={setRemainingTime}
              cards={cards}
              color={color}
            />
          )}
          {screen === "game|round-recap" && (
            <RoundRecap
              setRound={setRound}
              teams={teams}
              round={round}
              setTeams={setTeams}
              color={color}
            />
          )}
          {screen === "game|switch-player" && (
            <SwitchPlayer
              firstPlayerInRound={firstPlayerInRound}
              setfirstPlayerInRound={setfirstPlayerInRound}
              round={round}
              setRemainingTime={setRemainingTime}
              teams={teams}
              color={color}
            />
          )}
        </>
      ) : (
        "loading..."
      )}
    </>
  );
};

export default Game;
