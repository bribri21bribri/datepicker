import { Component, OnInit, Input, forwardRef, ElementRef, Renderer2, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const DATEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatepickerComponent),
  multi: true
};
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [DATEPICKER_VALUE_ACCESSOR]
})
export class DatepickerComponent implements OnInit, ControlValueAccessor {

  @Input() minDateString: string;
  @Input() maxDateString: string;
  @Input() bindField: any;

  showCalendar = false;
  minDate: moment.Moment;
  maxDate: moment.Moment;
  monthList = [];
  yearList = [];
  selectedMonth: number;
  selectedYear: number;
  localeString = 'zh-tw';
  navDate: any;
  weekDaysHeaderArr: Array<string> = [];
  gridArr: Array<any> = [];
  selectedDate: any;
  value: string;
  onChange: (value) => void;
  onTouched: () => void;
  disabled: boolean;
  constructor(renderer: Renderer2) { }

  writeValue(value: string): void {
    this.value = value;
    if (value) {
      this.navDate = moment(value).startOf('day');
      this.selectedDate = moment(this.navDate).startOf('day');
      this.selectedYear = this.selectedDate.year();
      this.selectedMonth = this.selectedDate.month();
      this.makeMonthList();
      this.makeYearList();
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit(): void {
    moment.locale(this.localeString);
    this.navDate = moment().startOf('day');
    this.selectedDate = moment(this.navDate).startOf('day');
    this.selectedYear = this.selectedDate.year();
    this.selectedMonth = this.selectedDate.month();
    if (this.minDateString) {
      this.minDate = moment(this.minDateString);
      if (this.minDate && !this.minDate.isBefore(this.navDate)) {
        throw Error('minDate can not be grater then current time');
      }
    }
    if (this.maxDateString) {
      this.maxDate = moment(this.maxDateString);
      if (this.maxDate && !this.maxDate.isAfter(this.navDate)) {
        throw Error('maxDate can not be less then current time');
      }
    }
    this.makeMonthList();
    this.makeYearList();
    this.makeHeader();
    this.makeGrid();
  }

  changeNavMonth(num: number) {
    if (this.canChangeNavMonth(num)) {
      this.navDate.add(num, 'month');
    }
    this.selectedMonth = this.navDate.month();
    this.selectedYear = this.navDate.year();
    if (this.selectedMonth > 11) {
      this.selectedMonth = 0;
    } else if (this.selectedMonth < 0) {
      this.selectedMonth = 11;
    }
    this.makeMonthList();
    this.makeGrid();
  }

  onNavMonthSelect(monthNum) {
    this.selectedMonth = monthNum;
    this.navDate.month(monthNum);
    this.makeGrid();
  }

  onNavYearSelect(yearNum) {
    this.selectedYear = yearNum;
    this.navDate.year(yearNum);
    const clonedDate = moment(this.navDate);
    const minDateStart = moment(this.minDate).startOf('month');
    const maxDateStart = moment(this.maxDate).startOf('month');
    const maxDateEnd = moment(this.maxDate).endOf('month');
    if (this.minDate && !this.maxDate) {
      if (clonedDate.endOf('month').isBefore(minDateStart)) {
        this.navDate.month(this.minDate.month());
        this.selectedMonth = this.minDate.month();
      }
    } else if (this.maxDate && !this.minDate) {
      if (clonedDate.startOf('month').isAfter(maxDateEnd)) {
        this.navDate.month(this.maxDate.month());
        this.selectedMonth = this.maxDate.month();
      }
    } else if (this.minDate && this.maxDate) {
      if (clonedDate.endOf('month').isBefore(minDateStart)) {
        this.navDate.month(this.minDate.month());
        this.selectedMonth = this.minDate.month();
      }
      if (clonedDate.startOf('month').isAfter(maxDateEnd)) {
        this.navDate.month(this.maxDate.month());
        this.selectedMonth = this.maxDate.month();
      }
    }
    this.makeYearList();
    this.makeMonthList();
    this.makeGrid();
  }

  canChangeNavMonth(num: number) {
    const clonedDate = moment(this.navDate);
    const minDateStart = moment(this.minDate).startOf('month');
    const maxDateStart = moment(this.maxDate).startOf('month');
    const maxDateEnd = moment(this.maxDate).endOf('month');
    clonedDate.add(num, 'month');
    if (this.minDate && !this.maxDate) {
      return clonedDate.endOf('month').isSameOrAfter(minDateStart);
    } else if (this.maxDate && !this.minDate) {
      return clonedDate.startOf('month').isSameOrBefore(maxDateEnd);
    } else if (this.minDate && this.maxDate) {
      return clonedDate.startOf('month').isBetween(minDateStart, maxDateEnd)
      || clonedDate.startOf('month').isSame(minDateStart)
      || clonedDate.startOf('month').isSame(maxDateStart);
    } else {
      return true;
    }
  }

  makeHeader() {
    const weekDaysArr: Array<number> = [0, 1, 2, 3, 4, 5, 6];
    weekDaysArr.forEach(day => this.weekDaysHeaderArr.push(moment().weekday(day).format('ddd')));
  }

  makeMonthList() {
    const returnList = [];
    const clonedDate = moment(this.navDate);
    const minDateStart = moment(this.minDate).startOf('month');
    const maxDateStart = moment(this.maxDate).startOf('month');
    const maxDateEnd = moment(this.maxDate).endOf('month');
    const months = moment.months();
    months.forEach((month, i) => {
      clonedDate.month(i);
      if (this.minDate && !this.maxDate) {
        if (clonedDate.endOf('month').isAfter(minDateStart)) {
          returnList.push({name: month, value: i});
        }
      } else if (this.maxDate && !this.minDate) {
        if (clonedDate.startOf('month').isSameOrBefore(maxDateEnd)) {
          returnList.push({name: month, value: i});
        }
      } else if (this.minDate && this.maxDate) {
        if (clonedDate.startOf('month').isBetween(minDateStart, maxDateEnd)
        || clonedDate.startOf('month').isSame(minDateStart)
        || clonedDate.startOf('month').isSame(maxDateStart)) {
          returnList.push({name: month, value: i});
        }
      } else {
        returnList.push({name: month, value: i});
      }
    });
    this.monthList = returnList;
  }

  makeYearList() {
    const clonedDate1 = moment(this.navDate);
    const clonedDate2 = moment(this.navDate);
    const minDateStart = moment(this.minDate).startOf('year');
    const maxDateStart = moment(this.maxDate).startOf('year');
    const returnList = [this.navDate.year()];
    for (let i = 1; i <= 20; i++) {
      clonedDate1.add(1, 'year');
      clonedDate2.subtract(1, 'year');
      if (this.minDate && !this.maxDate) {
        if (clonedDate2.startOf('year').isSameOrAfter(minDateStart)) {
          returnList.unshift(clonedDate2.year());
        }
        returnList.push(clonedDate1.year());
      } else if (this.maxDate && !this.minDate) {
        if (clonedDate1.startOf('year').isSameOrBefore(maxDateStart)) {
          returnList.push(clonedDate1.year());
        }
        returnList.unshift(clonedDate2.year());
      } else if (this.minDate && this.maxDate) {
        if (clonedDate2.startOf('year').isSameOrAfter(minDateStart)) {
          returnList.unshift(clonedDate2.year());
        }
        if (clonedDate1.startOf('year').isSameOrBefore(maxDateStart)) {
          returnList.push(clonedDate1.year());
        }
      } else {
        returnList.push(clonedDate1.year());
        returnList.unshift(clonedDate2.year());
      }
    }
    this.yearList = returnList;
  }

  makeGrid() {
    this.gridArr = [];

    const firstDayDate = moment(this.navDate).startOf('month');
    const initialEmptyCells = firstDayDate.weekday();
    const lastDayDate = moment(this.navDate).endOf('month');
    const lastEmptyCells = 6 - lastDayDate.weekday();
    const daysInMonth = this.navDate.daysInMonth();
    const arrayLength = initialEmptyCells + lastEmptyCells + daysInMonth;

    for (let i = 0; i < arrayLength; i++) {
      const obj: any = {};
      if (i < initialEmptyCells || i > initialEmptyCells + daysInMonth - 1) {
        obj.value = 0;
        obj.available = false;
      } else {
        obj.value = i - initialEmptyCells + 1;
        obj.available = this.isAvailable(i - initialEmptyCells + 1);
      }
      this.gridArr.push(obj);
    }
  }

  isAvailable(num: number): boolean {
    const dateToCheck = this.dateFromNum(num, this.navDate);
    if (this.minDate && dateToCheck.isSameOrBefore(this.minDate)) {
        return false;
    } else if (this.maxDate && dateToCheck.isSameOrAfter(this.maxDate)) {
      return false;
    } else {
        return true;
    }
  }

  dateFromNum(num: number, referenceDate: any): any {
    const returnDate = moment(referenceDate);
    return returnDate.date(num).startOf('day');
  }

  selectDay(day: any) {
    if (day.available) {
      this.selectedDate = this.dateFromNum(day.value, this.navDate);
      this.selectedYear = this.selectedDate.year();
      this.selectedMonth = this.selectedDate.month();
      this.showCalendar = false;
      this.value = this.selectedDate.format('YYYY-MM-DD');
      this.onChange(this.selectedDate.format('YYYY-MM-DD'));
    }
  }

  toggleCalendar() {
    this.showCalendar = true;
  }

  toggleSelectedClass(day) {
    if (this.selectedDate && this.selectedDate.isSame(this.dateFromNum(day.value, this.navDate))) {
      return 'is-selected';
    } else {
      return '';
    }
  }

}
