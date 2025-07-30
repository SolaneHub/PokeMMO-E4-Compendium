import "../App.css";

const PokemonCard = ({
  pokemonName,
  pokemonImageSrc,
  onClick,
  nameBackground,
}) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = `https://placehold.co/80x80/cccccc/333333?text=?`;
  };

  return (
    <div className="pokemon-card" onClick={onClick}>
      {pokemonName && (
        <p className="pokemon-name" style={{ background: nameBackground }}>
          {pokemonName}
        </p>
      )}

      {pokemonImageSrc ? (
        <img
          src={pokemonImageSrc}
          alt={pokemonName || "Pokemon Placeholder"}
          className="pokemon-image"
          onError={handleImageError}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "2rem",
            color: "#b0b3b8",
          }}
        >
          ?
        </div>
      )}
    </div>
  );
};

export default PokemonCard;
