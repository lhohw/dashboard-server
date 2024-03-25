import { describe, expect, test } from "bun:test";
import { dateRegex, dateSeperatorRegex } from "const/regex";

describe("date regex", () => {
  describe("Truthy", () => {
    describe("-", () => {
      test("YYYY-MM-DD", () => {
        const date = "2023-12-07";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YYYY-MM-D", () => {
        const date = "2023-12-7";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YYYY-M-DD", () => {
        const date = "2023-1-12";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YYYY-M-D", () => {
        const date = "2023-3-7";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YY-MM-DD", () => {
        const date = "23-12-07";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YY-MM-D", () => {
        const date = "23-12-7";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YY-M-DD", () => {
        const date = "23-3-17";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YY-M-D", () => {
        const date = "23-3-7";
        expect(dateRegex.test(date)).toBeTruthy();
      });
    });

    describe(".", () => {
      test("YYYY.MM.DD", () => {
        const date = "2023.12.07";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YYYY.MM.D", () => {
        const date = "2023.12.7";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YYYY.M.DD", () => {
        const date = "2023.2.17";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YYYY.M.D", () => {
        const date = "2023.3.7";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YY.MM.DD", () => {
        const date = "23.12.07";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YY.MM.D", () => {
        const date = "23.12.7";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YY.M.DD", () => {
        const date = "23.3.07";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YY.M.D", () => {
        const date = "23.3.7";
        expect(dateRegex.test(date)).toBeTruthy();
      });
    });

    describe("/", () => {
      test("YYYY/MM/DD", () => {
        const date = "2023/12/07";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YYYY/MM/D", () => {
        const date = "2023/12/7";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YYYY/M/DD", () => {
        const date = "2023/3/07";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YYYY/M/D", () => {
        const date = "2023/3/7";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YY/MM/DD", () => {
        const date = "23/12/07";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YY/MM/D", () => {
        const date = "23/12/7";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YY/M/DD", () => {
        const date = "23/2/17";
        expect(dateRegex.test(date)).toBeTruthy();
      });

      test("YY/M/D", () => {
        const date = "23/2/7";
        expect(dateRegex.test(date)).toBeTruthy();
      });
    });
  });

  describe("Falsy", () => {
    test("YYY-M-D", () => {
      const date = "233-3-7";
      expect(dateRegex.test(date)).toBeFalsy();
    });

    test("YYY.M.D", () => {
      const date = "233.3.7";
      expect(dateRegex.test(date)).toBeFalsy();
    });

    test("YYY/M/D", () => {
      const date = "233/3/7";
      expect(dateRegex.test(date)).toBeFalsy();
    });

    test("YYYYMMDD", () => {
      const date = "20231206";
      expect(dateRegex.test(date)).toBeFalsy();
    });

    test("YYMMDD", () => {
      const date = "231206";
      expect(dateRegex.test(date)).toBeFalsy();
    });

    test("YYYY_MM_DD", () => {
      const date = "2023_12_07";
      expect(dateRegex.test(date)).toBeFalsy();
    });

    test("YYYY/MM", () => {
      const date = "2020/01";
      expect(dateRegex.test(date)).toBeFalsy();
    });

    test("YYYY-MM", () => {
      const date = "2020-01";
      expect(dateRegex.test(date)).toBeFalsy();
    });

    test("YYYY.MM", () => {
      const date = "2020.01";
      expect(dateRegex.test(date)).toBeFalsy();
    });
  });
});

describe("date seperator regex", () => {
  test("-", () => {
    expect("2023-12-10".split(dateSeperatorRegex)).toEqual([
      "2023",
      "12",
      "10",
    ]);
    expect("23-1-10".split(dateSeperatorRegex)).toEqual(["23", "1", "10"]);
    expect("2023-1-1".split(dateSeperatorRegex)).toEqual(["2023", "1", "1"]);
  });

  test(".", () => {
    expect("2023.12.10".split(dateSeperatorRegex)).toEqual([
      "2023",
      "12",
      "10",
    ]);
    expect("23.1.10".split(dateSeperatorRegex)).toEqual(["23", "1", "10"]);
    expect("2023.1.1".split(dateSeperatorRegex)).toEqual(["2023", "1", "1"]);
  });

  test("/", () => {
    expect("2023/12/10".split(dateSeperatorRegex)).toEqual([
      "2023",
      "12",
      "10",
    ]);
    expect("23/1/10".split(dateSeperatorRegex)).toEqual(["23", "1", "10"]);
    expect("2023/1/1".split(dateSeperatorRegex)).toEqual(["2023", "1", "1"]);
  });
});
