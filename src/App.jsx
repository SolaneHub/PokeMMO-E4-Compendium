import React, { useState, useEffect } from "react";
import "./App.css"; // Importa il file CSS
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
  const [selectedTeam, setSelectedTeam] = useState("Team 1");
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [filteredEliteFour, setFilteredEliteFour] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);

  // Nuovo stato per tenere traccia del livello di strategia attualmente visualizzato
  const [currentStrategyView, setCurrentStrategyView] = useState([]);
  // Nuovo stato per tenere traccia dello storico dei livelli visitati (per il tasto "Indietro")
  const [strategyHistory, setStrategyHistory] = useState([]);

  // Funzione per colorare il testo della strategia (ora restituisce il testo in grassetto e bianco)
  const colorizeStrategyText = (text) => {
    if (!text) return null;

    // Restituisce il testo avvolto in un tag <strong> con stile per renderlo in grassetto e bianco
    return text;
  };

  useEffect(() => {
    if (selectedRegion) {
      const membersForRegion = eliteFourMembers.filter(
        (member) => member.region === selectedRegion.name
      );
      setFilteredEliteFour(membersForRegion);
    } else {
      setFilteredEliteFour([]);
    }
    setSelectedMember(null);
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    // Resetta gli stati della strategia
    setCurrentStrategyView([]);
    setStrategyHistory([]);
  }, [selectedRegion]);

  const handleMemberClick = (member) => {
    if (selectedMember === member) {
      setSelectedMember(null);
    } else {
      setSelectedMember(member);
    }
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    // Resetta gli stati della strategia
    setCurrentStrategyView([]);
    setStrategyHistory([]);
  };

  const handleRegionClick = (region) => {
    if (selectedRegion === region) {
      setSelectedRegion(null);
    } else {
      setSelectedRegion(region);
    }
  };

  const handleTeamClick = (teamName) => {
    setSelectedTeam(teamName);
    setSelectedRegion(null);
    setSelectedMember(null);
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    setFilteredEliteFour([]);
    // Resetta gli stati della strategia
    setCurrentStrategyView([]);
    setStrategyHistory([]);
  };

  const handlePokemonCardClick = (pokemon) => {
    setSelectedPokemon(pokemon);
    setIsPokemonDetailsVisible(true);
    // Quando si apre la scheda, imposta la vista sulla strategia principale
    const pokemonStrategy =
      eliteFourMembers.find((member) => member.name === selectedMember?.name) // Trova il membro selezionato
        ?.teams?.[selectedTeam]?.pokemonStrategies?.[pokemon?.name] || []; // Accedi alla strategia del Pokémon

    setCurrentStrategyView(pokemonStrategy);
    setStrategyHistory([]); // Inizia con uno storico vuoto
  };

  const closePokemonDetails = () => {
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    // Resetta gli stati della strategia alla chiusura
    setCurrentStrategyView([]);
    setStrategyHistory([]);
  };

  // Funzione per gestire il click su una variazione
  const handleStepClick = (item) => {
    // Se l'item è una variazione (con un nome e un array di steps), naviga nei suoi steps
    if (
      item.name &&
      item.steps &&
      Array.isArray(item.steps) &&
      item.steps.length > 0
    ) {
      setStrategyHistory([...strategyHistory, currentStrategyView]);
      setCurrentStrategyView(item.steps);
    }
    // Se lo step non ha steps (cioè è un main type o un semplice step), non fa nulla
  };

  // Funzione per tornare al livello precedente nello storico
  const handleBackClick = () => {
    // Prende l'ultimo elemento dallo storico
    const previousView = strategyHistory[strategyHistory.length - 1];
    // Rimuove l'ultimo elemento dallo storico
    const updatedHistory = strategyHistory.slice(0, -1);

    setStrategyHistory(updatedHistory);
    setCurrentStrategyView(previousView);
  };

  const currentTeamData = selectedMember?.teams?.[selectedTeam];
  const pokemonNamesForSelectedTeam = currentTeamData?.pokemonNames || [];

  const selectedPokemonData = pokemonData.find(
    (p) => p.name === selectedPokemon?.name
  );
  const selectedPokemonTypes = selectedPokemonData?.types || [];

  let detailsTitleBackground =
    typeBackgrounds[selectedPokemon?.name] || typeBackgrounds[""];

  if (
    !typeBackgrounds[selectedPokemon?.name] &&
    selectedPokemonTypes.length >= 2
  ) {
    detailsTitleBackground = generateDualTypeGradient(
      selectedPokemonTypes[0],
      selectedPokemonTypes[1]
    );
  } else if (
    !typeBackgrounds[selectedPokemon?.name] &&
    selectedPokemonTypes.length === 1
  ) {
    detailsTitleBackground =
      typeBackgrounds[selectedPokemonTypes[0]] || typeBackgrounds[""];
  }

  // Funzione per renderizzare il contenuto della strategia/variazione corrente
  const renderCurrentStrategyView = (strategy) => {
    if (!strategy || strategy.length === 0) {
      // Controlla se siamo nella vista principale o in una variazione
      if (strategyHistory.length === 0) {
        // Siamo nella vista principale e non c'è strategia
        return (
          <p>No strategy details available for this pokemon.</p>
        );
      } else {
        // Siamo in una variazione, ma il contenuto è vuoto
        return <p>No details available for this variation.</p>;
      }
    }

    // Determina se stiamo visualizzando la strategia principale (un singolo oggetto di tipo "main")
    const isMainStrategyView = strategy.length === 1 && strategy[0].type === "main";

    return (
      <div className="strategy-content-list">
        {/* Mostra il bottone Indietro solo se c'è storico */}
        {strategyHistory.length > 0 && (
          <button className="back-button" onClick={handleBackClick}>
            Back
          </button>
        )}

        {isMainStrategyView ? (
          // Renderizza lo step principale e le sue variazioni inline
          <>
            <div className="strategy-step-main">
              <p>{colorizeStrategyText(strategy[0].player)}</p>
            </div>
            {strategy[0].variations && strategy[0].variations.length > 0 && (
              <div className="main-strategy-variations-list"> {/* Nuovo contenitore per le variazioni */}
                {strategy[0].variations.map((variation, varIndex) => (
                  <div
                    key={varIndex}
                    className="strategy-variation-as-button" // Nuova classe per le variazioni stilizzate come bottoni
                    onClick={() => handleStepClick(variation)}
                  >
                    <p>{colorizeStrategyText(variation.name)}</p> {/* Mostra il nome della variazione */}
                    
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // Renderizza i singoli step (quando si visualizzano i passaggi di una specifica variazione)
          strategy.map((item, index) => {
            if (!item || !item.type) {
              console.warn("Skipping invalid item in strategy content at index:", index, item);
              return null;
            }
            // Qui, 'item' dovrebbe essere sempre di tipo "step"
            if (item.type === "step") {
              return (
                <div key={index} className="strategy-step">
                  <p>{colorizeStrategyText(item.player)}</p>
                </div>
              );
            }
            return null; // Non dovrebbe accadere con la nuova struttura se la logica è corretta
          })
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <header className="header-bar">
        <h1>PokéMMO Elite Four Compendium</h1>
      </header>

      <div className="container">
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

        <div className="cards-container regions-container">
          {pokemonRegions.map((region) => (
            <React.Fragment key={region.id}>
              <RegionCard
                region={region}
                onRegionClick={handleRegionClick}
                isSelected={selectedRegion === region}
              />
            </React.Fragment>
          ))}
        </div>

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

        {selectedMember && (
          <div className="pokemon-cards-display">
            {pokemonNamesForSelectedTeam.length > 0 ? (
              pokemonNamesForSelectedTeam.map((pokemonName, index) => {
                const pokemon = pokemonData.find((p) => p.name === pokemonName);

                if (!pokemon) {
                  return (
                    <PokemonCard
                      key={index}
                      onClick={() =>
                        handlePokemonCardClick({ name: pokemonName, types: [] })
                      }
                      nameBackground={typeBackgrounds[""]}
                    />
                  );
                }

                const pokemonTypes = pokemon.types || [];
                let nameBackground =
                  typeBackgrounds[pokemon.name] || typeBackgrounds[""];

                if (
                  !typeBackgrounds[pokemon.name] &&
                  pokemonTypes.length >= 2
                ) {
                  nameBackground = generateDualTypeGradient(
                    pokemonTypes[0],
                    pokemonTypes[1]
                  );
                } else if (
                  !typeBackgrounds[pokemon.name] &&
                  pokemonTypes.length === 1
                ) {
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
              })
            ) : (
              <p>
                Nessun Pokémon definito per il {selectedTeam} di{" "}
                {selectedMember.name}.
              </p>
            )}
          </div>
        )}

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
                  {/* Renderizza la vista corrente della strategia */}
                  {renderCurrentStrategyView(currentStrategyView)}
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
