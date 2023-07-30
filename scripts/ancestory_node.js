export function AncestoryNode(val, i, j, dropbox) {
  this.val = val;
  this.i = i;
  this.j = j;
  this.dropbox = dropbox;
  this.children = {};
  this.complete = false;
  this.found = false;
  this.word = null;
  this.definition = null;
  this.wordContainer = null;
}

//I believe that the logic here is flawed in that it should check to see if the child already exists
export const ancestoryPath = (board, visited, word) => {
  const path = Array.from(visited);
  const [rootI, rootJ] = path[0].split(",");
  let currentAncestor = board[rootI][rootJ];

  for (let idx = 1; idx < path.length; idx++) {
    const coords = path[idx];
    const [ancI, ancJ] = coords.split(",").map((ele) => Number(ele));
    const val = board[ancI][ancJ].val;
    const nextDropbox = board[ancI][ancJ].dropbox;
    const nextAncestor = new AncestoryNode(val, ancI, ancJ, nextDropbox);

    currentAncestor.children[coords] = nextAncestor;
    currentAncestor = nextAncestor;
  }
};
