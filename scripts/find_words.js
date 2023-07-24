export const getDictionay = async () => {
  const response = await fetch("definitions.json");
  const data = await response.text();
  const dictionary = await JSON.parse(data);

  return dictionary;
};

export const findWords = async (board, root) => {
  const foundWords = new Set();

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const chr = board[i][j];

      if (chr in root.children) {
        dfs(root, board, i, j, foundWords);
      }
    }
  }

  return Array.from(foundWords);
};

const dfs = (root, board, i, j, foundWords) => {
  if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) return;

  const chr = board[i][j];
  if (!(chr in root.children)) return;

  root = root.children[chr];
  board[i][j] = "*";

  if (root.word) foundWords.add(root.word);

  // horizontal and vertical traversal
  dfs(root, board, i + 1, j, foundWords);
  dfs(root, board, i - 1, j, foundWords);
  dfs(root, board, i, j + 1, foundWords);
  dfs(root, board, i, j - 1, foundWords);

  // diagonal traversal
  dfs(root, board, i + 1, j + 1, foundWords);
  dfs(root, board, i + 1, j - 1, foundWords);
  dfs(root, board, i - 1, j + 1, foundWords);
  dfs(root, board, i - 1, j - 1, foundWords);

  board[i][j] = chr;
  return;
};

export const buildTrie = async (words) => {
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

function Node(val) {
  this.val = val;
  this.children = {};
  this.word = null;
}

export default findWords;
