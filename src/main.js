import { mobileDragDrop } from "../scripts/build_board_mobile.js";
import { desktopDragDrop } from "../scripts/build_board_desktop.js";
import { getDictionay, buildTrie } from "../scripts/find_words.js";

const game = async () => {
  const dictionary = await getDictionay();
  const words = Object.keys(dictionary).filter((word) => word.length >= 3);
  const root = await buildTrie(words);

  mobileDragDrop(root);
  desktopDragDrop(root);
};

game();
