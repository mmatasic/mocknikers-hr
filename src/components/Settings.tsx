import { useCallback, useState } from 'react';
import GameContext from '../contexts/gameContext';
import { defaultSettings } from '../lib/defaultSettings';
import { checkNumber, setASetting } from '../lib/helpers';
import { useConextIfPopulated } from '../lib/hooks';
import Button from './Button';
import Game from './Game';
import Header from './Header';
import { StyledBackgroundContiner } from './styles/BackgroundContiner.styled';
import { StyledContainer } from './styles/Container.styled';
import { StyledSettings } from './styles/Settings.styled';
import ReactGA from 'react-ga4';
import { getWikiArticles } from '../lib/getWikiData';
import Loading from './Loading';

const Settings = () => {
  const { screen, settings, setSettings, setScreen, wikiData, setWikiData }: GameContext = useConextIfPopulated(GameContext);
  const [isLoading, setIsLoading] = useState(false);

  const logGameStart = () => {
    ReactGA.event('start_game', {
      card_type: settings.cardType,
      team_count: settings.teams.length,
      timer: settings.timer,
      allow_skips: settings.allowSkips,
      generated_card_count: settings.cardType === 'generate' ? settings.cardCount : null,
      is_drafting: settings.isDrafting,
      player_count: settings.playerCount,
    });
  };

  async function startGame(e: React.MouseEvent<HTMLButtonElement>) {
    if (!isDraftingValid()) {
      e.preventDefault();
      return;
    }

    if (settings.cardType === 'generate' && !wikiData) {
      e.preventDefault();
      setIsLoading(true);
      try {
        const data = await getWikiArticles();
        setWikiData(data);
        logGameStart();
        setScreen(settings.isDrafting ? 'game|drafting' : 'game|round');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    logGameStart();
    e.preventDefault();
    setScreen(settings.isDrafting ? 'game|drafting' : 'game|round');
  }

  function addTeam(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const tempTeams = [...settings.teams];
    tempTeams.push(`Team ${tempTeams.length + 1}`);
    setSettings({
      ...settings,
      teams: tempTeams,
    });
  }

  function removeTeam(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const tempTeams = [...settings.teams];
    tempTeams.pop();
    setSettings({
      ...settings,
      teams: tempTeams,
    });
  }

  const clearTeamOnFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement, Element>, index: number) => {
      if (settings.teams[index] === `Team ${index + 1}`) {
        const tempTeams = [...settings.teams];
        tempTeams[index] = '';
        setSettings({ ...settings, [e.target.name]: tempTeams });
      }
    },
    [setSettings, settings]
  );

  const defaultTeamOnBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement, Element>, index: number) => {
      const tempTeams = [...settings.teams];
      if (!settings.teams[index].trim()) {
        tempTeams[index] = `Team ${index + 1}`;
        setSettings({
          ...settings,
          [e.target.name]: tempTeams,
        });
      } else {
        tempTeams[index] = e.target.value.trim();
        setSettings({
          ...settings,
          [e.target.name]: tempTeams,
        });
      }
    },
    [setSettings, settings]
  );

  const isDraftingValid = () => {
    if (!settings.isDrafting) return true;
    return settings.cardCount % settings.playerCount === 0;
  };

  return (
    <>
      {screen.startsWith("game") ? (
        <Game />
      ) : isLoading ? (
        <Loading />
      ) : (
        <StyledBackgroundContiner
          className="background--scroll"
          background={"blue"}
        >
          <StyledContainer>
            <Header title="New Game" />
            <StyledSettings>
              <h3 className="heading">Settings</h3>
              <form>
                <div className="settings__group">
                  <label className="all-caps" htmlFor="team1">
                    Teams
                  </label>
                  {settings.teams.map((team, index) => (
                    <div className="team-container" key={`team${index + 1}`}>
                      <input
                        id={`team${index + 1}`}
                        data-index={index}
                        className="team"
                        name="teams"
                        type="text"
                        value={team}
                        onChange={(e) => setASetting(settings, setSettings, e)}
                        onBlur={(e) => defaultTeamOnBlur(e, index)}
                        onFocus={(e) => clearTeamOnFocus(e, index)}
                      />
                    </div>
                  ))}
                  <div className="button-container">
                    <Button handleClick={addTeam} width="50%" color="blue">
                      Add
                    </Button>
                    <Button
                      className="button--reverse"
                      handleClick={removeTeam}
                      width="50%"
                      color="blue"
                      disabled={settings.teams.length <= 2 ? true : false}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="settings__group">
                  <div className="input__container--split">
                    <label className="all-caps" htmlFor="timer">
                      Timer
                      <br />
                      <span>(in seconds)</span>
                    </label>
                    <input
                      className="input--narrow"
                      id="timer"
                      name="timer"
                      type="number"
                      value={settings.timer}
                      min="1"
                      max="999"
                      onChange={(e) => setASetting(settings, setSettings, e)}
                      onBlur={(e) => checkNumber(settings, setSettings, e)}
                    />
                  </div>
                </div>
                <div className="settings__group">
                  <div className="input__container--split">
                    <label className="all-caps" htmlFor="allowSkips">
                      Allow Skips?
                    </label>
                    <input
                      id="allowSkips"
                      name="allowSkips"
                      type="checkbox"
                      onChange={(e) => setASetting(settings, setSettings, e)}
                      checked={settings.allowSkips}
                    />
                  </div>
                </div>
                <div className="settings__group">
                  <div className="input__container--split">
                    <label className="all-caps" htmlFor="cardType">
                      Cards
                    </label>
                    <select
                      id="cardType"
                      name="cardType"
                      value={settings.cardType}
                      onChange={(e) => setASetting(settings, setSettings, e)}
                    >
                      <option value="base">Base Game</option>
                      <option value="base_hr">Croatian</option>
                      <option value="generate">Generated</option>
                      <option value="written">Written</option>
                    </select>
                  </div>
                  {settings.cardType === "written" && (
                    <textarea
                      id="cardText"
                      name="cardText"
                      value={settings.cardText}
                      onChange={(e) => setASetting(settings, setSettings, e)}
                      onBlur={(e) =>
                        !settings.cardText.trim()
                          ? setSettings({
                              ...settings,
                              [e.target.name]: defaultSettings.cardText,
                            })
                          : setSettings({
                              ...settings,
                              [e.target.name]: e.target.value.trim(),
                            })
                      }
                      onFocus={(e) =>
                        settings.cardText === defaultSettings.cardText &&
                        setSettings({ ...settings, [e.target.name]: "" })
                      }
                    />
                  )}
                  {(settings.cardType === "generate" ||
                    settings.cardType === "base" ||
                    settings.cardType === "base_hr") && (
                    <div className="settings__drafting">
                      <div className="input__container--split">
                        <label className="all-caps" htmlFor="cardCount">
                          Card Count
                        </label>
                        <input
                          id="cardCount"
                          className="input--narrow"
                          name="cardCount"
                          type="number"
                          min="1"
                          max={wikiData?.length}
                          value={settings.cardCount}
                          onChange={(e) =>
                            setASetting(settings, setSettings, e)
                          }
                          onBlur={(e) => checkNumber(settings, setSettings, e)}
                        />
                      </div>
                      <div className="input__container--split">
                        <label className="all-caps" htmlFor="isDrafting">
                          Enable Drafting?
                        </label>
                        <input
                          id="isDrafting"
                          name="isDrafting"
                          type="checkbox"
                          onChange={(e) =>
                            setASetting(settings, setSettings, e)
                          }
                          checked={settings.isDrafting}
                        />
                      </div>
                      {settings.isDrafting && (
                        <div className="input__container--split">
                          <label className="all-caps" htmlFor="playerCount">
                            Number of Players
                          </label>
                          <input
                            id="playerCount"
                            className="input--narrow"
                            name="playerCount"
                            type="number"
                            min="4"
                            max="16"
                            value={settings.playerCount}
                            onChange={(e) =>
                              setASetting(settings, setSettings, e)
                            }
                            onBlur={(e) =>
                              checkNumber(settings, setSettings, e)
                            }
                          />
                        </div>
                      )}
                      {settings.isDrafting && !isDraftingValid() && (
                        <div className="error-message">
                          Card count must be divisible by number of players.
                          Each player should contribute{" "}
                          {Math.floor(
                            settings.cardCount / settings.playerCount
                          )}{" "}
                          cards.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  handleClick={startGame}
                  color="blue"
                  type="submit"
                  disabled={!isDraftingValid()}
                >
                  Start Game
                </Button>
              </form>
            </StyledSettings>
          </StyledContainer>
        </StyledBackgroundContiner>
      )}
    </>
  );
};

export default Settings;
