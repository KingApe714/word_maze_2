document.addEventListener('DOMContentLoaded', () => {
    
    
    const gridCells = document.querySelectorAll('.grid-cell');
    const randomTile = document.querySelector('.random-tile');
    const tileSideBarContainer = document.querySelector('.tile-side-bar-container');

    //here is the logic for placing the tiles into the board and regenerating into the side bar
    const mutationObserver = new MutationObserver(entries => {
        console.log(entries)

        if (entries[0].removedNodes.length) {
            const newRandomTile = document.createElement('div');
            newRandomTile.className = 'random-tile';
            newRandomTile.draggable = 'true';
            newRandomTile.innerHTML = '?';

            newRandomTile.addEventListener('dragstart', () => {
                newRandomTile.classList.add('dragging-random-cell');
            });

            newRandomTile.addEventListener('dragend', () => {
                newRandomTile.classList.remove('dragging-random-cell');
            });

            newRandomTile.addEventListener('touchstart', () => {
                newRandomTile.classList.add('dragging-random-cell');
            });

            newRandomTile.addEventListener('touchend', () => {
                newRandomTile.classList.remove('dragging-random-cell');
            });

            tileSideBarContainer.appendChild(newRandomTile)
        }
    })

    mutationObserver.observe(tileSideBarContainer, { childList: true });

    randomTile.addEventListener('dragstart', () => {
        randomTile.classList.add('dragging-random-cell');
    });

    randomTile.addEventListener('dragend', () => {
        randomTile.classList.remove('dragging-random-cell');
    });

    randomTile.addEventListener('touchstart', () => {
        randomTile.classList.add('dragging-random-cell');
    });

    randomTile.addEventListener('touchend', () => {
        randomTile.classList.remove('dragging-random-cell');
    });

    randomTile.addEventListener('touchmove', e => {
        // e.preventDefault();
        let touchLocation = e.targetTouches[0];

        // console.log(touchLocation)

        randomTile.style.left = touchLocation.screenX + 'px';
        randomTile.style.top = touchLocation.screenY + 'px';
    })

    gridCells.forEach((gridCell, idx) => {
        gridCell.addEventListener('touchmove', e => {
            e.preventDefault();

            console.log(`moving over me ${idx}`)
        });
        gridCell.addEventListener('touchend', e => {
            e.preventDefault();

            console.log(`ended touch here ${idx}`)

            const draggable = document.querySelector('.dragging-random-cell');
            if (gridCell.childNodes.length === 0) {
                gridCell.appendChild(draggable)
            }
        })
        gridCell.addEventListener('dragover', e => {
            e.preventDefault();

            const draggable = document.querySelector('.dragging-random-cell');
            if (gridCell.childNodes.length === 0) {
                gridCell.appendChild(draggable)
            }
        });
    });
});