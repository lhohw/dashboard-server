import { days } from "const/date";
import { parseDate } from "utils/date";

class CustomDate extends Date {
  public year: number;
  public month: number;
  public date: number;
  public day: string;
  constructor(private _date?: number | string | Date) {
    _date = parseDate(_date);
    super(_date);
    this.year = _date.getFullYear();
    this.month = _date.getMonth() + 1;
    this.date = _date.getDate();
    this.day = days[_date.getDay()];
  }
  getYear() {
    return this.year;
  }
  getMonth(): number {
    return this.month;
  }
  getDayStr() {
    return this.day;
  }
}

export default CustomDate;
