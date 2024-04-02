import { describe, test, expect } from "bun:test";
import {
  extractFrontmatter,
  inlineStyleToJSX,
  transformReference,
  toCamelCase,
  transformTable,
  transform,
} from "utils/markdown";

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

  describe("transform markdown table", () => {
    test(`
    |heading | heading | heading|
    |-| --- | ------ |
    |data | data | ---- data --- |
    | --- | --- | ------- |
    `, () => {
      const markdown = `
      |heading | heading | heading|
      |-| --- | ------ |
      |data | data | ---- data --- |
      | --- | --- | ------- |
      `;
      const table = transformTable(markdown);
      expect(table).toBe(
        "\n" +
          `
      <table>
        <thead>
          <tr>
            <th>heading </th>
            <th> heading </th>
            <th> heading</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>data </td>
            <td> data </td>
            <td> ---- data --- </td>
          </tr>
          <tr>
            <td> --- </td>
            <td> --- </td>
            <td> ------- </td>
          </tr>
        </tbody>
      </table>
      `
            .split(/\n\s*/)
            .join("") +
          "\n"
      );
    });

    test(`
    |heading | heading | heading|heading|
    |-| --- | ------ |-|
    | 1 | 2 | 3 | 4 |5|
    |1 | 2 | 3 | 4 |
    |1|2||4|
    `, () => {
      const markdown = `
      |heading | heading | heading|heading|
      |-| --- | ------ |-|
      | 1 | 2 | 3 | 4 |5|
      |1 | 2 | 3 | 4 |
      |1|2||4|
      `;
      const table = transformTable(markdown);
      expect(table).toBe(
        "\n" +
          `
        <table>
          <thead>
            <tr>
              <th>heading </th>
              <th> heading </th>
              <th> heading</th>
              <th>heading</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> 1 </td>
              <td> 2 </td>
              <td> 3 </td>
              <td> 4 </td>
            </tr>
            <tr>
              <td>1 </td>
              <td> 2 </td>
              <td> 3 </td>
              <td> 4 </td>
            </tr>
            <tr>
              <td>1</td>
              <td>2</td>
              <td></td>
              <td>4</td>
            </tr>
          </tbody>
        </table>
        `
            .split(/\n\s*/)
            .join("") +
          "\n"
      );
    });
  });
  describe("transform markdown", () => {
    test(`
    body
    ## 참조
    - https://ref.com
    - [ref](ref.com)
    <!--
    comment
    -->`, () => {
      const markdown =
        "body\n" +
        "## 참조\n" +
        "- https://ref.com\n" +
        "- [ref](ref.com)\n" +
        "<!--\n" +
        "comment\n" +
        "-->";
      const transformed = transform(markdown);
      expect(transformed).toBe(
        "body\n" +
          "## 참조\n" +
          "- [https://ref.com](https://ref.com)\n" +
          "- [ref](ref.com)\n"
      );
    });
  });
});
