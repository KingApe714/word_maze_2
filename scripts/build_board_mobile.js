import { populateClueContainer } from "./clue_container.js";
import { generateBoard } from "./find_words.js";

export const mobileDragDrop = (root) => {
  const dragboxTopContainer = document.querySelector(".dragbox-top-container");
  const dropboxes = Array.from(document.querySelectorAll(".dropbox"));
  const gameContainer = document.querySelector(".game-container");

  gameContainer.addEventListener("touchstart", (e) => dragStart(e), {
    passive: false,
  });
  gameContainer.addEventListener("touchmove", (e) => drag(e), {
    passive: false,
  });
  gameContainer.addEventListener("touchend", (e) => drop(e), {
    passive: false,
  });

  let drg, drgT, drgL, drgB, drgR;

  let currentTile, avail;

  let lastDropbox;

  //Logic for throwing out the current tile that I am holding onto
  const garbage = document.querySelector(".garbage-icon");

  const dragStart = (evt) => {
    currentTile = evt.target;

    if (currentTile.getAttribute("draggable") === "true") {
      avail = "available";
      currentTile.classList.add("dragging-cell");
    } else {
      avail = "";
    }
  };

  const drag = (evt) => {
    evt.preventDefault();

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
      for (let dropbox of dropboxes) {
        let drp = dropbox.getBoundingClientRect();
        let drpT = drp.top,
          drpL = drp.left,
          drpB = drp.bottom,
          drpR = drp.right;

        let drgMidY = (drgB + drgT) / 2;
        let drgMidX = (drgL + drgR) / 2;

        //this if statement ensures that I am inside of one of the coordinates of one of the dropboxes
        if (
          drpT < drgMidY &&
          drpL < drgMidX &&
          drpB > drgMidY &&
          drpR > drgMidX
        ) {
          //when I'm here, I know that I'm looking at an available dropbox
          if (dropbox.childNodes.length === 0) {
            const newTile = document.createElement("div");
            newTile.className = "dragbox";
            newTile.classList.add("dragging-cell");
            newTile.draggable = "true";
            newTile.innerHTML = currentTile.innerHTML;
            if (currentTile.id) newTile.id = currentTile.id;

            dropbox.appendChild(newTile);

            //snap back feature
            if (!lastDropbox) {
              lastDropbox = dropbox;
            } else {
              if (lastDropbox.lastElementChild) {
                lastDropbox.removeChild(lastDropbox.lastElementChild);
              }
              lastDropbox = dropbox;
            }
          }
        }

        const garbageItem = garbage.getBoundingClientRect();
        let grbT = garbageItem.top,
          grbL = garbageItem.left,
          grbB = garbageItem.bottom,
          grbR = garbageItem.right;
        //I know that user has dropped over the garbage bin
        if (
          grbT < drgT &&
          grbL < drgL &&
          grbB > drgB &&
          grbR > drgR &&
          currentTile.parentNode.className !== "dragbox-cont"
        ) {
          garbage.style.height = "200px";
          garbage.style.width = "200px";
        } else {
          garbage.style.height = "100px";
          garbage.style.width = "100px";
        }
      }
    }
  };

  const drop = () => {
    //I am dragging a draggable tile
    if (avail === "available") {
      //add the regular color back to the cell
      lastDropbox?.childNodes[0]?.classList.remove("dragging-cell");

      if (
        currentTile.parentNode.className === "dragbox-cont" ||
        currentTile.parentNode.className === "question-mark-container" ||
        (currentTile.parentNode.className === "dropbox" && !lastDropbox)
      ) {
        currentTile.style.position = "";
      } else {
        const parent = currentTile.parentNode;
        parent.removeChild(parent.lastElementChild);
      }

      currentTile.classList.remove("dragging-cell");

      //Add the build board button into the drag
      if (
        currentTile.id === "question-mark" &&
        dropboxes.some(
          (ele) => ele?.lastElementChild?.id === "question-mark"
        ) &&
        dragboxTopContainer.lastElementChild.className !== "generate-board"
      ) {
        const generateBoardButton = document.createElement("button");
        generateBoardButton.className = "generate-board";
        generateBoardButton.innerHTML = "GENERATE BOARD";
        generateBoardButton.addEventListener(
          "touchstart",
          () => {
            generateBoard();
            populateClueContainer(dropboxes, root);
          },
          {
            passive: false,
          }
        );
        dragboxTopContainer.appendChild(generateBoardButton);
      }

      const garbageItem = garbage.getBoundingClientRect();
      let grbT = garbageItem.top,
        grbL = garbageItem.left,
        grbB = garbageItem.bottom,
        grbR = garbageItem.right;
      //I know that user has dropped over the garbage bin
      if (
        grbT < drgT &&
        grbL < drgL &&
        grbB > drgB &&
        grbR > drgR &&
        currentTile?.parentNode?.className !== "dragbox-cont"
      ) {
        garbage.appendChild(currentTile);
        garbage.removeChild(garbage.lastElementChild);

        if (lastDropbox?.children.length) {
          lastDropbox.removeChild(lastDropbox.lastElementChild);
        }

        garbage.style.height = "100px";
        garbage.style.width = "100px";

        //check to see if all question marks removed to remove generate board button
        if (
          !dropboxes.some(
            (ele) => ele.firstElementChild?.id === "question-mark"
          ) &&
          dragboxTopContainer.lastElementChild.className === "generate-board"
        ) {
          dragboxTopContainer.removeChild(dragboxTopContainer.lastElementChild);
        }
      } else {
        lastDropbox = null;
      }

      //Update the clue container as the tiles are being placed
      populateClueContainer(dropboxes, root);
    }
  };
};
