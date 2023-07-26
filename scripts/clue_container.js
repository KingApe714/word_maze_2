import { findWords } from "./find_words.js";

export const populateClueContainer = (dropboxes, root) => {
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

  const foundWords = findWords(matrix, root);

  for (let word of foundWords) {
    const wordContainer = document.createElement("div");
    wordContainer.innerHTML = word;
    wordContainer.className = "word-container";
    innerClueContainer.appendChild(wordContainer);
  }

  //re-append the innerClueContainer
  clueContainer.appendChild(innerClueContainer);

  //here I am trying to add a scroll feature for mobile on the clue container
  // Add a touchstart event listener to the div.
  innerClueContainer.addEventListener(
    "touchstart",
    function (event) {
      // Save the touch position when the user clicks the innerClueContainer.
      // this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;

      console.log("in the inner clue container");
    },
    { passive: false }
  );

  // Add a touchmove event listener to the innerClueContainer.
  innerClueContainer.addEventListener(
    "touchmove",
    function (event) {
      // Calculate the difference between the touch position when the user clicked the innerClueContainer and the current touch position.
      // const deltaX = event.touches[0].clientX - this.startX;
      const deltaY = event.touches[0].clientY - this.startY;

      // Move the innerClueContainer by the difference in touch positions.
      // this.style.left = this.offsetLeft + deltaX + "px";
      // this.style.top = this.offsetTop + deltaY + "px";
      this.scrollTop = this.offsetTop + deltaY + "px";

      console.log("this is the touchmove");
    },
    { passive: false }
  );
};
