import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {
  @Input() minDateString: string;
  @Input() maxDateString: string;

  minDate: moment.Moment;
  maxDate: moment.Moment;
  localeString = 'zh-tw';
  navDate: any;
  weekDaysHeaderArr: Array<string> = [];
  gridArr: Array<any> = [];
  selectedDate: any;
  constructor() { }

  ngOnInit(): void {
    moment.locale(this.localeString);
    this.navDate = moment();
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
    this.makeHeader();
    this.makeGrid();
  }

  changeNavMonth(num: number) {
    if (this.canChangeNavMonth(num)) {
      this.navDate.add(num, 'month');
    }
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

  makeHeader(){
    const weekDaysArr: Array<number> = [0, 1, 2, 3, 4, 5, 6];
    weekDaysArr.forEach(day => this.weekDaysHeaderArr.push(moment().weekday(day).format('ddd')));
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
    // console.log(this.gridArr);
  }

  isAvailable(num: number): boolean {
    const dateToCheck = this.dateFromNum(num, this.navDate);
    if (dateToCheck.isSameOrBefore(this.minDate)) {
        return false;
    } else if (dateToCheck.isSameOrAfter(this.maxDate)) {
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
    }
    console.log(this.selectedDate)
  }

  toggleSelectedClass(day) {
    if (this.selectedDate && this.selectedDate.isSame(this.dateFromNum(day.value, this.navDate))) {
      return 'is-selected';
    } else {
      return '';
    }
  }

}
