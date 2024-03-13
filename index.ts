import { handleIO } from "io";
import markdownCompress, { printTransformed } from "markdownCompress";
import readAsset from "readAsset";

type RunType = "compress" | "read";
const run = () => {
  const type = (process.env?.TYPE || "compress") as RunType;
  if (type === "compress") handleIO(markdownCompress, printTransformed);
  else if (type === "read") handleIO(readAsset);
  else
    throw new Error(
      `type must be one of compress | read\nreceived type: ${type}`
    );
};

run();
