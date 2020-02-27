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
  }

  changeNavMonth(num: number) {
    if (this.canChangeNavMonth(num)) {
      this.navDate.add(num, 'month');
    }
  }

  canChangeNavMonth(num: number){
    const clonedDate = moment(this.navDate);
    clonedDate.add(num, 'month');
    if (this.minDate && !this.maxDate) {
      return clonedDate.endOf('month').isSameOrAfter(this.minDate.startOf('month'));
    } else if (this.maxDate && !this.minDate) {
      return clonedDate.startOf('month').isSameOrBefore(this.maxDate.endOf('month'));
    } else if (this.minDate && this.maxDate) {
      return clonedDate.startOf('month').isBetween(this.minDate.startOf('month'), this.maxDate.endOf('month'))
      || clonedDate.startOf('month').isSame(this.minDate.startOf('month'))
      || clonedDate.startOf('month').isSame(this.maxDate.startOf('month'));
    } else {
      return true;
    }
  }

}
