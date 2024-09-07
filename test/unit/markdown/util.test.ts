import { describe, it, expect } from "bun:test";
import { getMarkdown } from "utils/io";
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

describe.only("getMarkdown", () => {
  it("gets markdown correctly", async () => {
    const markdown = await getMarkdown("category", "default-post");
    expect(markdown).toBe("test");
  });

  it("gets markdown correctly when use file name directly", async () => {
    const markdown = await getMarkdown("category", "default-post/index.md");
    expect(markdown).toBe("test");
  });

  it("throws error if file not exist", () => {
    expect(() => getMarkdown("category", "invalid-file-path")).toThrow(
      "ENOENT: No such file or directory"
    );
  });
});
