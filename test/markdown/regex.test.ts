import { describe, test, expect } from "bun:test";
import {
  inlineStyleRegex,
  markdownSerializerRegex,
  referenceRowRegex,
} from "const/regex";

/**
 * use markdownSerializerRegex that is union of
 * styleRegex | commentRegex | referenceRegex for performance reason
 */
describe("match comment", () => {
  test(`<!-- 한국말 코멘트 -->`, () => {
    const comment = `<!-- 한국말 코멘트 -->`;
    expect(comment.match(markdownSerializerRegex)).not.toBeNull();
  });
  test(`<!-- english comment -->`, () => {
    const comment = `<!--- english comment --->`;
    expect(comment.match(markdownSerializerRegex)).not.toBeNull();
  });
  test(`<!-- function in comment
  \`\`\`ts
  function () {}
  console.log();
  \`\`\`
  -->`, () => {
    const comment = `<!--
    function in comment
    \`\`\`ts
    function () {}
    console.log();
    \`\`\`
    -->`;
    expect(comment.match(markdownSerializerRegex)).not.toBeNull();
  });
  test(`<!-- 특수 문자 코멘트
    !@#$%^&*()_+-=[]\\|;':",./<>?
  -->`, () => {
    const comment = `<!-- 특수 문자 코멘트
    !@#$%^&*()_+-=[]\\|;':",./<>?
    -->`;
    expect(comment.match(markdownSerializerRegex)).not.toBeNull();
  });
});

describe("match style", () => {
  test(`<span style="color: #fabfdd88;"></span>`, () => {
    const markdown = `<span style="color: #fabfdd88;"></span>`;
    expect(markdown.match(markdownSerializerRegex)).not.toBeNull();
    expect(markdown.match(inlineStyleRegex)).not.toBeNull();
  });
  test(`<div style="flex: 1;"></div>`, () => {
    const markdown = `<div style="flex: 1;"></div>`;
    expect(markdown.match(markdownSerializerRegex)).not.toBeNull();
    expect(markdown.match(inlineStyleRegex)).not.toBeNull();
  });
  test(`<div style="-webkit-animation-delay: 2s;"></div>`, () => {
    const markdown = `<div style="-webkit-animation-delay: 2s";></div>`;
    expect(markdown.match(markdownSerializerRegex)).not.toBeNull();
    expect(markdown.match(inlineStyleRegex)).not.toBeNull();
  });
});

describe("match reference", () => {
  test(`
  ## 참고
  - https://!@#$%^&*()_=-+;'[]{},./?><'\\|1234
  - [링크](https://...)
  `, () => {
    const markdown = `
    ## 참고
    - https://!@#$%^&*()_=-+;'[]{},./?><'\\|1234
    - [링크](https://...)
    - ----
    `;
    expect(markdown.match(markdownSerializerRegex)).not.toBeNull();
    expect(markdown.match(referenceRowRegex)).not.toBeNull();
  });
  test(`
  ## 참고
  - https://262.ecma-international.org/14.0/?_gl=1*1szfzq*_ga*MjEyNDk2MTYwNy4xNzA2MzE5ODM2*_ga_TDCK4DWEPP*MTcwNjkzMzgyNC4xMC4xLjE3MDY5MzM5MjcuMC4wLjA.&_ga=2.190502702.48397567.1706933825-2124961607.1706319836#sec-object.prototype.__proto__
  `, () => {
    const markdown = `
    ## 참고
    - https://262.ecma-international.org/14.0/?_gl=1*1szfzq*_ga*MjEyNDk2MTYwNy4xNzA2MzE5ODM2*_ga_TDCK4DWEPP*MTcwNjkzMzgyNC4xMC4xLjE3MDY5MzM5MjcuMC4wLjA.&_ga=2.190502702.48397567.1706933825-2124961607.1706319836#sec-object.prototype.__proto__
    `;
    expect(markdown.match(markdownSerializerRegex)).not.toBeNull();
    expect(markdown.match(referenceRowRegex)).not.toBeNull();
  });
});
