import { useState } from 'react';
import Button from './components/Button';
import Settings from './components/Settings';
import GameContext from './contexts/gameContext';
import { defaultSettings, defaultScreen } from './lib/defaultSettings';
import { useLocalStorage } from './lib/hooks';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyles from './styles/global';
import { StyledBackgroundContiner } from './components/styles/BackgroundContiner.styled';
import { StyledBackgroundImage } from './components/styles/BackgroundImage.styled';
import { ReactComponent as BackgroudImage } from './images/monikers_characters.svg';
import ReactGA from 'react-ga4';

function App() {
  const [wikiData, setWikiData] = useState<Article[] | null>(null);
  const [settings, setSettings] = useLocalStorage(defaultSettings, 'settings');
  const [screen, setScreen] = useLocalStorage(defaultScreen, 'screen');

  ReactGA.initialize("XXX", {
    gaOptions: {
      debug_mode:
        window.location.hostname === "mmatasic.duckdns.org" ? false : true,
    },
    gtagOptions: {
      debug_mode:
        window.location.hostname === "mmatasic.duckdns.org" ? false : true,
    },
  });
  const CroatiaFlag = () => (
    <svg
      width="28"
      height="18"
      viewBox="0 0 28 18"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Croatian flag"
    >
      {/* Flag stripes */}
      <rect width="28" height="6" y="0" fill="#FF0000" />
      <rect width="28" height="6" y="6" fill="#FFFFFF" />
      <rect width="28" height="6" y="12" fill="#171796" />

      {/* Coat of arms */}
      <g transform="translate(11,4) scale(0.6)">
        {/* Shield */}
        <rect
          x="0"
          y="2"
          width="10"
          height="12"
          rx="1"
          fill="#FFFFFF"
          stroke="#C8102E"
          strokeWidth="0.6"
        />

        {/* Checkerboard */}
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 5 }).map((_, col) => (
            <rect
              key={`${row}-${col}`}
              x={col * 2}
              y={2 + row * 2}
              width="2"
              height="2"
              fill={(row + col) % 2 === 0 ? "#C8102E" : "#FFFFFF"}
            />
          ))
        )}

        {/* Crown (simplified) */}
        <rect x="1" y="0" width="8" height="2" fill="#0052B4" />
      </g>
    </svg>
  );

  function newGame(e: React.MouseEvent<HTMLButtonElement>) {
    ReactGA.event("initialize_game");
    e.preventDefault();
    setScreen("settings");
  }
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <GameContext.Provider
        value={{
          settings,
          screen,
          setSettings,
          setScreen,
          wikiData,
          setWikiData,
        }}
      >
        {(screen === "settings" || screen.startsWith("game")) && <Settings />}
        {screen === "home" && (
          <>
            <StyledBackgroundContiner
              className="background--centeredContent"
              background="beige"
            >
              <Button
                className="button__centered-circle"
                handleClick={newGame}
                color="blue"
              >
                <p className="new-game">New Game</p>
                <h1>Mocknikers HR</h1>
                <CroatiaFlag />
                <p className="inspired-by">Inspired by the Game Monikers</p>
              </Button>
            </StyledBackgroundContiner>
            <StyledBackgroundImage>
              <BackgroudImage className="background-image" />
            </StyledBackgroundImage>
          </>
        )}
      </GameContext.Provider>
    </ThemeProvider>
  );
}

export default App;
