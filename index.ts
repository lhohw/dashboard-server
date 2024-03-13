import { handleIO } from "io";
import compressMarkdown, { printTransformed } from "compressMarkdown";
import readAsset from "readAsset";

type RunType = "compress" | "read";
const run = () => {
  const type = (process.env?.TYPE || "compress") as RunType;
  if (type === "compress") handleIO(compressMarkdown, printTransformed);
  else if (type === "read") handleIO(readAsset);
  else
    throw new Error(
      `type must be one of compress | read\nreceived type: ${type}`
    );
};

run();
