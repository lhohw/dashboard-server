import { describe, test, expect } from "bun:test";
import { inlineStyleRegex, markdownSerializerRegex } from "const/regex";

/**
 * use markdownSerializerRegex that is union of
 * styleRegex | commentRegex for performance reason
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
