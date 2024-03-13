import { handleIO } from "io";
import markdownCompress, { printTransformed } from "markdownCompress";

const run = () => {
  handleIO(markdownCompress, printTransformed);
};

run();
