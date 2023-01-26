document.addEventListener('DOMContentLoaded', () => {
    
    
    const gridCells = document.querySelectorAll('.grid-cell');
    const randomTile = document.querySelector('.random-tile-outer-container');
    const tileSideBarContainer = document.querySelector('.tile-side-bar-container');

    randomTile.addEventListener('dragstart', () => {
        randomTile.classList.add('dragging-random-cell');
    });

    randomTile.addEventListener('dragend', () => {
        randomTile.classList.remove('dragging-random-cell');

        const newRandomTile = randomTile.cloneNode('deep');
        newRandomTile.addEventListener('dragstart', () => {
            newRandomTile.classList.add('dragging-random-cell');
        });
        newRandomTile.addEventListener('dragend', () => {
            newRandomTile.classList.remove('dragging-random-cell');
        })
        tileSideBarContainer.appendChild(newRandomTile);
    });

    gridCells.forEach((gridCell, idx) => {
        console.log(gridCell.children.length);
        gridCell.addEventListener('dragstart', () => {
            gridCell.classList.add('dragging-cell');

            console.log(`dragging cell ${idx}`)
        });

        gridCell.addEventListener('dragend', () => {
            gridCell.classList.remove('dragging-cell');

            console.log('drag end')
        });

        gridCell.addEventListener('dragover', e => {
            e.preventDefault();

            const draggable = document.querySelector('.dragging-random-cell');

            // console.log(draggable)

            gridCell.appendChild(draggable)
            // const draggableClone = draggable.cloneNode('deep')
            // if (gridCell.children.length === 0) {
            //     gridCell.appendChild(draggableClone);
            // }
        });
    })
})