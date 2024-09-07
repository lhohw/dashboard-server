import { describe, it, expect } from "bun:test";
import { getPostPath } from "utils/path";

const { ASSET_PATH } = process.env;

describe.only("getPostPath", () => {
  it("uses test folder in test env", () => {
    const path = getPostPath();
    expect(path).toBe(`${ASSET_PATH}/test/markdowns`);
  });

  it("just return path string. No check file exist", () => {
    const path = getPostPath("a", "b", "c");
    expect(path).toBe(`${ASSET_PATH}/test/markdowns/a/b/c`);
  });
});
