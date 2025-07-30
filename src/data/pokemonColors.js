export const typeBackgrounds = {
  Normale: "linear-gradient(to right, #D8D8D8, #9FA19F)",
  Lotta: "linear-gradient(to right, #FFB162, #FF8000)",
  Volante: "linear-gradient(to right, #BDDFFF, #81B9EF)",
  Veleno: "linear-gradient(to right, #C078F4, #9141CB)",
  Terra: "linear-gradient(to right, #C2895F, #915121)",
  Roccia: "linear-gradient(to right, #DBD8C8, #AFA981)",
  Coleottero: "linear-gradient(to right, #C5D260, #91A119)",
  Spettro: "linear-gradient(to right, #9C809C, #704170)",
  Acciaio: "linear-gradient(to right, #A2D0E0, #60A1B8)",
  Fuoco: "linear-gradient(to right, #FF7172, #E62829)",
  Acqua: "linear-gradient(to right, #83B9FF, #2980EF)",
  Erba: "linear-gradient(to right, #81D36E, #3FA129)",
  Elettro: "linear-gradient(to right, #FFE695, #FAC000)",
  Psico: "linear-gradient(to right, #FF96B8, #EF4179)",
  Ghiaccio: "linear-gradient(to right, #BCF2FF, #3FD8FF)",
  Drago: "linear-gradient(to right, #909CFF, #5060E1)",
  Buio: "linear-gradient(to right, #747474, #50413F)",
  Folletto: "linear-gradient(to right, #FFCDFF, #EF70EF)",
  Astrale:
    "linear-gradient(to right, #FF0000, #FF7F00, #F9CB00, #00CE00, #0000FF, #4B0082, #9400D3)",

  "": "linear-gradient(to right, #cccccc, #999999)",
};

const extractGradientColors = (gradientString) => {
  const regex = /linear-gradient\(to right, (.+)\)/;
  const match = gradientString.match(regex);
  if (match && match.length === 2) {
    return match[1].split(",").map((color) => color.trim());
  }
  if (gradientString && !gradientString.startsWith("linear-gradient")) {
    return [gradientString.trim()];
  }
  return [];
};

export const getPrimaryColor = (backgroundStyle) => {
  if (!backgroundStyle) {
    return "#999999";
  }

  if (backgroundStyle.startsWith("linear-gradient")) {
    const colors = extractGradientColors(backgroundStyle);
    return colors.length > 0 ? colors[0] : "#999999";
  } else {
    return backgroundStyle;
  }
};

export const generateDualTypeGradient = (type1, type2) => {
  const gradient1 = typeBackgrounds[type1];
  const gradient2 = typeBackgrounds[type2];

  if (!gradient1 && !gradient2) {
    return typeBackgrounds[""];
  }
  if (!gradient1) {
    return typeBackgrounds[type2] || typeBackgrounds[""];
  }
  if (!gradient2) {
    return typeBackgrounds[type1] || typeBackgrounds[""];
  }

  const colors1 = extractGradientColors(gradient1);
  const colors2 = extractGradientColors(gradient2);

  if (colors1.length === 0 || colors2.length === 0) {
    return (
      typeBackgrounds[type1] || typeBackgrounds[type2] || typeBackgrounds[""]
    );
  }

  if (type1 === "Astrale") {
    return typeBackgrounds["Astrale"];
  }
  if (type2 === "Astrale") {
    return typeBackgrounds["Astrale"];
  }

  if (colors1.length >= 2 && colors2.length >= 2) {
    return `linear-gradient(to right, ${colors1[1]}, ${colors2[1]})`;
  } else if (colors1.length >= 1 && colors2.length >= 1) {
    return `linear-gradient(to right, ${colors1[0]}, ${colors2[0]})`;
  }

  return (
    typeBackgrounds[type1] || typeBackgrounds[type2] || typeBackgrounds[""]
  );
};
