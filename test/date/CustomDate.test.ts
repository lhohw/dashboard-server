import { describe, test, expect } from "bun:test";
import CustomDate from "class/CustomDate";

describe("Custom Date", () => {
  describe("truthy", () => {
    describe("string date", () => {
      test("YYYY-MM-DD string date", () => {
        const date = "2023-12-08";
        const customDate = new CustomDate(date)!;
        expect(customDate.year).toBe(2023);
        expect(customDate.month).toBe(12);
        expect(customDate.date).toBe(8);
      });

      test("ISO string date", () => {
        const date = "2023-12-07T15:00:00.000Z";
        const customDate = new CustomDate(date)!;
        expect(customDate.year).toBe(2023);
        expect(customDate.month).toBe(12);
        expect(customDate.date).toBe(8);
      });
    });

    describe("number date", () => {
      test("0(1970. 1. 1. 오전 09:00:00)", () => {
        const date = 0;
        const customDate = new CustomDate(date)!;
        expect(customDate.year).toBe(1970);
        expect(customDate.month).toBe(1);
        expect(customDate.date).toBe(1);
        expect(customDate.getHours()).toBe(9);
        expect(customDate.getMinutes()).toBe(0);
        expect(customDate.getSeconds()).toBe(0);
      });

      test("1702171342387(2023. 12. 10. 오전 10:22:25)", () => {
        const date = 1702171345512;
        const customDate = new CustomDate(date)!;
        expect(customDate.year).toBe(2023);
        expect(customDate.month).toBe(12);
        expect(customDate.date).toBe(10);
        expect(customDate.getHours()).toBe(10);
        expect(customDate.getMinutes()).toBe(22);
        expect(customDate.getSeconds()).toBe(25);
      });
    });

    describe("Date date", () => {
      test("0(1970. 1. 1. 오전 9:00:00)", () => {
        const date = new Date(0);
        const customDate = new CustomDate(date)!;
        expect(customDate.year).toBe(1970);
        expect(customDate.month).toBe(1);
        expect(customDate.date).toBe(1);
        expect(customDate.getHours()).toBe(9);
        expect(customDate.getMinutes()).toBe(0);
        expect(customDate.getSeconds()).toBe(0);
      });

      test("1702171342387(2023. 12. 10. 오전 10:22:25)", () => {
        const date = new Date(1702171345512);
        const customDate = new CustomDate(date)!;
        expect(customDate.year).toBe(2023);
        expect(customDate.month).toBe(12);
        expect(customDate.date).toBe(10);
        expect(customDate.getHours()).toBe(10);
        expect(customDate.getMinutes()).toBe(22);
        expect(customDate.getSeconds()).toBe(25);
      });
    });
  });

  describe("falsy", () => {
    test("YYMMDD", () => {
      const date = "231208";
      expect(() => new CustomDate(date)).toThrow(/^Invalid Date:/);
    });
    test("invalid year", () => {
      const date = "2124-03-25";
      expect(() => new CustomDate(date)).toThrow(/^Invalid Date:/);
    });
    test("invalid month", () => {
      const date = "2024-15-25";
      expect(() => new CustomDate(date)).toThrow(/^Invalid Date:/);
    });
    test("invalid Date", () => {
      const date = "2024-03-32";
      expect(() => new CustomDate(date)).toThrow(/^Invalid Date:/);
    });
    test("invalid Date", () => {
      const date = "2024-03-00";
      expect(() => new CustomDate(date)).toThrow(/^Invalid Date:/);
    });
    test("invalid Date", () => {
      const date = "2023-02-29";
      expect(() => new CustomDate(date)).toThrow(/^Invalid Date:/);
    });
  });
});
