import React, { useEffect, useRef, useCallback } from 'react';
import GameContext from '../contexts/gameContext';
import { skipCard, nextTeam } from '../lib/helpers';
import { useConextIfPopulated } from '../lib/hooks';
import { StyledTimer } from './styles/Timer.styled';

type Proptypes = {
  paused: boolean;
  remainingTime: number;
  setRemainingTime: React.Dispatch<React.SetStateAction<number>>;
  teams: { team: string; score: number }[];
  setTeams: React.Dispatch<React.SetStateAction<{ team: string; score: number }[]>>;
  color: string;
  remainingCards: Cards;
  setRemainingCards: React.Dispatch<React.SetStateAction<Cards>>;
  round: number;
};

const Timer = ({ paused, remainingTime, setRemainingTime, teams, setTeams, remainingCards, setRemainingCards, color, round }: Proptypes) => {
  const { settings, setScreen }: GameContext = useConextIfPopulated(GameContext);
  const timerId = useRef<null | NodeJS.Timeout>(null);

  const timerLogic = useCallback(() => {
    setRemainingTime((remainingTime: number) => remainingTime - 1);
  }, [setRemainingTime]);

  const startTimer = useCallback(() => {
    timerId.current = setInterval(timerLogic, 1000);
  }, [timerLogic]);

  const stopTimer = () => {
    clearInterval(timerId.current as NodeJS.Timeout);
    timerId.current = null;
  };

  const resetTimer = useCallback(() => {
    stopTimer();
    setRemainingTime(settings.timer);
  }, [setRemainingTime, settings.timer]);

  // const formatRemainingTime = useCallback((time: number): string => {
  //   const minutes = Math.floor(time / 60);

  //   const secondsNumber: number = time % 60;
  //   let secondsString: string;
  //   secondsNumber < 10
  //     ? (secondsString = `0${secondsNumber}`)
  //     : (secondsString = secondsNumber.toString());
  //   return `${minutes}:${secondsString}`;
  // }, []);

  const setDashArray = useCallback((): string => {
    const circumfrance = 2 * 3.14 * 45;
    const timeFraction = remainingTime / settings.timer - (1 / settings.timer) * (1 - remainingTime / settings.timer);
    const dashArrayValue = (timeFraction * circumfrance).toFixed(0);
    return `${dashArrayValue} ${circumfrance}`;
  }, [remainingTime, settings.timer]);

  useEffect(() => {
    localStorage.setItem('remainingTime', JSON.stringify(remainingTime));
    if (remainingTime === 0) {
      skipCard(remainingCards, setRemainingCards);
      resetTimer();
      setTeams(nextTeam(teams));
      setScreen('game|switch-player');
    }
  }, [remainingCards, remainingTime, resetTimer, setRemainingCards, setScreen, setTeams, teams]);

  useEffect(() => {
    if (paused) {
      stopTimer();
    } else {
      startTimer();
    }
    return () => clearInterval(timerId.current as NodeJS.Timeout);
  }, [paused, startTimer]);

  return (
    <StyledTimer color={color}>
      <div className="base-timer">
        <svg className="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g className="base-timer__circle">
            <circle className="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path
              id="base-timer-path-remaining"
              strokeDasharray={setDashArray()}
              className="base-timer__path-remaining"
              d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
            ></path>
          </g>
        </svg>
        <span id="base-timer-label" className="base-timer__label">
          {remainingTime}
        </span>
      </div>
    </StyledTimer>
  );
};

export default Timer;
