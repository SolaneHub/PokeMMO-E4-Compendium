import React, { useState, useEffect } from "react";
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

  // Definisci le parole chiave da colorare e le loro classi CSS
  const colorKeywords = {
    // Nomi di mosse/strumenti (dalla strategia di Lorelei)
    "Stealth Rock": "move-item-color",
    "Calm Mind": "move-item-color",
    "X Speed": "move-item-color",
    Trick: "move-item-color",
    Earthquake: "move-item-color",
    "Swords Dance": "move-item-color",
    "Gyro Ball": "move-item-color",
    "Ice Punch": "move-item-color",
    Toxic: "move-item-color",
    "Belly Drum": "move-item-color",
    "Drain Punch": "move-item-color",
    "Drill Run": "move-item-color",
    Swap: "move-item-color",
    swap: "action-color",

    // Aggiungi altre parole chiave se necessario
    Enemy: "action-color",
    use: "action-color",
    Baiting: "action-color",
    "setting up": "action-color",
    "switches out": "action-color",
    "comes out": "action-color",
    "is sent out": "action-color",
    "let it use": "action-color",

    //Pokemon
    Claydol: "pokemon-color",
    Chandelure: "pokemon-color",
    Lapras: "pokemon-color",
    Blissey: "pokemon-color",
    Lucario: "pokemon-color",
    Bronzong: "pokemon-color",
  };

  // Funzione per colorare il testo della strategia
  const colorizeStrategyText = (text) => {
    if (!text) return null;

    // Sostituisci i caratteri di nuova riga con un placeholder temporaneo
    const textWithPlaceholders = text.replace(/\n/g, "___NEWLINE___");

    // Crea un array di pattern basati sulle parole chiave, ordinati per lunghezza decrescente
    // Questo aiuta a evitare di colorare substringhe (es. "Mind" invece di "Calm Mind")
    const sortedKeywords = Object.keys(colorKeywords).sort(
      (a, b) => b.length - a.length
    );

    // Costruisci un'espressione regolare che cerca tutte le parole chiave
    // Usa \b per cercare confini di parola e (|) per alternare
    const keywordPattern = new RegExp(
      `\\b(${sortedKeywords
        .map((kw) => kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")})\\b`,
      "gi"
    );

    const parts = [];
    let lastIndex = 0;

    textWithPlaceholders.replace(keywordPattern, (match, keyword, offset) => {
      // Aggiungi il testo non corrispondente prima della parola chiave
      if (offset > lastIndex) {
        parts.push(textWithPlaceholders.substring(lastIndex, offset));
      }

      // Aggiungi la parola chiave colorata
      const cssClass =
        colorKeywords[keyword.toLowerCase()] || colorKeywords[keyword]; // Controlla sia case sensitive che lowercase
      parts.push(
        <span key={offset} className={cssClass}>
          {match}
        </span>
      );

      lastIndex = offset + match.length;
      return match; // Necessario per il funzionamento di replace con callback
    });

    // Aggiungi il testo rimanente
    if (lastIndex < textWithPlaceholders.length) {
      parts.push(textWithPlaceholders.substring(lastIndex));
    }

    // Sostituisci i placeholder di nuova riga con <br />
    return parts.flatMap((part, index) => {
      if (typeof part === "string") {
        const lines = part.split("___NEWLINE___");
        return lines.map((line, i) => (
          <React.Fragment key={`${index}-${i}`}>
            {line}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        ));
      }
      return part;
    });
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

  // Funzione per gestire il click su uno step
  const handleStepClick = (item) => {
    // Se lo step ha variazioni, naviga nel sotto-livello
    if (
      item.variations &&
      Array.isArray(item.variations) &&
      item.variations.length > 0
    ) {
      // Aggiungi la vista corrente allo storico prima di cambiare vista
      setStrategyHistory([...strategyHistory, currentStrategyView]);
      // Imposta la nuova vista come le variazioni dello step cliccato
      setCurrentStrategyView(item.variations);
    }
    // Se lo step non ha variazioni, non fa nulla (o potresti aggiungere un'azione specifica se necessario)
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
  // Non abbiamo più bisogno di pokemonStrategy qui, la carichiamo in handlePokemonCardClick
  // const pokemonStrategiesForSelectedTeam = currentTeamData?.pokemonStrategies || {};
  // const pokemonStrategy = pokemonStrategiesForSelectedTeam[selectedPokemon?.name] || [];

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
          <p>Nessuna strategia dettagliata disponibile per questo Pokémon.</p>
        );
      } else {
        // Siamo in una variazione, ma il contenuto è vuoto
        return <p>Nessun dettaglio disponibile per questa variazione.</p>;
      }
    }

    return (
      <div className="strategy-content-list">
        {/* Mostra il bottone Indietro solo se c'è storico */}
        {strategyHistory.length > 0 && (
          <button className="back-button" onClick={handleBackClick}>
            Back
          </button>
        )}

        {strategy.map((item, index) => {
          if (!item || !item.type) {
            console.warn(
              "Skipping invalid item in strategy content at index:",
              index,
              item
            );
            return null;
          }

          // Usa la nuova funzione per colorare il testo
          const formattedText = item.player
            ? colorizeStrategyText(item.player)
            : null;

          if (item.type === "step") {
            // Determina se questo step ha variazioni (e quindi è navigabile)
            const hasVariations =
              item.variations &&
              Array.isArray(item.variations) &&
              item.variations.length > 0;
            const stepClassName = `strategy-step ${
              hasVariations ? "has-variations" : ""
            }`;

            return (
              <div key={index}>
                <div
                  className={stepClassName}
                  onClick={
                    hasVariations ? () => handleStepClick(item) : undefined
                  } // Chiama handleStepClick solo se ha variazioni
                  style={{ cursor: hasVariations ? "pointer" : "default" }} // Cambia cursore solo se navigabile
                >
                  <p>{formattedText}</p>
                  {/* Icona per indicare che si può navigare in un sotto-livello */}
                  {hasVariations && (
                    <span className="variation-toggle-icon">
                      ► {/* Icona che indica che si può andare avanti */}
                    </span>
                  )}
                </div>
                {/* Le variazioni annidate non vengono più renderizzate qui */}
              </div>
            );
          }
          // Ignoriamo il tipo "branch" nella nuova struttura
          return null;
        })}
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
              <p className="team-name">{teamName}</p>
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
                      // Passiamo un oggetto placeholder per la coerenza con handlePokemonCardClick
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
