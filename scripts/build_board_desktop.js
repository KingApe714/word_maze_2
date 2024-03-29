import { clearClueContainer, populateClueContainer } from "./clue_container.js";
import { generateBoard } from "./find_words.js";

export const desktopDragDrop = (root) => {
  const dragboxTopContainer = document.querySelector(".dragbox-top-container");
  const dropboxes = Array.from(document.querySelectorAll(".dropbox"));
  const dragboxes = document.querySelectorAll(".dragbox");
  const clearBoard = document.querySelector(".clear-board-button");
  const clueContainer = document.querySelector(".clue-container");
  const garbage = document.querySelector(".garbage-icon");
  let currentTile;

  clearBoard.addEventListener("mousedown", () => {
    clearClueContainer(dropboxes, clueContainer, dragboxTopContainer);
  });

  for (let dragbox of dragboxes) {
    dragbox.addEventListener("dragstart", () => {
      dragbox.classList.add("dragging-cell");

      currentTile = dragbox;
    });

    dragbox.addEventListener("dragend", () => {
      dragbox.classList.remove("dragging-cell");

      //Update the clue container as the tiles are being placed
      populateClueContainer(dropboxes, root);
    });
  }

  for (let dropbox of dropboxes) {
    dropbox.addEventListener("dragover", (e) => {
      e.preventDefault();

      if (dropbox.childNodes.length === 0) {
        const newTile = document.createElement("div");
        if (currentTile.id) newTile.id = currentTile.id;
        newTile.innerHTML = currentTile.innerHTML;
        newTile.className = "dragbox";
        newTile.draggable = "true";

        newTile.addEventListener("dragstart", () => {
          newTile.classList.add("dragging-cell");

          currentTile = newTile;
        });

        newTile.addEventListener("dragend", () => {
          newTile.classList.remove("dragging-cell");
        });

        const parentNode = currentTile.parentNode;
        if (parentNode.className === "dragbox-cont") {
          parentNode.appendChild(newTile);
        }

        dropbox.appendChild(currentTile);
      }
    });

    dropbox.addEventListener("drop", (e) => {
      //Add the build board button into the top container
      if (
        currentTile.id === "question-mark" &&
        dragboxTopContainer.lastElementChild.className !== "generate-board"
      ) {
        const generateBoardButton = document.createElement("button");
        generateBoardButton.className = "generate-board";
        generateBoardButton.innerHTML = "GENERATE BOARD";
        generateBoardButton.addEventListener(
          "mousedown",
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
    });
  }

  //logic for dragging over the trash bin
  const garbageWidth = garbage.style.width;

  garbage.addEventListener("dragover", (e) => {
    e.preventDefault();

    if (currentTile.parentNode.className === "dropbox") {
      console.log(garbage.style.width);
      garbage.style.width = "80px";
      garbage.style.height = "80px";
    }
  });

  garbage.addEventListener("drop", (e) => {
    e.preventDefault();

    if (currentTile.parentNode.className === "dropbox") {
      garbage.style.width = garbageWidth;
      garbage.style.height = garbageWidth;
      garbage.appendChild(currentTile);
      garbage.removeChild(garbage.lastElementChild);
    }

    //check to see if all question marks removed to remove generate board button
    if (
      !dropboxes.some((ele) => ele.firstElementChild?.id === "question-mark") &&
      dragboxTopContainer.lastElementChild.className === "generate-board"
    ) {
      dragboxTopContainer.removeChild(dragboxTopContainer.lastElementChild);
    }
  });
};
