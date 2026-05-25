import React from 'react';
import GameContext from '../contexts/gameContext';
import { defaultScreen, defaultSettings } from '../lib/defaultSettings';
import { resetLocalStorage } from '../lib/helpers';
import { useConextIfPopulated } from '../lib/hooks';
import Button from './Button';
import { StyledPauseMenu } from './styles/PauseMenu.styled';

type Proptypes = {
  paused: boolean;
  color: string;
  setPaused: React.Dispatch<React.SetStateAction<boolean>>;
};

const PauseMenu = ({ paused, color, setPaused }: Proptypes) => {
  const { setSettings, setScreen } = useConextIfPopulated(GameContext);

  const resumeGame = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPaused(!paused);
  };
  const endGame = () => {
    setSettings(defaultSettings);
    setScreen(defaultScreen);
    resetLocalStorage();
  };

  return (
    <StyledPauseMenu>
      <h2>Game Paused</h2>
      <Button handleClick={resumeGame} color={color} className="button--light">
        Resume Game
      </Button>
      <Button className="button--light button--reverse button--end-game" color={color} handleClick={endGame}>
        End Game
      </Button>
    </StyledPauseMenu>
  );
};

export default PauseMenu;
