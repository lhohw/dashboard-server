import { dateRegex } from "const/regex";
import { dates } from "const/date";

export const isValidStringDate = (date: string) => {
  const matched = date.match(dateRegex);
  if (!matched) return false;

  const [, _y, m, d] = matched;
  const y = `${_y.length === 2 ? getCentury(+_y, true) : ""}${_y}`;
  return isValidYear(+y) && isValidMonth(+m) && isValidDate(+y, +m, +d);
};

const isValidYear = (year: number) => year < 2100;
const isValidMonth = (month: number) => 1 <= month && month <= 12;
const isValidDate = (y: number, m: number, d: number) => {
  let dayLimit = dates[m];
  if (m === 2) {
    dayLimit += Number(isLeapYear(y));
  }
  return 1 <= d && d <= dayLimit;
};

export const getCentury = (year: number, shorten = false) => {
  return (19 + Number(year < 40)) * (shorten ? 1 : 100);
};

export const isLeapYear = (year: number) =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

export const pad = (n: number | string, length = 2) => {
  if (typeof n === "number") n = n.toString();
  return n.padStart(length, "0");
};

export const parseDate = (date?: string | number | Date) => {
  if (date === undefined || date === null) return new Date();
  if (typeof date === "number" || typeof date === "object")
    return new Date(date);

  if (!isValidStringDate(date)) {
    throw new Error(`Invalid Date: ${date}`);
  }

  const [, _year, month, day, T = "T00:00:00.000Z"] = date.match(dateRegex)!;
  const year = (_year.length === 2 ? getCentury(+_year, true) : "") + _year;
  return new Date(`${year}-${pad(month)}-${pad(day)}${T}`);
};
