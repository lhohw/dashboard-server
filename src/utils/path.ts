import path from "path";

const markdownPath = path.join(Bun.main, "../../markdown/");
const assetPath = path.join(Bun.main, "../assets/");

export type PathTargets = "markdown" | "assets";
export const getPath = (target: PathTargets, filename?: string) => {
  if (target === "markdown") return markdownPath + (filename || "");
  else if (target === "assets") return assetPath + (filename || "");
  throw new Error(`${target} is invalid`);
};
