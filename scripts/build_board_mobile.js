import { populateClueContainer } from "./clue_container.js";

export const mobileDragDrop = (root) => {
  const dropboxes = document.querySelectorAll("#dropbox");
  const body = document.body;

  body.addEventListener("touchstart", (e) => dragStart(e), { passive: false });
  body.addEventListener("touchmove", (e) => drag(e), { passive: false });
  body.addEventListener("touchend", (e) => drop(e), { passive: false });

  let drg, drgT, drgL, drgB, drgR;

  let currentTile, avail;

  let lastDropbox;

  //Logic for throwing out the current tile that I am holding onto
  const garbage = document.querySelector(".garbage-icon");
  const garbageItem = garbage.getBoundingClientRect();
  let grbT = garbageItem.top,
    grbL = garbageItem.left,
    grbB = garbageItem.bottom,
    grbR = garbageItem.right;

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

        //this if statement ensures that I am inside of one of the coordinates of one of the dropboxes
        if (drpT < drgT && drpL < drgL && drpB > drgB && drpR > drgR) {
          //when I'm here, I know that I'm looking at an available dropbox
          if (dropbox.childNodes.length === 0) {
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
              if (lastDropbox.lastElementChild) {
                lastDropbox.removeChild(lastDropbox.lastElementChild);
              }
              lastDropbox = dropbox;
            }
          }
        }

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
      if (lastDropbox && lastDropbox.childNodes[0]) {
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

        console.log(lastDropbox);

        if (lastDropbox?.children.length) {
          lastDropbox.removeChild(lastDropbox.lastElementChild);
        }

        garbage.style.height = "100px";
        garbage.style.width = "100px";
      } else {
        lastDropbox = null;
      }

      //Update the clue container as the tiles are being placed
      populateClueContainer(dropboxes, root);
    }
  };
};
