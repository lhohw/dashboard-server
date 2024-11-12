import { describe, test, expect } from "bun:test";
import {
  commentRegex,
  referenceRegex,
  inlineStyleRegex,
  imgRegex,
  linkRegex,
  inlineStylePropertyRegex,
  JSXStyleRegex,
  JSXStylePropertyRegex,
  mdRegex,
  titleRegex,
  srcRegex,
  base64SrcRegex,
  altRegex,
  headingRegex,
  frontmatterRegex,
} from "const/regex";
import { parseFrontmatterToMap, parseJSXStyleStringToMap } from "utils/regex";

describe("frontmatter", () => {
  test(`---
    title: title
    slug: s-l-u-g
    ---`, () => {
    const frontmatter = `---
        title: title
        slug: s-l-u-g
        ---`;
    const matched = frontmatter.match(frontmatterRegex);
    expect(matched).not.toBeNull();

    const [matchedStr] = matched!;
    const map = parseFrontmatterToMap(matchedStr);
    expect(map.get("title")).toBe("title");
    expect(map.get("slug")).toBe("s-l-u-g");
  });

  test(`---
    title: title!@#123제목 "[] {} ()" ''
    status: ready
    ---`, () => {
    const frontmatter = `---
    title: title!@#123제목 "[] {} ()" ''
    status: ready
    ---`;
    const matched = frontmatter.match(frontmatterRegex);
    expect(matched).not.toBeNull();

    const [matchedStr] = matched!;
    const map = parseFrontmatterToMap(matchedStr);
    expect(map.get("title")).toBe(`title!@#123제목 "[] {} ()" ''`);
    expect(map.get("status")).toBe("ready");
  });

  test(`---
    item1: !@#%
    item2: ---
    ---`, () => {
    const frontmatter = `---
    item1: !@#%
    item2: ---
    ---`;
    const matched = frontmatter.match(frontmatterRegex);
    expect(matched).not.toBeNull();

    const [matchedStr] = matched!;
    const map = parseFrontmatterToMap(matchedStr);
    expect(map.get("item1")).toBe(`!@#%`);
    expect(map.get("item2")).toBe("---");
  });

  test(`---
    한글_키: 한글_값
    ---`, () => {
    const frontmatter = `---
    한글_키: 한글_값
    ---`;
    const matched = frontmatter.match(frontmatterRegex);
    expect(matched).not.toBeNull();

    const [matchedStr] = matched!;
    const map = parseFrontmatterToMap(matchedStr);
    expect(map.get("한글_키")).toBe(`한글_값`);
  });
});

describe("comment", () => {
  test(`한국말을 포함한 코멘트`, () => {
    const comment = `<!-- 한국말 코멘트 -->`;
    const matched = comment.match(commentRegex)?.[0];
    expect(matched).toBe(comment);
  });

  test(`영어를 포함한 코멘트`, () => {
    const comment = `<!--- english comment --->`;
    const matched = comment.match(commentRegex)?.[0];
    expect(matched).toBe(comment);
  });

  test(`숫자를 포함한 코멘트`, () => {
    const comment = `<!--- 0123456789 --->`;
    const matched = comment.match(commentRegex)?.[0];
    expect(matched).toBe(comment);
  });

  test(`함수를 포함한 코멘트`, () => {
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

  test(`특수 문자를 포함한 코멘트`, () => {
    const comment = `<!-- 특수 문자 코멘트
    !@#$%^&*_+-=\\|;:,./<>?
    -->`;
    const matched = comment.match(commentRegex)?.[0];
    expect(matched).toBe(comment);
  });

  test("한국말/영어/숫자/함수/특수 문자가 포함된 코멘트", () => {
    const comment = `<!--
    abcABC1230
    \`\`\`ts
    function() {}
    \`\`\`
    특수 문자 코멘트
    !@#$%^&*()_+-=\\|;:,./<>?
    -->`;
    const matched = comment.match(commentRegex)?.[0];
    expect(matched).toBe(comment);
  });
});

describe("style", () => {
  describe("inline style property regex", () => {
    test("color: #fafcdd88;", () => {
      const styleProperty = "color: #fafcdd88;";
      const matched = styleProperty.match(inlineStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("color");
      expect(value).toBe("#fafcdd88");
    });

    test("-webkit-animation-delay: 2s", () => {
      const styleProperty = "-webkit-animation-delay: 2s";
      const matched = styleProperty.match(inlineStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("-webkit-animation-delay");
      expect(value).toBe("2s");
    });

    test("background: hsla(128, 30%, 72%, 0.12)", () => {
      const styleProperty = "background: hsla(128, 30%, 72%, 0.12)";
      const matched = styleProperty.match(inlineStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("background");
      expect(value).toBe("hsla(128, 30%, 72%, 0.12)");
    });

    test("background: linear-gradient(45deg, red 50%, blue 100%)", () => {
      const styleProperty =
        "background: linear-gradient(45deg, red 50%, blue 100%)";
      const matched = styleProperty.match(inlineStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("background");
      expect(value).toBe("linear-gradient(45deg, red 50%, blue 100%)");
    });
  });

  describe("inline style regex", () => {
    test(`<div style="color: #fafbfc88; width: 30px;">`, () => {
      const div = `<div style="color: #fafbfc88; width: 30px;">`;
      const matched = div.match(inlineStyleRegex);
      expect(matched).not.toBeNull();

      const [style, properties] = matched!;
      expect(style).toBe(`style="color: #fafbfc88; width: 30px;"`);
      expect(properties).toBe(`color: #fafbfc88; width: 30px;`);
    });

    test(`<div style="background: linear-gradient(45deg, #fff, #fafee1); -webkit-animation-delay: 2s">`, () => {
      const div = `<div style="background: linear-gradient(45deg, #fff, #fafee1); -webkit-animation-delay: 2s">`;
      const matched = div.match(inlineStyleRegex);
      expect(matched).not.toBeNull();

      const [style, properties] = matched!;
      expect(style).toBe(
        `style="background: linear-gradient(45deg, #fff, #fafee1); -webkit-animation-delay: 2s"`
      );
      expect(properties).toBe(
        `background: linear-gradient(45deg, #fff, #fafee1); -webkit-animation-delay: 2s`
      );
    });
  });

  describe("JSX style property regex", () => {
    test(`width: 30`, () => {
      const styleProperty = `width: 30"`;
      const matched = styleProperty.match(JSXStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("width");
      expect(value).toBe("30");
    });

    test(`height: 30px`, () => {
      const styleProperty = `height: 30px"`;
      const matched = styleProperty.match(JSXStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("height");
      expect(value).toBe("30px");
    });

    test(`color: "#fafcdd88"`, () => {
      const styleProperty = `color: "#fafcdd88"`;
      const matched = styleProperty.match(JSXStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("color");
      expect(value).toBe("#fafcdd88");
    });

    test(`WebkitAlignItems: "flex-start"`, () => {
      const styleProperty = `WebkitAlignItems: "flex-start"`;
      const matched = styleProperty.match(JSXStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("WebkitAlignItems");
      expect(value).toBe("flex-start");
    });

    test(`MozAnimationDelay: "-moz-initial"`, () => {
      const styleProperty = `MozAnimationDelay: "-moz-initial"`;
      const matched = styleProperty.match(JSXStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("MozAnimationDelay");
      expect(value).toBe("-moz-initial");
    });

    test(`background: "hsla(128, 30%, 72%, 0.12)"`, () => {
      const styleProperty = `background: "hsla(128, 30%, 72%, 0.12)"`;
      const matched = styleProperty.match(JSXStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("background");
      expect(value).toBe("hsla(128, 30%, 72%, 0.12)");
    });

    test(`background: "linear-gradient(45deg, red 50%, blue 100%)"`, () => {
      const styleProperty = `background: "linear-gradient(45deg, red 50%, blue 100%)"`;
      const matched = styleProperty.match(JSXStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("background");
      expect(value).toBe("linear-gradient(45deg, red 50%, blue 100%)");
    });
  });

  describe("JSX style regex", () => {
    test(`<div style={{ width: 30, height: "30px", color: "#fafed1", WebkitAlignItems: "flex-start", MozAnimationDelay: "-moz-initial", background: "hsla(128, 30%, 72%, 0.12)", }} />`, () => {
      const div = `<div
        style={{
          width: 30,
          height: "30px",
          color: "#fafed1",
          WebkitAlignItems: "flex-start",
          MozAnimationDelay: "-moz-initial",
          background: "hsla(128, 30%, 72%, 0.12)",
        }}
      />;`;

      const matched = div.match(JSXStyleRegex);
      expect(matched).not.toBeNull();

      const [style, properties] = matched!;
      expect(style).toBe(`style={{
          width: 30,
          height: "30px",
          color: "#fafed1",
          WebkitAlignItems: "flex-start",
          MozAnimationDelay: "-moz-initial",
          background: "hsla(128, 30%, 72%, 0.12)",
        }}`);

      const parseMap = parseJSXStyleStringToMap(properties);
      expect(parseMap.get("width")).toBe("30");
      expect(parseMap.get("height")).toBe("30px");
      expect(parseMap.get("color")).toBe("#fafed1");
      expect(parseMap.get("WebkitAlignItems")).toBe("flex-start");
      expect(parseMap.get("MozAnimationDelay")).toBe("-moz-initial");
      expect(parseMap.get("background")).toBe("hsla(128, 30%, 72%, 0.12)");
    });
  });
});

describe("reference", () => {
  test(`
  ## 참조
  - https://!@#$%^&*_=-+;,./?><\\|1234
  - [링크](https://...)
  - ----
  `, () => {
    const markdown = `
    ## 참조
    - https://!@#$%^&*_=-+;,./?><\\|1234
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
  렉시컬 스코프는 [호이스팅](./execution-context.md#호이스팅), [클로저](./closure.md), [실행 컨텍스트](./execution-context.md) 등
  
  ## 참조
  - https://www.etymonline.com/kr/word/lexical
  - https://poiemaweb.com/js-scope
  `, () => {
    const markdown = `
    ## 정리
    렉시컬 스코프는 [호이스팅](./execution-context.md#호이스팅), [클로저](./closure.md), [실행 컨텍스트](./execution-context.md) 등
    
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

describe("link", () => {
  test("[Smoke Particle System](http://blhog.vercel.app/graphic/smoke-particle-system)", () => {
    const link =
      "[Smoke Particle System](http://blhog.vercel.app/graphic/smoke-particle-system)";
    const matched = link.match(linkRegex);
    expect(matched).not.toBeNull();
    console.log(matched);

    const [, title, url] = matched!;
    expect(title).toBe("Smoke Particle System");
    expect(url).toBe("http://blhog.vercel.app/graphic/smoke-particle-system");
  });

  test("[var, let, const 비교](https://ui.dev/var-let-const)", () => {
    const link = "[var, let, const 비교](https://ui.dev/var-let-const)";
    const matched = link.match(linkRegex);
    expect(matched).not.toBeNull();

    const [, title, url] = matched!;
    expect(title).toBe("var, let, const 비교");
    expect(url).toBe("https://ui.dev/var-let-const");
  });

  test("[클로저](./closure.md)", () => {
    const link = "[클로저](./closure.md)";
    const matched = link.match(linkRegex);
    expect(matched).not.toBeNull();

    const [, title, url] = matched!;
    expect(title).toBe("클로저");
    expect(url).toBe("./closure.md");
  });

  test("[괄호(소괄호){중괄호}[대괄호]](./bracket.md)", () => {
    const link = "[괄호(소괄호){중괄호}[대괄호]](./bracket.md)";
    const matched = link.match(linkRegex);
    expect(matched).not.toBeNull();

    const [, title, url] = matched!;
    expect(title).toBe("괄호(소괄호){중괄호}[대괄호]");
    expect(url).toBe("./bracket.md");
  });

  test("[JavaScript Visualizer](https://ui.dev/ultimate-guide-to-execution-contexts-hoisting-scopes-and-closures-in-javascript#:~:text=Visualizer%EB%A5%BC%20%EC%82%B4%ED%8E%B4%EB%B3%B4%EA%B2%A0%EC%8A%B5%EB%8B%88%EB%8B%A4.-,%EC%BD%94%EB%93%9C%EB%A5%BC%20%EC%A7%81%EC%A0%91%20%EC%8B%9C%EA%B0%81%ED%99%94%ED%95%B4%20%EB%B3%B4%EC%84%B8%EC%9A%94,-%EC%9A%B0%EB%A6%AC%EB%8A%94%20undefined%2C)", () => {
    const link =
      "[JavaScript Visualizer](https://ui.dev/ultimate-guide-to-execution-contexts-hoisting-scopes-and-closures-in-javascript#:~:text=Visualizer%EB%A5%BC%20%EC%82%B4%ED%8E%B4%EB%B3%B4%EA%B2%A0%EC%8A%B5%EB%8B%88%EB%8B%A4.-,%EC%BD%94%EB%93%9C%EB%A5%BC%20%EC%A7%81%EC%A0%91%20%EC%8B%9C%EA%B0%81%ED%99%94%ED%95%B4%20%EB%B3%B4%EC%84%B8%EC%9A%94,-%EC%9A%B0%EB%A6%AC%EB%8A%94%20undefined%2C)";
    const matched = link.match(linkRegex);
    expect(matched).not.toBeNull();

    const [, title, url] = matched!;
    expect(title).toBe("JavaScript Visualizer");
    expect(url).toBe(
      "https://ui.dev/ultimate-guide-to-execution-contexts-hoisting-scopes-and-closures-in-javascript#:~:text=Visualizer%EB%A5%BC%20%EC%82%B4%ED%8E%B4%EB%B3%B4%EA%B2%A0%EC%8A%B5%EB%8B%88%EB%8B%A4.-,%EC%BD%94%EB%93%9C%EB%A5%BC%20%EC%A7%81%EC%A0%91%20%EC%8B%9C%EA%B0%81%ED%99%94%ED%95%B4%20%EB%B3%B4%EC%84%B8%EC%9A%94,-%EC%9A%B0%EB%A6%AC%EB%8A%94%20undefined%2C"
    );
  });

  test("[글](../performance/RAIL-model.md)", () => {
    const link = "[글](../performance/RAIL-model.md)";
    const matched = link.match(linkRegex);
    expect(matched).not.toBeNull();

    const [, title, src] = matched!;
    expect(title).toBe("글");
    expect(src).toBe("../performance/RAIL-model.md");
  });

  test("[글](../performance/RAIL-model.md#response)", () => {
    const link = "[글](../performance/RAIL-model.md#response)";
    const matched = link.match(linkRegex);
    expect(matched).not.toBeNull();

    const [, title, src] = matched!;
    expect(title).toBe("글");
    expect(src).toBe("../performance/RAIL-model.md#response");
  });

  test("[글](https://blhog.vercel.app/posts/performance/RAIL-model.md#response)", () => {
    const link =
      "[글](https://blhog.vercel.app/posts/performance/RAIL-model.md#response)";
    const matched = link.match(linkRegex);
    expect(matched).not.toBeNull();

    const [, title, src] = matched!;
    expect(title).toBe("글");
    expect(src).toBe(
      "https://blhog.vercel.app/posts/performance/RAIL-model.md#response"
    );
  });

  test("[Kinetic Typography](https://www.google.com/search?q=kinetic+typography+cmiscm&oq=kinetic+typography+cmiscm&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDQ2MDZqMGoxqAIAsAIA&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:5a335bca,vid:Df4RviUikZ0,st:0)", () => {
    const link =
      "[Kinetic Typography](https://www.google.com/search?q=kinetic+typography+cmiscm&oq=kinetic+typography+cmiscm&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDQ2MDZqMGoxqAIAsAIA&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:5a335bca,vid:Df4RviUikZ0,st:0)";
    const matched = link.match(linkRegex);
    expect(matched).not.toBeNull();

    const [, title, src] = matched!;
    expect(title).toBe("Kinetic Typography");
    expect(src).toBe(
      "https://www.google.com/search?q=kinetic+typography+cmiscm&oq=kinetic+typography+cmiscm&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDQ2MDZqMGoxqAIAsAIA&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:5a335bca,vid:Df4RviUikZ0,st:0"
    );
  });
});

describe("md", () => {
  test("[클로저](./closure.md)", () => {
    const link = "[클로저](./closure.md)";
    const matched = link.match(mdRegex);
    expect(matched).not.toBeNull();

    const actual = matched![0];
    expect(actual).toBe(".md");
  });

  test("[글](../performance/RAIL-model.md#response)", () => {
    const link = "[글](../performance/RAIL-model.md#response)";
    const matched = link.match(mdRegex);
    expect(matched).not.toBeNull();

    const [, hash] = matched!;
    expect(hash).toBe("#response");
  });

  test("[글](../performance/RAIL-model.md#response)", () => {
    const link = "[글](../performance/RAIL-model.md#response)";
    const matched = link.match(mdRegex);
    expect(matched).not.toBeNull();

    const [, hash] = matched!;
    expect(hash).toBe("#response");
  });
});

describe("img", () => {
  describe("property", () => {
    describe("title", () => {
      test(`<img title="ab123!@#%[](){}" />`, () => {
        const img = `<img title="ab123!@#%[](){}" />`;
        const matched = img.match(titleRegex);
        expect(matched).not.toBeNull();

        const [matchedStr, title] = matched!;
        expect(matchedStr).toBe(`title="ab123!@#%[](){}"`);
        expect(title).toBe("ab123!@#%[](){}");
      });

      test(`<img src="..." style="..." title="ab123!@#%[](){}" id="id" />`, () => {
        const img = `<img src="..." style="..." title="ab123!@#%[](){}" id="id" />`;
        const matched = img.match(titleRegex);
        expect(matched).not.toBeNull();

        const [matchedStr, title] = matched!;
        expect(matchedStr).toBe(`title="ab123!@#%[](){}"`);
        expect(title).toBe("ab123!@#%[](){}");
      });

      test(`<img title="i-m-a-g-e" />`, () => {
        const img = `<img title="i-m-a-g-e" />`;
        const matched = img.match(titleRegex);
        expect(matched).not.toBeNull();

        const [matchedStr, title] = matched!;
        expect(matchedStr).toBe(`title="i-m-a-g-e"`);
        expect(title).toBe("i-m-a-g-e");
      });
    });

    describe("alt", () => {
      test(`<img title="ab123!@#%[](){}" alt="im a ge deScripti@n" />`, () => {
        const img = `<img title="ab123!@#%[](){}" alt="im a ge deScripti@n" />`;
        const matched = img.match(altRegex);
        expect(matched).not.toBeNull();

        const [matchedStr, title] = matched!;
        expect(matchedStr).toBe(`alt="im a ge deScripti@n"`);
        expect(title).toBe("im a ge deScripti@n");
      });

      test(`<img src="..." style="..." alt="!@#$qwer123이미지 설명" title="ab123!@#%[](){}" id="id" />`, () => {
        const img = `<img src="..." style="..." alt="!@#$qwer123이미지 설명" title="ab123!@#%[](){}" id="id" />`;
        const matched = img.match(altRegex);
        expect(matched).not.toBeNull();

        const [matchedStr, title] = matched!;
        expect(matchedStr).toBe(`alt="!@#$qwer123이미지 설명"`);
        expect(title).toBe("!@#$qwer123이미지 설명");
      });
    });

    describe("style", () => {
      test(`<img src="..." style="width: 30px; height: 100px;" title="...`, () => {
        const img = `<img src="..." style="width: 30px; height: 100px;" title="...`;
        const matched = img.match(inlineStyleRegex);
        expect(matched).not.toBeNull();

        const [matchedStr, title] = matched!;
        expect(matchedStr).toBe(`style="width: 30px; height: 100px;"`);
        expect(title).toBe("width: 30px; height: 100px;");
      });
    });

    describe("src", () => {
      describe("ext", () => {
        test(`<img src="../../assets/img.png"`, () => {
          const img = `<img src="../../assets/img.png" />`;
          const matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          const [, src, ext] = matched!;
          expect(src).toBe("../../assets/img");
          expect(ext).toBe("png");
        });

        test(`<img src="../../assets/img.jpeg"`, () => {
          const img = `<img src="../../assets/img.jpeg" />`;
          const matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          const [, src, ext] = matched!;
          expect(src).toBe("../../assets/img");
          expect(ext).toBe("jpeg");
        });

        test(`<img src="../../assets/img.jpg"`, () => {
          const img = `<img src="../../assets/img.jpg" />`;
          const matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          const [, src, ext] = matched!;
          expect(src).toBe("../../assets/img");
          expect(ext).toBe("jpg");
        });

        test(`<img src="../../assets/img.svg"`, () => {
          const img = `<img src="../../assets/img.svg" />`;
          const matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          const [, src, ext] = matched!;
          expect(src).toBe("../../assets/img");
          expect(ext).toBe("svg");
        });

        test(`<img src="../../assets/img.avif"`, () => {
          const img = `<img src="../../assets/img.avif" />`;
          const matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          const [, src, ext] = matched!;
          expect(src).toBe("../../assets/img");
          expect(ext).toBe("avif");
        });

        test(`<img src="../../assets/img.webp"`, () => {
          const img = `<img src="../../assets/img.webp" />`;
          const matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          const [, src, ext] = matched!;
          expect(src).toBe("../../assets/img");
          expect(ext).toBe("webp");
        });

        test(`<img src="../../assets/img.webp"`, () => {
          const img = `<img src="../../assets/img.webp" />`;
          const matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          const [, src, ext] = matched!;
          expect(src).toBe("../../assets/img");
          expect(ext).toBe("webp");
        });
      });

      describe("다른 프로퍼티와 동작 여부", () => {
        test(`<img title="..." style='...' src="https://a.com/b.png" id="IMG" />`, () => {
          const img = `<img title="..." style='...' src="https://a.com/b.png" id="IMG" />`;
          const matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          const [, src, ext] = matched!;
          expect(src).toBe("https://a.com/b");
          expect(ext).toBe("png");
        });
      });

      describe("https", () => {
        test(`<img src="https://a.io/static/7a99/15f/e.jpg" />`, () => {
          const img = `<img src="https://a.io/static/7a99/15f/e.jpg" />`;
          const matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          const [, src, ext] = matched!;
          expect(src).toBe("https://a.io/static/7a99/15f/e");
          expect(ext).toBe("jpg");
        });
      });

      describe("base64", () => {
        test(`<img src="data:image/jpeg;base64,/9j/4AAQSkZ=" />`, () => {
          const img = `<img src="data:image/jpeg;base64,/9j/4AAQSkZ=" />`;
          const matched = img.match(base64SrcRegex);
          expect(matched).not.toBeNull();

          const [, ext, src] = matched!;
          expect(ext).toBe("jpeg");
          expect(src).toBe("/9j/4AAQSkZ=");
        });
      });

      describe("local path", () => {
        test(`relative path`, () => {
          let img, matched, src, ext;

          img = `<img src="../assets/a.png" />`;
          matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          [, src, ext] = matched!;
          expect(src).toBe("../assets/a");
          expect(ext).toBe("png");

          img = `<img src="./assets/a.webp" />`;
          matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          [, src, ext] = matched!;
          expect(src).toBe("./assets/a");
          expect(ext).toBe("webp");
        });

        test(`absolute path`, () => {
          let img, matched, src, ext;

          img = `<img src="@/assets/a.png" />`;
          matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          [, src, ext] = matched!;
          expect(src).toBe("@/assets/a");
          expect(ext).toBe("png");

          img = `<img src="assets/a.webp" />`;
          matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          [, src, ext] = matched!;
          expect(src).toBe("assets/a");
          expect(ext).toBe("webp");
        });
      });
    });
  });

  describe("element", () => {
    test(`<img title="i-m-a-g-e" src="../../assets/img.webp" style="width: 30px; height: 100px;" alt="im a ge deScripti@n" />`, () => {
      const img = `<img title="i-m-a-g-e" src="../../assets/img.webp" style="width: 30px; height: 100px;" alt="im a ge deScripti@n" />`;
      const matched = img.match(imgRegex);
      expect(matched).not.toBeNull();

      const [matchedStr, props] = matched!;
      expect(matchedStr).toBe(
        `<img title="i-m-a-g-e" src="../../assets/img.webp" style="width: 30px; height: 100px;" alt="im a ge deScripti@n" />`
      );
      expect(props).toBe(
        `title="i-m-a-g-e" src="../../assets/img.webp" style="width: 30px; height: 100px;" alt="im a ge deScripti@n"`
      );
    });

    test(`<img title="!@#A3$%^" style="display: flex;" src="../../assets/img.webp"`, () => {
      const img = `<img title="!@#A3$%^" style="display: flex;" src="../../assets/img.webp">`;
      const matched = img.match(imgRegex);
      expect(matched).not.toBeNull();

      const [matchedStr, props] = matched!;
      expect(matchedStr).toBe(
        `<img title="!@#A3$%^" style="display: flex;" src="../../assets/img.webp">`
      );
      expect(props).toBe(
        `title="!@#A3$%^" style="display: flex;" src="../../assets/img.webp"`
      );
    });

    test(`<div>
        <img title="i-m-a-g-e!@#A3" style="display: flex;" src="../../assets/img.webp" />
      </div>`, () => {
      const img = `<div>
        <img title="i-m-a-g-e!@#A3" style="display: flex;" src="../../assets/img.webp" />
      </div>`;
      const matched = img.match(imgRegex);
      expect(matched).not.toBeNull();

      const [matchedStr, props] = matched!;
      expect(matchedStr).toBe(
        `<img title="i-m-a-g-e!@#A3" style="display: flex;" src="../../assets/img.webp" />`
      );
      expect(props).toBe(
        `title="i-m-a-g-e!@#A3" style="display: flex;" src="../../assets/img.webp"`
      );
    });

    test(`<div>
        <img alt="!@#$ASDasd" src="../../assets/img.webp" title="i-m-a-g-e!@#A3" style="display: flex;" />
      </div>`, () => {
      const img = `<div>
        <img alt="!@#$ASDasd" src="../../assets/img.webp" title="i-m-a-g-e!@#A3" style="display: flex;" />
      </div>`;

      const matched = img.match(imgRegex);
      expect(matched).not.toBeNull();

      const [matchedStr, props] = matched!;
      expect(matchedStr).toBe(
        `<img alt="!@#$ASDasd" src="../../assets/img.webp" title="i-m-a-g-e!@#A3" style="display: flex;" />`
      );
      expect(props).toBe(
        `alt="!@#$ASDasd" src="../../assets/img.webp" title="i-m-a-g-e!@#A3" style="display: flex;"`
      );
    });
  });
});

describe.only("heading", () => {
  describe("row", () => {
    test(`# heading 123 !@# 가힣 [] {} () '"`, () => {
      const row = `# heading 123 !@# 가힣 [] {} () '"`;
      const matched = row.match(headingRegex);
      expect(matched).not.toBeNull();

      const [matchedStr, sharps, heading] = matched!;
      expect(matchedStr).toBe(`# heading 123 !@# 가힣 [] {} () '"`);
      expect(sharps).toBe(`#`);
      expect(heading).toBe(`heading 123 !@# 가힣 [] {} () '"`);
    });

    test(`#### ### ## #`, () => {
      const row = `#### ### ## #`;
      const matched = row.match(headingRegex);
      expect(matched).not.toBeNull();

      const [matchedStr, sharps, heading] = matched!;
      expect(matchedStr).toBe(`#### ### ## #`);
      expect(sharps).toBe(`####`);
      expect(heading).toBe(`### ## #`);
    });

    test(`heading with link`, () => {
      const row = `##### [React Reconciler](https://github.com/facebook/react/tree/main/packages/react-reconciler)`;
      const matched = row.match(headingRegex);
      expect(matched).not.toBeNull();

      const [matchedStr, sharps, heading] = matched!;
      expect(matchedStr).toBe(
        `##### [React Reconciler](https://github.com/facebook/react/tree/main/packages/react-reconciler)`
      );
      expect(sharps).toBe(`#####`);
      expect(heading).toBe(
        `[React Reconciler](https://github.com/facebook/react/tree/main/packages/react-reconciler)`
      );
    });

    test(`get single line`, () => {
      const row = `# 리액트
      ## 리액트란?`;

      const matched = row.match(headingRegex);
      expect(matched).not.toBeNull();

      const [matchedStr, sharps, heading] = matched!;
      expect(matchedStr).toBe(`# 리액트`);
      expect(sharps).toBe(`#`);
      expect(heading).toBe("리액트");
    });

    test(`with tab`, () => {
      const row = `# 리 액    트
      # 리액트란?`;

      const matched = row.match(headingRegex);
      expect(matched).not.toBeNull();

      const [matchedStr, sharps, heading] = matched!;
      expect(matchedStr).toBe(`# 리 액    트`);
      expect(sharps).toBe(`#`);
      expect(heading).toBe(`리 액    트`);
    });
  });
});
