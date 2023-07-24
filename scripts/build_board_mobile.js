import { findWords } from "./find_words.js";

// console.log(findWords);

export const mobileDragDrop = (root) => {
  const dropboxes = document.querySelectorAll("#dropbox");
  const body = document.body;

  body.addEventListener("touchstart", (e) => dragStart(e), { passive: false });
  body.addEventListener("touchmove", (e) => drag(e), { passive: false });
  body.addEventListener("touchend", (e) => drop(e), { passive: false });

  let drg, drgT, drgL, drgB, drgR;

  let currentTile, avail;

  let lastDropbox;

  function dragStart(evt) {
    currentTile = evt.target;

    if (currentTile.getAttribute("draggable") === "true") {
      avail = "available";
      currentTile.classList.add("dragging-cell");
    } else {
      avail = "";
    }
  }

  function drag(evt) {
    if (avail === "available") {
      currentTile.style.position = "absolute";
      currentTile.style.left = `${
        evt.touches[0].clientX - currentTile.clientWidth / 2
      }px`;
      currentTile.style.top = `${
        evt.touches[0].clientY - currentTile.clientHeight / 2
      }px`;

      drg = currentTile.getBoundingClientRect();
      drgT = drg.top;
      drgB = drg.bottom;
      drgL = drg.left;
      drgR = drg.right;

      //this code is my attempt at appending the currentTile to a dropbox as I drag over it
      // for (let dropbox of dropboxes) {
      for (let i = 0; i < dropboxes.length; i++) {
        let dropbox = dropboxes[i];
        let drp = dropbox.getBoundingClientRect();

        let drpT = drp.top,
          drpL = drp.left,
          drpB = drp.bottom,
          drpR = drp.right;

        //this if statement ensures that I am inside of one of the coordinates of one of the dropboxes
        if (drpT < drgT && drpL < drgL && drpB > drgB && drpR > drgR) {
          //when I'm here, I know that I'm looking at an available dropbox
          if (dropbox.childNodes.length === 0) {
            let I = Math.floor(i / 5);
            let J = i - 5 * I;

            const newTile = document.createElement("div");
            newTile.id = "dragbox";
            newTile.classList.add("dragging-cell");
            newTile.draggable = "true";
            newTile.innerHTML = currentTile.innerHTML;

            dropbox.appendChild(newTile);

            //snap back feature
            if (!lastDropbox) {
              lastDropbox = dropbox;
            } else {
              lastDropbox.removeChild(lastDropbox.lastElementChild);
              lastDropbox = dropbox;
            }
          }
        }
      }
    }

    evt.preventDefault();
  }

  async function drop() {
    //I am dragging a draggable tile
    if (avail === "available") {
      //add the regular color back to the cell
      if (lastDropbox) {
        lastDropbox.childNodes[0].classList.remove("dragging-cell");
      }

      if (
        currentTile.parentNode.className === "dragbox-cont" ||
        (currentTile.parentNode.className === "dropbox" && !lastDropbox)
      ) {
        currentTile.style.position = "";
      } else {
        const parent = currentTile.parentNode;
        parent.removeChild(parent.lastElementChild);
      }

      currentTile.classList.remove("dragging-cell");
      lastDropbox = null;
    }

    //Update the clue container as the tiles are being placed
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
  }
};
