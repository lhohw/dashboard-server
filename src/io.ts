import { createInterface } from "readline";

export const handleIO = (cb: (input: string) => void, closeCb?: () => void) => {
  console.log(`input filename: ___(.md)`);
  createInterface({
    input: process.stdin,
    output: process.stdout,
  })
    .on("line", cb)
    .on("close", () => {
      close(closeCb);
    });
};

const close = (closeCb?: () => void) => {
  closeCb?.();
  process.exit();
};
