import type { Mode } from "const/mode";
import Argv from "class/Argv";
import _path from "path";

const argv = Argv.init();

const { ASSET_PATH, NODE_ENV } = process.env;

const mode: Mode =
  (argv.get("mode") as Mode) || (NODE_ENV === "test" ? "test" : "draft");
const markdownPath = `${ASSET_PATH}/${mode}/markdowns`;

export const getPostPath = (...path: string[]) => {
  return _path.join(markdownPath, ...(path || []));
};
