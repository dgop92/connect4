const playerColors = {
  GREEN: "green",
  RED: "red",
  BLUE: "blue",
  ORANGE: "orange",
};

function shuffleArray(array) {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    // eslint-disable-next-line no-param-reassign
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function getRandomColors() {
  const colors = Object.values(playerColors);
  shuffleArray(colors);
  return colors;
}

module.exports = {
  playerColors,
  shuffleArray,
  getRandomColors,
};
