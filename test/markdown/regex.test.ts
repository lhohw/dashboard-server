import { describe, test, expect } from "bun:test";
import {
  commentRegex,
  inlineStyleRegex,
  referenceRegex,
  styleRegex,
  tableRegex,
} from "const/regex";

describe("match comment", () => {
  test(`<!-- 한국말 코멘트 -->`, () => {
    const comment = `<!-- 한국말 코멘트 -->`;
    const matched = comment.match(commentRegex)?.[0];
    expect(matched).toBe(comment);
  });
  test(`<!-- english comment -->`, () => {
    const comment = `<!--- english comment --->`;
    const matched = comment.match(commentRegex)?.[0];
    expect(matched).toBe(comment);
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
    const matched = comment.match(commentRegex)?.[0];
    expect(matched).toBe(comment);
  });
  test(`<!-- 특수 문자 코멘트
  !@#$%^&*()_+-=[]\\|;':",./<>?
  -->`, () => {
    const comment = `<!-- 특수 문자 코멘트
    !@#$%^&*()_+-=[]\\|;':",./<>?
    -->`;
    const matched = comment.match(commentRegex)?.[0];
    expect(matched).toBe(comment);
  });
});

describe("match style", () => {
  test(`<span style="color: #fabfdd88;"></span>`, () => {
    const markdown = `<span style="color: #fabfdd88;"></span>`;
    const matched = markdown.match(styleRegex)?.[0];
    expect(matched).toBe(`style="color: #fabfdd88;"`);

    const inlineMatched = markdown.match(inlineStyleRegex)?.[0];
    expect(inlineMatched).toBe(`"color: #fabfdd88;"`);
  });
  test(`<div style="flex: 1;"></div>`, () => {
    const markdown = `<div style="flex: 1;"></div>`;
    const matched = markdown.match(styleRegex)?.[0];
    expect(matched).toBe(`style="flex: 1;"`);

    const inlineMatched = markdown.match(inlineStyleRegex)?.[0];
    expect(inlineMatched).toBe(`"flex: 1;"`);
  });
  test(`<div style="-webkit-animation-delay: 2s;"></div>`, () => {
    const markdown = `<div style="-webkit-animation-delay: 2s;"></div>`;
    const matched = markdown.match(styleRegex)?.[0];
    expect(matched).toBe(`style="-webkit-animation-delay: 2s;"`);

    const inlineMatched = markdown.match(inlineStyleRegex)?.[0];
    expect(inlineMatched).toBe(`"-webkit-animation-delay: 2s;"`);
  });
});

describe("match reference", () => {
  test(`
  ## 참조
  - https://!@#$%^&*()_=-+;'[]{},./?><'\\|1234
  - [링크](https://...)
  - ----
  `, () => {
    const markdown = `
    ## 참조
    - https://!@#$%^&*()_=-+;'[]{},./?><'\\|1234
    - [링크](https://...)
    - ----
    `;
    const matched = markdown.match(referenceRegex)?.[0];
    expect(matched).toBe(markdown.trimStart());
  });
  test(`
  ## 참조
  - https://262.ecma-international.org/14.0/?_gl=1*1szfzq*_ga*MjEyNDk2MTYwNy4xNzA2MzE5ODM2*_ga_TDCK4DWEPP*MTcwNjkzMzgyNC4xMC4xLjE3MDY5MzM5MjcuMC4wLjA.&_ga=2.190502702.48397567.1706933825-2124961607.1706319836#sec-object.prototype.__proto__
  `, () => {
    const markdown = `
    ## 참조
    - https://262.ecma-international.org/14.0/?_gl=1*1szfzq*_ga*MjEyNDk2MTYwNy4xNzA2MzE5ODM2*_ga_TDCK4DWEPP*MTcwNjkzMzgyNC4xMC4xLjE3MDY5MzM5MjcuMC4wLjA.&_ga=2.190502702.48397567.1706933825-2124961607.1706319836#sec-object.prototype.__proto__
    `;
    const matched = markdown.match(referenceRegex)?.[0];
    expect(matched).toBe(markdown.trimStart());
  });
  test(`
  ## 참조
  - https://262.ecma-international.org/14.0/?_gl=1*1szfzq*_ga*MjEyNDk2MTYwNy4xNzA2MzE5ODM2*_ga_TDCK4DWEPP*MTcwNjkzMzgyNC4xMC4xLjE3MDY5MzM5MjcuMC4wLjA.&_ga=2.190502702.48397567.1706933825-2124961607.1706319836#sec-object.prototype.__proto__
  `, () => {
    const markdown = `
    ## 참조
    - https://262.ecma-international.org/14.0/?_gl=1*1szfzq*_ga*MjEyNDk2MTYwNy4xNzA2MzE5ODM2*_ga_TDCK4DWEPP*MTcwNjkzMzgyNC4xMC4xLjE3MDY5MzM5MjcuMC4wLjA.&_ga=2.190502702.48397567.1706933825-2124961607.1706319836#sec-object.prototype.__proto__
    `;
    const matched = markdown.match(referenceRegex)?.[0];
    expect(matched).toBe(markdown.trimStart());
  });
  test(`
  body

  ## 참조
  - https://...

  <!--
  comment
  -->`, () => {
    const markdown = `
    body

    ## 참조
    - https://...

    <!--
    comment
    -->`;
    const matched = markdown.match(referenceRegex)?.[0];
    expect(matched).toBe(
      `## 참조
    - https://...\n`
    );
  });
  test(`
  ## 정리
  lexical scope는 static scope라고도 하며, 단어의 사용이 약간의 혼란을 가져오지만 그 본질은 식별자가 정해진 범위 내에서만 유효하다는 것을 이해하는 것이다. 여기서는 렉시컬 스코프의 의미에 초점을 맞춰 이야기했지만, 렉시컬 스코프는 [호이스팅](./execution-context.md#호이스팅), [클로저](./closure.md), [실행 컨텍스트](./execution-context.md) 등 자바스크립트의 핵심적인 부분과 연관되므로, 이 글이 이들을 공부하는 데 조금이나마 도움이 될 수 있으면 좋겠다.
  
  ## 참조
  - https://www.etymonline.com/kr/word/lexical
  - https://poiemaweb.com/js-scope
  `, () => {
    const markdown = `
    ## 정리
    lexical scope는 static scope라고도 하며, 단어의 사용이 약간의 혼란을 가져오지만 그 본질은 식별자가 정해진 범위 내에서만 유효하다는 것을 이해하는 것이다. 여기서는 렉시컬 스코프의 의미에 초점을 맞춰 이야기했지만, 렉시컬 스코프는 [호이스팅](./execution-context.md#호이스팅), [클로저](./closure.md), [실행 컨텍스트](./execution-context.md) 등 자바스크립트의 핵심적인 부분과 연관되므로, 이 글이 이들을 공부하는 데 조금이나마 도움이 될 수 있으면 좋겠다.
    
    ## 참조
    - https://www.etymonline.com/kr/word/lexical
    - https://poiemaweb.com/js-scope
    `;
    const matched = markdown.match(referenceRegex)?.[0];
    expect(matched).toBe(`## 참조
    - https://www.etymonline.com/kr/word/lexical
    - https://poiemaweb.com/js-scope
    `);
  });
});

describe("markdown table", () => {
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
    const matched = markdown.match(tableRegex)?.[0];
    expect(matched).toBe(markdown);
  });
  test(`
  |heading | heading | heading|asd|
  |-| --- | ------ |-|
  |data | data | ---- data --- |ads|
  | --- | --- | ------- |asd|
  | ads | asd | adsd | das |asd|
  |asd as | asdsad | asddsa | asdasd |
  |asd|asd||ads|
  `, () => {
    const markdown = `
    |heading | heading | heading|asd|
    |-| --- | ------ |-|
    |data | data | ---- data --- |ads|
    | --- | --- | ------- |asd|
    | ads | asd | adsd | das |asd|
    |asd as | asdsad | asddsa | asdasd |
    |asd|asd||ads|
    `;
    const matched = markdown.match(tableRegex)?.[0];
    expect(matched).toBe(markdown);
  });
  test(`
  | 표현식 | 결괏값 |
  |---|---|
  | 5 | 5 |
  | 5 + 10 | 15 |
  | (5 + 10) * 4 | 60 |
  | () => 5 * 4 | () => 5 * 4 |
  | (() => 10)() | 10 |
  | 5 < 10 | true |`, () => {
    const markdown = `
    | 표현식 | 결괏값 |
    |---|---|
    | 5 | 5 |
    | 5 + 10 | 15 |
    | (5 + 10) * 4 | 60 |
    | () => 5 * 4 | () => 5 * 4 |
    | (() => 10)() | 10 |
    | 5 < 10 | true |`
      .split(/\n\s*/)
      .join("\n");
    const matched = markdown.match(tableRegex)?.[0];
    expect(matched).toBe(markdown);
  });
  test(`
  Not Table
  const nonNever: string | number | boolean = never; // ok
  const nonNever: null | undefined = never; // ok
  const nonNever: any = never; // ok
  const nonNever: unknown = never; // ok
  const _never: never = never; // ok
  `, () => {
    const markdown = `
    const nonNever: string | number | boolean = never; // ok
    const nonNever: null | undefined = never; // ok
    const nonNever: any = never; // ok
    const nonNever: unknown = never; // ok
    const _never: never = never; // ok
    `;
    const matched = markdown.match(tableRegex);
    expect(matched).toBeNull();
  });
});
