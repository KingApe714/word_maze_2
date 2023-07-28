export const getDictionay = async () => {
  const response = await fetch("definitions.json");
  const data = await response.text();
  const dictionary = await JSON.parse(data);

  return dictionary;
};

export const findWords = (board, root) => {
  const foundWords = [];

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const chr = board[i][j];

      //make sure that root starts at the character that I'm passing in
      if (chr in root.children) {
        bfs(root.children[chr], board, i, j, foundWords);
      }
    }
  }

  return foundWords;
};

const dirs = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
];

const isInbounds = (board, i, j) => {
  return i >= 0 && i < 5 && j >= 0 && j < 5;
};

const bfs = (root, board, i, j, foundWords) => {
  const queue = [
    { coords: [i, j], trieNode: root, visited: new Set([`${i},${j}`]) },
  ];

  while (queue.length) {
    const { coords, trieNode, visited } = queue.shift();
    const [idx, jdx] = coords;

    if (trieNode.word) {
      foundWords.push(trieNode.word);
    }

    for (let dir of dirs) {
      const [dirI, dirJ] = dir;
      const [nextI, nextJ] = [dirI + idx, dirJ + jdx];
      const nextCoords = `${nextI},${nextJ}`;
      const char = board[nextI] ? board[nextI][nextJ] : null;
      const nextNode = trieNode.children[char];

      if (
        !isInbounds(board, nextI, nextJ) ||
        visited.has(nextCoords) ||
        !(char in trieNode.children)
      ) {
        continue;
      }

      //ensure that every node path has its own visited Set
      const nextVisited = new Set(visited);
      nextVisited.add(nextCoords);
      queue.push({
        coords: [nextI, nextJ],
        trieNode: nextNode,
        visited: nextVisited,
      });
    }
  }
};

function Node(val) {
  this.val = val;
  this.children = {};
  this.word = null;
}

export const buildTrie = (words) => {
  const root = new Node(null);

  for (let word of words) {
    let current = root;
    for (let chr of word) {
      if (chr in current.children) {
        current = current.children[chr];
      } else {
        const nextNode = new Node(chr);
        current.children[chr] = nextNode;
        current = nextNode;
      }
    }
    current.word = word;
  }

  return root;
};

export const generateBoard = () => {
  //I need to loop through the board and populate the board with random tiles
  //then run the find words algo on the newly create board
  const board = document.querySelector(".board");
  const randomTiles = Array.from(board.querySelectorAll("#question-mark"));

  for (let randomTile of randomTiles) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomCharacter =
      alphabet[Math.floor(Math.random() * alphabet.length)];
    randomTile.innerHTML = randomCharacter;
  }
};
