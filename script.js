// document.addEventListener("DOMContentLoaded", () => {
const dropboxes = document.querySelectorAll("#dropbox");
const body = document.body;
// body.ontouchstart = dragStart(event);
// body.ontouchmove = drag(event);
// body.ontouchend = drop(event);

body.addEventListener("touchstart", (e) => dragStart(e), { passive: false });
body.addEventListener("touchmove", (e) => drag(e), { passive: false });
body.addEventListener("touchend", (e) => drop(e), { passive: false });

// console.log(body);

console.log("testing");

let drg, drgT, drgL, drgB, drgR;

let el, avail;

function dragStart(evt) {
  el = evt.target;

  // console.log(el);

  if (el.getAttribute("draggable") === "true") {
    avail = "available";
  } else {
    avail = "";
  }

  // console.log("drag started");
}

function drag(evt) {
  // console.log("dragging");

  if (avail === "available") {
    el.style.position = "absolute";
    el.style.left = `${evt.touches[0].clientX - el.clientWidth / 2}px`;
    el.style.top = `${evt.touches[0].clientY - el.clientHeight / 2}px`;
    // console.log(el.style.top);
    // console.log(el.clientHeight);
    // console.log(evt.touches[0].clientY - el.clientHeight / 2);

    drg = el.getBoundingClientRect();
    drgT = drg.top;
    drgB = drg.bottom;
    drgL = drg.left;
    drgR = drg.right;
  } else {
  }
  evt.preventDefault();
}

function drop() {
  // update on drop

  for (let dropbox of dropboxes) {
    let drp = dropbox.getBoundingClientRect();

    let drpT = drp.top,
      drpL = drp.left,
      drpB = drp.bottom,
      drpR = drp.right;

    if (avail === "available") {
      if (drpT < drgT && drpL < drgL && drpB > drgB && drpR > drgR) {
        //I should only be able to append a child if
        const tileCopy = el.cloneNode(true);
        const parentNode = el.parentNode;
        tileCopy.style.position = "";

        if (dropbox.childNodes.length === 0) {
          dropbox.appendChild(el);
        }

        if (
          parentNode.className === "dragbox-cont" &&
          parentNode.children.length === 0
        ) {
          parentNode.append(tileCopy);
        }

        el.style.position = "";
      }
    } else {
    }
  }
}

// this is where I want the code to live for the desktop drag and drop functionality
const dragboxes = document.querySelectorAll("#dragbox");
let currentBox;

for (let dragbox of dragboxes) {
  dragbox.addEventListener("dragstart", () => {
    dragbox.classList.add("dragging-cell");

    currentBox = dragbox;
  });

  dragbox.addEventListener("dragend", () => {
    dragbox.classList.remove("dragging-cell");
  });
}

for (let dropbox of dropboxes) {
  dropbox.addEventListener("dragover", (e) => {
    e.preventDefault();

    // console.log(currentBox);
    if (dropbox.childNodes.length === 0) {
      const newTile = document.createElement("div");
      newTile.id = "dragbox";
      newTile.draggable = "true";
      newTile.innerHTML = currentBox.innerHTML;

      newTile.addEventListener("dragstart", () => {
        newTile.classList.add("dragging-cell");

        currentBox = newTile;
      });

      newTile.addEventListener("dragend", () => {
        newTile.classList.remove("dragging-cell");
      });

      const parentNode = currentBox.parentNode;
      if (parentNode.className === "dragbox-cont") {
        parentNode.appendChild(newTile);
      }

      dropbox.appendChild(currentBox);
    }
  });
}
// });
