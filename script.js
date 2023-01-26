document.addEventListener('DOMContentLoaded', () => {
    
    
    const gridCells = document.querySelectorAll('.grid-cell');
    const randomTile = document.querySelector('.random-tile-outer-container');

    randomTile.addEventListener('dragstart', () => {
        randomTile.classList.add('dragging-random-cell');
    });

    randomTile.addEventListener('dragend', () => {
        randomTile.classList.remove('dragging-random-cell');
    });

    gridCells.forEach((gridCell, idx) => {
        gridCell.addEventListener('dragstart', () => {
            gridCell.classList.add('dragging-cell');

            console.log(`dragging cell ${idx}`)
        });

        gridCell.addEventListener('dragend', () => {
            gridCell.classList.remove('dragging-cell');
        });
    })
})