import { describe, test, expect } from "bun:test";
import { base64SrcRegex, imgPropsRegexSource } from "const/regex";
import { extractFrontmatter } from "utils/markdown/extract";
import {
  addClosingTag,
  inlineStyleToJSX,
  transformAllImage,
  srcToBase64,
  transformReference,
} from "utils/markdown/transform";
import { toCamelCase } from "utils/string";

describe("serialize markdown", () => {
  describe("extract frontmatter", () => {
    test(`---
    title: title
    slug: s-l-u-g
    ---`, () => {
      const text = `---
      title: title
      slug: s-l-u-g
      ---`;
      const frontmatter = extractFrontmatter(text);
      expect(frontmatter).toEqual({ title: "title", slug: "s-l-u-g" });
    });
    test(`---
    item1: !@#%
    item2: ---
    ---`, () => {
      const text = `---
      item1: !@#%
      item2: ---
      ---`;
      const frontmatter = extractFrontmatter(text);
      expect(frontmatter).toEqual({ item1: "!@#%", item2: "---" });
    });
    test(`---
    한글_키: 한글_값
    ---`, () => {
      const text = `---
      한글_키: 한글_값
      ---`;
      const frontmatter = extractFrontmatter(text);
      expect(frontmatter).toEqual({ 한글_키: "한글_값" });
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
      const markdown = `style="color: #fafafa;"`;
      const replaced = inlineStyleToJSX(markdown);
      expect(replaced).toMatch(/style={{ color: '#fafafa', }}/);
    });
    test(`style="flex: 1;"`, () => {
      const markdown = `style="flex: 1;"`;
      const replaced = inlineStyleToJSX(markdown);
      expect(replaced).toMatch(/style={{ flex: 1, }}/);
    });
    test(`style="flex: 1; color: #fafafa;"`, () => {
      const markdown = `style="flex: 1; color: #fafafa;"`;
      const replaced = inlineStyleToJSX(markdown);
      expect(replaced).toMatch(/style={{ flex: 1, color: '#fafafa', }}/);
    });
    test(`style="flex: 1; flex-direction:row; align-items: center;"`, () => {
      const markdown = `style="flex: 1; flex-direction:row; align-items: center;"`;
      const replaced = inlineStyleToJSX(markdown);
      expect(replaced).toMatch(
        /style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}/
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
    test("prototype-graph.png", async () => {
      const text = `<div id="prototype-graph-partial">
        <img src="../../images/prototype-graph-partial.png" style="max-width: 600px;" alt="프로토타입 그래프 일부분" />
      </div>`;
      const transformed = await srcToBase64(text);
      expect(`src="${transformed}"`).toMatch(base64SrcRegex);
    });
    test("prototype-graph-partial.png", async () => {
      const text = `<div id="prototype-graph">
      <img src="../../images/prototype-graph.png" alt="프로토타입 그래프" />
      </div>`;
      const transformed = await srcToBase64(text);
      expect(`src="${transformed}"`).toMatch(base64SrcRegex);
    });
    test("img with style", async () => {
      const text = `<div>
        <img src="../../images/prototype-graph.png" style="display: flex;" />
      </div>
  
      markdown text
      ...
  
      <div>
        <img src="../../images/prototype-graph.png" style="display: flex;" />
      </div>`;

      const transformed = await transformAllImage(text);
      expect(transformed.match(new RegExp(base64SrcRegex, "mg"))).toHaveLength(
        2
      );
    });
    test("add closing tag", async () => {
      const text = `<div>
        <img src="../../images/splitted-binary-data.png" style="display: flex;"/>
      </div>
  
      markdown text
      ...
  
      <div>
        <img src="../../images/third-party-cookie.png" style="display: flex;"/>
      </div>`;

      const transformed = await transformAllImage(text);
      const imgsRegex = new RegExp(
        `\\s*<img(${imgPropsRegexSource}| ${base64SrcRegex.source})+\\s*/?>$`,
        "mg"
      );

      const matched = transformed.match(imgsRegex);
      expect(matched).toBeTruthy();
      expect(matched).toHaveLength(2);
      expect(matched?.every((m) => m.endsWith("/>"))).toBeTrue();
    });
  });

  describe("ends with />", () => {
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
});
