import React from 'react';
import GameContext from '../contexts/gameContext';
import { useConextIfPopulated } from '../lib/hooks';
import Button from './Button';
import { StyledBackgroundContiner } from './styles/BackgroundContiner.styled';
import { StyledInterstitialContainer } from './styles/Container-Interstitial.styled';

type Proptypes = {
  round: number;
  teams: Teams;
  setRemainingTime: React.Dispatch<React.SetStateAction<number>>;
  color: string;
  firstPlayerInRound: boolean;
  setfirstPlayerInRound: React.Dispatch<React.SetStateAction<boolean>>;
};

const SwitchPlayer = ({ round, teams, setRemainingTime, color, firstPlayerInRound, setfirstPlayerInRound }: Proptypes) => {
  const { setScreen }: GameContext = useConextIfPopulated(GameContext);
  function startTurn(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setfirstPlayerInRound(false);
    setScreen('game');
  }
  return (
    <StyledBackgroundContiner className="background--titlePage" background={color}>
      <StyledInterstitialContainer>
        <div>
          <h2 className="all-caps">Round {round}</h2>
          {firstPlayerInRound ? (
            <h3>First up is {teams[0].team}</h3>
          ) : (
            <h3>
              Time's up! <br /> Next is {teams[0].team}.
            </h3>
          )}
          <p>Pass the device to a player on {teams[0].team}.</p>
        </div>
        <Button className="button__bottom-aligned" color={color} handleClick={startTurn}>
          Begin
        </Button>
      </StyledInterstitialContainer>
    </StyledBackgroundContiner>
  );
};

export default SwitchPlayer;
