import { describe, test, it, expect } from "bun:test";
import {
  addClosingTag,
  inlineStyleToJSX,
  transformAllImage,
  transformReference,
  transformLink,
  replaceSrcToBase64,
} from "utils/markdown/transform";
import { fetchMarkdown } from "utils/io";
import { toCamelCase } from "utils/string";
import { base64SrcRegex, imgRegex } from "const/regex";

describe("fetch markdown", () => {
  it("gets markdown correctly", async () => {
    const markdown = await fetchMarkdown("category", "default-post");
    expect(markdown).toBe("test");
  });

  it("gets markdown correctly when use file name directly", async () => {
    const markdown = await fetchMarkdown("category", "default-post/index.md");
    expect(markdown).toBe("test");
  });

  it("throws error if file not exist", () => {
    expect(() => fetchMarkdown("category", "invalid-file-path")).toThrow(
      "ENOENT: No such file or directory"
    );
  });
});

describe("inline style toCamelCase", () => {
  test("color", () => {
    const text = "color";
    const camelCase = toCamelCase(text);
    expect(camelCase).toBe("color");
  });

  test("flex-direction", () => {
    const text = "flex-direction";
    const camelCase = toCamelCase(text);
    expect(camelCase).toBe("flexDirection");
  });

  test("-webkit-animation-delay", () => {
    const text = "-webkit-animation-delay";
    const camelCase = toCamelCase(text);
    expect(camelCase).toBe("WebkitAnimationDelay");
  });
});

describe("inline style to JSX", () => {
  test(`style="color: #fafafa;"`, () => {
    const style = `style="color: #fafafa;"`;
    const replaced = inlineStyleToJSX(style);
    expect(replaced).toMatch(/style={{ color: ['"]#fafafa['"], }}/);
  });

  test(`style="flex: 1;"`, () => {
    const style = `style="flex: 1;"`;
    const replaced = inlineStyleToJSX(style);
    expect(replaced).toMatch(/style={{ flex: 1, }}/);
  });

  test(`style="flex: 1; color: #fafafa;"`, () => {
    const style = `style="flex: 1; color: #fafafa;"`;
    const replaced = inlineStyleToJSX(style);
    expect(replaced).toMatch(/style={{ flex: 1, color: ['"]#fafafa['"], }}/);
  });

  test(`style="flex: 1; flex-direction:row; align-items: center;"`, () => {
    const style = `style="flex: 1; flex-direction:row; align-items: center;"`;
    const replaced = inlineStyleToJSX(style);
    expect(replaced).toMatch(
      /style={{ flex: 1, flexDirection: ['"]row['"], alignItems: ['"]center['"], }}/
    );
  });

  test(`style="-webkit-animation-delay: 2s; background: hsla(128, 30%, 72%, 0.12);"`, () => {
    const style = `style="-webkit-animation-delay: 2s; background: hsla(128, 30%, 72%, 0.12);"`;
    const replaced = inlineStyleToJSX(style);
    expect(replaced).toMatch(
      /style={{ WebkitAnimationDelay: ['"]2s['"], background: ['"]hsla\(128, 30%, 72%, 0.12\)['"], }}/
    );
  });
});

describe("transform reference", () => {
  test(`
  ## 참조
  - https://262.ecma-international.org/14.0/?_gl=1*1szfzq*_ga*MjEyNDk2MTYwNy4xNzA2MzE5ODM2*_ga_TDCK4DWEPP*MTcwNjkzMzgyNC4xMC4xLjE3MDY5MzM5MjcuMC4wLjA.&_ga=2.190502702.48397567.1706933825-2124961607.1706319836#sec-object.prototype.__proto__
  - [링크](https://...)
  `, () => {
    const references = `
    ## 참조
    - https://262.ecma-international.org/14.0/?_gl=1*1szfzq*_ga*MjEyNDk2MTYwNy4xNzA2MzE5ODM2*_ga_TDCK4DWEPP*MTcwNjkzMzgyNC4xMC4xLjE3MDY5MzM5MjcuMC4wLjA.&_ga=2.190502702.48397567.1706933825-2124961607.1706319836#sec-object.prototype.__proto__
    - [링크](https://...)
    `;
    const transformed = transformReference(references);
    expect(transformed).toBe(
      "## 참조\n" +
        "- [https://262.ecma-international.org/14.0/?_gl=1*1szfzq*_ga*MjEyNDk2MTYwNy4xNzA2MzE5ODM2*_ga_TDCK4DWEPP*MTcwNjkzMzgyNC4xMC4xLjE3MDY5MzM5MjcuMC4wLjA.&_ga=2.190502702.48397567.1706933825-2124961607.1706319836#sec-object.prototype.__proto__](https://262.ecma-international.org/14.0/?_gl=1*1szfzq*_ga*MjEyNDk2MTYwNy4xNzA2MzE5ODM2*_ga_TDCK4DWEPP*MTcwNjkzMzgyNC4xMC4xLjE3MDY5MzM5MjcuMC4wLjA.&_ga=2.190502702.48397567.1706933825-2124961607.1706319836#sec-object.prototype.__proto__)\n" +
        "- [링크](https://...)"
    );
  });
  test(`
  ## 참조
  - [ref](https://ref.com)
  - https://ref.com`, () => {
    const markdown = `
    ## 참조
    - [ref](https://ref.com)
    - https://ref.com`;
    const transformed = transformReference(markdown);
    expect(transformed).toBe(
      "## 참조\n" +
        "- [ref](https://ref.com)\n" +
        "- [https://ref.com](https://ref.com)"
    );
  });
});

describe.only("transform images", async () => {
  const markdown = await fetchMarkdown("category", "with-image");

  describe("addClosingTag", () => {
    test(`<img src="">`, () => {
      const text = `<img src="">`;
      const actual = addClosingTag(text);
      expect(actual).toBe(`<img src=""/>`);
    });

    test(`<img src="" >`, () => {
      const text = `<img src="" >`;
      const actual = addClosingTag(text);
      expect(actual).toBe(`<img src="" />`);
    });

    test(`<img src=""`, () => {
      const text = `<img src=""`;
      const actual = addClosingTag(text);
      expect(actual).toBe(`<img src=""/>`);
    });

    test(`<img src="" />`, () => {
      const text = `<img src="" />`;
      const actual = addClosingTag(text);
      expect(actual).toBe(`<img src="" />`);
    });
  });

  describe("replaceSrcToBase64", async () => {
    it(`returns <img src="[base64 src]" />`, async () => {
      const globalImgRegex = new RegExp(imgRegex, "mg");
      const matched = globalImgRegex.exec(markdown)!;
      const imgStr = matched[0];
      const changed = await replaceSrcToBase64(
        imgStr,
        "category",
        "with-image"
      );
      expect(changed).toBeString();
      expect(base64SrcRegex.exec(changed)).not.toBeNull();
    });
  });

  describe("transform all images", () => {
    test("images are independent to sources", async () => {
      const changed = await transformAllImage(
        markdown,
        "category",
        "with-image"
      );
      expect(changed).toBeString();

      const globalBase64SrcRegex = new RegExp(base64SrcRegex, "mg");
      const matched = [...changed.matchAll(globalBase64SrcRegex)];
      expect(matched).toHaveLength(2);
    });
  });
});

describe("transform links", () => {
  test("[글](../performance/RAIL-MODEL.md#response)", () => {
    const category = "JavaScript";
    const link = `[글](../performance/RAIL-MODEL.md#response)`;
    const actual = transformLink(link, category);
    const expected =
      "[글](/post?category=performance&slug=RAIL-MODEL#response)";
    expect(actual).toBe(expected);
  });

  test("[글](./RAIL-MODEL.md#response)", () => {
    const category = "performance";
    const link = `[글](./RAIL-MODEL.md#response)`;
    const actual = transformLink(link, category);
    const expected = `[글](/post?category=performance&slug=RAIL-MODEL#response)`;
    expect(actual).toBe(expected);
  });

  test("[글](https://)", () => {
    const category = "performance";
    const link = `[글](https://)`;
    const actual = transformLink(link, category);
    const expected = "[글](https://)";
    expect(actual).toBe(expected);
  });
});
