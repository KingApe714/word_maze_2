document.addEventListener('DOMContentLoaded', () => {
    
    
    const gridCells = document.querySelectorAll('.grid-cell');
    const randomTile = document.querySelector('.random-tile');
    const tileSideBarContainer = document.querySelector('.tile-side-bar-container');

    const mutationObserver = new MutationObserver(entries => {
        if (entries[0].removedNodes.length) {
            const newRandomTile = document.createElement('div');
            newRandomTile.className = 'random-tile';
            newRandomTile.draggable = 'true';
            newRandomTile.innerHTML = '?';

            newRandomTile.addEventListener('dragstart', () => {
                newRandomTile.classList.add('dragging-random-cell');
            })

            newRandomTile.addEventListener('dragend', () => {
                newRandomTile.classList.remove('dragging-random-cell');
            })

            tileSideBarContainer.appendChild(newRandomTile)
        }
    })

    mutationObserver.observe(tileSideBarContainer, { childList: true })

    randomTile.addEventListener('dragstart', () => {
        randomTile.classList.add('dragging-random-cell');
    });

    randomTile.addEventListener('dragend', () => {
        randomTile.classList.remove('dragging-random-cell');
    });

    gridCells.forEach(gridCell => {
        gridCell.addEventListener('dragover', e => {
            e.preventDefault();

            const draggable = document.querySelector('.dragging-random-cell');
            gridCell.appendChild(draggable)
        });
    })
})