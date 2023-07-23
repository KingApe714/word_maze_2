export const desktopDragDrop = () => {
  const dropboxes = document.querySelectorAll("#dropbox");
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
};
