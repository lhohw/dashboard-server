import { describe, test, expect } from "bun:test";
import { base64SrcRegex, imgRegex } from "const/regex";
import {
  addClosingTag,
  inlineStyleToJSX,
  transformAllImage,
  srcToBase64,
  transformReference,
  transformLink,
} from "utils/markdown/transform";
import { toCamelCase } from "utils/string";

describe("serialize markdown", () => {
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

  describe("image transform", () => {
    test("srcToBase64", async () => {
      const text = `
      <div id="prototype-graph-partial">
        <img src="../../images/prototype-graph-partial.png" style="max-width: 600px;" alt="프로토타입 그래프 일부분" />
      </div>
      `;
      const transformed = await srcToBase64(text);
      const src = `src="${transformed}"`;
      const matched = src.match(base64SrcRegex);
      expect(matched).not.toBeNull();

      const [, ext] = matched!;
      expect(ext).toBe("png");
    });

    test("transformAllImage", async () => {
      const text = `
      <div>
        <img src="../../images/prototype-graph.png" style="display: flex;" />
      </div>
  
      markdown text
      ...
  
      <div>
        <img src="../../images/prototype-graph.png" style="display: flex;" />
      </div>
      `;

      const transformed = await transformAllImage(text);
      const globalRegex = new RegExp(base64SrcRegex, "g");
      const matched = [...transformed.matchAll(globalRegex)];

      expect(matched).toHaveLength(2);
    });

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

      test("in markdown", async () => {
        const img1 = `<img src="../../images/splitted-binary-data.png" style="display: flex;">`;
        expect(addClosingTag(img1)).toBe(
          `<img src="../../images/splitted-binary-data.png" style="display: flex;"/>`
        );

        const img2 = `<img src="../../images/splitted-binary-data.png" style="display: flex;" />`;
        expect(addClosingTag(img2)).toBe(
          `<img src="../../images/splitted-binary-data.png" style="display: flex;" />`
        );

        const text = `<div>
          ${img1}
        </div>
  
        markdown text
        ...
  
        <div>
          ${img2}
        </div>`;

        const transformed = await transformAllImage(text);
        const globalRegex = new RegExp(imgRegex, "g");

        const matched = transformed.match(globalRegex);
        expect(matched).toBeArray();
        expect(matched).toHaveLength(2);

        const allElementsHaveClosingTags = matched!.every((m) =>
          m.endsWith("/>")
        );
        expect(allElementsHaveClosingTags).toBeTrue();
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
});
