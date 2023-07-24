import { findWords } from "./find_words.js";

export const populateClueContainer = async (dropboxes, root) => {
  const clueContainer = document.querySelector(".clue-container");
  const innerClueContainer = document.createElement("div");
  innerClueContainer.className = "inner-clue-container";
  if (clueContainer.hasChildNodes()) {
    //remove the inner container every time a tile is dropped
    clueContainer.removeChild(clueContainer.firstChild);
  }

  const tiles = Array.from(dropboxes).map((ele) =>
    ele.firstChild ? ele.firstChild.innerHTML : null
  );

  const matrix = [];
  let innerArray = [];
  //need to convert this into a 5 x 5 matrix
  for (let i = 0; i < tiles.length; i++) {
    innerArray.push(tiles[i]);

    if (innerArray.length === 5) {
      matrix.push(innerArray);
      innerArray = [];
    }
  }

  const foundWords = await findWords(matrix, root);

  for (let word of foundWords) {
    const wordContainer = document.createElement("div");
    wordContainer.innerHTML = word;
    wordContainer.className = "word-container";
    innerClueContainer.appendChild(wordContainer);
  }

  clueContainer.appendChild(innerClueContainer);
};
