import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";
import { eliteFourMembers } from "./data/eliteFourData";
import EliteMemberCard from "./components/EliteMemberCard";
import { pokemonRegions } from "./data/regionData";
import RegionCard from "./components/RegionCard";
import PokemonCard from "./components/PokemonCard";
import { pokemonImages } from "./data/pokemonImages";
import {
  typeBackgrounds,
  generateDualTypeGradient,
  getPrimaryColor,
} from "./data/pokemonColors";
import { pokemonData } from "./data/pokemonData";

function App() {
  // State management
  const [selectedTeam, setSelectedTeam] = useState("Team 1");
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);
  const [currentStrategyView, setCurrentStrategyView] = useState([]);
  const [strategyHistory, setStrategyHistory] = useState([]);

  // Memoized filtered elite four members based on selected region
  const filteredEliteFour = useMemo(() => {
    return selectedRegion
      ? eliteFourMembers.filter((member) => member.region === selectedRegion.name)
      : [];
  }, [selectedRegion]);

  // Memoized current team data
  const currentTeamData = useMemo(
    () => selectedMember?.teams?.[selectedTeam],
    [selectedMember, selectedTeam]
  );

  // Memoized pokemon names for selected team
  const pokemonNamesForSelectedTeam = useMemo(
    () => currentTeamData?.pokemonNames || [],
    [currentTeamData]
  );

  // Preload images
  useEffect(() => {
    pokemonNamesForSelectedTeam.forEach((name) => {
      const img = new Image();
      img.src = pokemonImages[name];
    });
  }, [pokemonNamesForSelectedTeam]);

  // Memoized selected pokemon data
  const selectedPokemonData = useMemo(
    () => pokemonData.find((p) => p.name === selectedPokemon?.name),
    [selectedPokemon]
  );

  // Memoized selected pokemon types
  const selectedPokemonTypes = useMemo(
    () => selectedPokemonData?.types || [],
    [selectedPokemonData]
  );

  // Memoized background for details title
  const detailsTitleBackground = useMemo(() => {
    if (typeBackgrounds[selectedPokemon?.name]) {
      return typeBackgrounds[selectedPokemon.name];
    }

    if (selectedPokemonTypes.length >= 2) {
      return generateDualTypeGradient(
        selectedPokemonTypes[0],
        selectedPokemonTypes[1]
      );
    }

    if (selectedPokemonTypes.length === 1) {
      return typeBackgrounds[selectedPokemonTypes[0]] || typeBackgrounds[""];
    }

    return typeBackgrounds[""];
  }, [selectedPokemon, selectedPokemonTypes]);

  // Reset strategy states
  const resetStrategyStates = useCallback(() => {
    setCurrentStrategyView([]);
    setStrategyHistory([]);
  }, []);

  // Event handlers
  const handleMemberClick = useCallback(
    (member) => {
      setSelectedMember((prev) => (prev === member ? null : member));
      setSelectedPokemon(null);
      setIsPokemonDetailsVisible(false);
      resetStrategyStates();
    },
    [resetStrategyStates]
  );

  const handleRegionClick = useCallback((region) => {
    setSelectedRegion((prev) => (prev === region ? null : region));
  }, []);

  const handleTeamClick = useCallback(
    (teamName) => {
      setSelectedTeam(teamName);
      setSelectedRegion(null);
      setSelectedMember(null);
      setSelectedPokemon(null);
      setIsPokemonDetailsVisible(false);
      resetStrategyStates();
    },
    [resetStrategyStates]
  );

  const handlePokemonCardClick = useCallback(
    (pokemon) => {
      setSelectedPokemon(pokemon);
      setIsPokemonDetailsVisible(true);

      const pokemonStrategy =
        selectedMember?.teams?.[selectedTeam]?.pokemonStrategies?.[pokemon?.name] || [];
      setCurrentStrategyView(pokemonStrategy);
      setStrategyHistory([]);
    },
    [selectedMember, selectedTeam]
  );

  const closePokemonDetails = useCallback(() => {
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategyStates();
  }, [resetStrategyStates]);

  const handleStepClick = useCallback(
    (item) => {
      if (item?.steps && Array.isArray(item.steps)) {
        setStrategyHistory((prev) => [...prev, currentStrategyView]);
        setCurrentStrategyView(item.steps);
      }
    },
    [currentStrategyView]
  );

  const handleBackClick = useCallback(() => {
    if (strategyHistory.length > 0) {
      setCurrentStrategyView(strategyHistory[strategyHistory.length - 1]);
      setStrategyHistory((prev) => prev.slice(0, -1));
    }
  }, [strategyHistory]);

  // Effect to reset states when region changes
  useEffect(() => {
    setSelectedMember(null);
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategyStates();
  }, [selectedRegion, resetStrategyStates]);

  // Improved strategy rendering
  const renderStrategyContent = useCallback((content) => {
    if (!content || content.length === 0) {
      return <p>No strategy available</p>;
    }

    return content.map((item, index) => {
      // Pure variation container (like Lapras case)
      if (!item.type && item.variations) {
        return (
          <div key={index} className="variation-group">
            {item.variations.map((variation, varIndex) => (
              <div
                key={varIndex}
                className="strategy-variation-as-button"
                onClick={() => handleStepClick(variation)}
              >
                <p>{variation.name}</p>
              </div>
            ))}
          </div>
        );
      }

      // Main strategy
      if (item.type === "main") {
        return (
          <div key={index} className="strategy-block">
            {item.player && (
              <div className="strategy-step-main">
                <p>{item.player}</p>
              </div>
            )}
            {item.variations && (
              <div className="variation-group">
                {item.variations.map((variation, varIndex) => (
                  <div
                    key={varIndex}
                    className="strategy-variation-as-button"
                    onClick={() => handleStepClick(variation)}
                  >
                    <p>{variation.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      // Regular step
      if (item.type === "step") {
        return (
          <div key={index} className="strategy-step">
            {item.player && <p>{item.player}</p>}
            {item.variations && (
              <div className="variation-group">
                {item.variations.map((variation, varIndex) => (
                  <div
                    key={varIndex}
                    className="strategy-variation-as-button"
                    onClick={() => handleStepClick(variation)}
                  >
                    <p>{variation.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      return null;
    });
  }, [handleStepClick, handleBackClick]);

  // Render helper for Pokemon cards
  const renderPokemonCards = useMemo(() => {
    if (!pokemonNamesForSelectedTeam.length) {
      return (
        <p>
          No pokemon defined for {selectedTeam} of {selectedMember?.name}.
        </p>
      );
    }

    return pokemonNamesForSelectedTeam.map((pokemonName, index) => {
      const pokemon = pokemonData.find((p) => p.name === pokemonName) || {
        name: pokemonName,
        types: [],
      };
      const pokemonTypes = pokemon.types || [];

      let nameBackground = typeBackgrounds[pokemon.name] || typeBackgrounds[""];

      if (!typeBackgrounds[pokemon.name] && pokemonTypes.length >= 2) {
        nameBackground = generateDualTypeGradient(
          pokemonTypes[0],
          pokemonTypes[1]
        );
      } else if (!typeBackgrounds[pokemon.name] && pokemonTypes.length === 1) {
        nameBackground =
          typeBackgrounds[pokemonTypes[0]] || typeBackgrounds[""];
      }

      return (
        <PokemonCard
          key={index}
          pokemonName={pokemon.name}
          pokemonImageSrc={pokemonImages[pokemon.name]}
          onClick={() => handlePokemonCardClick(pokemon)}
          nameBackground={nameBackground}
        />
      );
    });
  }, [pokemonNamesForSelectedTeam, selectedMember, selectedTeam, handlePokemonCardClick]);

  return (
    <div className="App">
      <header className="header-bar">
        <h1>PokéMMO Compendium</h1>
      </header>

      <div className="container">
        {/* Team Selector */}
        <div className="cards-container team-selector-container">
          {Object.keys(eliteFourMembers[0]?.teams || {}).map((teamName) => (
            <div
              key={teamName}
              className={`card team-card ${
                selectedTeam === teamName ? "selected" : ""
              }`}
              onClick={() => handleTeamClick(teamName)}
            >
              {teamName === "Team 1" ? (
                <a
                  href="https://pokepast.es/a3bee7499d07b81e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-name-link"
                >
                  <p className="team-name" style={{ color: "white" }}>
                    {teamName}
                  </p>
                </a>
              ) : (
                <p className="team-name">{teamName}</p>
              )}
            </div>
          ))}
        </div>

        {/* Regions */}
        <div className="cards-container regions-container">
          {pokemonRegions.map((region) => (
            <RegionCard
              key={region.id}
              region={region}
              onRegionClick={handleRegionClick}
              isSelected={selectedRegion === region}
            />
          ))}
        </div>

        {/* Elite Four Members */}
        {selectedRegion && filteredEliteFour.length > 0 && (
          <div className="cards-container elitefour-container">
            {filteredEliteFour.map((member, i) => {
              const memberBackground =
                typeBackgrounds[member.type] || typeBackgrounds[""];
              const memberShadowColor = getPrimaryColor(memberBackground);

              return (
                <EliteMemberCard
                  key={i}
                  member={member}
                  onMemberClick={handleMemberClick}
                  isSelected={selectedMember === member}
                  background={memberBackground}
                  shadowColor={memberShadowColor}
                />
              );
            })}
          </div>
        )}

        {/* Pokemon Cards */}
        {selectedMember && (
          <div className="pokemon-cards-display">{renderPokemonCards}</div>
        )}

        {/* Pokemon Details Modal */}
        {isPokemonDetailsVisible && selectedPokemon && (
          <div className="overlay" onClick={closePokemonDetails}>
            <div
              className="pokemon-details-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="pokemon-details-title-wrapper"
                style={{ background: detailsTitleBackground }}
              >
                <h2>{selectedPokemon.name}</h2>
              </div>

              <div className="details-menu">
                <div className="menu-content">
                  {strategyHistory.length > 0 && (
                    <button className="back-button" onClick={handleBackClick}>
                      Back
                    </button>
                  )}
                  {renderStrategyContent(currentStrategyView)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;