import { findWords } from "./find_words.js";
import { AncestoryNode } from "./ancestory_node.js";

export const populateClueContainer = (dropboxes, root) => {
  const clueContainer = document.querySelector(".clue-container");
  const innerClueContainer = document.createElement("div");
  innerClueContainer.className = "inner-clue-container";
  if (clueContainer.hasChildNodes()) {
    //remove the inner container every time a tile is dropped
    clueContainer.removeChild(clueContainer.firstChild);
  }

  const ancestoryMatrix = [];
  let innerArray = [];
  //need to convert this into a 5 x 5 ancestoryMatrix
  for (let i = 0; i < dropboxes.length; i++) {
    let I = Math.floor(i / 5);
    let J = i % 5;
    const val = dropboxes[i].firstChild
      ? dropboxes[i].firstChild.innerHTML
      : null;
    const ancestor = new AncestoryNode(val, I, J, dropboxes[i]);

    innerArray.push(ancestor);

    if (innerArray.length === 5) {
      ancestoryMatrix.push(innerArray);
      innerArray = [];
    }
  }

  const [foundWords, paths] = findWords(ancestoryMatrix, root);

  for (let path of paths) {
    const wordContainer = document.createElement("div");
    wordContainer.className = "word-container";

    path.forEach((coord) => {
      const [pathI, pathJ] = coord.split(",").map((ele) => Number(ele));
      const node = ancestoryMatrix[pathI][pathJ];
      const tile = node.dropbox.firstChild;
      const charDiv = document.createElement("div");
      charDiv.className = "char-div";
      charDiv.style.backgroundColor =
        tile.id === "question-mark" ? "#e69122" : "#31d2b1";
      charDiv.innerHTML = tile.innerHTML;

      console.log(tile.id);

      wordContainer.appendChild(charDiv);
    });

    innerClueContainer.appendChild(wordContainer);
  }

  //re-append the innerClueContainer
  clueContainer.appendChild(innerClueContainer);
};
