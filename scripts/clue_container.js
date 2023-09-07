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

  const canvasDrawLine = document.querySelector(".draw-line");
  const ctx = canvasDrawLine.getContext("2d");

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
    let node = null;

    path.forEach((coord) => {
      const [pathI, pathJ] = coord.split(",").map((ele) => Number(ele));
      if (node === null) {
        node = ancestoryMatrix[pathI][pathJ];
      } else {
        node = node.children[coord];
      }
      const tile = node.dropbox.firstChild;
      const charDiv = document.createElement("div");
      charDiv.className = "char-div";
      charDiv.style.backgroundColor =
        tile.id === "question-mark" ? "#e69122" : "#31d2b1";
      charDiv.innerHTML = tile.innerHTML;

      wordContainer.appendChild(charDiv);
    });

    wordContainer.addEventListener(
      "touchstart",
      (e) => {
        // remove the animation if any other path has it
        const bouncingBoxes = document.querySelectorAll(".bounce-7");
        let myAni;

        for (let box of bouncingBoxes) {
          cancelAnimationFrame(myAni);
          box.classList.remove("bounce-7");
          box.style.animationDelay = "";
        }

        requestAnimationFrame(mover);

        // I can simply loop through the path as it has the coordinates that I need
        function mover() {
          Array.from(path).forEach((coord, idx) => {
            const [pathI, pathJ] = coord.split(",").map((ele) => Number(ele));
            const matrixDiv = ancestoryMatrix[pathI][pathJ].dropbox.firstChild;
            const charDiv = wordContainer.children[idx];

            matrixDiv.classList.add("bounce-7");
            matrixDiv.style.animationDelay = `${idx * 0.095}s`;
            charDiv.classList.add("bounce-7");
            charDiv.style.animationDelay = `${idx * 0.095}s`;

            ctx;
          });
        }
      },
      { passive: false }
    );

    node.wordContainer = wordContainer;
    innerClueContainer.appendChild(wordContainer);
  }

  //re-append the innerClueContainer
  clueContainer.appendChild(innerClueContainer);
};
